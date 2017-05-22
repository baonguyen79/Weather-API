$(function(){

	const apiKey = "";
	
	let currentWeatherArray = [];
	let forecast5DaysArray = [];
	let cityName = "";
	
	//*************************************** 
	//* zipcode Submit 
	//*************************************** 
	$(":button").on("click", (e) => {

		let zipCode = $("#zipCode").val();

		const zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;

		if (!zipCodePattern.test(zipCode))
		{
			alert("invalid zipcode");
		}else {
			Promise.all([loadPlaces(zipCode) , forecast5Days(zipCode, 5)])
			.then((result) => {
				currentWeatherArray = result[0];
				forecast5DaysArray  = result[1].list;
				cityName = `${result[0].name}`;

				let weatherDom = $("#weather-col"); 
				weatherDom.html('<h4>Current weather</h4>');
				let domString = formatDom(currentWeatherArray);
				weatherDom.append(domString);
				addforecasttButtons();
			}).catch((error) => {
				console.log(error);
			});
		}

	});

	//*************************************** 
	//* current weather promise
	//*************************************** 
	const loadPlaces = (zipCode) => {
		return new Promise ((resolve, reject) => {
			$.ajax(`http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&units=imperial&appid=${apiKey}`)  
			.done((data) => resolve(data))
			.fail((error) => reject(error));
		});
	};

	//*************************************** 
	//* 5 days weather forecast promise
	//*************************************** 
	const forecast5Days = (zipCode, days) => {
		return new Promise ((resolve, reject) => {
			$.ajax(`http://api.openweathermap.org/data/2.5/forecast/daily?zip=${zipCode},us&cnt=${days}&units=imperial&appid=${apiKey}`)  
			.done((data) => resolve(data))
			.fail((error) => reject(error));
		});
	};

	//*************************************** 
	//* format current weather dom
	//*************************************** 
	const formatDom = (result) => {
		let iconCode = result.weather[0].icon;
		let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
		let weatherString = `<div class="row">`;

		weatherString  = `<div class="col-md-2 col-md-offset-1 dayCol">`;
		weatherString  += `<p><img src=${iconUrl}></p>`;
		weatherString  += `<h4>${result.name}</h4>`; 
		weatherString  += `<p>${Math.round(result.main.temp)}F</p>`;
		weatherString  += `<p>${result.weather[0].main}</p>`;
		weatherString  += `<p>Air ${result.main.pressure}</p>`; 
		weatherString  += `<p>Wind: ${result.wind.speed}</p>`;
		weatherString  += `</div></div>`; 
	// currentWeaterDom.find(".icon").html(currWeatherString);
	return weatherString;

}

//*************************************** 
//* format 5 days weather forecast DOM
//*************************************** 
const formatForecastDom = (result) => {
	let iconCode = result.weather[0].icon;
	let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
	let weatherString = `<div class="row">`;

	weatherString  = `<div class="col-md-2  dayCol">`;
	weatherString  += `<p><img src=${iconUrl}></p>`;
	weatherString  += `<p>${result.weather[0].main}</p>`;
	weatherString  += `<h4>${moment.unix(result.dt).format("dddd, MMMM Do")}</h4>`;
	weatherString  += `<p>Day  ${Math.round(result.temp.day)}F   Night  ${Math.round(result.temp.night)}F </p>`;
	weatherString  += `<p>Air: ${result.pressure}</p>`; 
	weatherString  += `<p>Wind: ${result.speed}</p>`;
	weatherString  += `</div></div>`; 

	return weatherString;
}

//*************************************** 
//* write 5 days forecast DOM
//*************************************** 
const writeForecastdom = (results) => {
	let domString = "";

	let forecastDom = $("#weather-col"); 
	forecastDom.html(`<h4>Weather forecast:  ${cityName}</h4>`);

	results.forEach((result) => {
		domString = "";
		domString += formatForecastDom(result);
		forecastDom.append(domString);
	});

};

//*************************************** 
//* add 5 days forecast buttons
//*************************************** 
const addforecasttButtons = ()  => {

	let forecastButtonsString = `<input type="button" id="current" class="btn-info" value="current"><input type="button" id="forecast5Days" class="btn-info" value="5 days">`;

	$('#fiveDays').html(forecastButtonsString);

	$('#forecast5Days').on('click', () => {
		writeForecastdom(forecast5DaysArray);

		$('#forecast5Days').off('click') 

	});

	$('#current').on('click', () => {
		let weatherDom = $("#weather-col"); 
		weatherDom.html('<h4>Current weather</h4>');
		let domString = formatDom(currentWeatherArray);
		weatherDom.append(domString);
		addforecasttButtons();
	});
}


});