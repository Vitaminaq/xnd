<template lang="html">
    <div id="cart">
        <!--购物车-->
        <div class="cart-item">
        <scroller
          :on-refresh="refresh"
          :on-infinite="infinite"
          ref="my_scroller" style="height:15rem;margin-top: 1rem">           
          <ul>
            <li class="cart-item-wrap" v-for="(item,index) in goods">
              <div class="icon">
                <div class="choose-btn" @click.stop="selectItem(item)" :class="item.checked ? 'choose' : 'unchoose'"></div>
                <div class="icon-logo" @click="toDetail">
                  <div class="tag" :class="{presale: !item.state,offsale:item.state}" v-show="item.goods_info.status_text"></div>
                  <div class="tag1" v-show="item.goods_info.status_text"><p>{{item.goods_info.status_text}}</p></div>
                  <img :src="item.goods_info.goods_img">
                </div>  
              </div>
              <div class="content" @click="toDetail(item)">
                <h2 class="name">{{item.goods_info.title}}</h2>
                <p class="desc">{{item.goods_info.description}}</p>
                <p class="price-line"><span class="price"><span class="attach">&yen;</span>{{item.goods_info.price}}<span class="attach">/{{item.goods_info.unit}}</span></span><span class="old-price">&yen;{{item.goods_info.origin_price}}/{{item.unit}}</span></p>
                <div class="deliver-time"><p>{{item.goods_info.send_time}}{{item.goods_car_id}}</p></div>
              </div>
              <div class="amount">
                <span class="btn-minus" @click.stop="changeAmount(item,0)"></span>
                <input class="amount-num" type="number"  v-model="item.goods_num" @keyup="maxnum(item.goods_car_id)" @focus="hidit" @blur="changenumfast(item.goods_car_id)"></input>
                <span class="btn-plus" @click.stop="changeAmount(item,1)"></span>
              </div>      
            </li>
          </ul>
        </scroller>    
        </div>
        <div class="toPay" v-show="barhid">
          <div class="paycontent">
            <div class="chooseAll" @click="chooseAll" :class="selectAll ? 'select' : 'unselect'"></div>
            <div class="chooseAlltxt"><p>全选</p></div>
            <div class="pay-sum-wrap">
            <p><span class="pay-sum">合计：</span>&yen;{{totalMoney}}<span class="deliver">(不含运费)</span></p>
            </div>
            <div class="toPayBtn" @click="toCheck"></div>
          </div>
          
        </div>  
        <bottombar v-show="barhid"></bottombar>
    </div>    
</template>
<script>
import Vue from 'vue'
import utils from '../common/utils'
import VueScroller from 'vue-scroller'
import bottombar from '../components/bottombar'
import request from '../common/request'
export default {
  //  itemList => 购物车列表
  data () {
    return {
      selectAll: false,
      goods: [],
      good_car_id: '',
      good_car_id1: [],
      currentPage: 1,
      limit: 8,
      barhid: true
    }
  },
  components: {
    bottombar,
    VueScroller
  },
  created: function () {
    this.$router.name = this.$route.name
  },
  computed: {
    //  计算总金额
    totalMoney: function () {
      var total = 0
      this.goods.forEach(function (item, index) {
        if (item.checked) {
          total += item.goods_num * item.goods_info.price
        }
      })
      return total.toFixed(2)
    }
  },
  methods: {
    refresh: function (done) {
      this.currentPage = 1
      request.get(this.$router, {page: this.currentPage, limit: this.limit}, function (data) {
        this.currentPage ++
        this.goods = data
        done()
        utils.toToast('刷新成功')
      }.bind(this))
    },
    infinite: function (done) {
      var refreshData
      request.get(this.$router, {page: this.currentPage, limit: this.limit}, function (data) {
        this.currentPage++
        refreshData = data
        if (refreshData.length < this.limit) {
          this.goods = this.goods.concat(refreshData)
          done(true)
        } else {
          for (var i = refreshData.length - 1; i >= 0; i--) {
            this.goods.push(refreshData[i])
          }
          done()
        }
      }.bind(this))
    },
    //  进入商品详情页
    toDetail: function (item) {
      this.$router.push({path: '/detail', query: { goodsId: 1 }})
    },
    // 去结算
    toCheck: function () {
      if (this.good_car_id !== '') {
        this.$router.push({path: '/preorder?goods_car_id=' + this.good_car_id})
      }
    },
    //  选中购物车商品
    selectItem: function (item) {
      if (typeof item.checked === 'undefined') {
        Vue.set(item, 'checked', true)
        this.good_car_id = this.good_car_id + item.goods_car_id + ','
        this.good_car_id1 = this.good_car_id.split(',')
        if (this.good_car_id1.length === this.goods.length + 1) {
          this.selectAll = true
        }
      } else if (item.checked === false) {
        item.checked = true
        this.good_car_id = this.good_car_id + item.goods_car_id + ','
        this.good_car_id1 = this.good_car_id.split(',')
        if (this.good_car_id1.length === this.goods.length + 1) {
          this.selectAll = true
        }
      } else {
        item.checked = !item.checked
        if (this.selectAll === true) {
          this.selectAll = false
        }
        this.good_car_id1 = this.good_car_id.split(',')
        if (this.good_car_id1.length === 2) {
          this.good_car_id = ''
        } else {
          var reg = new RegExp(item.goods_car_id + ',', 'g')
          this.good_car_id = this.good_car_id.replace(reg, '')
        }
      }
      this.good_car_id1 = this.good_car_id.split(',')
      if (this.good_car_id1.length === this.goods.length + 1) {
        this.selectAll = true
        // this.good_car_id1.length = 0
      }
    },
    //  全选
    chooseAll: function () {
      this.selectAll = !this.selectAll
      this.good_car_id = ''
      this.goods.forEach((item, index) => {
        if (typeof item.checked === 'undefined') {
          Vue.set(item, 'checked', this.selectAll)
          this.good_car_id = this.good_car_id + item.goods_car_id + ','
        } else if (item.checked === false) {
          item.checked = true
          this.good_car_id = this.good_car_id + item.goods_car_id + ','
        } else if (item.checked === true) {
          this.good_car_id = this.good_car_id + item.goods_car_id + ','
        }
        if (this.selectAll === false) {
          item.checked = false
          this.good_car_id = ''
        }
      })
    },
    //  改变购物车数量
    changeAmount: function (item, type) {
      if (type) {
        console.log(item)
        if (item.goods_num < 999) {
          item.goods_num++
          request.put(this.$router, {rootName: 'updateCart', goods_car_id: item.goods_car_id, goods_num: item.goods_num})
        } else if (item.goods_num > 999) {
          item.goods = 999
          request.put(this.$route, {rootName: 'updateCart', goods_car_id: item.goods_car_id, goods_num: 999})
        }
      } else {
        if (item.goods_num > 1) {
          item.goods_num--
          request.put(this.$route, {rootName: 'updateCart', goods_car_id: item.goods_car_id, goods_num: item.goods_num})
        } else {
          request.patch(this.$route, {rootName: 'updateCart', goods_car_id: item.goods_car_id}, (data) => {
            console.log(data)
            if (!data.status) {
              this.refresh()
            }
          })
        }
      }
    },
    changenumfast: function (goodcarid) {
      // console.log(this.goods.length)
      this.barhid = true
      for (var i = 0; i < this.goods.length; i++) {
        if (this.goods[i].goods_car_id === goodcarid) {
          if (this.goods[i].goods_num > 0 && this.goods[i].goods_num < 1000) {
            request.put(this.$router, {rootName: 'updateCart', goods_car_id: this.goods[i].goods_car_id, goods_num: this.goods[i].goods_num})
          } else if (this.goods[i].goods_num === '') {
            this.goods[i].goods_num = 1
            request.put(this.$router, {rootName: 'updateCart', goods_car_id: this.goods[i].goods_car_id, goods_num: this.goods[i].goods_num})
          }
        }
      }
    },
    maxnum: function (goodcarId) {
      for (var i = 0; i < this.goods.length; i++) {
        if (this.goods[i].goods_car_id === goodcarId) {
          if ((/\d/g.test(this.goods[i].goods_num)) === true) {
            if (this.goods[i].goods_num > 999) {
              this.goods[i].goods_num = 999
            } else if (this.goods[i].goods_num === '0') {
              this.goods[i].goods_num = ''
            }
          } else {
            this.goods[i].goods_num = ''
          }
        }
      }
    },
    hidit: function () {
      this.barhid = false
    }
  }
}
</script>
<style scoped>
  @import "../common/mixin.css";
  #cart{
    margin-top: .983333rem;
  }
  .address{
    z-index: 200;
    background-color: #fff;
    padding: .413333rem .573333rem;
    height: 1rem;
    text-align: left;
    position: relative;
    border-bottom: .026667rem solid #ecedef; 
  }
  .address div{
    font-size: 0;
    letter-spacing: 0;
  }
  .address .address-name{
    font-size: .466666rem;
  }
  .address .address-tel{
    margin-left: .573333rem;
    font-size: .33333rem;
  }
  .address .address-text{
    font-size: .306666rem;
    margin-top: .213333rem
  }
  .address .right-arrow{
    position: absolute;
    right: .573333rem;
    top:.746667rem;
    width: .2rem;
    height: .333333rem;
  }
  .cart-item-wrap{
    padding: .4666rem 5.73%;
    width: 100%;
    height: 2.96rem;
    box-sizing: border-box;
    border-bottom: 1px solid #ecedef;
  }
  .cart-item-wrap *{
    margin: 0;
  }
  .icon{
    display: inline-block;
    float: left;
    height: 100%;
    width: 34.64%;
    margin-right: 2.666667%;
  }
  .icon .choose-btn{
    display: inline-block;
    float: left;
    width: .586667rem;
    height: .586667rem;
    margin-top: .746667rem;
    margin-right: 9.11%;
    background-size: 100% 100%;
    
    background-repeat: no-repeat
  }
  .icon .choose{
    background-image: url("../assets/cart/choose.png");
  }
  .icon .unchoose{
    background-image: url("../assets/cart/unchoose.png");
  }
  .icon .icon-logo{
    position: relative;
    display: inline-block;
    float: left;
    width: 71.72%;
    height: 2.06666rem;
  }
  .icon-logo .presale{
    display: table;
    position: absolute;
    top: -.186667rem;
    left:-.186667rem;
    width: .82666rem;
    height: .82666rem;
    background-image: url("../assets/cart/presale.png");
    background-size: 100% 100%;
  }
  .icon-logo .offsale{
    display: table;
    position: absolute;
    top: -.186667rem;
    left:-.186667rem;
    width: .82666rem;
    height: .82666rem;
    background-image: url("../assets/cart/offsale.png");
    background-size: 100% 100%;
  }
 .icon-logo .tag1
    {
        display: table;
        position: absolute;
        top: -0.3rem;
        left: -0.27rem;
        width: 1rem;
        height: 1rem;
        z-index:101;
    }
  .icon-logo .tag1 p{
      color: white;
      display: table-cell;
      vertical-align: middle;
      font-size: 0.1rem;
      letter-spacing: 0;
  }
  .icon-logo img{
    width: 100%;
    height: 100%;
  }
  .content{
    display: inline-block;
    float: left;
    height: 100%;
    width: 34.59%;
    padding-right: 2.9333%;
    letter-spacing: 0;
    font-size: 0;
    border-right: .026667rem solid #32ab42;
  }
  .content .name{
    font-size: .493333rem;
    margin-bottom: .16rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .content .desc{
    font-size: .28rem;
    color: rgba(0,0,0,0.6);
    margin-bottom: .293333rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .content .price-line{
    margin-bottom: .106667rem
  }
  .content .price{
    font-size: .36rem;
    font-weight: bold;
    color: #32ab42;
  }
  .content .old-price{
    font-size: .28px;
    text-decoration: line-through;
  }
  .content .price .attach{
    font-size: .293333rem;
  }
  .content .deliver-time{
    height: 0.4rem;
    width: 100%;
  }
  .content .deliver-time p
  {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: .25333rem;
  }
  .amount{
    display: inline-block;
    float: left;
    width: 21.1%;
    margin-left: 3.3333%;
    margin-top: .773333rem
  }
  .amount span,.amount input{
    display: inline-block;
    float: left;
  }
  .amount .amount-num{
    width: .746667rem;
    font-size: .4rem;
    font-weight: bold;
    margin-left: .026667rem;
    margin-right: .026667rem;
    margin-top: .07rem;
    outline: none;
    text-align: center
  }
  .btn-minus{
    display: block;
    width: .533333rem;
    height: .533333rem;
    background-image: url("../assets/cart/tag-minus.png");
    background-size: 100% 100%;
  }
  .btn-plus{
    display: block;
    width: .533333rem;
    height: .533333rem;
    background-image: url("../assets/cart/tag-plus.png");
    background-size: 100% 100%;
  }
  .toPay{
    background-color: #fff;
    position: fixed;
    bottom: 1.58666rem;
    width: 99%;
    height: 1.213333rem;
    letter-spacing: 0;
    font-size: 0;
    border-top: 1px solid #ecedef;
  }
  .paycontent
  {
    position: relative;
    width: 100%;
    height: 1.213333rem;
  }
  .toPay .chooseAll{
    position: absolute;
    top: 0.306667rem;
    left: 0.573333rem;
    width: 0.586667rem;
    height: 0.586667rem;
    background-size: cover;
  }
 .toPay .select{
    background-image: url("../assets/cart/choose.png");
  }
 .toPay .unselect{
    background-image: url("../assets/cart/unchoose.png");
  }
  .chooseAlltxt{
    position: absolute;
    top: 0.453333rem;
    left: 1.2rem;
    width: 1.066667rem;
    font-size: .293333rem;
  }
  .pay-sum-wrap{
    position: absolute;
    left: 2rem;
    top: 0;
    width: 49.3333%;
  }
  .pay-sum-wrap p{
    font-size: .346667rem;
    margin-left: 4.53333%;
    margin-top: .453333rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pay-sum-wrap .pay-sum{
    font-weight: bold;
  }
  .pay-sum-wrap .deliver{
    font-size: .28rem;
  }
  .toPayBtn{
    float: right;
    margin-top: .253333rem;
    margin-right: 5.73333%;
    background-image: url("../assets/cart/topay.png");
    background-size: 100% 100%;
    width: 24.93333%;
    height:.706666rem;
  }
</style>
