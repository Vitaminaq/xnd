<template>
  
  <div id="orders">
  <headerbar></headerbar>
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
            <div class="coupontxt" v-show="this.txtsh">请输入可使用的优惠码</div>
            <div class="coupontxt" v-show="!this.txtsh">{{coupond}}</div>
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
            <span class="check-btn" id="cbtn" @click.stop="pay"><img src="../assets/cart/toCheck.png"></span>
        </div>
        <!--优惠码输入弹窗-->
        <transition name="fade">
            <div class="mask" v-show="toastDisplay">
                <div class="discount-toast" v-show="toastDisplay">
                    <input type="text" placeholder="请输入优惠码" v-model="idnum">
                    <div class="discount-toast-confirm">
                        <div class="btn" @click="toastShow" id="btn1">取消</div>
                        <div class="btn" @click.stop="useidnum">确认</div>
                    </div>    
                </div>
            </div>    
        </transition>
        <transition name="fade1">
            <div id="noaddt" v-show="noaddtoast">
                <img src="../assets/noadd.png">
            </div>    
        </transition>
  </div>
</template>
<script>
import headerbar from '../components/headerbar'
import request from '../common/request'
import utils from '../common/utils'
export default {
  name: 'preorder',
  components: {
    headerbar
  },
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
      noaddtoast: false,
      coupontxt: '',
      txtsh: true,
      coupond: '',
      cprice: ''
    }
  },
  created: function () {
    var that = this
    this.minurl = location.href
    this.minurls = this.minurl.split('#')
    // console.log(this.minurl[pos - 1])
    var pos = this.minurl.indexOf('#')
    if (this.minurl[pos - 1] !== '?') {
      location.href = this.minurls[0] + '?#' + this.minurls[1]
    }
    this.$router.name = this.$route.name
    if (this.$route.query.addid) {
      this.addid = this.$route.query.addid
    }
    request.get(this.$router, {
      goods_car_ids: this.$route.query.goods_car_id,
      addr_id: this.addid
    }, function (data) {
      if (data.code && data.code === 37) {
        // utils.toToast('没有收货地址')
        this.noaddtoast = true
        setTimeout(function () {
          that.$router.push({path: '/person/address/add?id1=markadd1&goods_car_id=' + that.$route.query.goods_car_id})
        }, 500)
      } else {
        this.ordercontent = data.rcv_info.msg
        this.order_info_stime = data.orders_info.send_time
        this.price_info = data.orders_info.price_info
        this.good_car_info = data.orders_info.goods_car_info
        this.totalmoney = data.orders_info.price_info[1].value
        this.coupontxt = data.orders_info.coupon
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
            this.coupond = data.msg.coupon_text
            this.txtsh = false
            this.price_info[2].value = data.msg.coupon_all_price
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
          agent_id: 1,
          coupon_id: this.coupon
        }, function (data) {
          this.item = data
          if (data.msg) {
            utils.toToast('data.msg')
          } else {
            if (typeof window.WeixinJSBridge === 'undefined') {
              if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
              } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
                document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
              }
            } else {
              this.onBridgeReady()
              this.state = true
            }
          }
        }.bind(this), function (err) {
          console.log(err)
          this.state = true
          utils.toToast('创建订单失败')
        }.bind(this))
      }
    },
    onBridgeReady: function () {
      window.WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          'appId': this.item.appid,     // 公众号名称，由商户传入
          'timeStamp': this.item.timestamp,         // 时间戳，自1970年以来的秒数
          'nonceStr': this.item.nonce_str, // 随机串
          'package': 'prepay_id=' + this.item.prepay_id,
          'signType': 'MD5',         // 微信签名方式
          'paySign': this.item.paySign // 微信签名
        },
        function (res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            utils.toToast('支付成功')
            this.$router.push({path: '/person/order/order?status=2'})
          } else {
            utils.toToast('支付失败')
            this.$router.push({path: '/person/order/order?status=1'})
          }    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠
        }.bind(this))
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
        bottom: 0.6666rem;
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
        width: 3.333333rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
        background-size: 100% 100%; 
    }
    #cbtn img
    {
      width: 3.08rem;
      height: 0.746667rem;
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
        width: 70%;
        height: 3.106667rem;
        background-color: #fff;
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%,-50%);
        border-radius: 3px;
        transition: 2s;
    }
    .discount-toast input{
        width: 87.5%;
        height: 0.786667rem;
        outline: none;
        border: 1px solid #ecedef;
        border-radius: 3px;
        font-size: 0.5rem;
        margin-top: 0.606667rem;
    }
    .discount-toast .discount-toast-confirm{
        width: 100%;
        position: absolute;
        bottom: 0;
        height: 1.093333rem;
        border-top: solid #ADADAD 1px;
    }
    .discount-toast .discount-toast-confirm .btn{
        display:inline-block; 
        cursor: pointer;
        float: left;
        width: 49%;
        margin-top: 0.106667rem;
        padding-top: 0.186667rem;
        height: 0.693333rem;
        font-size: .48rem;
        color: #31ab43;
        text-align: center;
    }
    .discount-toast .discount-toast-confirm #btn1
    {
      border-right: solid #ADADAD 1px;
      color: black;
    }
    .fade1-enter-active, .fade1-leave-active {
        transition: opacity .5s
    }
    .fade1-enter, .fade1-leave-to /* .fade-leave-active in <2.1.8 */ {
        opacity: 0
    }
    #noaddt
    {
      position: absolute;
      top: 23%;
      left: 25.733%;
    }
    #noaddt img
    {
      width: 4.853333rem;
      height: 3.12rem;
    }
    .coupontxt
    {
      color: black;
      display: block;
      height: 0.666667rem;
      z-index: 999;
      font-size: 0.346667rem;
      text-align: left;
    }
</style>
