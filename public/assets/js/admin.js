var selectCategory = document.getElementById("exampleSelectCategory");
var selectCategoryDetail = document.getElementById("exampleSelectCategoryDetail");

axios.get('http://localhost:3000/api/category').then(respone => {
    console.log(respone.data)
    respone.data.forEach(c => {
        console.log(c._id)
        var option = document.createElement("option");
        option.text = c.name;
        option.value = c._id;
        selectCategory.appendChild(option)
    })
})

var onCategoryChange = function(){
    var categoryID = selectCategory.value

    axios.get('http://localhost:3000/api/category-detail/'+categoryID).then(respone => {
    console.log(respone.data)
    selectCategoryDetail.innerHTML = ''
    respone.data.forEach(c => {
        var option = document.createElement("option");
        option.text = c.name;
        option.value = c._id;
        selectCategoryDetail.appendChild(option)
    })
})
}