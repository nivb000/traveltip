



function getWeather(lat,lng) {
    const API = '8d4d5b23ebc8471afe6faefd8d21031d'    
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`
    const prm1 = fetch(URL)
    .then((res) => console.log(res))


}