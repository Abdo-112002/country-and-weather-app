
let mainContent = document.querySelector("#all-countrys");
let countrysOptions = document.querySelector("#country-list");
let search = document.querySelector("#search");
let styleMode = document.querySelector(".header__mode");
let countrysApi = `https://restcountries.com/v2/all`;

styleMode.addEventListener("click",(e) => {
    document.body.classList.toggle("dark");
    if(document.body.className == "dark"){
        styleMode.innerHTML = "light_mode";
        styleMode.style.cssText = "color : #fff";
    }else {
        styleMode.innerHTML = "dark_mode";
        styleMode.style.cssText = "color : #202c37";
    }
});

window.onload = function() {
    displayDataInPage(countrysApi);
   setTimeout(() => {
        alert("Click on any country box to show weather details");
   }, 5000);
}

// get all country
async function displayDataInPage(url) {
    let countrys = await getData(url);
    htmlCode(countrys);
}

// get data from api
async function getData(url) {
    try{
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }catch(error){
        console.log(error);
    }
}

// render the data in html 
function htmlCode(countrys) {
    countrys.forEach((item) => {
        let country = `
            <div class="main-content__item" onclick='countryDetails("${item.name}")'>
                <div class="main-content__item--box">
                    <img src="${item.flags.svg}" alt="country-img">
                </div>
                <div class="main-content__item--info">
                    <h2 class="country-name">${ (item.name == "Israel") ? "لا نعترف بها دوله" : item.name }</h2>
                    <h3>Population: <span>${item.population}</span></h3>
                    <h3>Region: <span>${item.region}</span></h3>
                    <h3>Capital: <span>${item.capital}</span></h3>
                </div>
            </div>
        `;
        mainContent.innerHTML += country;
    });
    if(mainContent.innerHTML != "") {
        preLoaderData("none");
    }
}

// get data by Region from select option
countrysOptions.addEventListener("change",loadData);
async function loadData(e){
    let value = e.target.value.trim();
    search.value = "" ;
    if(value.toLowerCase() === "all"){
        preLoaderData("block");
        displayDataInPage(countrysApi);
    }else {
        let countrys = await getData(countrysApi);
        let countrysRegion = countrys.filter(item => item.region == value);
        preLoaderData("block");
        htmlCode(countrysRegion);
    }

}


//search country name 
search.addEventListener("keyup",findCountry)
function findCountry(e) {
    if(e.key == "Enter" && e.keyCode == 13){
        let value = e.target.value.toLowerCase().trim();
        if(value){
                let api = `https://restcountries.com/v2/name/${value}`;
                preLoaderData("block");
                displayDataInPage(api);
            }else{
                preLoaderData("block");
                displayDataInPage(countrysApi);
            }
        }
}
    

// country details and weather 
async function countryDetails(countryName) {
   let weatherApi = `https://api.weatherapi.com/v1/current.json?key=6a54f2e6b388461185b20613220602&q=${countryName}&aqi=no;`;
   let weatherDetails = await getData(weatherApi);

   // get all details as you need
   let {country,name:city} = weatherDetails.location;
   let {icon,text:status} = weatherDetails.current.condition;
   let {feelslike_f,humidity,temp_f} = weatherDetails.current;
   
   weatherDetailsPopUp({country,city,icon,status,feelslike_f,humidity,temp_f});

}

// display weather data in popUp page
function  weatherDetailsPopUp(allData) {
    
    let PopUp_page = document.querySelector(".PopUp-page");
    PopUp_page.style.cssText = "display: flex";

    let PopUpContent = document.querySelector(".PopUp-page__detalis-content");
    let country = PopUpContent.querySelector(".info-name h3").textContent = allData.country;
    let city = PopUpContent.querySelector(".info-name p").textContent = allData.city;
    let icon = PopUpContent.querySelector(".status-icon").src = allData.icon;
    let tempF = PopUpContent.querySelector(".tempF").innerHTML = `${allData.temp_f} &#8451;`;
    let status = PopUpContent.querySelector(".status").textContent = allData.status;


    let closePopUp_page = document.querySelector(".close");
    closePopUp_page.addEventListener("click",(e) => {
        PopUp_page.style.cssText = "display: none";
    });
}



function preLoaderData(value){
    if(value == "block") {
        mainContent.innerHTML = "";
    }
    document.querySelector(".main-loader").style.display = value;
}