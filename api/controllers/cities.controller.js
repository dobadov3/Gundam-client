var json = require('../vietnam_provinces_cities.json');

module.exports.getCity = function(req, res){
    var values = Object.values(json);
    var keys = Object.keys(json);

    values = values.map(item => {
        return item.name
    })
    var city = [];
    for (let i = 0; i<values.length; i++){
        var obj = {
            key: keys[i],
            value: values[i]
        }

        city.push(obj)
    }

    res.json(city);
}

module.exports.getDistrict = function(req, res){
    var {district} = req.params;
    var keys = Object.keys(json[district].cities);
    var values = Object.values(json[district].cities);
    var d = [];
    for (let i = 0; i < values.length; i++) {
        var obj = {
            key: keys[i],
            value: values[i],
        };

        d.push(obj);
    }
    res.json(d);
}