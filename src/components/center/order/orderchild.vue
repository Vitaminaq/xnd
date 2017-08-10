<template>
<div>
 
   <div class="licut">
  	   
   </div>

   <div class="content">
    <img id="selected1" v-show="this.actives1" src="../../../../static/order/selected.png">
    <img id="selected2" v-show="this.actives2" src="../../../../static/order/selected.png">
    <img id="selected3" v-show="this.actives3" src="../../../../static/order/selected.png">
    <img id="selected4" v-show="this.actives0" src="../../../../static/order/selected.png">
     <div v-if="this.hidshow" class="mes">
     	{{this.mes}}
     </div>
     <div v-else="!this.hidshow" class="manymes">
      <scroller
      :on-refresh="refresh"
      :on-infinite="infinite" class="scroller"  ref="my_scroller" :class="mergewillpay ? 'scroller1' : 'scroller2'">
     	<ul :class="mergewillpay ? 'ul1' : 'ul2'">
     		<li v-for="item in items">
     			<div class="detail" @click="tologistic(item.order_info.order_id)">
     				<div class="didangid"><span>订单号</span><span>：</span><span>{{item.order_info.order_num}}</span></div>
     				<div><span>下单时间</span><span>：</span><span>{{item.order_info.created_at}}</span></div>
     			</div>
     			
                <div class="gooddetail">
                	
                		    <div class="licut">
  	   
                        </div>
                        <div v-show="hidchoose" class="chooseit" @click="selectItem(item)" :class="item.checked1 ? 'choose' : 'unchoose'"></div>
                			<div class="good" :class="mergewillpay ? 'good1' : 'good2'" @click.stop="togooddetail(item.goods_info.goods_id)">
                				<div class="goodlist"><img :src="item.goods_info.goods_img"></div>
                				<div class="goodlist goodtxt"><div class="goodtxt1">{{item.goods_info.name}}</div><div class="goodtxt2">{{item.goods_info.goods_desc}}</div></div>
                				<div class="goodnum" :class="mergewillpay ? 'goodnum1' : 'goodnum2'">X{{item.goods_info.num}}({{item.goods_info.unit}})</div>
                				<div class="goodmoney">{{item.goods_info.value}}</div>
                				<img class="togooddetail" src="../../../assets/personcenter/arrow.png">
                			</div>
                	
                </div>
                <div class="fine" :class="mergewillpay ? 'fine1' : 'fine2'" v-for="price in item.price_info"><div class="finetxt">{{price.text}}</div><div class="finemoney">{{price.value}}</div>
                 
                </div>
                <div class="licut">
       
                 </div>
                <!-- <div class="goodtotal">
                   <div class="totalnum"><span class="totaltxt">{{item.summary.goods_count}}</span></div>
                   <div class="totalmoney"><span class="totaltxt">{{item.summary.price_count}}</span><span class="totaltxt1">{{item.summary.send_price_count}}</span></div>
                </div> -->
                 <div class="licut">
  	   
                </div>
                <div class="buttons">
                  <img @click.stop="clicked(button.click,item.order_info.order_id)" class="buttonsimg" v-for="button in item.other_info.buttons" v-if="button.state" :src="button.img_url" > 
                </div>
                   
                    <div class="givetime" v-for="texts in item.other_info.texts" v-if="texts.state">
                	   <div class="timetxt"><span>{{texts.name}}</span></div>
                	   <div class="timenum"><span>{{texts.value}}</span></div>
                    </div>
                
                <div class="bigcut">
  	   
                </div>
     		</li>
     	</ul>
      </scroller>
     </div>

   </div>
   <transition name="fade2">
      <div id="noaddt2" v-show="noaddtoast2">
        <img src="../../../assets/got.png">
      </div>    
    </transition>
    <div id="mergecontent" v-show="mergewillpay" ref="a">
      <div class="bigcut">
       
                </div>
      <div id="mergetxt">
        <span id="mergenum">共{{totalNum}}件商品</span>
        <span id="mergemoney">合计：&yen;{{totalMoney}}</span><span id="mergerdeliver">(含运费￥0.00)</span>
      </div>
      <div class="licut">
       </div>
      <div id="mergeimg" @click="mergepay">
        <img src="../../../assets/merge.png">
      </div>
    </div>
   <bottombar></bottombar>
 </div>
</template>
<script>
import bottombar from '../../../components/bottombar'
import request from '../../../common/request'
import utils from '../../../common/utils'
import VueScroller from 'vue-scroller'
import Vue from 'vue'
export default {
  name: 'orderchild',
  components: {
    bottombar,
    VueScroller
  },
  watch: {
    status1: function (newval, oldval) {
      this.currentPage1 = 1
      this.getdatas()
    },
    statuss: function (newval, oldval) {
      this.status1 = this.statuss
    }
  },
  props: ['statuss', 'currentPage'],
  data: function () {
    return {
      hidshow: true,
      status1: '',
      mes: '',
      items: [],
      actives0: null,
      actives1: null,
      actives2: null,
      actives3: null,
      currentPage1: '',
      limit: 4,
      minurl: '',
      minurls: [],
      item2: [],
      item3: [],
      noaddtoast2: false,
      orderids: '',
      orderids1: [],
      mestate: true,
      mergewillpay: null,
      hidchoose: null
    }
  },
  created: function () {
    this.minurl = location.href
    this.minurls = this.minurl.split('#')
    // console.log(this.minurl[pos - 1])
    var pos = this.minurl.indexOf('#')
    if (this.minurl[pos - 1] !== '?') {
      location.href = this.minurls[0] + '?#' + this.minurls[1]
    }
    this.minurl = this.minurls[0]
    // console.log(this.minurl)
    this.$router.name = this.$route.name
    this.currentPage1 = this.currentPage
    // this.getdatas()
    if (this.statuss !== '') {
      this.status1 = this.statuss
    } else {
      this.status1 = this.$route.query.status
    }
  },
  computed: {
    //  计算总金额
    totalMoney: function () {
      var total = 0
      this.items.forEach(function (item, index) {
        if (item.checked1) {
          var value = item.goods_info.value.split('￥')
          var val = value[1]
          total += parseInt(item.goods_info.num) * val
        }
      })
      return total.toFixed(2)
    },
    totalNum: function () {
      var total = 0
      this.items.forEach(function (item, index) {
        if (item.checked1) {
          total += item.goods_info.num
        }
      })
      return total
    }
  },
  methods: {
    getdatas: function () {
      this.currentPage1 = 1
      request.get(this.$router, {
        rootName: 'order',
        status: this.status1,
        page: this.currentPage1,
        limit: this.limit}, function (data) {
          this.actives0 = data.actives[0].actived
          this.actives1 = data.actives[1].actived
          this.actives2 = data.actives[2].actived
          this.actives3 = data.actives[3].actived
          this.mes = data.msg
          if (data.num === 0) {
            this.hidshow = true
            this.mergewillpay = false
            this.hidchoose = false
          } else {
            this.hidshow = false
            if (this.status1 === 1 || this.status1 === '1') {
              this.mergewillpay = true
              this.hidchoose = true
            } else {
              this.mergewillpay = false
              this.hidchoose = false
            }
            this.items = data.items
          }
          if (data.items.length < this.limit) {
            this.currentPage1 = 1
          } else {
            this.currentPage1++
          }
        }.bind(this))
    },
    refresh: function (done) {
      this.currentPage1 = 1
      request.get(this.$router, {rootName: 'order', status: this.status1, page: this.currentPage1, limit: this.limit}, function (data) {
        this.actives0 = data.actives[0].actived
        this.actives1 = data.actives[1].actived
        this.actives2 = data.actives[2].actived
        this.actives3 = data.actives[3].actived
        this.mes = data.msg
        if (data.num === 0) {
          this.hidshow = true
          this.mergewillpay = false
          this.hidchoose = false
        } else {
          this.hidshow = false
          this.items = data.items
          if (this.status1 === 1 || this.status1 === '1') {
            this.mergewillpay = true
            this.hidchoose = true
          } else {
            this.mergewillpay = false
            this.hidchoose = false
          }
        }
        this.currentPage1 ++
        done()
        utils.toToast('刷新成功')
      }.bind(this))
    },
    infinite: function (done) {
      if (this.currentPage1 > 1) {
        var refreshData
        request.get(this.$router, {rootName: 'order', status: this.status1, page: this.currentPage1, limit: this.limit}, function (data) {
          refreshData = data.items
          if (refreshData.length < this.limit) {
            this.currentPage1 = 1
            this.items = this.items.concat(refreshData)
            done(true)
          } else {
            this.currentPage1++
            for (var i = refreshData.length - 1; i >= 0; i--) {
              this.items.push(refreshData[i])
            }
            done()
          }
        }.bind(this))
      } else {
        done(true)
      }
    },
    clicked: function (num, orderid) {
      for (var i = 0; i < this.items.length; i++) {
        if (typeof this.items[i].checked === 'undefined') {
          Vue.set(this.items[i], 'checked', true)
        }
      }
      switch (num) {
        case 1:
          this.cancel(orderid)
          break
        case 2:
          this.paynow(orderid)
          break
        case 3:
          this.got(orderid)
          break
        case 4:
          this.logistic(orderid)
          break
        case 5:
          this.link()
          break
        case 6:
          this.delorder(orderid)
          break
      }
    },
    cancel: function (orderid) {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].order_info.order_id === orderid && this.items[i].checked === true) {
          console.log(this.items[i].checked)
          this.items[i].checked = false
          request.put(this.$router, {
            rootName: 'cancelorder',
            order_id: orderid}, function (data) {
              for (var i = this.items.length - 1; i >= 0; i--) {
                if (this.items[i].order_info.order_id === orderid) {
                  this.items.splice(i, 1)
                }
              }
              for (var j = 0; j < this.items.length; j++) {
                if (this.items[j].order_info.order_id === orderid) {
                  this.items[j].checked = true
                }
              }
              utils.toToast('取消成功')
            }.bind(this), function (err) {
              console.log(err)
              for (var j = 0; j < this.items.length; j++) {
                if (this.items[j].order_info.order_id === orderid) {
                  this.items[j].checked = true
                }
              }
              utils.toToast('取消失败')
            })
        }
      }
    },
    paynow: function (orderid) {
      var that = this
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].order_info.order_id === orderid && this.items[i].checked === true) {
          this.items[i].checked = false
          request.get(this.$router, {
            order_ids: orderid + ',',
            pay_id: 4,
            rootName: 'paying'
          }, function (data) {
            // console.log(data)
            that.item2 = data
            if (typeof window.WeixinJSBridge === 'undefined') {
              if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
              } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
                document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
              }
            } else {
              this.onBridgeReady(that.item2)
              for (var j = 0; j < this.items.length; j++) {
                if (this.items[j].order_info.order_id === orderid) {
                  this.items[j].checked = true
                }
              }
            }
          }.bind(this))
        }
      }
    },
    onBridgeReady: function (obj) {
      window.WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            'appId': obj.appid,     // 公众号名称，由商户传入
            'timeStamp': obj.timestamp,         // 时间戳，自1970年以来的秒数
            'nonceStr': obj.nonce_str, // 随机串
            'package': 'prepay_id=' + obj.prepay_id,
            'signType': 'MD5',         // 微信签名方式
            'paySign': obj.paySign // 微信签名
          },
        function (res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            utils.toToast('支付成功')
            this.$router.push({path: '/person/order/order?status=2'})
          } else {
            utils.toToast('支付失败')
          }    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠
        }.bind(this))
    },
    got: function (orderid) {
      var that = this
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].order_info.order_id === orderid && this.items[i].checked === true) {
          this.items[i].checked = false
          request.put(this.$router, {
            rootName: 'got',
            order_id: orderid}, function (data) {
              for (var i = this.items.length - 1; i >= 0; i--) {
                if (this.items[i].order_info.order_id === orderid) {
                  this.items.splice(i, 1)
                }
              }
              for (var j = 0; j < this.items.length; j++) {
                if (this.items[j].order_info.order_id === orderid) {
                  this.items[j].checked = true
                }
              }
              // utils.toToast('确认收货成功')
              this.noaddtoast2 = true
              setTimeout(function () {
                that.noaddtoast2 = false
              }, 1000)
            }.bind(this), function (err) {
              console.log(err)
              for (var j = 0; j < this.items.length; j++) {
                if (this.items[j].order_info.order_id === orderid) {
                  this.items[j].checked = true
                }
              }
              utils.toToast('确认收货失败')
            }.bind(this))
        }
      }
    },
    logistic: function (orderid) {
      this.tologistic(orderid)
    },
    link: function () {
      window.location.href = 'tel:17508404755'
    },
    delorder: function (orderid) {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].order_info.order_id === orderid && this.items[i].checked === true) {
          this.items[i].checked = false
          request.patch(this.$router, {
            rootName: 'delorder',
            order_id: orderid}, function (data) {
              console.log(data)
              // console.log(this.items)
              for (var i = this.items.length - 1; i >= 0; i--) {
                if (this.items[i].order_info.order_id === orderid) {
                  this.items.splice(i, 1)
                }
              }
              for (var j = 0; j < this.items.length; j++) {
                if (this.items[j].order_info.order_id === orderid) {
                  this.items[j].checked = true
                }
              }
              utils.toToast('删除成功')
            }.bind(this), function (err) {
              console.log(err)
              for (var j = 0; j < this.items.length; j++) {
                if (this.items[j].order_info.order_id === orderid) {
                  this.items[j].checked = true
                }
              }
              utils.toToast('删除失败')
            })
        }
      }
    },
    togooddetail: function (goodid) {
      this.$router.push({path: '/detail?goodsId=' + goodid})
    },
    tologistic: function (orderid) {
      this.$router.push({path: '/person/order/logistic?order_id=' + orderid})
    },
    //  选中购物车商品
    selectItem: function (item) {
      if (typeof item.checked1 === 'undefined') {
        Vue.set(item, 'checked1', true)
        this.orderids = this.orderids + item.order_info.order_id + ','
      } else if (item.checked1 === false) {
        item.checked1 = true
        this.orderids = this.orderids + item.order_info.order_id + ','
      } else {
        item.checked1 = !item.checked1
        this.orderids1 = this.orderids.split(',')
        if (this.orderids1.length === 2) {
          this.orderids = ''
        } else {
          var reg = new RegExp(item.order_info.order_id + ',', 'g')
          this.orderids = this.orderids.replace(reg, '')
        }
      }
      // console.log(this.orderids)
    },
    mergepay: function () {
      var that = this
      if (this.mestate === true && this.orderids) {
        this.mestate = false
        request.get(this.$router, {
          order_ids: this.orderids,
          pay_id: 4,
          rootName: 'paying'
        }, function (data) {
          // console.log(data)
          that.item3 = data
          if (typeof window.WeixinJSBridge === 'undefined') {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
              document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
            }
          } else {
            this.onBridgeReady(that.item3)
            this.mestate = true
          }
        }.bind(this))
      }
    }
  }
}
</script>
<style>
*{
	padding: 0;
	margin: 0;
}
.scroller1
{
  height:11rem;
}
.scroller2
{
  height:15rem;
}
#toggle
{
  margin-top: 0.973333rem;
  height: 1.24rem;
  width:100%;
  position: relative;
}
#back
{
  width:1.2rem;
  height: 1.24rem;
  position: absolute;
  top: -0.1rem;
}
.arrowwh
{
  width: 0.2rem;
  height: 0.333333rem;
}
#dingdanlist
{
  padding-left: 1.366667rem;
    padding-top:0.426667rem; 
}
#dingdanlist li
{
  list-style: none;
  float: left;
  font-size: 0.4rem;
  color: black;
}
ul .right
{
  padding-right: 0.946667rem;
}
.content
{
	width:100%;
	height: 14rem;
	overflow-y: auto;
	position: relative;
}
#selected1
{
	width: 1.253333rem;
	height: 0.04rem;
	position: absolute;
	top: 0;
	left: 1.3rem;
	z-index: 999;
}
#selected2
{
	width: 1.253333rem;
	height: 0.04rem;
	position: absolute;
	top: 0;
	left: 3.5rem;
	z-index: 999;
}
#selected3
{
	width: 1.253333rem;
	height: 0.04rem;
	position: absolute;
	top: 0;
	left: 5.6rem;
	z-index: 999;
}
#selected4
{
	width: 1.6rem;
	height: 0.04rem;
	position: absolute;
	top: 0;
	left: 7.8rem;
	z-index: 999;
}
.mes
{
	padding-top:3.346667rem; 
	height:1.333333rem;
	width:5.333333rem;
	margin: 0 auto;
	font-size: 0.413333rem;
}
.manymes
{
  width:100%;
	height: 13.9rem;
  padding-top: 0.04rem;
  margin-top: 0.04rem;
	overflow-y: auto;
}
.detail
{
	width: 80%;
	height:1.173333rem;
	text-align: left;
	margin-top: 0.32rem;
	margin-left: 0.573333rem;
	font-size: 0.32rem;
	color: #ADADAD;
}
.didangid
{
	margin-bottom: 0.186667rem;
}
.licut
{
  width: 100%;
  height: 0.04rem;
  background: url(../../../assets/licut.png);
}
.good
{
    padding-top: 0.253333rem;
    height: 1.266667rem;
    position: relative;
}
.good1
{
    margin-left: 1.38rem;
}
.good2
{
  margin-left: 0.573333rem;
}
.good .goodlist
{
	float: left;
}
.goodtxt
{
	text-align: left;
	margin-left: 0.2rem;
	margin-top: 0.04rem;
}
.goodtxt1,.goodtxt2
{
	width: 2.666667rem;
	white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.goodtxt1
{
  padding-top: 0.066667rem;
	height: 0.413333rem;
    font-size: 0.413333rem;
}
.goodtxt2
{
	font-size: 0.32rem;
	height: 0.32rem;
	color: #ADADAD;
	margin-top: 0.226667rem;
}
.goodlist img
{
	width: 1.026667rem;
	height: 1.026667rem;
}
.goodnum
{
	font-size: 0.36rem;
	position: absolute;
	bottom: 0.586667rem;
}
.goodnum1
{
  right:3.0rem;
}
.goodnum2
{
  right:3.8rem;
}
.goodmoney
{
	font-size: 0.36rem;
	position: absolute;
	bottom: 0.586667rem;
	right:1.08rem;
}
.togooddetail
{
	position: absolute;
	bottom: 0.586667rem;
	right:0.573333rem;
	width:0.2rem;
	height: 0.333333rem;
}
.fine
{
	height:0.586667rem;
	padding-top: 0.16rem;
	font-size: 0.32rem;
}
.fine1
{
  width: 86%;
  padding-left: 1.38rem;
}
.fine2
{
  width: 95%;
  padding-left: 0.573333rem;
}
.fine2 .finemoney
{
  margin-left: 7rem;
}
.fine div
{
	float: left;
}
.finetxt
{
  padding-top: 0.16px;
  height: 0.4rem;
}
.fine1 .finemoney
{
	margin-left: 6.2rem;
}
.goodtotal
{
	width: 100%;
	height: 0.813333rem;
	position: relative;
}
.totalnum
{
	position: absolute;
	height: 0.813333rem;
	left: 0.573333rem;
	top: -0.333333rem;
}
.totalmoney
{
	position: absolute;
	height: 0.813333rem;
	right: 0.573333rem;
	top: -0.333333rem;
}
.goodtotal .totaltxt
{
	font-size: 0.4rem;
}
.goodtotal .totaltxt1
{
	font-size: 0.333333rem;
}
.goodbutton
{
	height: 0.973333rem;
	width: 100%;
	position: relative;
}
.goodbutton img
{
	width: 2.173333rem;
	height: 0.626667rem;
	position: absolute;
	top:0.173333rem;
}
.buttonpay
{
	right: 3.226667rem;
}
.buttoncancel
{
	right: 0.573333rem;
}
.bigcut
{
  width: 100%;
  height: 0.24rem;
  background: url(../../../../static/willpay/bigcut.png);
}
.givetime
{
	width: 100%;
	height: 0.973333rem;
	font-size: 0.413333rem;
	position: relative;
}
.givetime div
{
	position: absolute;
	top:0.28rem;
}
.givetime .timetxt
{
	left: 0.573333rem;
}
.givetime .timenum
{
	right: 0.573333rem;
}
.buttons
{
  text-align: right;
}
.buttonsimg
{ 
  width: 2.173333rem;
  height: 0.626667rem;
  padding-right: 0.573333rem;
}
.fade2-enter-active, .fade2-leave-active {
  transition: opacity .5s
}
.fade2-enter, .fade2-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
#noaddt2
{
  position: absolute;
  top: 23%;
  left: 25.733%;
}
#noaddt2 img
{
  width: 4.853333rem;
  height: 3.12rem;
}
.gooddetail
{
  position: relative;
}
.choose{
  background-image: url("../../../assets/cart/choose.png");
}
.unchoose{
  background-image: url("../../../assets/cart/unchoose.png");
}
.chooseit
{
  position: absolute;
  top: 35%;
  left: 0.573333rem;
  width: 0.533333rem;
  height: 0.533333rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index:999;
}
#mergecontent
{
  position: fixed;
  bottom: 1.6222rem;
  font-size: 0.4rem;
  background-color: white; 
  width: 100%;
}
#mergetxt
{
  width: 100%;
  height: 0.813333rem;
}
#mergetxt span
{
  margin:0;
  float: left;
}
#mergenum
{
  padding-top: 0.213333rem;
  width: 30%;
}
#mergemoney
{
  padding-top: 0.213333rem;
  width: 42%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#mergeimg
{
  height: 0.986667rem;
}
#mergecontent img
{
  width: 2.24rem;
  height: 0.64rem;
  float: right;
  margin-right: 0.573333rem;
  padding-top: 0.173333rem;
}
#mergerdeliver
{
  padding-top: 0.253333rem;
  font-size: 0.333333rem;
}
.ul1
{
  margin-bottom: 1.2rem;
}
</style>
