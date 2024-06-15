var searchHistory = []; // Array to store search history
const weatherApiKey= 'bff5cff573de67ba3fa31f78ce078c13'; // API key for OpenWeatherMap
const weatherApiUrl = 'https://api.openweathermap.org'; // URL for OpenWeatherMap API

// DOM element references
var searchForm = document.querySelector('#search-form'); // Form element for search
var searchInput = document.querySelector('#search-input'); // Input element for search
var todayContainer = document.querySelector('#today'); // Container for today's weather
var forecastContainer = document.querySelector('#forecast'); // Container for 5 day forecast
var searchHistoryContainer = document.querySelector('#history'); // Container for search history

dayjs.extend(window.dayjs_plugin_utc); // Extend dayjs with UTC plugin
dayjs.extend(window.dayjs_plugin_timezone); // Extend dayjs with timezone plugin

function displaySearchHistory() { // Function to display search history
    searchHistoryContainer.innerHTML = '';

    searchHistory.slice().reverse().forEach((city) => { // Loop through search history array
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-controls', 'today forecast');
        btn.classList.add('history-btn', 'btn-history');
        
        btn.setAttribute('data-search', city); // Set data attribute to city name
        btn.textContent = city;
        searchHistoryContainer.append(btn);
    });
}

function addToSearchHistory(search) { // Function to add search to search history
    if (!searchHistory.includes(search)) {
        searchHistory.push(search);
        localStorage.setItem('search-history', JSON.stringify(searchHistory));
        displaySearchHistory();
    }
}

function initializeSearchHistory() { // Function to initialize search history
    var storedHistory = localStorage.getItem('search-history');
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
        displaySearchHistory();
    }
}

function displayCurrentWeather(city, weather) { // Function to display current weather
    var date = dayjs().format('M/D/YYYY');
    var tempF = weather.main.temp;
    var windMph = weather.wind.speed;
    var humidity = weather.main.humidity;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`; 
    var iconDescription = weather.weather[0].description || weather[0].main; // Get weather description

    var card = document.createElement('div'); // Create card element
    var cardBody = document.createElement('div'); // Create card body element
    var heading = document.createElement('h2'); // Create heading element
    var weatherIcon = document.createElement('img');   // Create weather icon element
    var tempEl = document.createElement('p'); // Create temperature element
    var windEl = document.createElement('p');  // Create wind element
    var humidityEl = document.createElement('p'); // Create humidity element

    card.setAttribute('class', 'card');  // Set class attribute for card
    cardBody.setAttribute('class', 'card-body'); // Set class attribute for card body
    card.append(cardBody); // Append card body to card

    heading.setAttribute('class', 'h3 card-title'); // Set class attribute for heading
    tempEl.setAttribute('class', 'card-text'); // Set class attribute for temperature element
    windEl.setAttribute('class', 'card-text'); // Set class attribute for wind element
    humidityEl.setAttribute('class', 'card-text');  // Set class attribute for humidity element

    heading.textContent = `${city} (${date})`; // Set text content for heading
    weatherIcon.setAttribute('src', iconUrl); // Set src attribute for weather icon
    weatherIcon.setAttribute('alt', iconDescription); // Set alt attribute for weather icon
    weatherIcon.setAttribute('class', 'weather-img'); // Set class attribute for weather icon
    heading.append(weatherIcon); // Append weather icon to heading
    tempEl.textContent = `Temp: ${tempF}°F`; // Set text content for temperature element
    windEl.textContent = `Wind: ${windMph} MPH`; // Set text content for wind element
    humidityEl.textContent = `Humidity: ${humidity} %`; // Set text content for humidity element
    cardBody.append(heading, tempEl, windEl, humidityEl);   // Append heading, temperature, wind, and humidity elements to card body

    todayContainer.innerHTML = ''; // Clear today container
    todayContainer.append(card); // Append card to today container
}

function displayForecastCard(forecast) { // Function to display forecast card
    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDescription = forecast.weather[0].description;
    var tempF = forecast.main.temp;
    var humidity = forecast.main.humidity;
    var windMph = forecast.wind.speed;

    var col = document.createElement('div'); // Create column element
    var card = document.createElement('div'); // Create card element
    var cardBody = document.createElement('div'); // Create card body element
    var cardTitle = document.createElement('h3'); // Create heading element
    var weatherIcon = document.createElement('img'); // Create weather icon element

    // Create elements for a card
    var tempEl = document.createElement('p'); 
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    col.append(card); // Append card to column
    card.append(cardBody);  // Append card body to card
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl); // Append heading, weather icon, temperature, wind, and humidity elements to card body

    col.classList.add('five-day-card'); // Set class attribute for column
    card.classList.add('card', 'bg-primary', 'h-100', 'text-white'); // Set class attribute for card
    cardBody.classList.add('card-body', 'p-2'); // Set class attribute for card body
    cardTitle.classList.add('card-title'); // Set class attribute for heading
    tempEl.classList.add('card-text'); // Set class attribute for temperature element
    windEl.classList.add('card-text'); // Set class attribute for wind element
    humidityEl.classList.add('card-text'); // Set class attribute for humidity element

    cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    weatherIcon.setAttribute('src', iconUrl); // Set src attribute for weather icon
    weatherIcon.setAttribute('alt', iconDescription); // Set alt attribute for weather icon
    tempEl.textContent = `Temp: ${tempF} °F`; // Set text content for temperature element
    windEl.textContent = `Wind: ${windMph} MPH`; // Set text content for wind element
    humidityEl.textContent = `Humidity: ${humidity} %`; // Set text content for humidity element

    forecastContainer.append(col); // Append column to forecast container
}


function displayForecast(dailyForecast) { // Function for displaying 5 day forecast
    var startDt = dayjs().add(1, 'day').startOf('day').unix(); // Get start date for forecast
    var endDt = dayjs().add(6, 'day').startOf('day').unix(); // Get end date for forecast
    var headingCol = document.createElement('div'); // Create column element
  
    forecastContainer.innerHTML = ''; // Clear forecast container
    forecastContainer.append(headingCol); // Append heading column to forecast container
  
    for (var i = 0; i < dailyForecast.length; i++) { // Loop through daily forecast data
      if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) { // Check if forecast date is within 5 days
        if (dailyForecast[i].dt_txt.slice(11, 13) == "12") { // Check if forecast is for noon
          displayForecastCard(dailyForecast[i]); // Display forecast card
        }
      }
    }
}

function displayItems(city, data) { // Function to display items
    displayCurrentWeather(city, data.list[0], data.city.timezone); // Display current weather
    displayForecast(data.list); // Display 5 day forecast
}

function getWeather(location) { // Function to get weather data
    var { lat } = location; 
    var { lon } = location;
    var city = location.name; // Get city name from location object 
  
    var apiUrl = `${weatherApiUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;
  
    fetch(apiUrl) // Fetch weather data
      .then(function (res) {return res.json();})
      .then(function (data) { displayItems(city, data);})
      .catch(function (err) {console.error(err);});
}

function getCoords(search) { // Function to get coordinates
    var apiUrl = `${weatherApiUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;
  
    fetch(apiUrl) // Fetch coordinates
      .then(function (res) {return res.json();})
      .then(function (data) {
        if (!data[0]) {
          alert('Please try a valid city'); // Alert user if city is not found
        } else {
          addToSearchHistory(search);
          getWeather(data[0]);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
}

function searchFormSubmit(e) { // Function to handle search form submit
    e.preventDefault();
    var search = searchInput.value.trim(); // Get search input value
    if (search) {
        getCoords(search); // Get coordinates for search
        searchInput.value = ''; //
    }
}

function searchHistoryClick(e) { // Function to handle search history click
    if (!e.target.matches('.btn-history')) { // Check if clicked element has class of btn-history
      return;
    }
    var btn = e.target; // Get clicked element
    var search = btn.getAttribute('data-search'); // Get search value from data attribute
    getCoords(search); // Get coordinates for search
}

initializeSearchHistory(); // Initialize search history
searchForm.addEventListener('submit', searchFormSubmit); // Add event listener for search form submit
searchHistoryContainer.addEventListener('click', searchHistoryClick); // Add event listener for search history click


getCoords("Buffalo");

