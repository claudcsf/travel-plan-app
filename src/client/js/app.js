const url = 'http://localhost:8000/getApp'; // Get appData
const url2 = 'http://localhost:8000/getSaved'; // Get tripSaved
const url3 = 'http://localhost:8000/save'; // Save appData to tripSaved

// UI update
fetch(url).then(res => res.json()).then(response => {
    
    // if object is empty, section is empty
    if(Object.entries(response).length === 0 ){
        document.querySelector('.dynamic__trip').innerHTML = '';
    }else{ // otherwise, update UI
        document.querySelector('.dynamic__trip #dynamic__destination').innerHTML = `${response.name}, ${response.countryName}`;
        document.querySelector('.dynamic__trip #dynamic__countdown').innerHTML = `${response.countdown}`;
        document.querySelector('.dynamic__trip #trip-date').innerHTML = `${response.firstDay}`;
        document.querySelector('.dynamic__trip #dynamic__high').innerHTML = `${response.maxTemp}`;
        document.querySelector('.dynamic__trip #dynamic__low').innerHTML = `${response.minTemp}`;
        document.querySelector('.header').style.backgroundImage = `url('${response.imageHolder}')`;
        document.querySelector('.h1').style.display = "none";
    }
});

// Saving the trip
fetch(url2).then(res => res.json()).then(response => {
    if(Object.entries(response).length === 0 ){
        document.querySelector('.trip-card').innerHTML = '';
    }else{
        document.querySelector('.trip-card #dynamic__destination').innerHTML = `${response.name}, ${response.countryName}`;
        document.querySelector('.trip-card #dynamic__countdown').innerHTML = `${response.countdown}`;
        document.querySelector('.trip-card #dynamic__high').innerHTML = `${response.maxTemp}`;
        document.querySelector('.trip-card #dynamic__low').innerHTML = `${response.minTemp}`;
        document.querySelector('.trip-card').style.display = "flex";
    }
});

