# Weather Dashboard with Chatbot Integration

## Overview

This project is a fully responsive weather dashboard that provides current weather information and a 5-day forecast for any city. It integrates with the OpenWeather API for weather data and uses Google's Generative AI for a chatbot feature. The dashboard includes data visualization using Chart.js and offers various data manipulation options.

## Features

1. **Current Weather Display**: Shows current weather conditions for a searched city.
2. **5-Day Forecast**: Provides a detailed 5-day weather forecast.
3. **Data Visualization**: Utilizes Chart.js to display weather data in various chart formats:
   - Vertical Bar Chart: Shows temperatures for the next 5 days.
   - Doughnut Chart: Displays the percentage of different weather conditions over the 5-day period.
   - Line Chart: Illustrates temperature changes for the next 5 days.
4. **Interactive Table**: 
   - Displays forecast data with pagination.
   - Allows sorting temperatures in ascending and descending order.
   - Filters data to show only rainy days.
   - Highlights the day with the highest temperature.
5. **Chatbot Integration**: Uses Google's Generative AI to answer user queries about the displayed weather data.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- OpenWeather API
- Gemini API
- Chart.js

## Setup Instructions

1. Clone the repository to your local machine.
2. Open the project folder in your preferred code editor.
3. Ensure you have valid API keys for:
   - OpenWeather API
   - Google Generative AI
4. Replace the placeholder API keys in the JavaScript files with your actual API keys:
   - In `script.js`: Replace `'API KEY'` with your OpenWeather API key.
   - In the chatbot section: Replace `'API KEY'` with your Gemini API key.
5. Open `index.html` in a web browser to view the dashboard.

## Usage Guidelines

1. **Search for a City**: 
   - Enter a city name in the search bar and press Enter to fetch weather data.

2. **View Weather Information**:
   - Current weather conditions are displayed in the main widget.
   - The 5-day forecast is shown in various charts below.

3. **Interact with the Forecast Table**:
   - Use pagination buttons to navigate through the forecast data.
   - Click "Sort Ascending" or "Sort Descending" to reorder temperatures.
   - Use "Filter Rain Days" to show only rainy weather forecasts.
   - Click "Highest Temperature" to highlight the warmest day.
   - Use "Remove Filters" to reset the table to its original state.

4. **Use the Chatbot**:
   - Type your weather-related questions in the chat input.
   - Click "Send" or press Enter to get AI-generated responses based on the displayed data.

## File Structure

- `index.html`: Main dashboard page
- `table.html`: Forecast table page
- `style.css`: Styles for the dashboard
- `styles.css`: Styles for the table page
- `script.js`: Main JavaScript file for dashboard functionality
- `script1.js`: JavaScript file for table and data manipulation features

## Contributing

Contributions to improve the dashboard are welcome. Please fork the repository and submit a pull request with your changes.

## License

This project is open source and available under the [MIT License](LICENSE).
