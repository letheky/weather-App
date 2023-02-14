feather.replace()
const APIkey = 'eae716dc50073d95e2f23037e30a6283'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const loader = $('.loader')
const input = $('input')
const btn = $('button')

const day = $('.date-dayname')
const date = $('.date-day')
const location = $('.location')
const weatherTemp = $('.weather-temp')
const weatherDesc = $('.weather-desc')
const todayInfo = $$('.value')
const weekList = $('.week-list')
const dayInWeek = weekList.querySelectorAll('.day-name')
const tempInWeek = weekList.querySelectorAll('.day-temp')

async function getWeather(url){
    const weatherContainer = $('.weather-container')
    const weatherIcon = weatherContainer.querySelector('.weather-icon')
    const dayIcons = weekList.querySelectorAll('.day-icon')
    
    loader.setAttribute('style','visibility:visible;')
    btn.setAttribute('style','opacity:0.5;')

    const res = await fetch(url)
    if(res.status === 404){
        window.alert('Vui lòng nhập đúng tên thành phố')
        input.value = ''
    }
    const weatherData = await res.json()

    loader.setAttribute('style','visibility:hidden;')
    btn.setAttribute('style','opacity:1;')

    const today = new Date()
    const object = getCurrentData(today,weatherData.list)
    const data = {
        'day' : getDay(today),
        'date' : today,
        'location' : weatherData.city.name + ', ' + weatherData.city.country ,
        ...object
    }
    day.textContent = data.day
    date.textContent = `${data.date.getDate()} ${convertMonth(data.date.getMonth())}, ${data.date.getFullYear()}` 
    location.textContent = data.location
    weatherTemp.textContent = Math.ceil(Number(data.temp)) + '°C'
    weatherDesc.textContent = capitalize(data.desc)
    getIcon(data.type,weatherIcon,stringToHTML)  
    todayInfo.forEach((attr,index)=>{
        if(index === 0)attr.textContent = Math.ceil(Number(data.feels_like)) + '°C'
        if(index === 1)attr.textContent = data.humidity + '%'
        if(index === 2)attr.textContent = data.wind + ' km/h'
    })

    dayInWeek.forEach((day,index)=>{
        const dayTime = new Date(weatherData.list[(index+1)*8-1].dt_txt)
        day.textContent = getDay(dayTime)
        tempInWeek[index].textContent = Math.ceil(weatherData.list[(index+1)*8-1].main.temp )+ '°C'
        getIcon(weatherData.list[(index+1)*8-1].weather[0].main,dayIcons[index],stringToDayIcon)
    })
}

getWeather(`http://api.openweathermap.org/data/2.5/forecast?q=Hanoi&lang=vi&appid=${APIkey}&units=metric`)

btn.onclick = () => {
    let cityName = input.value
    getWeather(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&lang=vi&appid=${APIkey}&units=metric`)
}

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault()
      btn.click()
    }
})

function stringToHTML(str) {
	let dom = document.createElement('div')
    dom.classList.add('weather-icon')
	dom.innerHTML = str
	return dom
}

function stringToDayIcon(str) {
	let dom = document.createElement('div')
    dom.classList.add('day-icon')
	dom.innerHTML = str
	return dom
}

function getIcon(type,div,func){
    switch(type){
        case 'Clear': 
            div.replaceWith(func(feather.icons['sun'].toSvg()))
            break;
        case 'Rain': 
            div.replaceWith(func(feather.icons['cloud-rain'].toSvg()))
            break;
        case 'Clouds': 
            div.replaceWith(func(feather.icons['cloud'].toSvg()))
            break;     
        default:
            div.replaceWith(func(feather.icons['cloud-snow'].toSvg()))
            break;     
    }
}


function getCurrentData(date,arrList){
    const object = {
        'temp' : '',
        'desc' : '',
        'feels_like' : '',
        'humidity' : '',
        'wind' : '',
        'type' : ''
    }
    for(let i=0 ; i<arrList.length ; i++){
        if(date.getHours() < Number(arrList[i].dt_txt.slice(11,13))){
            object.temp = arrList[i].main.temp
            object.feels_like = arrList[i].main.feels_like
            object.humidity = arrList[i].main.humidity
            object.desc = arrList[i].weather[0].description
            object.type = arrList[i].weather[0].main
            object.wind = arrList[i].wind.speed 
            break;     
        }
    }
    return object
}


function getDay(date){
    switch(date.getDay()){
        case 1: 
            return 'Thứ 2';
        case 2: 
            return 'Thứ 3';
        case 3: 
            return 'Thứ 4';
        case 4: 
            return 'Thứ 5';
        case 5: 
            return 'Thứ 6';
        case 6: 
            return 'Thứ 7';
        default:
            return 'Chủ nhật';
    }
}

function convertMonth(date){
    switch(date){
        case 1: 
            return 'tháng 2';
        case 2: 
            return 'tháng 3';
        case 3: 
            return 'tháng 4';
        case 4: 
            return 'tháng 5';
        case 5: 
            return 'tháng 6';
        case 6: 
            return 'tháng 7';
        case 7: 
            return 'tháng 8';
        case 8: 
            return 'tháng 9';
        case 9: 
            return 'tháng 10';
        case 10: 
            return 'tháng 11';
        case 11: 
            return 'tháng 12';
        default: 
            return 'tháng 1';
    }

}

function capitalize(word){
    const arr = word.split(" ")
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
    }
    const str2 = arr.join(" ")
    return str2
}

function displayIcon(type){
    switch(type){
        case 'Clear': 
            return 'sun';
        case 'Rain': 
            return 'cloud-rain';
        case 'Clouds': 
            return 'cloud';
    }
}
