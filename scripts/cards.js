/* =========================================================================
   MyWeather — functional weather app
   Data source: Open-Meteo (https://open-meteo.com) — free, no API key needed
   ========================================================================= */

const ICON_BASE = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated";

// Default location shown before geolocation / search resolves anything
const DEFAULT_LOCATION = { name: "Tokyo, Japan", lat: 35.6762, lon: 139.6503, tz: "Asia/Tokyo" };

let currentLocation = { ...DEFAULT_LOCATION };

/* ---------------------------- WMO weather code mapping ---------------------------- */
// https://open-meteo.com/en/docs — weathercode reference
function weatherCodeInfo(code, isDay) {
    const day = isDay ? "day" : "night";
    const table = {
        0: { icon: `clear-${day}`, text: "Clear Sky", emoji: isDay ? "&#x2600;" : "&#x1F319;" },
        1: { icon: `cloudy-1-${day}`, text: "Mainly Clear", emoji: isDay ? "&#x1F324;" : "&#x1F319;" },
        2: { icon: `cloudy-2-${day}`, text: "Partly Cloudy", emoji: "&#x26C5;" },
        3: { icon: `cloudy-3-${day}`, text: "Overcast", emoji: "&#x2601;" },
        45: { icon: `fog-${day}`, text: "Fog", emoji: "&#x1F32B;" },
        48: { icon: `fog-${day}`, text: "Rime Fog", emoji: "&#x1F32B;" },
        51: { icon: `rainy-1-${day}`, text: "Light Drizzle", emoji: "&#x1F326;" },
        53: { icon: `rainy-1-${day}`, text: "Drizzle", emoji: "&#x1F326;" },
        55: { icon: `rainy-2-${day}`, text: "Dense Drizzle", emoji: "&#x1F327;" },
        56: { icon: "rain-and-sleet-mix", text: "Freezing Drizzle", emoji: "&#x1F327;" },
        57: { icon: "rain-and-sleet-mix", text: "Freezing Drizzle", emoji: "&#x1F327;" },
        61: { icon: `rainy-1-${day}`, text: "Light Rain", emoji: "&#x1F326;" },
        63: { icon: `rainy-2-${day}`, text: "Rain", emoji: "&#x1F327;" },
        65: { icon: `rainy-3-${day}`, text: "Heavy Rain", emoji: "&#x1F327;" },
        66: { icon: "rain-and-sleet-mix", text: "Freezing Rain", emoji: "&#x1F327;" },
        67: { icon: "rain-and-sleet-mix", text: "Freezing Rain", emoji: "&#x1F327;" },
        71: { icon: `snowy-1-${day}`, text: "Light Snow", emoji: "&#x1F328;" },
        73: { icon: `snowy-2-${day}`, text: "Snow", emoji: "&#x2744;" },
        75: { icon: `snowy-3-${day}`, text: "Heavy Snow", emoji: "&#x2744;" },
        77: { icon: "snowy-1", text: "Snow Grains", emoji: "&#x2744;" },
        80: { icon: `rainy-1-${day}`, text: "Light Showers", emoji: "&#x1F326;" },
        81: { icon: `rainy-2-${day}`, text: "Showers", emoji: "&#x1F327;" },
        82: { icon: `rainy-3-${day}`, text: "Violent Showers", emoji: "&#x26C8;" },
        85: { icon: `snowy-1-${day}`, text: "Snow Showers", emoji: "&#x1F328;" },
        86: { icon: `snowy-3-${day}`, text: "Heavy Snow Showers", emoji: "&#x2744;" },
        95: { icon: `isolated-thunderstorms-${day}`, text: "Thunderstorm", emoji: "&#x26C8;" },
        96: { icon: `scattered-thunderstorms-${day}`, text: "Thunderstorm w/ Hail", emoji: "&#x26C8;" },
        99: { icon: "severe-thunderstorm", text: "Severe Thunderstorm", emoji: "&#x26C8;" },
    };
    return table[code] || { icon: `cloudy-2-${day}`, text: "Unknown", emoji: "&#x26C5;" };
}

function iconUrl(name) {
    return `${ICON_BASE}/${name}.svg`;
}

function windDirection(deg) {
    const dirs = ["North", "North East", "East", "South East", "South", "South West", "West", "North West"];
    return dirs[Math.round(deg / 45) % 8];
}

/* ---------------------------- Rendering ---------------------------- */

function renderHero(current, code) {
    const info = weatherCodeInfo(code, current.is_day === 1);
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning!" : hour < 18 ? "Good Afternoon!" : "Good Evening!";

    document.getElementById("greeting").textContent = greeting;
    document.getElementById("hero-emoji").innerHTML = info.emoji;
    document.getElementById("hero-location").textContent = currentLocation.name;
    document.getElementById("header-location-name").textContent = currentLocation.name;
    document.getElementById("hero-temp").innerHTML = `${Math.round(current.temperature_2m)} &deg;c`;
    document.getElementById("hero-condition").textContent = info.text;
    document.getElementById("hero-feelslike").innerHTML = `Feels like ${Math.round(current.apparent_temperature)} &deg;`;
}

function renderDateTime() {
    const now = new Date().toLocaleString("en-US", {
        timeZone: currentLocation.tz,
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
    // "Tuesday, 14, July, 10:30 AM" -> reformat to "Tuesday, 14 July - 10:30 AM"
    const parts = now.split(", ");
    const formatted = parts.length === 4
        ? `${parts[0]}, ${parts[1]} ${parts[2]} - ${parts[3]}`
        : now;
    document.getElementById("hero-datetime").textContent = formatted;

    const updated = new Date().toLocaleTimeString("en-US", {
        timeZone: currentLocation.tz,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
    document.getElementById("last-updated").textContent = updated;
}

function renderDetails(current, daily) {
    document.getElementById("detail-temp").innerHTML = `${Math.round(current.temperature_2m)} &deg;c`;
    document.getElementById("detail-temp-range").innerHTML =
        `&uarr; ${Math.round(daily.temperature_2m_max[0])}&deg; / &darr; ${Math.round(daily.temperature_2m_min[0])}&deg;`;
    document.getElementById("detail-humidity").textContent = `${Math.round(current.relative_humidity_2m)}%`;
    document.getElementById("detail-wind-speed").textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById("detail-wind-dir").textContent = windDirection(current.wind_direction_10m);
    document.getElementById("detail-pressure").textContent = `${Math.round(current.surface_pressure)} hPa`;
}

function renderHourly(hourly) {
    const nowIso = new Date().toISOString().slice(0, 13); // yyyy-mm-ddThh
    let startIdx = hourly.time.findIndex((t) => t.slice(0, 13) === nowIso);
    if (startIdx === -1) startIdx = 0;

    const slice = hourly.time.slice(startIdx, startIdx + 10);
    let html = "";

    slice.forEach((time, i) => {
        const idx = startIdx + i;
        const d = new Date(time);
        const label = i === 0 ? "Now" : d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }).replace(" ", "");
        const info = weatherCodeInfo(hourly.weathercode[idx], hourly.is_day[idx] === 1);
        const isLast = i === slice.length - 1;

        html += `
        <div class="card${isLast ? " last-card" : ""}">
            <span>${label}</span>
            <img class="icon" src="${iconUrl(info.icon)}" alt="${info.text}"/>
            <span>${Math.round(hourly.temperature_2m[idx])} &deg;</span>
        </div>`;
    });

    document.querySelector(".js-hourly-cards").innerHTML = html;
}

function renderDaily(daily) {
    let html = "";
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < Math.min(5, daily.time.length); i++) {
        const d = new Date(daily.time[i]);
        const dayLabel = i === 0 ? "Today" : dayNames[d.getUTCDay()];
        const info = weatherCodeInfo(daily.weathercode[i], true);
        html += `
        <div class="daily-card${i === 0 ? " today" : ""}">
            <span>${dayLabel}</span>
            <img src="${iconUrl(info.icon)}" alt="${info.text}"/>
            <span>${Math.round(daily.temperature_2m_max[i])}&deg; / ${Math.round(daily.temperature_2m_min[i])}&deg;</span>
        </div>`;
    }

    // .js-daily-card is an (empty) wrapper div inside .daily-cards in the markup;
    // render into the parent container so cards lay out correctly.
    const wrapper = document.querySelector(".js-daily-card");
    const container = wrapper ? wrapper.parentElement : document.querySelector(".daily-cards");
    container.innerHTML = html;
}

/* ---------------------------- Data fetching ---------------------------- */

async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure` +
        `&hourly=temperature_2m,weathercode,is_day` +
        `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
        `&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather request failed");
    return res.json();
}

async function reverseGeocode(lat, lon) {
    try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        if (!res.ok) throw new Error("Reverse geocode failed");
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || "Unknown";
        const country = data.countryName || "";
        return country ? `${city}, ${country}` : city;
    } catch {
        return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    }
}

async function searchCity(query) {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;
    const r = data.results[0];
    const name = r.admin1 ? `${r.name}, ${r.country}` : `${r.name}, ${r.country}`;
    return { name, lat: r.latitude, lon: r.longitude, tz: r.timezone };
}

/* ---------------------------- App bootstrap ---------------------------- */

async function loadWeather() {
    try {
        const data = await fetchWeather(currentLocation.lat, currentLocation.lon);
        currentLocation.tz = data.timezone || currentLocation.tz;

        renderHero(data.current, data.current.weather_code);
        renderDetails(data.current, data.daily);
        renderHourly(data.hourly);
        renderDaily(data.daily);
        renderDateTime();
    } catch (err) {
        console.error("Could not load weather:", err);
        document.getElementById("hero-condition").textContent = "Weather unavailable";
    }
}

function useLocation(loc) {
    currentLocation = { ...currentLocation, ...loc };
    loadWeather();
}

function init() {
    // Try geolocation first; fall back to the default city on denial/error.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                const name = await reverseGeocode(latitude, longitude);
                useLocation({ name, lat: latitude, lon: longitude });
            },
            () => {
                loadWeather();
            },
            { timeout: 8000 }
        );
    } else {
        loadWeather();
    }

    // Keep the clock/date fresh even between full weather refreshes.
    setInterval(renderDateTime, 30000);

    // Theme toggle
    const themeIcon = document.querySelector(".theme-toggle");
    if (localStorage.getItem("myweather-theme") === "dark") {
        document.body.classList.add("change-theme");
    }
    themeIcon.addEventListener("click", () => {
        document.body.classList.toggle("change-theme");
        localStorage.setItem("myweather-theme", document.body.classList.contains("change-theme") ? "dark" : "light");
    });

    // Location search (click the chevron next to the location name)
    const searchTrigger = document.getElementById("location-search-trigger");
    if (searchTrigger) {
        searchTrigger.addEventListener("click", async () => {
            const query = prompt("Search for a city:");
            if (!query) return;
            try {
                const result = await searchCity(query);
                if (result) {
                    useLocation(result);
                } else {
                    alert(`No results found for "${query}".`);
                }
            } catch {
                alert("Location search failed. Please try again.");
            }
        });
    }

    // Manual refresh button in the footer
    const refreshBtn = document.getElementById("refresh-btn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", loadWeather);
    }

    // Nav tab switching: highlight the active tab and scroll to its section
    const tabs = document.querySelectorAll(".nav-links li[data-tab]");
    const sectionMap = {
        today: "section-today",
        hourly: "section-hourly",
        daily: "section-daily",
    };
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const key = tab.dataset.tab;
            if (key === "about") {
                alert("MyWeather — live forecasts powered by Open-Meteo.\nClick the location chevron to search any city.");
                return;
            }
            tabs.forEach((t) => t.classList.remove("today"));
            tab.classList.add("today");
            const target = document.getElementById(sectionMap[key]);
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

document.addEventListener("DOMContentLoaded", init);