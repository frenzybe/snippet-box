use tauri::{Manager, AppHandle};
use tauri_plugin_global_shortcut::{Code, Modifiers, Shortcut, ShortcutState};

fn test_comp() {
    let _b = tauri_plugin_global_shortcut::Builder::new().with_handler(|app, shortcut, event| {
        if event.state() == ShortcutState::Released {
             // ...
        }
    });
}
