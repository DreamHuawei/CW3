<script>
export default{
    data() {
        return{
            order: {
              firstName: '',
              lastName: '',
              number: '',
            },
        }
    },
    props:['products','cart','datas','apiPre'],
    computed:{
        isSubmitDisabled: function() {
            return !this.order.firstName || !this.order.lastName || !this.order.number;
            },
    },
    methods: {
        checkRating(n, myProducts) {
            return myProducts.rating - n >= 0;
            },
            validateAndSubmit: function() {
            var nameRegex = /^[A-Za-z]+$/;
            var numberRegex = /^[0-9]+$/;
            if (!nameRegex.test(this.order.firstName) || !nameRegex.test(this.order.lastName) || !numberRegex.test(this.order.number)) {
                alert('Please check the format you entered. \r\rTip: The First and Last names should be letters. \r       The Phone number must be a number.');
            } 
            else {
                this.order.products = this.datas;
                let datas = this.datas;
                const apiPre = this.apiPre;
                fetch(this.apiPre + 'order', {
                    method: 'post',
                    body: JSON.stringify(this.order),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode:'cors'// 允许发送跨域请求
                }).then(function(response){
                    response.json().then(function(data){
                        if(data.code == 1){
                            // 清空购物车
                            let ids = [];
                            for (var i = 0; i < datas.length; i++) {
                                ids.push(datas[i].id);
                            }
                            datas = [];
                            // 刷新库存
                            fetch(apiPre + 'num', {
                                method: 'put',
                                body: JSON.stringify({ids:ids}),
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                mode:'cors'// 允许发送跨域请求
                            }).then(function(response){
                                response.json().then(function(data){
                                    if(data.code == 1){
                                        alert('Submit Successfully');
                                        // 刷新页面
                                        location.reload();
                                    }
                                })

                            });
                        }
                    })

                });
            }
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
        <div class=" btn btn-primary btn-sm" v-on:click="$emit('home')">HOME</div>
                <div class="row restrict">
                    <div v-for="product in datas" style="width: 33.33%;" :key="product.id">
                        <div >
                        <div style="float: left; margin-right: 10px;">
                            <figure>
                                <img class="product" v-bind:src="[apiPre+product.image]">
                            </figure>
                        </div>
                        <div class="description">
                            <h1 v-text="product.title" style="font-size: 25px; font-weight: bold;"></h1>
                            <p v-html="product.location"></p>
                            <p class="price">{{product.price | formatPrice}}</p>
                            <button class=" btn btn-primary btn-lg" v-on:click="$emit('remove-item-from-cart',product)">
                                Remove
                            </button>
                            <div class="rating">
                                <span v-bind:class="{'rating-active' :checkRating(n, product)}" v-for="n in 5" :key="n">
                                    ☆
                                </span>
                            </div>
                        </div>
                        </div>
                    </div>
    
                </div>   
            <div class="row" >
                <div class="col-md-10 col-md-offset-1"  style="margin-top: 5%;">                    
                <div class="panel panel-info">
                    <div class="panel-heading">Course Checkout</div>
                    <div class="panel-body">
                    <div class="form-group">
                        <div class="col-md-12">
                        <h4>
                            <strong>Complete Your Information</strong>
                        </h4>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-md-6">
                            <strong>First Name:</strong>
                            <input v-model.trim="order.firstName" class="form-control" />
                        </div>
                        <div class="col-md-6">
                            <strong>Last Name:</strong>
                            <input v-model.trim="order.lastName" class="form-control" />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-md-12">
                            <strong>Phone number:</strong>
                            </div>
                            <div class="col-md-12">
                            <input v-model.trim="order.number" class="form-control" />
                        </div>
                    </div>
                    
                    <div class="col-md-12 verify">
                        <pre>
                            First Name: {{order.firstName}}
                            Last Name: {{order.lastName}}
                            Phone number: {{order.number}}
                            
                        </pre>
                    </div>

                    <div class="form-group submitCourse">
                        <div class="col-md-3">
                            <button disabled="true" class="btn btn-primary btn-sm" v-if="isSubmitDisabled">Submit</button>
                            <button class="btn btn-primary btn-sm" v-on:click="validateAndSubmit" v-else>Submit</button>
                        </div>
                    </div> 
                    <!-- end of col-md-12 verify-->
                    </div>
                    <!--end of panel-body-->
                </div>
                <!--end of panel panel-info-->
                </div> 
                <!--end of col-md-10 col-md-offset-1-->
            </div>
            </div>
</template>
