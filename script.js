let barChartInstance = null;
let doughnutChartInstance = null;
let lineChartInstance = null;
let isCelsius = true; // Default unit
let userLocation = null;

document.getElementById('search-button').addEventListener('click', fetchWeatherData);
document.getElementById('unit-toggle').addEventListener('click', toggleUnits);

// Detect geolocation on page load
window.onload = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        fetchWeatherData(); // Fallback to default location
    }
};

// Show loading spinner
function showSpinner(show) {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = show ? 'block' : 'none';
}

// Get geolocation
function showPosition(position) {
    userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    fetchWeatherData();
}

// Handle geolocation errors
function showError(error) {
    console.error('Geolocation error:', error);
    fetchWeatherData(); // Fallback to default location
}

// Toggle between Celsius and Fahrenheit
function toggleUnits() {
    isCelsius = !isCelsius;
    document.getElementById('unit-toggle').textContent = isCelsius ? '°C' : '°F';
    fetchWeatherData();
}

// Fetch weather data based on city input or geolocation
function fetchWeatherData() {
    const city = document.getElementById('city-input').value;
    const units = isCelsius ? 'metric' : 'imperial';
    const apiKey = '53f73a784be9b690ab9d99a8cc397315';
    let currentWeatherUrl;
    let forecastUrl;
    
    if (city) {
        currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
    } else if (userLocation) {
        currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${apiKey}&units=${units}`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${apiKey}&units=${units}`;
    } else {
        // Default to Rawalpindi, PK if no geolocation or city input
        currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=Rawalpindi,PK&appid=${apiKey}&units=${units}`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Rawalpindi,PK&appid=${apiKey}&units=${units}`;
    }

    // Show spinner
    showSpinner(true);

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            showSpinner(false); // Hide spinner
            updateWeatherInfo(data);
        })
        .catch(error => {
            showSpinner(false);
            console.error('Error fetching weather data:', error);
            const weatherInfo = document.getElementById('weather-info');
            weatherInfo.innerHTML = `<p>Failed to retrieve data. Please check your connection and try again.</p>`;
        });

    // Fetch 5-day weather forecast for charts
    fetch(forecastUrl)
        .then(response => response.json())
        .then(forecastData => {
            if (forecastData.cod === "200") {
                updateCharts(forecastData);
            } else {
                console.error('Forecast data not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

function updateWeatherInfo(data) {
    const weatherInfo = document.getElementById('weather-info');
    if (data.cod === 200) {
        const iconId = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconId}.png`;
        
        weatherInfo.innerHTML = `
            <div> 
                <h2>${data.name}, ${data.sys.country}</h2>
                <img id="icon" src="${iconUrl}" alt="Weather icon" style="animation: fadeIn 0.5s ease;">
            </div>
            <p>Temperature: ${data.main.temp}°${isCelsius ? 'C' : 'F'}</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
    } else {
        weatherInfo.innerHTML = `<p>City not found. Please try again.</p>`;
    }
}

function updateCharts(forecastData) {
    const dailyTemperatures = [];
    const weatherConditions = [];
    const labels = [];

    for (let i = 0; i < forecastData.list.length; i += 8) {
        dailyTemperatures.push(forecastData.list[i].main.temp);
        weatherConditions.push(forecastData.list[i].weather[0].main);
        labels.push(new Date(forecastData.list[i].dt_txt).toLocaleDateString());
    }

    if (barChartInstance) barChartInstance.destroy();
    if (doughnutChartInstance) doughnutChartInstance.destroy();
    if (lineChartInstance) lineChartInstance.destroy();

    barChartInstance = createBarChart(dailyTemperatures, labels);
    doughnutChartInstance = createDoughnutChart(weatherConditions);
    lineChartInstance = createLineChart(dailyTemperatures, labels);
}

function createBarChart(temperatures, labels) {
    const ctx = document.getElementById('barChartCanvas').getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                delay: 500,
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createLineChart(temperatures, labels) {
    const ctx = document.getElementById('lineChartCanvas').getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateScale: true,
                easing: 'easeOutBounce'
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createDoughnutChart(weatherConditions) {
    
    const weatherCount = weatherConditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});

    const ctx = document.getElementById('pieChartCanvas').getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(weatherCount),
            datasets: [{
                data: Object.values(weatherCount),
                backgroundColor: ['#ffcc00', '#ff9900', '#66ccff', '#66ff66', '#ff6666']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                delay: 500
            }
        }
    });
}

