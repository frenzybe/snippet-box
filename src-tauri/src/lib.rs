use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, State,
};
use std::sync::Mutex;
use std::str::FromStr;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};
use tauri_plugin_sql::{Migration, MigrationKind};
#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};
#[cfg(target_os = "windows")]
use window_vibrancy::{apply_mica, apply_acrylic, apply_blur};

fn show_window(app: &AppHandle) {
    if let Some(win) = app.get_webview_window("main") {
        #[cfg(target_os = "macos")]
        let _ = app.set_activation_policy(tauri::ActivationPolicy::Regular);
        let _ = win.show();
        let _ = win.set_focus();
    }
}

fn hide_window(app: &AppHandle) {
    if let Some(win) = app.get_webview_window("main") {
        let _ = win.hide();
        #[cfg(target_os = "macos")]
        let _ = app.set_activation_policy(tauri::ActivationPolicy::Accessory);
    }
}

#[tauri::command]
fn show_app(app: tauri::AppHandle) {
    show_window(&app);
}

#[tauri::command]
fn hide_app(app: tauri::AppHandle) {
    hide_window(&app);
}

struct AppShortcutState(Mutex<Option<Shortcut>>);

#[tauri::command]
fn update_shortcut(app: AppHandle, state: State<'_, AppShortcutState>, shortcut_str: String) -> Result<(), String> {
    #[cfg(desktop)]
    {
        let mut current = state.0.lock().unwrap();
        
        if let Some(old_shortcut) = *current {
            let _ = app.global_shortcut().unregister(old_shortcut);
        }
        
        if let Ok(new_shortcut) = Shortcut::from_str(&shortcut_str) {
            match app.global_shortcut().register(new_shortcut) {
                Ok(_) => {
                    *current = Some(new_shortcut);
                    Ok(())
                }
                Err(e) => Err(format!("Failed to register shortcut: {}", e))
            }
        } else {
            Err("Invalid shortcut string".into())
        }
    }
    #[cfg(not(desktop))]
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "initial_schema",
            sql: "
                CREATE TABLE snippets (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    description TEXT,
                    is_favorite INTEGER DEFAULT 0,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE files (
                    id TEXT PRIMARY KEY,
                    snippet_id TEXT NOT NULL,
                    filename TEXT NOT NULL,
                    code TEXT NOT NULL,
                    language TEXT NOT NULL,
                    FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE
                );
                CREATE TABLE tags (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL
                );
                CREATE TABLE snippet_tags (
                    snippet_id TEXT NOT NULL,
                    tag_id INTEGER NOT NULL,
                    PRIMARY KEY (snippet_id, tag_id),
                    FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE,
                    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
                );
                CREATE VIRTUAL TABLE snippets_fts USING fts5(
                    snippet_id UNINDEXED,
                    title,
                    description,
                    content
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "add_snippet_history",
            sql: "
                CREATE TABLE snippet_history (
                    id TEXT PRIMARY KEY,
                    snippet_id TEXT NOT NULL,
                    data TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "add_is_template_to_snippets",
            sql: "ALTER TABLE snippets ADD COLUMN is_template INTEGER DEFAULT 0;",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "add_history_index",
            sql: "CREATE INDEX IF NOT EXISTS idx_history_snippet_id ON snippet_history(snippet_id);",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "cleanup_redundant_fts_triggers",
            sql: "DROP TRIGGER IF EXISTS snippets_ai; DROP TRIGGER IF EXISTS snippets_au;",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .setup(|app| {
            let show_item = MenuItemBuilder::with_id("show", "Show / Hide").build(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "Quit Snippet Box").build(app)?;

            let menu = MenuBuilder::new(app)
                .item(&show_item)
                .separator()
                .item(&quit_item)
                .build()?;

            TrayIconBuilder::new()
                .icon(tauri::image::Image::from_bytes(include_bytes!("../icons/trayTemplate.png")).unwrap())
                .menu(&menu)
                .show_menu_on_left_click(false)
                .tooltip("Snippet Box")
                .on_menu_event(|app: &AppHandle, event| match event.id().as_ref() {
                    "show" => {
                        if let Some(win) = app.get_webview_window("main") {
                            if win.is_visible().unwrap_or(false) {
                                hide_window(app);
                            } else {
                                show_window(app);
                            }
                        }
                    }
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray: &tauri::tray::TrayIcon, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(win) = app.get_webview_window("main") {
                            if win.is_visible().unwrap_or(false) {
                                hide_window(app);
                            } else {
                                show_window(app);
                            }
                        }
                    }
                })
                .build(app)?;

            #[cfg(desktop)]
            {
                app.manage(AppShortcutState(Mutex::new(None)));
                
                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_handler(move |app, s, event| {
                            let state = app.state::<AppShortcutState>();
                            let current = state.0.lock().unwrap();
                            if Some(*s) == *current && event.state() == ShortcutState::Released {
                                if let Some(win) = app.get_webview_window("main") {
                                    if win.is_visible().unwrap_or(false) {
                                        let focused = win.is_focused().unwrap_or(false);
                                        if focused {
                                            hide_window(app);
                                        } else {
                                            show_window(app);
                                            let _ = win.eval("setTimeout(() => { const input = document.querySelector('.search-input'); if(input) { input.focus(); input.select(); } }, 50);");
                                        }
                                    } else {
                                        show_window(app);
                                        let _ = win.eval("setTimeout(() => { const input = document.querySelector('.search-input'); if(input) { input.focus(); input.select(); } }, 50);");
                                    }
                                }
                            }
                        })
                        .build()
                )?;
            }

            #[cfg(target_os = "macos")]
            let _ = apply_vibrancy(
                &app.get_webview_window("main").unwrap(),
                NSVisualEffectMaterial::Sidebar,
                None,
                None
            );

            #[cfg(target_os = "windows")]
            {
                let window = app.get_webview_window("main").unwrap();
                if let Err(_) = apply_mica(&window, None) {
                    if let Err(_) = apply_acrylic(&window, Some((18, 18, 18, 125))) {
                        let _ = apply_blur(&window, Some((18, 18, 18, 125)));
                    }
                }
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                hide_window(window.app_handle());
            }
        })
        .plugin(tauri_plugin_sql::Builder::default().add_migrations("sqlite:snippets.db", migrations).build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![show_app, hide_app, update_shortcut])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
