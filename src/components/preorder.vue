<template>
  <div id="orders">
        <div id="address" @click="toaddress">
            <div class="address-title"><img src="../assets/cart/address.png"><span>收货地址</span></div>
            <div class="address-name">{{ordercontent.name}}<span class="address-tel">{{ordercontent.phone}}</span></div>
            
            <div class="address-text">{{ordercontent.fullAddr}}</div>
            <img src="../assets/cart/right-arrow.png" class="right-arrow">
        </div>
        <div class="licut">
       
            </div> 
        <div class="deliver1">
            <div class="deliver-title">发货时间</div>
            <div class="deliver-time">
                <span class="deliver-date">{{order_info_stime[0]}}</span>
                <span class="deliver-day">{{order_info_stime[1]}}</span>
            </div>
        </div>
        <div class="licut">
       
            </div> 
        <div class="discount" @click="toastShow">
            <div class="discount-title">优惠码</div>
            <img src="../assets/cart/right-arrow.png" class="right-arrow" >
        </div>
        <div class="licut">
       
            </div> 
       <div class="order-list">
            <ul>
                <li class="list-title">订单详情</li>
                <li v-for="item1 in price_info">
                  <span class="list-left">{{item1.name}}</span><span class="list-right">{{item1.value}}</span>
                </li>
                <li v-for="item in good_car_info">
                    <span class="list-left">{{item.name}}：</span><span class="list-right-item"><span class="amount">{{item.num}}{{item.unit}}</span><span class="price">{{item.value}}</span></span>
                </li> 
            </ul>
        </div>
        <div class="toCheck">
            <span class="check-all-money">合计：{{totalmoney}}</span>
            <span class="check-btn" @click.stop="pay"></span>
        </div>
        <!--优惠码输入弹窗-->
        <transition name="fade">
            <div class="mask" v-show="toastDisplay">
                <div class="discount-toast" v-show="toastDisplay">
                    <input type="text" placeholder="请输入优惠码" v-model="idnum">
                    <div class="discount-toast-confirm">
                        <div class="btn" @click="toastShow">取消</div>
                        <div class="btn" @click.stop="useidnum">确认</div>
                    </div>    
                </div>
            </div>    
        </transition>
  </div>
</template>
<script>
import request from '../common/request'
import utils from '../common/utils'
import wx from 'weixin-js-sdk'
export default {
  name: 'preorder',
  data () {
    return {
      toastDisplay: false,
      good_car_info: [],
      ordercontent: [],
      order_info_stime: [],
      price_info: [],
      idnum: '',
      totalmoney: '',
      goods_id: [],
      addid: '',
      coupon_id: '',
      state: true,
      item: [],
      minurl: '',
      minurls: [],
      item1: '',
      item2: []
    }
  },
  created: function () {
    this.minurl = location.href
    var reg = new RegExp(/\/#/, 'g')
    this.minurl = this.minurl.replace(reg, '')
    this.minurls = this.minurl.split('?')
    this.minurl = this.minurls[0]
    this.$router.name = this.$route.name
    if (this.$route.query.addid) {
      this.addid = this.$route.query.addid
    }
    request.get(this.$router, {
      goods_car_ids: this.$route.query.goods_car_id,
      addr_id: this.addid
    }, function (data) {
      if (data.code && data.code === 11) {
        utils.toToast('没有收货地址')
        this.$router.push({path: '/person/address/add?id1=markadd1&goods_car_id=' + this.$route.query.goods_car_id})
      } else {
        this.ordercontent = data.rcv_info.msg
        this.order_info_stime = data.orders_info.send_time
        this.price_info = data.orders_info.price_info
        this.good_car_info = data.orders_info.goods_car_info
        this.totalmoney = data.orders_info.price_info[1].value
        for (var i = 0; i < this.good_car_info.length; i++) {
          this.goods_id.push(this.good_car_info[i].goods_id)
        }
        this.addid = data.rcv_info.msg.id
      }
    }.bind(this))
  },
  methods: {
    toastShow: function () {
      this.toastDisplay = !this.toastDisplay
    },
    toaddress: function () {
      this.$router.push({path: '/person/address?id=markadd&goods_car_id=' + this.$route.query.goods_car_id})
    },
    useidnum: function () {
      if (this.idnum !== '') {
        request.get(this.$router, {
          goods_car_ids: this.$route.query.goods_car_id,
          rootName: 'coupon',
          agent_id: 1,
          code: this.idnum
        }, function (data) {
          if (data.code === 0) {
            this.totalmoney = data.msg.all_price
            this.toastDisplay = !this.toastDisplay
            this.idnum = ''
            this.coupon = data.msg.id
            utils.toToast('使用成功')
          } else {
            this.idnum = ''
            utils.toToast('优惠码无效')
          }
        }.bind(this), function (err) {
          console.log(err)
          utils.toToast('请求失败')
        })
      }
    },
    pay: function () {
      if (this.state === true) {
        this.state = false
        request.post(this.$router, {
          goods_car_ids: this.$route.query.goods_car_id,
          rootName: 'createorder',
          addr_id: this.addid,
          pay_id: 4,
          coupon_id: this.coupon
        }, function (data) {
          for (var i = 0; i < data.length; i++) {
            this.item1 = data[i] + ','
          }
          request.get(this.$router, {
            url: this.minurl,
            rootName: 'pay'
          }, function (data) {
            this.item = data
            console.log(data)
            wx.config({
              debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: this.item.appid, // 必填，公众号的唯一标识
              timestamp: this.item.timestamp, // 必填，生成签名的时间戳
              nonceStr: this.item.nonceStr, // 必填，生成签名的随机串
              signature: this.item.signature, // 必填，签名，见附录1
              jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
            wx.ready(function () {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
              request.get(this.$router, {
                order_ids: this.item1,
                pay_id: 4,
                rootName: 'paying'
              }, function (data) {
                console.log(data)
                this.item2 = data
                wx.chooseWXPay({
                  timestamp: this.item2.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                  nonceStr: this.item2.nonce_str, // 支付签名随机串，不长于 32 位
                  package: 'prepay_id=' + this.item2.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                  signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                  paySign: this.item2.paySign, // 支付签名
                  success: function (res) {
                    if (res.errMsg === 'chooseWXPay:ok') {
                      alert('支付成功')
                    } else {
                      alert('支付失败')
                    }
                  }
                })
              }.bind(this))
             // utils.toToast('支付成功')
             // this.$router.push({path: '/person/order/order?status=2'})
            })
              // wx.error(function(res){
              // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                // console.log(err)
               //  this.$router.push({path: '/person/order/order?status=1'})
             // })
          }.bind(this))
        }.bind(this), function (err) {
          console.log(err)
          this.state = true
          utils.toToast('创建订单失败')
        }.bind(this))
      }
    }
  }
}
</script>
<style>
 @import "../common/mixin.css";
   #orders
   {
     margin-top: 0.983333rem;
   }
   #address{
        margin:0;
        width: 94%;
        background-color: #fff;
        padding: 0.426667rem 0 0 0.573333rem;
        height: 2.706666rem;
        text-align: left;
        position: relative;
        box-sizing: border-box;
    }
    .licut
    {
       width: 100%;
       height: 0.04rem;
       background: url(../assets/licut.png);
    }
    #address div{
        font-size: 0;
        letter-spacing: 0;
    }
    .address-title{
        margin-bottom: .293333rem;
    }
    .address-title span{
        font-size: .413333rem;
    }
    .address-title img{
        vertical-align: bottom;
        margin-right: .133333rem;
        width: .32rem;
        height: .413333rem;
    }
    #address .address-name{
        font-size: .48rem;
    }
    #address .address-tel{
        margin-left: .573333rem;
        font-size: .346667rem;
    }
    #address .address-text{
        font-size: .306666rem;
        margin-top: .213333rem
    }
    #address .right-arrow{
        position: absolute;
        right: 0rem;
        top:1.173333rem;
        width: .2rem;
        height: .333333rem;
    }
    .deliver1, .discount{
        width: 100%;
        font-size: 0;
        height: 1.853333rem;
        padding: .373333rem .573333rem;
        box-sizing: border-box;
    }
    .deliver1 .deliver-title{
        text-align: left;
        font-size: .413333rem;
        margin-bottom: .28rem;
    }    
    .discount .discount-title{
        text-align: left;
        font-size: .413333rem;
        margin-bottom: .28rem;
    }
    .deliver1 .deliver-time{
        font-size: .413333rem;
    }
    .deliver1 .deliver-time .deliver-date{
        float: left;
    }
    .deliver1.deliver-time .deliver-day{
        float: right;
    }
    .discount{
        position: relative;
    }
    .discount img{
        position: absolute;
        bottom: .4rem;
        right: .573333rem;
        width: .2rem;
        height: .333333rem;
    }
    .order-list{
        padding: .373333rem .573333rem;
        height: 8.8rem;
        box-sizing: border-box;
        font-size: 0;
        letter-spacing: 0;
        overflow-y:auto;
    }
    .order-list .list-title{
        text-align: left;
        font-size: .413333rem;
    }
    .order-list li span{
        font-size: .413333rem;
    }
    .order-list li{
        margin-bottom: .373333rem;
    }
    .order-list li::after{
        display: block;
        content: '';
        height: 0;
        clear:both;
        overflow: hidden;
        visibility: hidden;
    }
    .order-list li .list-left{
        text-align: left;
        float: left;
    }
    .order-list li .list-right{
        float: right;
    }
    .order-list li .list-right-item{
        width: 40%;
        float: right;
    }
    .order-list li .list-right-item .amount{
        float: left
    }
    .order-list li .list-right-item .price{
        float: right;
    }
    .toCheck{
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 1.533333rem;
        padding: 0 .573333rem;
        border-top: .026667rem solid #ecedef; 
        box-sizing: border-box;
        font-size: 0;
        background-color: #fff;
    }
    .toCheck .check-all-money{
        float: left;
        margin-top: .533333rem;
        font-size: .466666rem;
    }
    .toCheck .check-btn{
        float: right;
        margin-top: .386666rem;
        width: 3.08rem;
        height: .746667rem;
        background-image:url("../assets/cart/toCheck.png");
        background-size: 100% 100%; 
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
        opacity: 0
    }
    .mask{
        position: fixed;
        z-index: 1000;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0,0,0,0.6);
    }
    .discount-toast{
        z-index: 2000;
        width: 60%;
        height: 2.666667rem;
        background-color: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        border-radius: 3px;
        transition: 2s;
    }
    .discount-toast input{
        width: 80%;
        height: .64rem;
        outline: none;
        border: 1px solid #ecedef;
        font-size: .373333rem;
        line-height: .64rem;
    }
    .discount-toast .discount-toast-confirm{
        width: 100%;
        position: absolute;
        bottom: 0;
        padding: .133333rem 0;
    }
    .discount-toast .discount-toast-confirm .btn{
        cursor: pointer;
        float: left;
        width: 50%;
        font-size: .48rem;
        color: #31ab43;
        text-align: center;
    }
</style>
