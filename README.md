# Fylos Mobile UI Viewer

Απλό React app για να προβάλλεις και να δοκιμάσεις τα mobile UI templates (JSX files) από το iOS app.

## 🚀 Quick Start

### 1. Εγκατάσταση

```bash
cd C:\Projects\fylos-mobile-ui-viewer
npm install
```

### 2. Προσθήκη των JSX Files

Βάλε τα 4 JSX files που σου έστειλε ο συνάδελφος στο folder:
```
src/screens/
```

Μετονομάστε τα σε:
- `Screen1.jsx`
- `Screen2.jsx`
- `Screen3.jsx`
- `Screen4.jsx`

### 3. Ενημέρωση του App.jsx

Άνοιξε το `src/App.jsx` και:
1. Uncomment τα imports των screens
2. Uncomment τα Routes

```jsx
import Screen1 from './screens/Screen1'
import Screen2 from './screens/Screen2'
import Screen3 from './screens/Screen3'
import Screen4 from './screens/Screen4'

// Και στις Routes:
<Route path="/screen1" element={<Screen1 />} />
<Route path="/screen2" element={<Screen2 />} />
<Route path="/screen3" element={<Screen3 />} />
<Route path="/screen4" element={<Screen4 />} />
```

### 4. Τρέξε το App

```bash
npm run dev
```

Θα ανοίξει αυτόματα στο browser στο `http://localhost:3000`

## 📱 Features

- ✅ Mobile frame preview (iPhone-like)
- ✅ React Router για navigation μεταξύ οθονών
- ✅ Hot reload (αλλαγές φαίνονται αμέσως)
- ✅ Responsive (λειτουργεί και σε mobile browser)

## 🔗 Navigation μεταξύ Οθονών

Στα JSX components σου, χρησιμοποίησε:

```jsx
import { useNavigate } from 'react-router-dom'

function YourScreen() {
  const navigate = useNavigate()
  
  return (
    <button onClick={() => navigate('/screen2')}>
      Go to Next Screen
    </button>
  )
}
```

## 📂 Project Structure

```
fylos-mobile-ui-viewer/
├── src/
│   ├── screens/          # Βάλε εδώ τα JSX files
│   │   ├── Screen1.jsx
│   │   ├── Screen2.jsx
│   │   ├── Screen3.jsx
│   │   └── Screen4.jsx
│   ├── App.jsx          # Main app με routes
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## 🛠️ Build για Production

```bash
npm run build
```

Τα built files θα είναι στο `dist/` folder.

## 💡 Tips

- Αν τα JSX files έχουν imports που λείπουν, προσθέστε τα dependencies στο `package.json`
- Για styling, μπορείτε να χρησιμοποιήσετε inline styles ή να προσθέσετε CSS files
- Το mobile frame είναι responsive - σε μικρές οθόνες γίνεται fullscreen

## 🐛 Troubleshooting

**Error: Cannot find module './screens/Screen1'**
- Βεβαιωθείτε ότι τα αρχεία είναι στο `src/screens/` folder
- Ελέγξτε τα imports στο `App.jsx`

**JSX syntax errors**
- Βεβαιωθείτε ότι τα αρχεία έχουν `.jsx` extension
- Ελέγξτε ότι όλα τα components έχουν `export default`

