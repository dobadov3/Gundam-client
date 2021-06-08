var selectCityTemp = document.getElementById("select-city-temp");
var selectCity = document.getElementById("select-city");
var selectDistrict = document.getElementById("select-district");


axios.get("http://localhost:3000/api/cities").then((respone) => {
    respone.data.forEach((c) => {
        var option = document.createElement("option");
        option.text = c.value;
        option.value = c.key;
        selectCityTemp.appendChild(option);
    });
});
var onCityChange = function () {
    var value = selectCityTemp.value;
    selectCity.innerHTML = ''
    var selectedCityText = selectCityTemp.options[selectCityTemp.selectedIndex].text;
    var option = document.createElement("option");
    option.text = selectedCityText
    option.value = selectedCityText
    selectCity.appendChild(option);
    selectCity.value = selectedCityText
    console.log(selectCity.value)
    selectDistrict.innerHTML = ''
    axios
        .get("http://localhost:3000/api/cities/" + value)
        .then((respone) => {
            respone.data.forEach((c) => {
                var optionDistrict = document.createElement("option");
                optionDistrict.text = c.value;
                optionDistrict.value = c.value;
                selectDistrict.appendChild(optionDistrict);
            });
        });
}