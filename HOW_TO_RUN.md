# How to Run Locally

## Option 1: Direct File Open (Simplest)
Simply double-click `index.html` or right-click and select "Open with Browser"

## Option 2: Local Web Server (Recommended for full functionality)

### Python 3
```bash
python -m http.server 8000
```
Then open: http://localhost:8000

### Python 2
```bash
python -m SimpleHTTPServer 8000
```
Then open: http://localhost:8000

### Node.js (if npx is available)
```bash
npx http-server -p 8000
```
Then open: http://localhost:8000

### PHP
```bash
php -S localhost:8000
```
Then open: http://localhost:8000

## Option 3: VS Code Live Server Extension
1. Install "Live Server" extension in VS Code
2. Right-click index.html
3. Select "Open with Live Server"

## Why use a web server?
While the app works when opened directly, using a local web server:
- Provides a more realistic testing environment
- Ensures CORS policies work correctly (if you add external resources later)
- Better simulates production deployment
- Some browser features work better over HTTP

## No Installation Required!
The application is 100% static - no npm install, no build process, no backend setup needed.
