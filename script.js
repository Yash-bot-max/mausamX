console.log("Script Loaded");
const apiKey = "19ffd149e8575f9ba45820b919600ec6";
const temp = document.querySelector(".temp");
const cityName = document.querySelector(".city");
const weather = document.querySelector(".weather");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const input = document.querySelector(".input");
const search = document.querySelector(".search");
const weatherImg = document.querySelector(".img");
const feelLike = document.querySelector(".feels-like");
const moreBtn = document.querySelector(".more");
const bottom = document.querySelector(".bottom");
const geobtn = document.querySelector(".current");
const error = document.querySelector(".error");
const forecasting = document.querySelector(".forecasting");
const feelTemp = document.querySelector(".feel-temp");
const visibility = document.querySelector(".visibility");
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
const pressure = document.querySelector(".pressure");
const moreDetail = document.querySelector(".more-detail");
const overlay = document.getElementById('loading-overlay');
const fiveDay = document.querySelector(".five-day");
const forecastList = document.querySelector(".forecast-list");
const container = document.querySelector(".container");
const recentList = document.querySelector(".recent-list");
const recentSection = document.querySelector(".recent-section");
const date = document.querySelector(".date");
const themeBtn = document.querySelector(".theme-btn");
const unitBtns = document.querySelectorAll(".unit-btn button");
const state = document.querySelector(".state");
const value = document.querySelector(".value");
const hourlyList = document.querySelector(".hourly-list");
const hourlySection = document.querySelector(".hourly-section");
const emptyState = document.querySelector(".empty-state");
const footer = document.querySelector(".made");
const favoriteList = document.querySelector(".favorite-list");
const favoriteSection = document.querySelector(".favorite-section");

const weatherImages = {
    Clear: "Images/clear-day.svg",
    Clouds: "Images/clouds.png",
    Rain: "Images/rain.svg",
    Drizzle: "Images/drizzle.svg",
    Thunderstorm: "Images/thunderstorms.svg",
    Snow: "Images/snow.svg",
    Mist: "Images/mist.png",
    Haze: "Images/haze.svg",
    Fog: "Images/fog.svg"
};
const background = {
    Clear: "linear-gradient(135deg,#FFF8D6,#FFE9A8)",
    Clouds: "linear-gradient(135deg,#EEF3F8,#D8E6F2)",
    Rain: "linear-gradient(135deg,#D9EAFD,#B8D8F8)",
    Drizzle: "linear-gradient(135deg,#E0F4FF,#C9E7FF)",
    Mist: "linear-gradient(135deg,#F4F4F4,#E5E7EB)",
    Snow: "linear-gradient(135deg,#FFFFFF,#EAF6FF)"
};
const condition = {
    1: "Good",
    2: "Fair",
    3: "Moderate",
    4: "Poor",
    5: "Very Poor"
};
const colors = {
    1: "#0F766E", // Teal
    2: "#A16207", // Dark Yellow
    3: "#C2410C", // Burnt Orange
    4: "#B91C1C", // Crimson
    5: "#6B21A8"  // Purple
};
const bgColors = {
    1: "#1B5E20",
    2: "#827717",
    3: "#E65100",
    4: "#B71C1C",
    5: "#4A148C"
};

let currentUnit = "metric";
let currentCity = "";
let currentData = null;


// Show the loading spinner
function showSpinner() {
    overlay.classList.remove('hidden');
    search.disabled = true;
    geobtn.disabled = true;
}


// Hide the loading spinner
function hideSpinner() {
    overlay.classList.add('hidden');
    search.disabled = false;
    geobtn.disabled = false;
}

function hideWeatherUI() {
    forecasting.style.display = "none";
    moreDetail.style.display = "none"
    fiveDay.style.display = "none"
    hourlySection.style.display = "none"
}

function showWeatherUI() {
    forecasting.style.display = "block";
    moreDetail.style.display = "block";
    fiveDay.style.display = "block"
    hourlySection.style.display = "block"
}

function showError() {
    error.style.display = "block";
    hideWeatherUI();
}



// Logic Behind celsius to fahrenheit
unitBtns.forEach(btn => {

    btn.addEventListener("click", () => {
        unitBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        if (btn.textContent.trim() === "°C") {
            currentUnit = "metric";
        } else {
            currentUnit = "imperial";
        }
        if (!currentCity) {
            alert("First Enterd City Name")
            input.focus()
            return;
        }
        getWeather(currentCity);

    });

});


let theme = localStorage.getItem("theme");

if (theme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
}
themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        themeBtn.textContent = "☀️";

    } else {
        localStorage.setItem("theme", "light");
        themeBtn.textContent = "🌙";

    }

});



search.addEventListener("click", () => {
    const text = input.value.trim();
    if (text === "") {
        input.focus();
        alert("Please enter city name");
        return;
    }
    getWeather(text);
    input.value = "";
});

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        search.click();
    }
});



// Fetch current weather
async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`;
    showSpinner();
    try {
        const response = await fetch(url);
        if (!response.ok) {
            showError()
            return;
        }
        else {
            const data = await response.json();
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            console.log(data)
            currentCity = city;
            currentData = data
            displayWeather(data)
            getAQI(lat, lon)
            updateRecent(city);
            getFiveDayForecast(lat, lon)
        }
    }
    catch (error) {
        console.error(error);
        alert("Something went wrong");
        showError()
        return;
    } finally {
        hideSpinner();
    }


}

// Display weather data
function displayWeather(data) {
    const localTime = new Date((data.dt + data.timezone) * 1000);
    date.textContent = localTime.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC"
    });
    temp.textContent =
        `${Math.round(data.main.temp)}${currentUnit === "metric" ? "°C" : "°F"}`;
    humidity.textContent = data.main.humidity + "%";

    wind.textContent =
        `${currentUnit === "metric" ? (data.wind.speed).toFixed(0) : data.wind.speed.toFixed(0)}  ${currentUnit === "metric" ? "km/h" : "mph"}`;

    feelLike.textContent =
        `Feels Like ${Math.round(data.main.feels_like)}${currentUnit === "metric" ? "°C" : "°F"}`;
    cityName.textContent = data.name;
    weather.textContent =
        data.weather[0].description.charAt(0).toUpperCase() +
        data.weather[0].description.slice(1);

    const main = data.weather[0].main;
    weatherImg.src = weatherImages[main] || "Images/default.png";
    container.style.background = background[main] || "#fff";
    feelTemp.textContent =
        `${Math.round(data.main.feels_like)}${currentUnit === "metric" ? "°C" : "°F"}`;
    visibility.textContent = Number((data.visibility / 1000).toFixed(1)) + " km";

    sunrise.textContent = new Date(data.sys.sunrise * 1000)
        .toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });

    sunset.textContent = new Date(data.sys.sunset * 1000)
        .toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });

    pressure.textContent = data.main.pressure + " hPa";
    error.style.display = "none";
    showWeatherUI()
}



// Gets user's current location using Geolocation API
geobtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(
        successCallback,
        () => {
            alert("Location permission denied.");
        }
    );

});


//Find the geolocation of the user
async function successCallback(position) {
    showSpinner();
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            showError()
            return;
        }
        else {
            const data = await response.json();
            currentCity = data.name;
            getAQI(lat, lon)
            displayWeather(data)
            getFiveDayForecast(lat, lon)
            updateRecent(data.name);

        }
    }
    catch (error) {
        alert("Something went wrong");
        showError()
        return;
    } finally {
        hideSpinner();
    }
}



async function getAQI(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            showError()
            return;
        }
        else {
            const data = await response.json();
            displayAqi(data)
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong");
        showError()
        return;
    } finally {
        hideSpinner();
    }

}

function displayAqi(data) {
    const valueAqi = data.list[0].main.aqi
    value.textContent = `AQI ${valueAqi}`;
    state.textContent = condition[valueAqi];
    value.style.backgroundColor = bgColors[valueAqi];
    state.style.color = bgColors[valueAqi];
}


//Event listener for Weather Details ion
moreBtn.addEventListener("click", () => {
    bottom.classList.toggle("show");
    const icon = moreBtn.querySelector("span");
    if (bottom.classList.contains("show")) {
        icon.textContent = "expand_less";
    }
    else {
        icon.textContent = "expand_more";
    }

});



// Logic behind display Hourly Forecast
function displayHourlyForecast(data) {

    let html = "";
    data.list.slice(0, 8).forEach(item => {
        const time = new Date(item.dt_txt).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });
        const temp = Math.round(item.main.temp);
        const icon = item.weather[0].icon;
        html += `
         <div class="hour-card">

            <p>${time}</p>

            <img src="https://openweathermap.org/img/wn/${icon}@2x.png">

            <h3>${temp}°</h3>

        </div>
        `;
    });

    hourlyList.innerHTML = html;

}


// Fetch 5-day forecast
async function getFiveDayForecast(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`
        );

        if (!response.ok) return;

        const data = await response.json();
        displayForecast(data);
    }
    catch (err) {
        console.log(err);
    }
}



function displayForecast(data) {
    let html = "";
    const dataList = data.list
    dataList.forEach(element => {
        if (element.dt_txt.includes("12:00:00")) {
            const day = new Date(element.dt_txt).toLocaleDateString("en-US", { weekday: "short" })
            const unit = currentUnit === "metric" ? "°C" : "°F";

            const minTemp = Math.round(element.main.temp_min);
            const maxTemp = Math.round(element.main.temp_max);
            const icon = element.weather[0].icon
            html += `<div class="row">
            <span class = "day">${day}</span>
            
            <img class ="icon" src="https://openweathermap.org/img/wn/${icon}@2x.png">
            
            <div class="Temp">
            <span>${maxTemp}${unit}</span> /
            <span>${minTemp}${unit}</span>
                    </div>
            </div>`;

        }

    });
    forecastList.innerHTML = html;
    displayHourlyForecast(data);

}


let recent = JSON.parse(localStorage.getItem("Recent")) || [];
let favorites = JSON.parse(localStorage.getItem("Favorites")) || [];

function updateRecent(city) {
    recent = JSON.parse(localStorage.getItem("Recent")) || [];
    recent = recent.filter(item =>
        item.toLowerCase() !== city.toLowerCase()
    );

    recent.unshift(city);

    if (recent.length > 5) {
        recent.pop();
    }

    localStorage.setItem("Recent", JSON.stringify(recent));
    displayRecentCities(recent);
}

// Update recent searches
function displayRecentCities(recent) {
    favorites = JSON.parse(localStorage.getItem("Favorites")) || [];
    recentList.innerHTML = "";

    if (recent.length === 0) {
        emptyState.style.display = "flex";
        recentList.style.display = "none";
    } else {
        emptyState.style.display = "none";
        recentList.style.display = "flex";
    }
    recent.forEach(city => {

        const isFavorite = favorites.includes(city);
        const btn = document.createElement("button");
        btn.className = "recent-btn";

        btn.innerHTML = `
             <span class="city-name">
                   <span class="material-symbols-outlined location">
                         location_on
                    </span>
                    ${city.charAt(0).toUpperCase() + city.slice(1)}
             </span>
        
             <span class="favorite-btn ${isFavorite ? "active" : ""}">
                    <span class="material-symbols-outlined">
                         star
                    </span>
             </span>
            <span class="delete-btn">
                <span class="material-symbols-outlined">
                    delete
                </span>
             </span>`;

        // Weather search
        btn.addEventListener("click", () => {
            getWeather(city);
        });

        // Delete
        btn.querySelector(".delete-btn").addEventListener("click", (e) => {
            e.stopPropagation();

            recent = recent.filter(c => c !== city);
            localStorage.setItem("Recent", JSON.stringify(recent));
            displayRecentCities(recent);
        });

        // Favorite Toggle
        const starBtn = btn.querySelector(".favorite-btn");
        starBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (favorites.includes(city)) {
                favorites = favorites.filter(item => item !== city);
            }
            else {
                favorites.push(city)
            }
            localStorage.setItem("Favorites", JSON.stringify(favorites));

            displayFavoriteCities();

            displayRecentCities(recent);

        });
        recentList.appendChild(btn);
    });

}

function displayFavoriteCities() {

    favoriteList.innerHTML = "";
     if (favorites.length === 0) {
        favoriteSection.style.display = "none";
        return;
    }

    favoriteSection.style.display = "block";
    
    favorites.forEach(city => {

        const btn = document.createElement("button");
        btn.className = "city-name";
        btn.innerHTML = `
            <span class="star material-symbols-outlined location">
                location_on
            </span>
            ${city.charAt(0).toUpperCase() + city.slice(1)}

             <span class="delete-btn">
                <span class="material-symbols-outlined">
                    delete
                </span>
             </span>
        `;

        btn.addEventListener("click", () => {
            getWeather(city);
        });
        favoriteList.appendChild(btn);

         btn.querySelector(".delete-btn").addEventListener("click", (e) => {
            e.stopPropagation();

            favorites = favorites.filter(c => c !== city);
            console.log("Favorites:", favorites);
            localStorage.setItem("Favorites", JSON.stringify(favorites));
           displayFavoriteCities();
           displayRecentCities(recent);
        });
    });

}


const year = new Date().getFullYear();

footer.innerHTML = `
Made with ❤️ by Yash © ${year}
`;

hideWeatherUI()
displayRecentCities(recent);
displayFavoriteCities();
