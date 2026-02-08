# AutoForm Fill – Fake Data Generator

Browser extension that fills web forms with realistic fake data. Available for Chrome and Firefox.

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

### Chrome
1. Go to `chrome://extensions`
2. Turn on **Developer mode**
3. **Load unpacked** → select `Chrome-Extension` folder

### Firefox
1. Go to `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on** → select `manifest.json` from `Mozile-Extension` folder

Or download from [Firefox Add-ons (AMO)](https://addons.mozilla.org/en-US/firefox/addon/auto-fill-fake-data-generator/)

## Usage

1. Open any page with a form
2. **Fill:** Click the extension icon → "Fill Form", or use shortcut `Ctrl+Shift+V` then `V` again
3. **Settings:** Right-click extension → Options (or open from popup)

## Options (Settings)

- **General:** Shortcut on/off, phone format (local/international), custom image/PDF/doc for file auto-fill
- **Field types:** Enable/disable filling for each type (name, email, phone, file, etc.)
- **Custom rules:** Add rules like `nickname` [fixed] → Name, `+8801878578504` [fixed] → Phone (exact number), or regex patterns

## Project Structure

```
├── Chrome-Extension/   # Chrome (Manifest V3)
├── Mozile-Extension/   # Firefox (Manifest V2)
```

## Publishing

### Chrome Web Store
Package `Chrome-Extension` folder (exclude dev files) and upload to Chrome Web Store.

### Firefox Add-ons (AMO)
Package `Mozile-Extension` folder and submit to addons.mozilla.org. Includes required `data_collection_permissions` for AMO compliance.
