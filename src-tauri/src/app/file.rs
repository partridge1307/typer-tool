use serde_json::Value;
use std::{fs, io::Read};
use tauri::http::MimeType;

// Docx parser
#[derive(serde::Serialize)]
pub enum FormatType {
    NORMAL,
    ITALIC,
    UNDERLINE,
}

fn parse_docx(path: &str) -> Result<Vec<String>, &str> {
    // Read docx file
    let docx = docx_rs::read_docx(&read_to_vec(path)).map_err(|_| "Failed to parse docx")?;
    // Parse docx to json and navigate to Document children element
    let data: Value = serde_json::from_str(&docx.json()).map_err(|_| "Failed to parse docx")?;
    let document = data["document"]["children"]
        .as_array()
        .ok_or("Failed to access elements in docx")?;

    // Parsing content
    Ok(document
        .into_iter()
        .map(|paragraph| {
            let format_type = get_format_type(paragraph).unwrap_or(FormatType::NORMAL);
            let text = get_text(paragraph, &format_type).unwrap_or(String::new());

            text
        })
        .collect())
}

fn get_format_type(paragraph: &Value) -> Result<FormatType, &str> {
    let data = paragraph["data"]["children"]
        .as_array()
        .ok_or("Failed to access children elements to parse format type")?;

    for child in data {
        if let Some(run_property) = child["data"]["runProperty"].as_object() {
            let is_underline = run_property
                .get("underline")
                .map_or(false, |v| v == "single");
            let is_italic = run_property
                .get("italic")
                .map_or(false, |v| v.as_bool() == Some(true));

            if is_underline {
                return Ok(FormatType::UNDERLINE);
            }
            if is_italic {
                return Ok(FormatType::ITALIC);
            }
        }
    }

    Ok(FormatType::NORMAL)
}

fn get_text<'a>(paragraph: &Value, format_type: &FormatType) -> Result<String, &'a str> {
    let paragraph_children = paragraph["data"]["children"]
        .as_array()
        .ok_or("Failed to read children elements in docx")?;

    let mut result = String::new();
    for children in paragraph_children {
        if children["type"] == "text" {
            if let Some(text) = children["data"]["text"].as_str() {
                match format_type {
                    FormatType::ITALIC => result.push_str(&format!("**{}**", text)),
                    FormatType::UNDERLINE => result.push_str(&format!("__{}__", text)),
                    _ => result.push_str(text),
                }
            }
        } else {
            result.push_str(&get_text(children, format_type)?)
        }
    }

    Ok(result)
}

fn read_to_vec(path: &str) -> Vec<u8> {
    let mut vec = Vec::new();

    let mut file = fs::File::open(path).unwrap();
    file.read_to_end(&mut vec).unwrap();

    vec
}

#[tauri::command]
pub async fn read_file(path: &str) -> Result<String, String> {
    let mime_type = MimeType::parse_from_uri(path).to_string();

    if mime_type.as_str() == "text/plain" {
        let mut file = fs::File::open(path).map_err(|_| "Failed to parse txt file")?;
        let mut result = String::new();
        file.read_to_string(&mut result)
            .map_err(|_| "Failed to read txt file")?;

        println!("{}", result);

        Ok(result)
    } else {
        let result = parse_docx(path).map_err(|_| "Failed to parse docx file")?;

        Ok(result.join("\n"))
    }
}
