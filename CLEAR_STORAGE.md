# Clear Storage Instructions

## Quick Method (Browser Console)

1. Open your browser's Developer Tools (F12 or Cmd+Option+I on Mac)
2. Go to the **Console** tab
3. Type and press Enter:
   ```javascript
   localStorage.clear()
   ```
4. Refresh the page (F5 or Cmd+R)

## Alternative: Clear Specific Keys

If you only want to clear the landing page flag:
```javascript
localStorage.removeItem('polycaster_landing_skipped')
```

## Clear All PolyCaster Storage

To clear all PolyCaster-related localStorage:
```javascript
localStorage.removeItem('polycaster_landing_skipped')
localStorage.removeItem('polycaster_seen_alerts')
localStorage.removeItem('polycaster_onboarding_completed')
```

## Using Browser DevTools

1. Open DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage**
4. Click on your domain (e.g., `http://localhost:3000`)
5. Right-click and select **Clear** or delete individual items

