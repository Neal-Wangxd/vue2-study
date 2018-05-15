new Vue({
    el:'#app_cart',
    data:{
        //购物车数据
        shopListArr:[],
        //是否全选
        isSelectAll: false,
        //总价格
        totalPrice: 0,
        //是否隐藏删除面板
        isHideDelPanel:true,
        //当前要删除的商品
        currentDelShop:{}

    },
    //组件已经加载完毕，请求网络数据，业务处理
    mounted(){
        //请求本地数据
        this.getLocalData();
    },
    //过滤
    filters:{
        //格式化金额
        moneyFormat(money){
            return '¥' + money.toFixed(2);
        }
    },
    methods:{
        //1.请求本地数据
        getLocalData(){
            this.$http.get('../../data/data.json').then(response => {
                const res = response.body;
                if(res){
                    this.shopListArr = res.allShops.shopList;
                    //console.log(this.shopListArr);
                }
            },response => {
                alert('error');
            });
        },
        //单个商品金额计算
        singerShopPrice(shop,flag){
            if(flag){//加
                shop.shopNumber += 1;
            }else{//减
                if(shop.shopNumber <= 1){
                    shop.shopNumber = 1;
                    return;
                }
                shop.shopNumber -= 1;
            }
            this.getAllShopPrice();
        },
        //全选和反选
        selectAll(flag){
            this.isSelectAll = !flag;
            //遍历商品list
            this.shopListArr.forEach((value,index) => {
                if(typeof value.checked === 'undefined'){
                    this.$set(value,'checked', !flag);
                }else{
                    value.checked = !flag;
                }
            });
            this.getAllShopPrice();
        },
        //计算商品的总价格
        getAllShopPrice(){
            let totalPrice = 0;
            this.shopListArr.forEach((value,index) => {
                if(value.checked){
                    totalPrice += value.shopPrice * value.shopNumber;
                }
            });
            this.totalPrice = totalPrice;
        },
        //计算单个商品选中
        singerShopSelect(shop){
            if(typeof shop.checked === 'undefined'){
                this.$set(shop,'checked', true);
            }else{
                shop.checked = !shop.checked;
            }
            //计算价格
            this.getAllShopPrice();

            //判断是否全选
            this.hasSelectAll();
        },
        //判断是否全选了
        hasSelectAll(){
            let flag = true;
            this.shopListArr.forEach((value,index) => {
                if(!value.checked){
                    flag = false;
                }
            });
            this.isSelectAll = flag;
        },
        //点击删除某个商品
        clickRemoveShop(shop){
            this.isHideDelPanel = false;
            this.currentDelShop = shop;
        },
        //删除商品
        removeShop(){
            this.isHideDelPanel = true;
            const index = this.shopListArr.indexOf(this.currentDelShop);
            this.shopListArr.splice(index,1);
            this.getAllShopPrice();
        }
    }
})