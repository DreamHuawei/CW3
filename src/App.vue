<script>
import ProductList from './components/ProductList.vue'
import Checkout from './components/Checkout.vue'
export default{
    data() {
        return{
            sitename: "Course Selection System",
            currentComponent: "ProductList",
            cart: [],
            searchContent: "",
            products:[],
            datas: [],
            titleSort: "asc",
            apiPre:"https://mapp-env.eba-3mn2p9xd.eu-north-1.elasticbeanstalk.com/",
        }
    },

    components:{
      ProductList,
      Checkout
    },

    created: function () { 
      this.initData();
      
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("service-worker.js");
      }
    },

    computed: {

      cartItemCount() {
          return this.cart.length || '';
      },

      sortedProducts() {
          if (this.products.length > 0) {
              let productsArray = this.products.slice(0);
              if(this.searchContent && this.searchContent !== ""){
                  productsArray = productsArray.filter(product=>product.title.toLowerCase().includes(this.searchContent.toLowerCase()));
              }
              if(this.titleSort === "asc"){
                  return  productsArray.sort(compare);
              } else {
                  return productsArray.sort(compareDesc);
              }

              function compare(a, b) {
              if (a.title.toLowerCase() < b.title.toLowerCase())
                  return -1;
              if (a.title.toLowerCase() > b.title.toLowerCase())
                  return 1;
              return 0;
              }
              function compareDesc(a, b) {
              if (a.title.toLowerCase() < b.title.toLowerCase())
                  return 1;
              if (a.title.toLowerCase() > b.title.toLowerCase())
                  return -1;
              return 0;
              }
          }
      }
    },
    methods: {
            
            addToCart(aProduct) {
            this.cart.push(aProduct.id);
            },
            
            cartCount(id) {
                let count = 0;
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i] === id) {
                    count++;
                    }
                }
                return count;
            },

            getCart() {
                this.datas = [];
                for (var i = 0; i < this.cart.length; i++) {
                    for (var j = 0; j < this.products.length; j++) {
                        if (this.cart[i] === this.products[j].id) {
                            this.datas.push(this.products[j]);
                        }
                    }
                }
            },

            remove(product){
                for (var i = 0; i < this.datas.length; i++) {
                    if (this.datas[i].id == product.id) {
                            this.datas.splice(i, 1);
                    }
                }
                for (var i = 0; i < this.cart.length; i++) {
                        if (this.cart[i] == product.id) {
                                this.cart.splice(i, 1);
                        }
                }
            },
            

            showCheckout() {
              if (this.currentComponent === ProductList){
              this.currentComponent = Checkout;
              this.getCart();
            }
             else
              this.currentComponent = ProductList;
            },

            home(){
              this.currentComponent = ProductList;
            },

            
            //用于展示前端的产品数据
           initData: async function(){
            const response = await fetch(this.apiPre + 'lesson');
            const result = await response.json();
            this.products = result.data;
            },
            
        },
        
}
</script>

<template>
  <div class="range">
  <div id="app">
  <header >
            <div class="navbar navbar-default" style=" background-color: bisque;">
                <div class="navbar-header ">
                    <h1>{{ sitename }}</h1>
                </div>
                                
                <div class="nav navbar-nav navbar-right cart">
                    <button type="button" class="btn btn-default btn-lg" :disabled="this.cart.length === 0" v-on:click="showCheckout" style="position: relative;  left: 27%;">
                        <span class="glyphicon glyphicon-shopping-cart">{{ cartItemCount}}</span> Checkout
                    </button>

                    <div class="searchBox">
                        <input type="text" v-model="searchContent"  placeholder="Search Box">
                    </div>
                </div>
                <div class="sort">
                    <div class="col-md-8 boxes">
                        <input type="radio" name="sort" value="asc" v-model="titleSort" >
                        <label >titleAsc</label>
                        <input type="radio" name="sort" value="desc" v-model="titleSort" >
                        <label >titleDesc</label>
                    </div>
                </div>
            </div>
        </header>
        <component
          :is="currentComponent"
          :products="sortedProducts"
          :cart="cart" 
          :apiPre="apiPre"
          :datas="datas"
          @add-item-to-cart="addToCart"
          @remove-item-from-cart="remove"
          @getCart="getCart"
          @home="home"
        >

        </component>
      </div>
    </div>
</template>

