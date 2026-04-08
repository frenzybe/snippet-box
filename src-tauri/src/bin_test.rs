use tauri_plugin_global_shortcut::Shortcut;
use std::str::FromStr;
fn test() {
    let s = "CommandOrControl+Shift+X".parse::<Shortcut>();
}
