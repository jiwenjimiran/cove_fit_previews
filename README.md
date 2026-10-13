# Fit Previews

A Cove extension that fits video covers, animated hover previews, and scrub frames inside their thumbnail area. Portrait phone videos remain fully visible with black bars instead of being cropped. Landscape videos also retain their full frame.

Requires **Cove 1.5.1 or newer**. Applies to Cove's shared video thumbnail component, including library cards, tagging thumbnails, and duplicate previews. Card sizes and preview playback behavior stay the same. The video player and other entity images are unaffected.

## Install

In **Settings → Extensions → Install from URL**, paste:

```text
https://github.com/jiwenjimiran/cove_fit_previews/releases/download/v1.0.0/io.github.jiwenjimiran.fit-previews-1.0.0.zip
```

Enable **Fit Previews**. Refresh Cove if your version does not immediately reload extension styles. Disable it to restore Cove's configured fit preference.

The extension uses a stylesheet and a minimal compiled UI extension. It has no JavaScript, settings, API requests, or library writes. Cove owns loading and removing the stylesheet when the extension is enabled or disabled.

## Development

Requires .NET 10 and PowerShell. The package references the published Cove.Plugins 1.5.1 contract and excludes host assemblies from the ZIP.

```powershell
./scripts/package.ps1
```

Browser validation uses Playwright to check portrait/landscape fitting, cover/video/scrub media, unchanged thumbnail dimensions, unrelated images, and stylesheet removal:

```powershell
npm ci
npx playwright install chromium
npm test
```
