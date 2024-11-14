# 🚀 Satellite Tracker

A simple web application that displays the **real-time location of the International Space Station (ISS)** on a world map. The app automatically updates every 5 minutes (510 seconds) and allows manual refreshing. This project uses **Leaflet.js** for map rendering and **Axios** for API calls to fetch the ISS location.

---

## 🛠️ Technologies Used

- **HTML**: For the page structure
- **CSS**: For styling the layout
- **JavaScript**: For API integration and map handling
- **Leaflet.js**: For rendering the interactive map
- **Axios**: For making HTTP requests

---

## 📂 Project Structure

```bash
/satellite-tracker
  ├── index.html              # Main HTML file
  ├── /styles
  │     └── style.css         # Styles for the map and layout
  ├── /scripts
  │     └── script.js         # JavaScript for map functionality and API handling
  └── README.md               # Project documentation
```

## ⚙️ Prerequisites

-- This project utilizes the following technologies:

-- **HTML**: For the structure of the page
-- **CSS**: For styling the page and layout
-- **JavaScript**: For integrating with APIs and handling map functionality
-- **Leaflet.js**: For displaying the world map
-- **Axios**: For making HTTP requests to fetch the ISS location

## 📦 Setup Instructions

-- Clone the Repository

```bash
git clone https://github.com/Youngman-d-coder/Satellite_Tracker.git
cd satellite-tracker
```

-- Open the index.html file in your browser.
-- Open the Project
-- Ensure Internet Access
-- The project uses external libraries (Leaflet.js, Axios) -- linked via CDN in the HTML file. Ensure you are connected to the internet to load these resources.

## 🧭 Features

-- Real-time ISS Location: The map displays the current -- position of the International Space Station (ISS), updated -- every 5 minutes (510 seconds).
-- Refresh Button: A manual refresh button allows users to -- fetch the latest ISS location at any time.
-- Coordinates Display: Displays the current latitude and -- longitude of the ISS on the right side of the screen.
-- Loading Spinner: A loading spinner is displayed while -- fetching the ISS data from the API.

## 🛠️ Functionality

API Integration
The application retrieves the current location of the ISS using the Open Notify ISS API:

API Endpoint: http://api.open-notify.org/iss-now.json
Data Format: JSON
Key Data Fields:
iss_position: Contains the latitude and longitude of the ISS.
timestamp: The time at which the data was fetched.
Map Integration
Leaflet.js is used to render the map.
The map is centered at [0, 0] (Equator), and the ISS position is updated every time new coordinates are fetched.
Automatic Updates
The ISS position is updated every 5 minutes (510 seconds) using the setInterval() method in JavaScript. This interval can be adjusted as necessary.
Manual Refresh
Users can manually update the ISS position by clicking the Refresh button. The refresh function makes a new API request and updates the map and the coordinates.
Error Handling
Basic error handling is in place to ensure smooth functioning if the API request fails, such as displaying an error message in the browser console.

## 📄 Files Explanation

**index.html**:

Contains the structure of the web page, including the map display, coordinates section, and the refresh button.
Links to the necessary external resources (Leaflet.js, Axios).
**style.css**:

Contains the styling rules for the layout, such as:
The map container width and height.
Button and coordinate display styles.
Basic page layout using Flexbox for positioning the map and controls.
**script.js**:

Handles the logic for:
Fetching the ISS location from the API.
Updating the map marker and coordinates.
Handling the refresh button click and automatic updates.
Showing the loading spinner while fetching data.

## 💡 How the Application Works

-- **Initialization**: When the page loads, the map is -- initialized with the ISS's position at [0, 0].
-- **Location Update**: The updateISSLocation function is called immediately to fetch the ISS location and update the map.
-- **Automatic Updates**: The location is updated every 5 minutes using the setInterval() function.
-- **Manual Refresh: Users can click the Refresh button to fetch and display the ISS's current location manually.
-- **Coordinates Display**: The coordinates and a timestamp of the last update are displayed beside the map.
-- **Error Handling\*\*: If there is an issue with fetching the data, an error message is logged to the console.

## ⚙️ Challenges and Solutions

Issue with Map Not Updating: Initially, the map wasn't updating correctly due to incorrect API response handling. This was solved by ensuring that the latitude and longitude were extracted correctly from the API response and passed to the Leaflet map.
Loading Spinner: Initially, the app lacked feedback during data fetches, which led to confusion. A simple loading spinner was added to show users that data was being fetched.

## 📝 License

This project is open-source and available under the MIT License.

## 📬 Contact

For further questions or issues with the project, feel free to reach out to the project maintainer:

Email: sayhitonelson@gmail.com
GitHub: github.com/Youngman-d-coder
