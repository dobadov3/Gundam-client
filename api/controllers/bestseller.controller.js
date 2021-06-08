var Product = require('../../models/products.model');
var Order = require('../../models/order.model')
module.exports.get = async function(req, res){
    var order = await Order.find();
    var productslist =[];
    var idlist =[]
    var a = [], b = [], prev;
    for(let i=0;i<order.length;i++)
    {
        for(let j=0;j<order[i].products.length;j++)
        {
            productslist.push(order[i].products[j]);
        }
        console.log("productlist:"+productslist)
    }
    for(let i=0;i<productslist.length;i++)
    {
        idlist.push(productslist[i]._id)
    }
    //Count id
    idlist.sort();
    for ( var i = 0; i < idlist.length; i++ ) {
        if ( idlist[i] !== prev ) {
            a.push(idlist[i]); 
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = idlist[i];
    }
    var product = await Product.find({_id:a}).limit(10)
    res.json(product);

}
