$(function(){


	const apiKey = "995ac6ea46a19a0b62c8db1fd15a0f62";
	
	let saveZip = "";

	
	$(":button").on("click", (e) => {
        
        let zipCode = $("#zipCode").val();
        console.log(zipCode);

        const zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;

        if (!zipCodePattern.test(zipCode))
        {
	        alert("invalid zipcode");
        }else {
        	loadPlaces(zipCode).then((result) => {
	        	let currentWeatherDom = $("#CurrentWeather"); 
	        	currentWeatherDom. append('<h4>Current weather</h4>');
				let domString = formatDom(result);
				currentWeatherDom.append(domString);
				addforecasttButtons();
		}).catch((error) => {
			console.log(error);
		});
	}
       
    });

   

	const loadPlaces = (zipCode) => {
		return new Promise ((resolve, reject) => {
			$.ajax(`http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&units=imperial&appid=${apiKey}`)  
			  .done((data) => resolve(data))
			  .fail((error) => reject(error));
		});
	};





	const forecast5Days = (zipCode, days) => {
		return new Promise ((resolve, reject) => {
			$.ajax(`http://api.openweathermap.org/data/2.5/forecast/daily?zip=${zipCode},us&cnt=${days}&units=imperial&appid=${apiKey}`)  
			  .done((data) => resolve(data))
			  .fail((error) => reject(error));
		});
	};

const formatDom = (result) => {
	let iconCode = result.weather[0].icon;
	let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
	let weatherString = "";

	weatherString  = `<div class="col-md-6 col-md-offset-2">`;
	weatherString  += `<p><img src=${iconUrl}></p>`;
	weatherString  += `<p>Temperature : ${result.main.temp}F</p>`;
	weatherString  += `<p>Conditions  : ${result.weather[0].main}</p>`;
	weatherString  += `<p>Air pressure: ${result.main.pressure}</p>`; 
	weatherString  += `<p>Wind speed  : ${result.wind.speed}</p>`;
	weatherString  += `</div>`; 
	// currentWeaterDom.find(".icon").html(currWeatherString);
	return weatherString;

}

const writeForecastDom = (results) => {
	console.log("writeForecastdom" , results);
	let domString = "";
	let forecastDom = $("#forecast"); 
	forecastDom. append('<h4>Weather forecast</h4>');

	results.forEach((result) => {
		domString += formatDom(result);
	});
	forecastDom.append(domString);

};

const addforecasttButtons = ()  => {

	let forecastButtonsString = `<input type="button" id="forecast5Days" value="Click for 5 days forecast"> <input type="button" id="forecast3Days" value="Click for 3 days forecast">`;

	$('#next-button').html(forecastButtonsString);

	 $('#forecast5Days').on('click', () => {
	 	let zipCode = $("#zipCode").val();
    	forecast5Days(zipCode, 5).then((results) => {
    	    writeForecastDom(results.list)	
    		// console.log("5 days result", result);			
    	})
    	.catch((error) => {
    		console.log ("error forecast 5 days", error)
    	});

    });

    $('#forecast3Days').on('click', () => {

    });
}


});