<template>
  <div id="detail">
  <headerbar></headerbar>
    <div class="swiper-wrap">  
      <swiper :options="swiperOption"  ref="mySwiper" class="swiper">  
         <!-- 这部分放你要渲染的那些内容 -->  
         <swiper-slide class="slide" v-for="(url,index) in goodsImg" :key="index"><div ><img :src="url"></div></swiper-slide>
         <!-- 这是轮播的小圆点 -->  
         <div class="swiper-pagination" slot="pagination"></div>
       
      </swiper>
        <!--左上角tag-->
       <div class="tag" :class="{presale: state2,offsale:state3}" v-show="state1"></div>
       <div class="tag1" v-show="state1"><p>{{this.txt}}</p></div>
       <!--热卖倒计时-->
       <div class="timeout">
           <div class="time-title"><p>距结束仅剩</p></div>
           <div class="time-remain"><p>{{this.cuttimestring}}</p></div>    
       </div>
       <!--加入购物车弹出层!暂时不用-->
       <!-- <transition name="fade">
          <div class="addcart-ok"  v-show="this.toaststate">
             <img src="../assets/detail/addcart-success.png" class="addcartsucc">
          </div>
       </transition>   -->  
    </div>   
    <div class="detail-text">
        <h2 class="name">{{goodsDetail.title}}</h2>
        <p class="desc">{{goodsDetail.description}}</p>
        <p class="detailprice">
            <span class="attach">&yen;</span>
            <span class="price">{{goodsDetail.price}}</span>
            <span class="attach">/{{goodsDetail.unit}}</span>            
        </p>
        <p class="start-time">{{goodsDetail.send_time}}</p>
    </div>
    <div class="btn-arrow" v-show="this.hd">
        <img src="../assets/detail/bottom-arrow.png">
    </div>
    <div class="item-detail">
        <img :src="goodsDetail.detail">
    </div>    
    <div class="btn-line">
        <img src="../assets/detail/line-horzontail.png">
    </div>
    <!--<router-view></router-view>-->
    <addcart :goodsId="goodsId"></addcart>
    
  </div>    
</template>
<script>
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import headerbar from '../components/headerbar'
    import Toast from 'vue-easy-toast'
    import request from '@/common/request'
    import addcart from '../components/addcart'
    export default {
      name: 'detail',
      components: {
        swiper,
        swiperSlide,
        Toast,
        addcart,
        headerbar
      },
      data () {
        return {
          swiperOption: {
           // 是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
            notNextTick: true,
            pagination: '.swiper-pagination',
            slidesPerView: 'auto',
            centeredSlides: true,
            paginationClickable: true,
            spaceBetween: 30,
            onSlideChangeEnd: swiper => {
             // 这个位置放swiper的回调方法
            //  this.page = swiper.realIndex+1;
            //  this.index = swiper.realIndex;
            }
          },
          goodsId: '',
          goodsDetail: '',
          goodsImg: '',
          txt: '',
          state1: false,
          state2: false,
          state3: false,
          toaststate: false,
          day1: '',
          house1: '',
          miu1: '',
          miao1: '',
          cuttimestring: '',
          scroll: '',
          hd: true
        }
      },
      // watch: {
      //   scr: function (newval, oldval) {
      //     if (newval === 0) {
      //       console.log('fdsfd')
      //     }
      //   }
      // },
      // props: ['goodsId'],
      created: function () {
        var that = this
        this.$router.name = this.$route.name
        this.goodsId = this.$route.query.goodsId
        request.get(this.$router, {goodsId: this.goodsId}, function (data) {
          this.goodsDetail = data.detail
          this.goodsImg = data.goods_imgs
          if (data.exp.text === null) {
            if (data.category === null) {
              this.state1 = false
            } else {
              this.txt = data.category.name
              this.state1 = true
              this.state2 = true
              this.state3 = false
            }
          } else {
            this.txt = data.exp.text
            this.state3 = true
            this.state2 = false
          }
          // console.log(string.leave_end_time_text)
          var day = this.goodsDetail.leave_end_time_text.split('天')
          this.day1 = day[0]
          var house = day[1].split('小时')
          this.house1 = house[0]
          var miu = house[1].split('分')
          this.miu1 = miu[0]
          var miao = miu[1].split('秒')
          this.miao1 = miao[0]
          setInterval(function () { that.cuttime() }, 1000)
        }.bind(this))
      },
      // mounted: function () {
      //   const that = this
      //   window.onscroll = () => {
      //     return (() => {
      //       that.scr = document.body.scrollTop
      //     })()
      //   }
      // },
      mounted: function () {
        window.addEventListener('scroll', this.menu)
      },
      methods: {
        menu: function () {
          this.scroll = document.body.scrollTop
          if (this.scroll > 0) {
            this.hd = false
          } else {
            this.hd = true
          }
        },
        cuttime: function () {
          if (this.miao1 > 0) {
            this.miao1--
          } else {
            if (this.miu1 > 0) {
              this.miu1--
              this.miao1 = 60
            } else {
              if (this.house1 > 0) {
                this.house1--
                this.miu1 = 60
              } else {
                if (this.day1 > 0) {
                  this.day1--
                  this.house1 = 24
                } else {
                  this.day1 = 0
                  this.miu1 = 0
                  this.house1 = 0
                  this.miao1 = 0
                }
              }
            }
          }
          this.cuttimestring = this.day1 + '天' + this.house1 + '小时' + this.miu1 + '分' + this.miao1 + '秒'
        }
      }
    }
</script>
<style>
    @import "../common/mixin.css";
    #detail{
        z-index: 200;
        margin-top: 1.49rem;
    }
    .swiper{
        width: 88.53%;
        height:9.0rem;
    }
    .addcart-ok{
        position: absolute;
        bottom: -8.7%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 200;
    }
    .addcart-ok img{
        width: 4.853333rem;
        height: 3.12rem;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
        opacity: 0
    }
    .swiper img{
        width: 100%;
        height:8.093333rem;
    }
    .swiper-pagination-bullet-active{

        background-color: #32ab42 !important;
    }
    .swiper-pagination
    {
        position: absolute;
        bottom: 0;
        left: 0;
    }
    .swiper-wrap{
        position: relative;
    }
    .swiper-wrap .tag{
        position: absolute;
        top: -.293333rem;
        left: 0.4666rem;
        width: 1.3066rem;
        height: 1.3066rem;
        color: #fff;
        background-size: cover;
        z-index: 100;
    }
    .swiper-wrap .tag1
    {
        display: table;
        position: absolute;
        top: -0.15rem;
        left: 0.6rem;
        width: 1rem;
        height: 1rem;
        z-index:101;
    }
    .swiper-wrap .tag1 p{
        color: white;
        display: table-cell;
        vertical-align: middle;
        font-size: 0.3866rem;
        letter-spacing: 0;
    }
    .swiper-wrap .presale{
        background-image: url("../assets/detail/unsale.png");
    }
    .swiper-wrap .offsale{
        background-image: url("../assets/detail/offsale.png");
    }
    .swiper-wrap .timeout{
        width:7.2rem;
        position: absolute;
        bottom: 0.90422rem;
        left: 50%;
        transform: translate(-50%,0);
        font-size: 0;
        height: .5733rem;
        z-index: 100;
    }
    .swiper-wrap .time-title{
        float: left;
        /*display: inline-block;*/
        /*width:1.8533rem*/
        width: 2.4rem;
        height: 100%;
        background-image: url("../assets/detail/time-red.png");
    }
    .time-title p{
        color: #fff;
        height: .5733rem;
        line-height: .5733rem;
        font-size: 0.413333rem;
    }
    .swiper-wrap .time-remain{
        float: left;
        /*display: inline-block;*/
        /*width:2.8666rem*/
        width: 4.8rem;
        height: 100%;
        background-image: url("../assets/detail/time-gray.png");
    }
    .time-remain p{
        height: .5733rem;
        line-height: .5733rem;
        font-size: 0.413333rem;
        color: #fff;
    }
    .detail-text{
        font-size: 0;
        letter-spacing: 0;
    }
    .detail-text .name{
        font-size: .666667rem;
        line-height: .693333rem;
        color: #000;
        padding-top: 0.013333rem;
    }
    .detail-text .desc{
        font-size: 0.413333rem;
        color: rgba(0,0,0,0.6);
        text-align: center;
        padding-top: 0.133333rem;
    }
    .detailprice
    {
        padding-top: 0.426667rem;
    }
    .detail-text .attach{
        font-size: .373333rem;
        color: #32ab42;        
    }
    .detail-text .price{
        font-size: .533333rem;
        font-weight: bold;
        color: #32ab42;        
    }
    .detail-text .old-price{
        font-size: .373333rem;
        text-decoration: line-through;
        color: rgba(0,0,0,0.6);
    }
    .detail-text .start-time{
        padding-top: 0.253333rem;
        font-size: .3866rem;
        color: #000;
        margin-bottom: 0.466rem;
    }
    .btn-arrow
    {
      margin:0;
      padding: 0;
      width: 0.4rem;
      height: 0.4rem;
      position: fixed;
      left: 50%;
      margin-left: -0.2rem;
      bottom: 2.15rem;
      animation:myfirst 1s infinite;
      animation-direction:alternate;
      -webkit-animation-direction:alternate;
    }
    .btn-arrow img
    {
      width:0.45rem;
      height: 0.3rem; 
    }
    @keyframes myfirst
    {
      0%   {opacity:1; left: 50%;bottom: 2.15rem;}
      /*25%  {opacity:0.4; left: 4.6rem;bottom: 2.75rem;}*/
      50%  {opacity:0.6; left: 50%;bottom: 2.25rem;}
      /*75%  {opacity:0.8; left: 4.6rem;bottom: 2.9rem;}*/
      100% {opacity:0.2; left: 50%;bottom: 2.35rem;}
    }
    .item-detail{
        margin-top: 2.133333rem;
        width: 100%;
        margin-bottom: 15.5%;
    }
    .item-detail img{
        width: 100%;
    }
    .btn-line{
        position: fixed;
        bottom: 1.43333rem;
        z-index: 2000;
    }
    .btn-line img{
        width: 100%;
    }
    .btn-bar{
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
        font-size: .266667rem;
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
        font-size: 0.2266rem;
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
        /*商品下架样式*/
        background-image: url("../assets/detail/saleout.png");
    }
    
</style>
