# VIT Security Authentication System - File Structure

This project has been divided into three separate files for better organization and maintainability.

## Files

### 1. **index.html**
The main HTML structure containing:
- Page layout and semantic markup
- Navigation bar with VIT branding
- Authentication layers (Login, Pattern, Memory, Sequence)
- Hint box and activity log sidebar
- Footer

### 2. **styles.css**
All styling and visual design including:
- Responsive layout (grid-based container)
- Custom gradients and animations
- Progress level indicators with arrow shapes
- Form controls and buttons
- Memory grid and color button styles
- Message boxes and banners
- Mobile responsive design (@media queries)

### 3. **script.js**
All application logic and interactivity:
- Configuration (credentials, patterns, sequences)
- State management
- Layer-based authentication flow
- Login validation
- Pattern recognition challenges
- Memory grid game
- Color sequence recall
- Attempt tracking and lockout system
- Activity logging

## How to Use

### Local Development
1. Place all three files in the same directory:
   ```
   your-project/
   ├── index.html
   ├── styles.css
   └── script.js
   ```

2. Open `index.html` in a web browser

### File Relationships
- `index.html` links to `styles.css` via: `<link rel="stylesheet" href="styles.css">`
- `index.html` links to `script.js` via: `<script src="script.js"></script>`
- All files must be in the same directory for the relative paths to work

### Deployment
For web hosting, upload all three files to your server maintaining the same directory structure.

## Features
- **4-Layer Authentication System**
  - Layer 1: Username/Password (admin/admin)
  - Layer 2: Pattern Recognition
  - Layer 3: Memory Grid Challenge
  - Layer 4: Color Sequence Recall
  
- **Security Features**
  - 3 attempts per layer
  - 3 total runs before permanent lockout
  - Real-time activity logging
  - Visual feedback for success/failure

## Customization

### Changing Credentials
Edit in `script.js`:
```javascript
const CFG = {
  username: 'admin',  // Change this
  password: 'admin',  // Change this
  ...
}
```

### Adding Patterns
Edit in `script.js`:
```javascript
patterns: [
  { question: 'Your pattern ?', answer: 'answer' },
  ...
]
```

### Modifying Color Sequences
Edit in `script.js`:
```javascript
sequences: [
  ['red', 'blue', 'green', 'yellow'],
  ...
]
```

### Styling Changes
All visual modifications should be made in `styles.css`

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile devices
- No external dependencies required
