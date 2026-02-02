# Publish on addons.mozilla.org (AMO)

## 1. Create account
- Go to https://addons.mozilla.org
- Sign up / Log in (Firefox account)

## 2. Create the add-on zip
Zip the **contents** of Mozile-Extension (not the folder itself):
- Include: manifest.json, content.js, popup.js, popup.html, options.js, options.html, icons/
- Exclude: PUBLISH.md, .git, node_modules

**Windows (PowerShell)** from project root:
```powershell
Compress-Archive -Path manifest.json, content.js, popup.js, popup.html, options.js, options.html, icons -DestinationPath autoform-fill-1.0.0.zip
```
Run this from inside the `Mozile-Extension` folder.

## 3. Submit on AMO
1. Go to https://addons.mozilla.org/developers/
2. Click **Submit a New Add-on**
3. Choose **On this site** → Upload your zip
4. Select **Firefox** and submit
5. Fill in **Description**, **Privacy policy** (if you collect data), **Category**
6. Submit for review (manual review can take a few days)

## 4. Add-on ID
The manifest uses `autoform-fill-fake-data@addon`. After first approval, AMO may suggest or assign an ID; you can keep this one if it’s accepted.

## 5. New versions
Bump `version` in manifest.json, recreate the zip, then go to your add-on’s **Developer Hub** page on AMO and upload the new zip as a new version.
