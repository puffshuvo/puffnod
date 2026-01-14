# Projects Section Color Customization Guide

The background color transition on the projects section is now fully functional and easy to customize!

## How to Change Colors

Open `toggle.js` and find the **COLOR_CONFIG** section (around line 690):

```javascript
const COLOR_CONFIG = [
    { from: '#f5f7fa', to: '#e2cbc3', textColor: '#333' },
    { from: '#ea6666', to: '#764ba2', textColor: 'white' },
    { from: '#000000', to: '#434343', textColor: 'white' },
    { from: '#FA8BFF', to: '#2BD2FF', textColor: '#1a1a1a' },
    { from: '#ffecd2', to: '#fcb69f', textColor: '#333' }
];
```

### Color Stop Parameters:

- **`from`**: Left side gradient color (hex format #RRGGBB)
- **`to`**: Right side gradient color (hex format #RRGGBB)
- **`textColor`**: Text color for this section (#333 = dark, white = light, etc.)

## How It Works

1. As users scroll through the projects section, the background smoothly transitions between color stops
2. Each color stop is interpolated smoothly to create a gradient effect
3. The gradient goes from left (`from`) to right (`to`) at a 135-degree angle
4. Text color automatically adjusts for better readability

## Example: Change to Cool Blue Tones

Replace the COLOR_CONFIG with:

```javascript
const COLOR_CONFIG = [
    { from: '#e0f2ff', to: '#b3d9ff', textColor: '#333' },
    { from: '#4da6ff', to: '#0073e6', textColor: 'white' },
    { from: '#003d99', to: '#002266', textColor: 'white' },
    { from: '#1a75ff', to: '#0033cc', textColor: 'white' },
    { from: '#99ccff', to: '#6699ff', textColor: '#333' }
];
```

## Example: Warm Sunset Theme

```javascript
const COLOR_CONFIG = [
    { from: '#ffe6cc', to: '#ffcc99', textColor: '#333' },
    { from: '#ff9933', to: '#ff6600', textColor: 'white' },
    { from: '#cc3300', to: '#990000', textColor: 'white' },
    { from: '#ff6633', to: '#ff3300', textColor: 'white' },
    { from: '#ffdd99', to: '#ffbb66', textColor: '#333' }
];
```

## Tips

- Use online color pickers (e.g., colorpicker.com) to find hex colors you like
- Make sure text color contrasts well with the gradient for readability
- Test in your browser by scrolling through the projects section
- You can have as many color stops as you want (not limited to 5)

## What Was Fixed

1. ✅ Changed selector from `#projectsSection` to `#projects` (matching HTML)
2. ✅ Improved scroll calculation for more accurate transitions
3. ✅ Made colors configurable in a clear `COLOR_CONFIG` object
4. ✅ Enhanced the color interpolation logic
5. ✅ Added better viewport detection
