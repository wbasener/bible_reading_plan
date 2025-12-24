# Bible Reading Plan Tracker - Installation Instructions

## What You Have

A Progressive Web App (PWA) that helps you track your daily Bible reading with four different reading plans:
1. **Straight Through** - Genesis to Revelation in order
2. **Chronological** - Bible events in historical order
3. **52-Week Variety** - Different genres each day (Epistles, Law, History, Psalms, Poetry, Prophecy, Gospels)
4. **One Year Bible** - Balanced readings from OT, NT, Psalms, and Proverbs each day

## Features
- ✅ Daily checkboxes that persist across sessions
- 📊 Progress tracking with statistics
- 📅 Calendar view of completed days
- 🔄 Switch between different reading plans
- 📱 Works offline once installed
- 🌙 Clean, mobile-friendly interface

## Installation Instructions for Samsung Phone

### Method 1: Using GitHub Pages (Recommended - Easiest)

1. **Upload to GitHub**:
   - Create a free GitHub account at https://github.com
   - Create a new repository (name it anything, like "bible-reading-plan")
   - Upload all the files from the `bible-reader` folder to your repository
   - Enable GitHub Pages in repository Settings → Pages → Select "main" branch → Save
   - Your app will be available at: `https://yourusername.github.io/bible-reading-plan/`

2. **Install on Your Phone**:
   - Open Samsung Internet or Chrome browser on your Samsung phone
   - Navigate to your GitHub Pages URL
   - Tap the menu button (three dots)
   - Select "Add to Home screen" or "Install app"
   - The app icon will appear on your home screen
   - You can now use it like a regular app, even offline!

### Method 2: Using a Local Web Server

1. **On Your Computer**:
   ```bash
   cd bible-reader
   python3 -m http.server 8000
   ```
   
2. **On Your Samsung Phone**:
   - Connect to the same WiFi network as your computer
   - Find your computer's IP address (on Windows: `ipconfig`, on Mac/Linux: `ifconfig`)
   - Open browser and navigate to: `http://YOUR_COMPUTER_IP:8000`
   - Install to home screen as described above

### Method 3: Using Netlify (Free Hosting)

1. Go to https://www.netlify.com and create a free account
2. Drag and drop the entire `bible-reader` folder onto Netlify
3. Netlify will give you a URL like `https://random-name.netlify.app`
4. Open this URL on your Samsung phone and install to home screen

## Using the App

1. **First Time**: Select your preferred reading plan
2. **Daily Reading**: Open the app to see today's reading assignment
3. **Mark Complete**: Check the box when you finish reading
4. **Navigate**: Use the date picker or arrow buttons to view different days
5. **View Progress**: See your completion percentage, current streak, and total days completed
6. **Calendar View**: Click "View Calendar" to see all 365 days at a glance

## Files Included

- `index.html` - Main app interface
- `styles.css` - App styling
- `app.js` - Main application logic
- `reading-plans.js` - All four reading plans data
- `sw.js` - Service worker for offline functionality
- `manifest.json` - PWA configuration
- `icon-192.png` - App icon (192x192)
- `icon-512.png` - App icon (512x512)
- `icon.svg` - Source icon file

## Technical Details

- **Storage**: Uses localStorage to save your progress
- **Offline**: Works without internet after first load
- **Privacy**: All data stays on your device
- **Compatible**: Works on any modern smartphone browser
- **No Account**: No sign-up or login required

## Troubleshooting

**App not installing?**
- Make sure you're using a modern browser (Chrome, Samsung Internet, Firefox)
- Try clearing browser cache and reloading

**Progress not saving?**
- Check that browser storage is enabled
- Don't use private/incognito mode

**Want to change plans?**
- Click "Change Plan" button
- Your progress is saved even when switching plans

## Support

This is a standalone web app that runs entirely on your device. Your reading progress is stored locally and never sent anywhere. Enjoy your daily Bible reading!

---

Created with ❤️ for daily Bible study
