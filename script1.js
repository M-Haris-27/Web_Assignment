const weatherApiKey = '53f73a784be9b690ab9d99a8cc397315';
const geminiApiKey = 'AIzaSyBb7E_c2klsWZucWepQmEr5A1LMtk9zN80';
let currentPage = 1;
const rowsPerPage = 10;
let forecastData = [];
let filteredData = [];
let isCelsius = true;

// Fetch weather data on search
document.getElementById('search-button').addEventListener('click', function () {
    const city = document.getElementById('city-input').value;
    fetchWeatherData(city);
});

// Show loading spinner
function showSpinner(show) {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = show ? 'block' : 'none';
}

// Function to fetch weather data
function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric`;
    showSpinner(true);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            showSpinner(false);
            if (data.cod === '200') {
                forecastData = data.list; // Save data globally
                filteredData = [...forecastData]; // Initialize filtered data
                currentPage = 1; // Reset to page 1
                updateDisplay() // Display table for the first page
                
            } else {
                document.getElementById('table-body').innerHTML = `<tr><td colspan="5">City not found. Try again.</td></tr>`;
            }
        })
        .catch(error => {
            hideLoadingSpinner();
            console.error('Error fetching forecast data:', error);
            document.getElementById('table-body').innerHTML = `<tr><td colspan="5">Error fetching weather data. Please try again.</td></tr>`;
        });
}

// Geolocation Support: Fetch weather data based on user's location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherDataByLocation(lat, lon);
    }, function () {
        console.warn("Geolocation permission denied. Please search for a city.");
    });
} else {
    console.warn("Geolocation is not supported by this browser.");
}


function fetchWeatherDataByLocation(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                forecastData = data.list; // Save data globally
                filteredData = [...forecastData]; // Initialize filtered data
                currentPage = 1; // Reset to page 1
                updateDisplay();
            } else {
                document.getElementById('table-body').innerHTML = `<tr><td colspan="5">Location weather data not found. Try again.</td></tr>`;
            }
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            document.getElementById('table-body').innerHTML = `<tr><td colspan="5">Error fetching weather data. Please try again.</td></tr>`;
        });
}


document.getElementById('unit-toggle').addEventListener('click', function() {
    isCelsius = !isCelsius;
    this.textContent = isCelsius ? '°C' : '°F';
    updateDisplay(); // Update the display after toggling units
});

// Modify the convertTemp function
function convertTemp(tempCelsius) {
    return isCelsius ? tempCelsius : (tempCelsius * 9/5) + 32;
}


function displayTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const dataForPage = filteredData.slice(start, end);

    // Populate the table with rows for the current page
    dataForPage.forEach(entry => {
        const date = new Date(entry.dt_txt).toLocaleDateString();
        const temp = convertTemp(entry.main.temp).toFixed(1);
        const tempUnit = isCelsius ? '°C' : '°F';
        const weather = entry.weather[0].description;
        const humidity = entry.main.humidity;
        const windSpeed = entry.wind.speed;

        const row = `<tr>
            <td>${date}</td>
            <td>${temp}${tempUnit}</td>
            <td>${weather}</td>
            <td>${humidity}%</td>
            <td>${windSpeed} m/s</td>
        </tr>`;

        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

function updateDisplay() {
    displayTable();
    setupPagination();
}

// Function to set up pagination buttons
function setupPagination() {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Update button states and page info
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Set up pagination button listeners
document.getElementById('prev-btn').addEventListener('click', function () {
    if (currentPage > 1) {
        currentPage--;
        displayTable();
        setupPagination();
    }
});

document.getElementById('next-btn').addEventListener('click', function () {
    if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
        currentPage++;
        displayTable();
        setupPagination();
    }
});

// New filter and sort functions
document.getElementById('sort-asc').addEventListener('click', function() {
    resetFilteredData();
    filteredData.sort((a, b) => a.main.temp - b.main.temp);
    updateDisplay();
});

document.getElementById('sort-desc').addEventListener('click', function() {
    resetFilteredData();
    filteredData.sort((a, b) => b.main.temp - a.main.temp);
    updateDisplay();
});

document.getElementById('filter-rain').addEventListener('click', function() {
    resetFilteredData();
    filteredData = filteredData.filter(entry => entry.weather[0].main.toLowerCase().includes('rain'));
    updateDisplay();
});

document.getElementById('highest-temp').addEventListener('click', function() {
    resetFilteredData();
    const highestTempEntry = filteredData.reduce((max, entry) => entry.main.temp > max.main.temp ? entry : max);
    filteredData = [highestTempEntry];
    updateDisplay();
});

// New function to reset filteredData
function resetFilteredData() {
    filteredData = [...forecastData];
}

// New function to update display after filtering or sorting
function updateDisplay() {
    currentPage = 1;
    displayTable();
    setupPagination();
}

// Chatbot functionality
const chatInput = document.getElementById('chat-input');
const chatButton = document.getElementById('chat-button');
const chatAnswer = document.querySelector('.chat-answer');

chatButton.addEventListener('click', handleChatInput);
chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleChatInput();
    }
});

function displayMessage(message, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChatInput() {
    const query = chatInput.value.trim();
    if (query) {
        displayMessage(query, true);  // Display user message
        if (query.toLowerCase().includes('weather')) {
            handleWeatherQuery(query);
        } else {
            handleGeneralQuery(query);
        }
        chatInput.value = '';
    }
}

function handleWeatherQuery(query) {
    if (forecastData.length === 0) {
        displayChatbotResponse("I'm sorry, but I don't have any weather data to analyze. Please search for a city first.");
        return;
    }

    if (query.toLowerCase().includes('temperature') || query.toLowerCase().includes('temp')) {
        const temps = forecastData.map(entry => entry.main.temp);
        const minTemp = Math.min(...temps).toFixed(1);
        const maxTemp = Math.max(...temps).toFixed(1);
        const avgTemp = (temps.reduce((sum, temp) => sum + temp, 0) / temps.length).toFixed(1);
        displayChatbotResponse(`Based on the forecast data: 
        Minimum temperature: ${minTemp}°C
        Maximum temperature: ${maxTemp}°C
        Average temperature: ${avgTemp}°C`);
    } else if (query.toLowerCase().includes('humidity')) {
        const humidities = forecastData.map(entry => entry.main.humidity);
        const avgHumidity = (humidities.reduce((sum, hum) => sum + hum, 0) / humidities.length).toFixed(1);
        displayChatbotResponse(`The average humidity in the forecast is ${avgHumidity}%`);
    } else if (query.toLowerCase().includes('wind')) {
        const windSpeeds = forecastData.map(entry => entry.wind.speed);
        const avgWindSpeed = (windSpeeds.reduce((sum, speed) => sum + speed, 0) / windSpeeds.length).toFixed(1);
        displayChatbotResponse(`The average wind speed in the forecast is ${avgWindSpeed} m/s`);
    } else {
        displayChatbotResponse("I can provide information about temperature, humidity, and wind speed from the forecast. What specific weather information would you like to know?");
    }
}

async function handleGeneralQuery(query) {
    try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: query }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response generated from Gemini API');
        }

        const generatedText = data.candidates[0].content.parts[0].text;
        displayChatbotResponse(generatedText);
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        if (error.message.includes('Failed to fetch')) {
            displayChatbotResponse("I'm having trouble connecting to my knowledge base. Please check your internet connection and try again.");
        } else if (error.message.includes('API key')) {
            displayChatbotResponse("There's an issue with my configuration. Please contact support for assistance.");
        } else {
            displayChatbotResponse("I encountered an error while processing your request. Please try again later. Error details: " + error.message);
        }
    }
}

function displayChatbotResponse(response) {
    displayMessage(response);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set up initial empty state for the table
    document.getElementById('table-body').innerHTML = '<tr><td colspan="5">Enter a city to see weather forecast.</td></tr>';
    
    // Initialize pagination
    setupPagination();
});