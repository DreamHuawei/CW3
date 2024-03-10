<script>
export default{
    data() {
        return{
            titleSort: "asc",

        }
    },
    props:["products","cart","apiPre"],
    methods: {
        checkRating(n, myProducts) {
            return myProducts.rating - n >= 0;
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
            
            canAddToCart(aProduct) {
                return aProduct.availableInventory > this.cartCount(aProduct.id);
            },
            
        },
        filters: {
            formatPrice(price) {
                if (!parseInt(price)) { return ""; }
                if (price > 99999) {
                    var priceString = (price / 100).toFixed(2);	
                    var priceArray = priceString.split("").reverse();	
                    var index = 3;
                    while (priceArray.length > index + 3) {	
                    priceArray.splice(index+3, 0, ",");	
                    index += 4;	
                    }
                    return "$" + priceArray.reverse().join("");	
                }
                else {
                    return "$" + (price / 100).toFixed(2);
                }
            }
          },
}
</script>

<template>
    <div>
  
        <div class="restrict">
                <div v-for="product in products" style="width: 33.33%;" :key="product.id">

                    <div style="float: left; margin-right: 10px;">
                        <figure>
                            <img class="product" v-bind:src="[apiPre+product.image]">
                        </figure>
                    </div>
                    <div class="description">
                        <h1 v-text="product.title" style="font-size: 25px; font-weight: bold;"></h1>
                        <p v-html="product.location"></p>
                        <p class="price">{{product.price | formatPrice}}</p>
                        <button class=" btn btn-primary btn-lg" v-on:click="$emit('add-item-to-cart', product)" v-if="canAddToCart(product)">
                            Add to cart
                        </button>
                        <button disabled="true" class=" btn btn-primary btn-lg" v-else>
                            Add to cart
                        </button>
                        <span class="inventory-message" v-if="product.availableInventory - cartCount(product.id) === 0">
                            All Out!
                        </span>
                        <span class="inventory-message" v-else-if="product.availableInventory - cartCount(product.id) < 5">
                            Only {{product.availableInventory - cartCount(product.id)}} left!
                        </span>
                        <span class="inventory-message" v-else>
                            Buy Now!
                        </span>
                        
                        <div class="rating">
                            <span v-bind:class="{'rating-active' : checkRating (n, product)}" v-for="n in 5" :key="n">
                                ☆
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
</template>