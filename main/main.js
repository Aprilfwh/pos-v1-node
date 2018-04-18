var load = require("./datbase");
var loadAllItems = load.loadAllItems;
var loadPromotions = load.loadPromotions;

function printInventory(selectedItems) {
    //返回不同物品的数量
    function getNumber(select){
        var number_json ={};
        for (var i=0;i<select.length;i++){
            if(!number_json[select[i]]){
                number_json[select[i]] = 1;
            }
            else{
                number_json[select[i]] +=1;
            }
        }
        return number_json;
    }

    // getOrdered函数获得购买物品的明细
    function getOrdered(all, number_list) {
        var order_list =[];
        for (var key in number_list) {
            var temp = {};
            var name;//名称
            var price;//单价
            var number;//购买数量
            var unit;//单位
            var barcode = key.split("-")[0];//物品barcode
            if (key.split("-").length > 1) {
                number = Number(key.split("-")[1]);//称重物品的数量

            }
            else {
                number = number_list[barcode];//其他物品的数量已经保存在number_list里了
            }
            for (var j = 0; j < all.length; j++) {
                if (all[j].barcode === barcode) {
                    name = all[j].name;//物品名
                    price = all[j].price;//菜品单价
                    unit = all[j].unit;
                    break;
                }
            }
            temp.barcode = barcode;
            temp.name = name;
            temp.number = number;
            temp.unit = unit;
            temp.price = price;
            temp.total_price = number * price;//该菜品的总价格
            order_list.push(temp);
        }
        return order_list;
    }
    function getGive(order_list, promote){
        var give=[];
        var spare=0;//节省的钱
        for(var i=0;i<order_list.length;i++){
            if(order_list[i].number >= 3){
                for(var j=0;j<promote[0].barcodes.length;j++){
                    if(order_list[i].barcode===promote[0].barcodes[j]){
                        var give_number = Math.floor(order_list[i].number/3);
                        spare += give_number*order_list[i].price;
                        order_list[i].total_price-=give_number*order_list[i].price;//如果该物品参加买二送一的活动，更新该物品的总价格
                        give.push([order_list[i].name, give_number,order_list[i].unit]);
                        break;
                    }
                }
            }
        }
        give.push(spare);
        return give;
    }
    //按输出要求返回结果
    function output(order_list, give) {
        var result = '***<没钱赚商店>购物清单***\n';
        var total_price=0;
        for(var i=0;i<order_list.length;i++){
            result += '名称：'+ order_list[i].name + '，数量：'+ order_list[i].number.toString() +
                order_list[i].unit +'，单价：'+order_list[i].price.toFixed(2).toString() + '(元)，小计：'+
                order_list[i].total_price.toFixed(2).toString() + '(元)\n';
            total_price += order_list[i].total_price;
        }
        result += '----------------------\n';
        result += '挥泪赠送商品：\n';
        for(var j=0;j<give.length-1;j++){
            result += '名称：'+give[j][0] + '，数量：'+give[j][1].toString()+give[j][2]+'\n';
        }
        result += '----------------------\n';
        result += '总计：'+total_price.toFixed(2).toString()+'(元)\n';
        result +='节省：'+give[give.length-1].toFixed(2).toString()+'(元)\n';
        result += '**********************';
        return result;
    }
    var allItems = loadAllItems();
    var promote = loadPromotions();
    var number_list = getNumber(selectedItems);
    var order_list = getOrdered(allItems, number_list);
    var give= getGive(order_list, promote);
    var result = output(order_list, give);
    console.log(result);
    return result;
}
module.exports=printInventory;