SARVESH TEACHER MANAGER — PWA

This package is a Progressive Web App (PWA) version of the HTML app.

IMPORTANT:
A PWA cannot install service-worker functionality when opened directly as file://.
It must be served from HTTPS or localhost.

QUICK TEST ON A COMPUTER:
1. Open a terminal in this folder.
2. Run a local server, for example:
   python -m http.server 8080
3. Open:
   http://localhost:8080
4. In Chrome/Edge choose Install App / Add to Home Screen.

FOR PHONE INSTALLATION:
Host this folder on an HTTPS website/server, open the site in Chrome on Android,
then use the browser menu -> Install app / Add to Home screen.

The app is designed to work offline after the first successful load.
LocalStorage data remains on the device/browser profile.
