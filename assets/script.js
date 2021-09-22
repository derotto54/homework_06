var textarea = document.getElementById('destination');
var search = document.getElementById('destSearch')
let myCond =''
let otherCondArray = ["Thunderstorm", "fa-bolt", "Drizzle", "fa-cloud-showers-heavy", "Rain", "fa-cloud-rain", "Snow", "fa-snowflake", "Atmosphere", "fa-exclamation-triangle", "Clouds", "fa-cloud","Clear", "fa-sun"]

//Get users local temp
function getMyTemp() {

   //Run if location coordinates are valid 
    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        let myTemp = ''
  
        //API url to get local weather
        let openWeatherCall = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=minutely,hourly,daily,alerts' + '&units=imperial' + '&appid=ef63013691934073952193cd8112b3f3'

        //API call to get local weather
        fetch(openWeatherCall) 
            .then(function (response) {
                return response.json();
            })
            
            //Return local temp and add it to the DOM
            .then(function (data){
                myTemp = data.current.temp.toFixed(0)
                myCond = data.current.weather[0].main
                var h = document.createElement('p')
                h.id = 'tempText'
                h.innerText = myTemp + "\xB0F"
                var i = document.createElement('i')
                i.classList.add("fas", otherCondArray[otherCondArray.indexOf(myCond) + 1])
                document.querySelector('#localTemp').appendChild(h)
                document.querySelector('#localTemp').appendChild(i)
            })
    }

  //Logic for error detection if no location can be returned
    function error() {
        textContent = 'Unable to retrieve your location';
    }
    if(!navigator.geolocation) {
        textContent = 'Geolocation is not supported by your browser';
    } else {
        textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

//Get destination weather and displays it
function destinationWeather() {
    var result = textarea.value;
    if (result == '') {
        return
    } else {
    //API url to get destination weather

        let destinationWeather = 'https://api.openweathermap.org/data/2.5/weather?q=' + result + '&units=imperial' + '&appid=ef63013691934073952193cd8112b3f3'
        
        //API call to get destination weather
        fetch(destinationWeather) 
            .then(function (response) {
                return response.json();
            })

            //Return destination temps and add it to the DOM
            .then(function (data){
                var myDestTemp = data.main.temp.toFixed(0)
                var myDestHighTemp = data.main.temp_max.toFixed(0)
                var myDestLowTemp = data.main.temp_min.toFixed(0) 
                var myDestCond = data.weather[0].main       
                const destArray = [{classes: ["title", "is-4", "has-text-weight-bold", "m-5", "destConditions"], inText: 'Current Temp'}, {inText: myDestTemp + "\xB0F"}, {inText: 'High'}, {inText: myDestHighTemp + "\xB0F"}, {inText: 'Low'}, {inText: myDestLowTemp + "\xB0F"}]  
                document.querySelectorAll('.destConditions').forEach(e => e.remove());
                for (var i = 0; i < destArray.length; i++) {
                    var elem = document.createElement('p')
                    elem.classList.add(...destArray[0].classes)
                    elem.innerText = destArray[i].inText
                    document.querySelector('#myDestinationsWeather').appendChild(elem)
                }
                var i = document.createElement('i')
                //i.id = "condImg"
                i.style.fontSize = "80px"
                i.classList.add("destConditions","fas", otherCondArray[otherCondArray.indexOf(myDestCond) + 1])
                document.querySelector('#myDestinationsWeather').appendChild(i)
            })
    }            
}

//Store recent destination searches to local storage
function recentDestinations() {
    var result = textarea.value
    if (result == '') {
        return
    } else {
    localStorage.setItem('thirdDest', localStorage.getItem('secondDest'))
    localStorage.setItem('secondDest',localStorage.getItem('firstDest'))
    localStorage.setItem('firstDest', result)
    showRecentDestination()
    }
}

//Display the most recent destination searches
function showRecentDestination() {
    if (localStorage.getItem('firstDest') == null) {
        localStorage.setItem('firstDest', " ")
        if (localStorage.getItem('secondDest') == null) {
            localStorage.setItem('secondDest', " ")
            if (localStorage.getItem('thirdDest') == null) {
                localStorage.setItem('thirdDest', " ")
            }
        }
        showRecentDestination()
    } else 
        document.getElementById('firstDest').innerText = localStorage.getItem('firstDest')
        document.getElementById('secondDest').innerText = localStorage.getItem('secondDest')
        document.getElementById('thirdDest').innerText = localStorage.getItem('thirdDest')
}

//Event listener for searching destination
search.addEventListener('click', destinationWeather)
search.addEventListener('click', recentDestinations);
textarea.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      search.click();
    }
  });
textarea.addEventListener("click", function() {
    document.getElementById("destination").value = ""
})

getMyTemp()
showRecentDestination()