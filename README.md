# 🚀 International Space Station (ISS) Tracker

A modern, responsive web application that displays the **real-time location of the International Space Station (ISS)** on an interactive world map with a stunning **dark theme and neon effects**. The app automatically updates every 5 minutes and features manual refresh capabilities, offline detection, and accessible design. Built with **Leaflet.js** for map rendering and **Axios** for secure HTTPS API calls.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🌍 **Real-time ISS Tracking**: Live location updates every 5 minutes
- 🔄 **Manual Refresh**: On-demand location updates with debounced refresh button
- 📡 **Offline Detection**: Automatic monitoring of network connectivity
- ♿ **Accessible Design**: ARIA labels and semantic HTML for screen readers
- 📱 **Responsive Layout**: Works seamlessly on desktop and mobile devices
- 🎨 **Dark Theme with Neon Effects**: Stunning visual design with glowing elements and animated backgrounds
- 🌟 **Animated Star Field**: Dynamic background with twinkling stars
- 💫 **Smooth Animations**: Hover effects, transitions, and pulsing neon glow
- 🔒 **Secure**: HTTPS API endpoints for safe data transmission
- ⚡ **Performance Optimized**: Request timeouts and debouncing to prevent excessive API calls

---

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern, responsive styling with Flexbox, gradients, and animations
- **JavaScript (ES6+)**: Async/await, modern syntax
- **Leaflet.js v1.9.4**: Interactive map rendering with dark theme tiles
- **Axios**: HTTP client for API requests
- **Where the ISS At API**: Reliable ISS location data provider
- **CARTO Dark Theme**: Dark map tiles for enhanced visual experience
- **ESLint & Prettier**: Code quality and formatting tools

---

## 📂 Project Structure

```
satellite-tracker/
├── index.html              # Main HTML file with semantic structure
├── assets/
│   └── satellite_icon.png  # Custom ISS marker icon
├── styles/
│   └── style.css          # Responsive styles and layout
├── scripts/
│   └── script.js          # JavaScript for map and API handling
├── .eslintrc.json         # ESLint configuration
├── .prettierrc.json       # Prettier configuration
├── .gitignore             # Git ignore rules
├── package.json           # Project metadata and scripts
├── LICENSE                # MIT License
└── README.md              # Project documentation
```

---

## ⚙️ Prerequisites

- **Node.js** (v14 or higher) - Required for development tools
- **npm** - Package manager (comes with Node.js)
- **Modern Web Browser** - Chrome, Firefox, Safari, or Edge (latest versions)
- **Internet Connection** - Required for loading map tiles and ISS data

---

## 📦 Setup Instructions

### Quick Start (Development)

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Youngman-d-coder/Satelite_Tracker.git
   cd Satelite_Tracker
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

   This will start a local HTTP server on port 8080 and automatically open the app in your default browser.

4. **Access the Application**
   - The app will open automatically at `http://localhost:8080`
   - Or manually navigate to `http://localhost:8080` in your browser

### Alternative: Direct Browser Access

If you don't need development tools, you can open `index.html` directly in your browser:

```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

**Note**: Some features may not work correctly when opening directly due to CORS policies. Using the development server is recommended.

---

## 🚀 Available Scripts

- **`npm start`** - Start HTTP server on port 8080
- **`npm run dev`** - Start server and open in browser
- **`npm run lint`** - Check code quality with ESLint
- **`npm run format`** - Format code with Prettier

---

---

## 🔧 How It Works

### Architecture Overview

1. **Initialization**
   - Map is initialized using Leaflet.js centered at [0, 0] with dark theme tiles
   - ISS marker is placed with custom satellite icon
   - Initial API call fetches current ISS position

2. **Data Fetching**
   - API Endpoint: `https://api.wheretheiss.at/v1/satellites/25544` (secure HTTPS)
   - Response Format: JSON with `latitude`, `longitude`, and `timestamp`
   - Timeout: 10 seconds to prevent hanging requests
   - Error Handling: Specific error messages for different failure types
   - Coordinates formatted to 4 decimal places for precision

3. **Automatic Updates**
   - Background refresh every 5 minutes using `setInterval()`
   - Configurable interval via `CONFIG.UPDATE_INTERVAL`
   - No user interaction required

4. **Manual Refresh**
   - Refresh button with 1-second debouncing to prevent spam
   - Immediate API call on button click
   - Loading spinner provides visual feedback with neon glow

5. **Offline Detection**
   - Monitors `navigator.onLine` status
   - Listens for `online` and `offline` events
   - Displays user-friendly notifications with gradient backgrounds

6. **Map Updates**
   - Marker position updated to new coordinates
   - Map view centered on ISS location
   - Popup shows latitude and longitude with 4 decimal precision

---

## 🎨 User Interface

- **Dark Theme**: Navy/purple gradient background with animated star field
- **Neon Effects**: Cyan glowing borders, text shadows, and button effects with pulsing animations
- **Map Container**: Interactive Leaflet map with CARTO dark theme tiles and neon border glow
- **Coordinates Panel**: Dark semi-transparent panel with cyan accents and hover effects
- **Refresh Button**: Gradient cyan button with ripple effect and neon glow on hover
- **Loading Spinner**: Animated spinner with neon cyan glow effect
- **Notifications**: Gradient background notifications with glow effects (error in red, success in green)

---

## 🔒 Security Features

- ✅ **HTTPS API Calls**: All requests use secure HTTPS protocol
- ✅ **Request Timeouts**: 10-second timeout prevents hanging connections
- ✅ **Input Validation**: Proper error handling for API responses
- ✅ **No Sensitive Data**: No user data collected or stored
- ✅ **CSP Ready**: Compatible with Content Security Policies

---

## ♿ Accessibility

- **ARIA Labels**: All interactive elements have descriptive labels
- **Semantic HTML**: Proper use of `<header>`, `<main>`, `<section>`, `<aside>`
- **Live Regions**: Coordinates update with `aria-live="polite"`
- **Keyboard Navigation**: Full keyboard support for all controls
- **Screen Reader Friendly**: Descriptive text for assistive technologies

---

## 🧪 Code Quality

- **ESLint**: Configured for modern JavaScript best practices
- **Prettier**: Consistent code formatting across all files
- **Constants**: Configuration values extracted to `CONFIG` object
- **Error Handling**: Comprehensive try-catch blocks with specific messages
- **Debouncing**: Prevents excessive API calls from rapid clicks
- **Clean Code**: Well-commented, maintainable codebase

---

## 🚧 Known Limitations

- ISS position updates every 5 minutes (API limitation)
- Requires active internet connection for map tiles and ISS data
- No historical ISS position data (current position only)
- Limited to ISS tracking (no other satellites)

---

## 🔮 Future Enhancements

Potential improvements for future versions:

- [ ] Add ISS orbit path visualization
- [ ] Display ISS pass predictions for user's location
- [ ] Add more satellites to track
- [ ] Implement PWA (Progressive Web App) features
- [ ] Add dark mode toggle
- [ ] Show ISS crew information
- [ ] Add multi-language support
- [ ] Include ISS altitude and speed data
- [ ] Add unit tests and E2E tests

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code:

- Passes ESLint checks (`npm run lint`)
- Is formatted with Prettier (`npm run format`)
- Follows existing code style
- Includes appropriate comments

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Nelson Chimdiadi C.**

- Email: sayhitonelson@gmail.com
- GitHub: [@Youngman-d-coder](https://github.com/Youngman-d-coder)

---

## 🙏 Acknowledgments

- [Where the ISS At API](https://wheretheiss.at/) - Reliable ISS location data
- [Leaflet.js](https://leafletjs.com/) - Interactive map library
- [CARTO](https://carto.com/) - Dark theme map tiles
- [OpenStreetMap](https://www.openstreetmap.org/) - Map data
- [Axios](https://axios-http.com/) - Promise-based HTTP client

---

## ⭐ Show Your Support

If you find this project helpful, please consider giving it a star on GitHub!

---

**Last Updated**: February 2024  
**Version**: 1.0.0
