axios.get('http://localhost:3000/api/category').then(res => {
    var category = [...res.data]
    var navbar = document.getElementById("nav-bg-id");
    var detailCategory = [];

    navbar.innerHTML = `<div class='navbar-collapse collapse' id='mc-horizontal-menu-collapse'>
    <div class='nav-outer'>
        <ul class='nav navbar-nav'>
            <li class='active dropdown'><a href='/home'>Home</a></li>
            <li class='dropdown'><a class='dropdown-toggle' href='#' data-hover='dropdown' data-toggle='dropdown'>${category[0].name}</a>
                <ul class='dropdown-menu pages'>
                    <li>
                        <div class='yamm-content'>
                            <div class='row'>
                                <div class='col-xs-12 col-menu'>
                                    <ul class='links' id='ul-gundam'>
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
            <li class='dropdown'><a class='dropdown-toggle' href='#' data-hover='dropdown' data-toggle='dropdown'>${category[1].name}</a>
                <ul class='dropdown-menu pages'>
                    <li>
                        <div class='yamm-content'>
                            <div class='row'>
                                <div class='col-xs-12 col-menu'>
                                    <ul class='links' id='ul-tools'>
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
            <li class='dropdown'><a class='dropdown-toggle' href='#' data-hover='dropdown' data-toggle='dropdown'>${category[2].name}</a>
                <ul class='dropdown-menu pages'>
                    <li>
                        <div class='yamm-content'>
                            <div class='row'>
                                <div class='col-xs-12 col-menu'>
                                    <ul class='links' id='ul-paints'>
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
            <li class='dropdown hidden-sm'><a href='#'>${category[3].name}</a></li>
            <li class='dropdown'><a class='dropdown-toggle' href='#' data-hover='dropdown' data-toggle='dropdown'>${category[4].name}</a>
                <ul class='dropdown-menu pages'>
                    <li>
                        <div class='yamm-content'>
                            <div class='row'>
                                <div class='col-xs-12 col-menu'>
                                    <ul class='links' id='ul-others'>
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
        <div class='clearfix'></div>
    </div>
</div>`

    var ulGundam = document.getElementById('ul-gundam');
    var ulTools = document.getElementById('ul-tools');
    var ulPaints = document.getElementById('ul-paints');
    var ulOthers = document.getElementById('ul-others');
    
    for (let i=0; i<category.length;i++){
        axios.get('http://localhost:3000/api/category-detail/' + category[i]._id).then(res => {
            detailCategory[i] = res.data
            var html = ''
            if (i === 0){
                detailCategory[i].forEach(element => {
                    html +=  `<li><a href="/products/${element._id}">${element.name}</a></li>`
                });
                ulGundam.innerHTML = html
            }
            if (i === 1){
                detailCategory[i].forEach(element => {
                    html +=  `<li><a href="/products/${element._id}">${element.name}</a></li>`
                });
                ulTools.innerHTML = html
            }
            if (i === 2){
                detailCategory[i].forEach(element => {
                    html +=  `<li><a href="/products/${element._id}">${element.name}</a></li>`
                });
                ulPaints.innerHTML = html
            }
            if (i === 4){
                detailCategory[i].forEach(element => {
                    html +=  `<li>
                        <a href="/products/${element._id}">${element.name}</a>
                    </li>`
                });
                ulOthers.innerHTML = html
            }
        })         
    }
})