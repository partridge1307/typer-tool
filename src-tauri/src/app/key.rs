use std::{thread, time};

use rdev::{simulate, EventType, Key};

#[tauri::command]
pub fn send_key() {
    let delay = time::Duration::from_millis(20);

    match simulate(&EventType::KeyPress(Key::Space)) {
        Ok(()) => {
            println!("Pressed");
        }
        Err(_) => {
            println!("We could not send {:?}", "test");
        }
    }

    thread::sleep(delay)
}
