ORGANIZE PWA

This is a small offline-first organizer:
- Groups and unlimited subgroups
- Checkable list items
- Notes on groups/items
- Search
- Data saved locally in the browser
- PWA manifest + service worker

IMPORTANT:
A proper installable PWA normally needs to be served over HTTPS (or localhost).
Opening index.html directly from a file manager may let the UI work, but Android/Chrome may not offer "Install app".

PHONE-ONLY QUICK START:
1. Extract this ZIP.
2. Open the folder in a phone code editor/file manager that can preview HTML.
3. For full PWA installation, serve the folder from an HTTPS host or a local web-server app on the phone.
4. Open the served address in Chrome and use "Add to Home screen"/"Install app".

All list data is stored in localStorage on the device/browser. Export/import is not included in this first version.
