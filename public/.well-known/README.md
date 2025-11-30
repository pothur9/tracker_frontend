# Digital Asset Links Setup for Vercel

## What is this file?

This `assetlinks.json` file verifies that your Android app is authorized to open your Vercel domain in Trusted Web Activity (TWA) mode.

## Current Status

⚠️ **ACTION REQUIRED**: You need to replace `REPLACE_WITH_YOUR_SHA256_FINGERPRINT` with your actual SHA-256 fingerprint.

## Steps to Complete Setup

### 1. Generate SHA-256 Fingerprint

**For Debug Build (Testing):**

Open PowerShell and run:
```powershell
keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
```

Look for the line that says `SHA256:` and copy the fingerprint (format: `A1:B2:C3:...`)

**Example output:**
```
Certificate fingerprints:
     SHA1: 12:34:56:78:90:AB:CD:EF:...
     SHA256: 14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B1:3F:CF:44:E5
```

### 2. Update assetlinks.json

Edit this file and replace `REPLACE_WITH_YOUR_SHA256_FINGERPRINT` with your SHA-256 fingerprint.

**IMPORTANT**: Keep the colons in the fingerprint (e.g., `14:6D:E9:83:...`)

Example:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.tracker.app",
    "sha256_cert_fingerprints": [
      "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B1:3F:CF:44:E5"
    ]
  }
}]
```

### 3. Deploy to Vercel

After updating the file:

1. Commit and push to your repository:
   ```bash
   git add public/.well-known/assetlinks.json
   git commit -m "Add Digital Asset Links for Android TWA"
   git push
   ```

2. Vercel will automatically deploy the changes

3. Verify the file is accessible at:
   ```
   https://tracker-frontend-khaki.vercel.app/.well-known/assetlinks.json
   ```

### 4. Verify Digital Asset Links

Use Google's verification tool:
1. Go to: https://developers.google.com/digital-asset-links/tools/generator
2. Enter:
   - **Site domain**: `tracker-frontend-khaki.vercel.app`
   - **Package name**: `com.tracker.app`
   - **SHA-256 fingerprint**: (your fingerprint)
3. Click "Generate Statement"
4. Verify it matches your assetlinks.json

### 5. Test the TWA

After deploying:

1. Build and install the Android app:
   ```bash
   cd tracker-android
   ./gradlew installDebug
   ```

2. Launch the app - it should open without browser UI

3. If it opens in Chrome instead:
   - Wait up to 24 hours for Google to verify
   - Clear Chrome data: Settings → Apps → Chrome → Storage → Clear Data
   - Try again

## For Production Release

When you create a release build, you'll need to:

1. Generate a release keystore:
   ```bash
   keytool -genkey -v -keystore tracker-release.keystore -alias tracker -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Get the release SHA-256:
   ```bash
   keytool -list -v -keystore tracker-release.keystore -alias tracker
   ```

3. Add the release fingerprint to this file (you can have multiple fingerprints):
   ```json
   "sha256_cert_fingerprints": [
     "DEBUG_FINGERPRINT_HERE",
     "RELEASE_FINGERPRINT_HERE"
   ]
   ```

## Troubleshooting

### File not accessible
- Check that the file is in `public/.well-known/assetlinks.json`
- Verify it's deployed to Vercel
- Test URL: https://tracker-frontend-khaki.vercel.app/.well-known/assetlinks.json

### App still opens in Chrome
- Verify SHA-256 fingerprint is correct
- Check JSON syntax is valid
- Clear Chrome app data
- Wait for Google verification (up to 24 hours)

### Invalid JSON
- Use a JSON validator: https://jsonlint.com/
- Ensure proper quotes and commas
- No trailing commas allowed

## Next.js Configuration (if needed)

If the file isn't being served correctly, you may need to add to `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/.well-known/assetlinks.json',
      headers: [
        {
          key: 'Content-Type',
          value: 'application/json',
        },
      ],
    },
  ]
}
```

## Resources

- [Digital Asset Links Documentation](https://developers.google.com/digital-asset-links/v1/getting-started)
- [TWA Quick Start Guide](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start/)
- [Verification Tool](https://developers.google.com/digital-asset-links/tools/generator)
