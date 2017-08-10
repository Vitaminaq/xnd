<template lang="html">
    <div id="home">
    <headerbar></headerbar>
      <scroller
        :on-refresh="refresh"
        :on-infinite="infinite"
        ref="my_scroller" style="height:15rem;margin-top: 1rem"> 
      <ul>
        <li class="goods-item" v-for="(item,index) in goods" @click="toItem(index)">
          <div class="icon">
            <div class="tag" v-show="item.category.name"></div>
            <div class="tag2" v-show="item.category.name"><div class="tag1"><span>{{item.category.name}}</span></div></div>
            <div class="sale-time" v-show="item.start_time > currentTime"><p>{{item.start_time | formatTime}}出售</p></div>
            <img :src="item.goods_img" >
          </div>
          <div class="content">
            <div class="titlediv"><h2 class="indexname">{{item.title}}</h2></div>
            <p class="desc">{{item.description}}</p>
            <p class="old-price"><span class="old-attach">&yen;</span>{{item.origin_price}}<span class="old-attach">/{{item.unit}}</span>
            
            </p>
            <p class="price"><span class="attach">&yen;</span>{{item.price}}<span class="attach">/{{item.unit}}</span></p>
            <a class="toCart" :class="item.start_time < currentTime && item.end_time > currentTime ? 'onsale' : 'unsale'"></a>
          </div>
        </li>
      </ul>
      </scroller>      
      <bottombar></bottombar>
      <!--回到顶部-->
      <div class="toTop" @click="toTop"></div>
    </div> 
</template>
<script>
    import utils from '../common/utils'
    import VueScroller from 'vue-scroller'
    import bottombar from '../components/bottombar'
    import headerbar from '../components/headerbar'
    import Toast from 'vue-easy-toast'
    import request from '@/common/request'
    export default{
      name: 'home',
      components: {
        VueScroller,
        bottombar,
        Toast,
        headerbar
      },
      // goods => 商品列表 currentPage => 当前分页
      data: function () {
        return {
          goods: [],
          goodsId: 0,
          currentTime: 0,
          currentPage: 1,
          limit: 8,
          item1: [],
          minurl1: '',
          minurls1: []
        }
      },
      created: function () {
        this.$router.name = this.$route.name
        let d = new Date()
        this.currentTime = Math.floor(d.getTime() / 1000)
      },
      methods: {
        toTop () {
          VueScroller.scrollTo(0, 0)
        },
        toItem (index) {
          var goodsId = this.goods[index].id
          this.goodsId = goodsId
          this.$router.push({path: '/detail', query: { goodsId: goodsId }})
        },
        refresh: function (done) {
          this.currentPage = 1
          request.get(this.$router, {page: this.currentPage, limit: this.limit}, function (data) {
            this.currentPage++
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
        }
      },
      filters: {
        formatTime: function (time) {
          // console.log(utils.formatDate(time))
          return utils.formatDate(time)
        }
      }
    }
</script>
<style scoped>
  @import "../common/mixin.css";
  #home{
    margin-top: 1.19rem;
    margin-bottom: 1.89rem;
  }
  .goods-item{
    width: 100%;
    height: 4.49rem;
    border-bottom: 1px solid #c0d4d5;
  }
  .icon{
  
    float: left;
    position: relative;
    width: 59.3%;
    height: 3.93rem;
    margin:0.28rem 4.26666% 0.28rem 5.6% ;
  }
  .icon img{
    width: 100%;
    height: 100%;
  }
  .icon .tag{
    position: absolute;
    top: -0.133rem;
    left: -0.226rem;
    width: 1.21rem;
    height: 1.21rem;
    background-image: url("../assets/tag.png");
    background-size: cover;
    color: #fff;
  }
  .icon .tag2
  {
    position: absolute;
    top: 0.1rem;
    left: 0;
    margin: 0 auto;
    display: table;
    height: 0.8rem;
    width: 0.8rem;
  }
  .icon .tag1
  {
    display: table-cell;
    height: 0.8rem;
    width: 0.8rem;
    font-size: 0.38rem;
    color: white;
    vertical-align: middle;
  }

  .icon .sale-time{
    width: 5.25rem;
    height: 0.533rem;
    position: absolute;
    right: 0.12rem;
    bottom: 0.346rem;
    background-image: url("../assets/sale-time.png");
    background-size: 100% 100%;
    color: #fff;
  }
  .icon .sale-time p{
    font-size: 0.32rem;
    line-height: 0.533rem;
  }
  .content{
    position: relative;
    width: 29%;
    height: 3.93rem;
    margin-top: .28rem;
    display: inline-block;
    float: left;
    font-size: 0;
  }
  .content .titlediv{
    display: table;
    height: 1.2rem;
    width: 2.666667rem;
    margin: 0.133333rem 0 0.266667rem 0； 
   }
  .content .indexname{

    display: table-cell;
    vertical-align:middle;
    /*-webkit-box-orient: vertical;
    -webkit-line-clamp: 2;*/
    overflow: hidden;
    font-size: 0.48rem;
    line-height: 0.62rem;
    color: #000;
  }
  .content .desc{
    font-size: 0.32rem;
    color: rgba(0,0,0,0.6);
    padding-top: 0.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .old-price{
    font-size: 0.35rem;
    color: rgba(0,0,0,0.6);
    padding-top: 0.346667rem;
    text-decoration: line-through;
    height: auto;
    z-index: 300;
  }
  .price{
    padding-top: 0.133333rem;
    font-size: 0.46rem;
    font-weight: bold;
    color: #32ab42;
  }
  .price .attach{
    font-size: 0.32rem;
    color: #32ab42;
  }
  .toCart{
    display: block;
    margin: 0 auto;
    position: absolute;
    left: 50%;
    bottom: 2px;
    transform: translate(-50%,0);
    height: 0.64rem;
    /*background-size: 100% 100%;*/
  }
  .toCart.onsale{
    width: 2.453333rem;
    background: url("../assets/addcar.png") no-repeat ;
    background-size: 2.453333rem 0.64rem;
  }
  .toCart.unsale{
    width: 73.2%;
    background: url("../assets/unsale.png") no-repeat ;
    background-size: 100% 100%;
  }
  .loadmore{
    height: .426667rem;
    line-height: .426667rem;
    font-size: .32rem;
  }
  .toTop{
    display: none;
    background-color: #000;
    width: 1.066667rem;
    height: 1.066667rem;
    position: fixed;
    bottom: 2rem;
    right: .266667rem;
  }
</style>
