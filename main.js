const OPENWEATHER_API_KEY = '21cd7ffaf13d91a005d5854834f990b0';
const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const WEATHER_TABLE_ROWS = ['Date', 'Temperature ℃', 'Weather condition', ' '];

function parseWeatherData (data) {
    let options = { day: 'numeric', month: 'numeric', year: '2-digit', hour: 'numeric',  minute: 'numeric' };
    return $.map(data, function (item) {
        return {
            dateString: new Date(item.dt * 1000).toLocaleString("ru-RU", options),
            temperature: ((Math.floor(item.main.temp) > 0) ? ("+" + (Math.floor(item.main.temp))) : (Math.floor(item.main.temp))),
            weatherText: item.weather[0].main,
            weatherIcon: item.weather[0].icon
        }
    })
}

function generateTable(data) {

    let oldContainer = $(".container");
    let containerHTML = '<div class="container"><div class="table-responsive"><table class="table"><thead><tr></tr></thead><tbody></tbody></table></div></div>'
    if (oldContainer.length) {
        oldContainer.replaceWith(containerHTML);
    } else {
        $( "body" ).append(containerHTML);
    }

    let tableHead = $ ("table>thead>tr");
    let tableBody = $ ("table>tbody");

    for (let key of WEATHER_TABLE_ROWS) {
        tableHead.append(`<th>${key}</th>`)
    }

    for (let item of data) {
        tableBody.append('<tr></tr>');
        let bodyRow = $("table>tbody>tr:last");
        for (let key in item) {
            if (key === 'weatherIcon') {
                let imgHTML = `<td><img class="weather-icon" src="http://openweathermap.org/img/wn/${item[key]}@2x.png"></td>`;
                bodyRow.append(imgHTML);
            } else {
                bodyRow.append(`<td>${item[key]}</td>`);
            }
        }
    }
}

function renderWeatherTable(latitude, longitude) {
    let url = `${OPENWEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    $.getJSON( url, function( data ) {
        let weatherData = parseWeatherData(data.list);
        generateTable(weatherData);
    });
}
