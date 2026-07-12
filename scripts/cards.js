const hourlyData = [
    { time: "Now", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-2-day.svg", temp: 26 },
    { time: "12 PM", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-2-day.svg", temp: 27 },
    { time: "1 PM", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/clear-day.svg", temp: 28 },
    { time: "2 PM", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/clear-day.svg", temp: 28 },
    { time: "3 PM", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/clear-day.svg", temp: 27 },
    { time: "4 PM", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/clear-day.svg", temp: 26 },
    { time: "5 PM", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-2-day.svg", temp: 25 },
    { time: "6 PM", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-2-day.svg", temp: 24 },
    { time: "7 PM", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/frost-night.svg", temp: 23 },
    { time: "8 PM", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/frost-night.svg", temp: 22 },
];

let weatherData = '';

hourlyData.forEach(data => {

    if (data.time === "8 PM") {
        weatherData += `
        <div class="card last-card">
        <span>${data.time}</span>
        <img class="icon" src="${data.icon}" alt="weather-icon"/>
        <span>${data.temp} &deg;</span>
    </div>

    `
    } else {
        weatherData += `
        <div class="card ">
        <span>${data.time}</span>
        <img class="icon" src="${data.icon}" alt="weather-icon"/>
        <span>${data.temp} &deg;</span>
    </div>

    `
    }
});
            
document.querySelector('.js-hourly-cards').innerHTML = weatherData;


const dailyData = [
    { day: "Wed", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/clear-day.svg", temp: "28\u00B0 / 18\u00B0" },
    { day: "Thu", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-2-day.svg", temp: "27\u00B0 / 17\u00B0" },
    { day: "Fri", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-2-day.svg", temp: "25\u00B0 / 16\u00B0" },
    { day: "Sat", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-2-day.svg", temp: "24\u00B0 / 15\u00B0" },
    { day: "Sun", icon: "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/clear-day.svg", temp: "27\u00B0 / 18\u00B0" }

];

let dailyForecast = '';

dailyData.forEach(daily => {
    dailyForecast += ` <div class="daily-card">
                    <span>${daily.day}</span>
                    <img  src="${daily.icon}"/>
                    <span>${daily.temp}</span>
                </div>`
});

document.querySelector('.js-daily-card').innerHTML = dailyForecast;


const themeIcon = document.querySelector('.theme-toggle');

themeIcon.addEventListener('click', () => {
    document.body.classList.toggle('change-theme');
});