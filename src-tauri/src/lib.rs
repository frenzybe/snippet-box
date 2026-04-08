use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, State,
};
use std::sync::Mutex;
use std::str::FromStr;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

/// Show window and restore the Dock icon
fn show_window(app: &AppHandle) {
    if let Some(win) = app.get_webview_window("main") {
        #[cfg(target_os = "macos")]
        let _ = app.set_activation_policy(tauri::ActivationPolicy::Regular);
        let _ = win.show();
        let _ = win.set_focus();
    }
}

/// Hide window and remove the Dock icon
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
        
        // Unregister previous if exists
        if let Some(old_shortcut) = *current {
            let _ = app.global_shortcut().unregister(old_shortcut);
        }
        
        // Parse and register new
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
    tauri::Builder::default()
        .setup(|app| {
            // ── System Tray ──────────────────────────────────
            let show_item = MenuItemBuilder::with_id("show", "Show / Hide").build(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "Quit Snippet Box").build(app)?;

            let menu = MenuBuilder::new(app)
                .item(&show_item)
                .separator()
                .item(&quit_item)
                .build()?;

            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
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

            // ── Global Shortcut (Dynamic) ────────────
            #[cfg(desktop)]
            {
                app.manage(AppShortcutState(Mutex::new(None)));
                
                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_handler(move |app, s, event| {
                            // Check if it's our registered trigger
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

            Ok(())
        })
        // ── Hide to tray on close — also remove from Dock ────────
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                hide_window(window.app_handle());
            }
        })
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![show_app, hide_app, update_shortcut])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
