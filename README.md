# AutoForm Fill – Fake Data Generator

Chrome extension that fills web forms with realistic fake data. Supports HTML, React, Vue, Angular, Next.js, and Express-style forms.

## Features

- **Text & inputs:** Name, email, phone, address, company, date, number, password, URL, NID, textarea
- **Phone:** Bangladeshi format — local (`01XXXXXXXXX`) or international (`+8801XXXXXXXXX`), configurable in settings
- **Dropdowns & selects:** Random option (or context-aware e.g. Bangladesh/Dhaka); Vue Select, Ant Design, React Select, MUI, Angular Material
- **Checkboxes & radio buttons:** Random selection
- **File & image upload:** Auto-fills file inputs with demo or your custom image/PDF/doc (set in Options → Custom Files)
- **Custom rules:** Map field patterns (text or regex) to fill type or Skip; fixed values (e.g. `+8801878578504` → phone) fill that exact value
- **Keyboard shortcut:** `Ctrl+Shift+V` then `V` again (double-tap V) — toggle in Options
- **Settings page:** General (shortcut, phone format, custom files), Field types (per-type toggles), Custom rules

## Installation

1. Chrome → `chrome://extensions`
2. Turn on **Developer mode**
3. **Load unpacked** → select this folder

## Usage

1. Open any page with a form.
2. **Fill:** Click the extension icon → “Fill Form”, or use shortcut `Ctrl+Shift+V` then `V` again.
3. **Settings:** Right-click extension → Options (or open from popup).

## Options (Settings)

- **General:** Shortcut on/off, phone format (local/international), custom image/PDF/doc for file auto-fill
- **Field types:** Enable/disable filling for each type (name, email, phone, file, etc.)
- **Custom rules:** Add rules like `nickname` [fixed] → Name, `+8801878578504` [fixed] → Phone (exact number), or regex patterns

## Important Notes

- **File upload:** Enable “File Upload” in Field types. Upload your own image/PDF/doc in Options → Custom Files to use those instead of demo files.
- **Custom rules:** Fixed value (e.g. a phone number) fills that exact value; text patterns match field name/label/placeholder and use the chosen fill type.

## Publishing

Package the extension and upload to the Chrome Web Store (e.g. zip excluding dev files).
