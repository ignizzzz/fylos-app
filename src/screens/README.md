# Mobile UI Screens

Βάλε εδώ τα 4 JSX files που σου έστειλε ο συνάδελφος.

## Οδηγίες:

1. **Μετονομάστε τα αρχεία** (αν χρειάζεται) σε:
   - `Screen1.jsx`
   - `Screen2.jsx`
   - `Screen3.jsx`
   - `Screen4.jsx`

2. **Ενημερώστε το `App.jsx`**:
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

3. **Για navigation μεταξύ οθονών**, χρησιμοποιήστε:
   ```jsx
   import { useNavigate } from 'react-router-dom'
   
   const navigate = useNavigate()
   
   // Σε button click:
   <button onClick={() => navigate('/screen2')}>
     Go to Screen 2
   </button>
   ```

## Παράδειγμα Screen Component:

```jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

function Screen1() {
  const navigate = useNavigate()
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Screen 1</h1>
      <button onClick={() => navigate('/screen2')}>
        Next Screen
      </button>
    </div>
  )
}

export default Screen1
```

