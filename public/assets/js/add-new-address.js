var selectNewCityTemp = document.getElementById("select-new-city-temp");
var selectNewCity = document.getElementById("select-new-city");
var selectNewDistrict = document.getElementById("select-new-district");

axios.get("http://localhost:3000/api/cities").then((respone) => {
    respone.data.forEach((c) => {
        var option = document.createElement("option");
        option.text = c.value;
        option.value = c.key;
        selectNewCityTemp.appendChild(option);
    });
});
var onNewCityChange = function () {
    var value = selectNewCityTemp.value;
    selectNewCity.innerHTML = "";
    var selectedCityText =
        selectNewCityTemp.options[selectNewCityTemp.selectedIndex].text;
    var option = document.createElement("option");
    option.text = selectedCityText;
    option.value = selectedCityText;
    selectNewCity.appendChild(option);
    selectNewCity.value = selectedCityText;
    selectNewDistrict.innerHTML = "";
    axios.get("http://localhost:3000/api/cities/" + value).then((respone) => {
        respone.data.forEach((c) => {
            var optionDistrict = document.createElement("option");
            optionDistrict.text = c.value;
            optionDistrict.value = c.value;
            selectNewDistrict.appendChild(optionDistrict);
        });
    });
};
