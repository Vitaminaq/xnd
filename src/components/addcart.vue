<template>
  <div class="addcart">
    <div id="added">
        <div class="btn-bar-wrap">
            <router-link to='/'>
            <div class="btn-home btn">
                <div class="img-wrap"><img src="../assets/detail/item-home.png"></div>
                <p class="btn-title">首页</p>
            </div>
            </router-link>
            <router-link to='/cart'>
            <div class="btn-cart btn">
                <div class="img-wrap"><img src="../assets/detail/cart.png"><div class="cart-amount" v-show="cartAll>0"><p class="cart-amount-num">{{cartAll}}</p></div></div>
                <p class="btn-title">购物车</p>
            </div>
            </router-link> 
            <div class="btn-addCart" @click.stop="addCart" :class="this.state1 ? 'onsale' : 'saleout'">
                
            </div>
        </div> 
        <transition name="fade3">
            <div id="noaddt3" v-show="noaddtoast3">
                <img src="../assets/detail/added.png">
            </div>    
        </transition>    
    </div>
        
  </div>     
</template>
<script>
    import utils from '../common/utils'
    import request from '@/common/request'
    export default {
      name: 'addcart',
      props: ['goodsId'],
      data () {
        return {
          cartAll: 0,
          state1: false,
          noaddtoast3: false
        }
      },
      created: function () {
        this.$router.name = this.$route.name
        if (localStorage.getItem('uid') || localStorage.getItem('token')) {
          request.get(this.$router, {rootName: 'cartAll'}, function (data) {
            if (data.num < 1000) {
              this.cartAll = data.num
            } else {
              this.cartAll = 999
            }
          }.bind(this))
        }
        request.get(this.$router, {goodsId: this.goodsId}, function (data) {
          if (data.car.can_click === 1) {
            this.state1 = true
          } else {
            this.state1 = false
          }
        }.bind(this))
      },
      methods: {
        addCart: function () {
          var that = this
          request.post(this.$router, {rootName: 'addCart', goods_id: this.goodsId, goods_num: 1}, function (data) {
            if (this.state1 === true && data.code !== 8) {
              // utils.toToast('加入购物车成功')
              that.noaddtoast3 = true
              setTimeout(function () {
                that.noaddtoast3 = false
              }, 1000)
              request.get(this.$router, {rootName: 'cartAll'}, function (data) {
                // console.log(data.num)
                if (data.num < 1000) {
                  this.cartAll = data.num
                } else {
                  this.cartAll = 999
                }
              }.bind(this))
              // this.cartAll++
            } else {
              utils.toToast('商品未开售或者已下架')
            }
          }.bind(this))
        }
      }
    }
</script>
<style>
    .addcart{
        background-color: #fff;
        width: 100%;
        height: 1.633333rem;
        line-height: 1.493333rem;
        position: fixed;
        bottom: 0;
        z-index: 1000;
    }
    .btn-bar-wrap{
        width: 88.53%;
        height: 100%;
        margin: 0 auto;
        font-size: 0;
    }
    .btn-bar-wrap .btn{
        display: inline-block;
        margin-top: 0.2333rem;
        float: left;
    }
    .btn-bar-wrap .btn img{
        width: 100%;
        height: 100%;
    }
    .btn-bar-wrap .btn .btn-title{
        font-size: .36rem;
        text-align: center;
        line-height: .266667rem;
        margin-top:.24rem;
    }
    .btn-bar-wrap .img-wrap{
        width: .7066rem;
        height: .7066rem;
        margin: 0 auto;
    }
    .btn-home{
        padding-right: 0.4666rem;
        border-right: .053333rem solid #ecedef;
    }
    .btn-cart{
        margin-left: 0.4666rem;
    }
    .btn-cart .img-wrap{
        position: relative
    }
    .btn-cart .cart-amount{
        position: absolute;
        display: table;
        width: 0.4666rem;
        height: 0.4666rem;
        background-image: url("../assets/detail/cart-amount.png");
        background-size: cover;
        top: -.08rem;
        right: -.213333rem
        
    }
    .cart-amount .cart-amount-num{
        display: table-cell;
        vertical-align: middle;
        letter-spacing: 0;
        font-size: 0.27rem;
        line-height: 0.4666rem;
        color: #fff;
    }
    .btn-addCart{
        width: 3.08rem;
        height: .7066rem;
        background-size: 100% 100%;
        margin-top: .45rem;
        float: right;
    }
    .onsale{
        background-image: url("../assets/detail/add-cart.png");
    }
    .saleout{
        /*商品下架或未开售样式*/
        background-image: url("../assets/detail/saleout.png");
    }
    .fade3-enter-active, .fade3-leave-active {
      transition: opacity .5s
    }
    .fade3-enter, .fade3-leave-to /* .fade-leave-active in <2.1.8 */ {
      opacity: 0
    }
    #noaddt3
    {
      position: absolute;
      top: -530%;
      left: 25.733%;
    }
    #noaddt3 img
    {
      width: 4.853333rem;
      height: 3.12rem;
    }
</style>

