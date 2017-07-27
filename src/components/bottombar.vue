<template>
  <div id="bottombar">
      <div class="line-bottom">
      <img src="../assets/line-bottom.png">
      </div>
      <div class="tab">
      <div class="tab-item home">
        <router-link to='/'><p>首页</p></router-link>
      </div>
      <div class="tab-item cart">
        <router-link to='/cart'><p>购物车</p></router-link>
      </div>
      <div class="tab-item info">
        <router-link to='/person'><p>个人中心</p></router-link>
      </div>
    </div>
  </div>    
</template>
<script>
</script>
<style scoped>
    .line-bottom{
    width: 100%;
    height: 0.093333rem;
    position: fixed;
    bottom: 1.493333rem;
  }
  .line-bottom img{
    width: 100%;
    height: 100%;
    vertical-align: top;
  }
  .tab{
    background-color: #fff;
    display: flex;
    width: 100%;
    height: 1.493333rem;
    line-height: 1.493333rem;
    position: fixed;
    bottom: 0;
  }
  .tab-item{
    flex: 1;
    text-align: center;
  }
  .tab-item.home a{
    background-image: url("../assets/home.png");
  }
  .tab-item.home a.router-link-exact-active{
    background-image: url("../assets/home-active.png");
  }
  .tab-item.cart a{
    background-image: url("../assets/cart.png");
  }
  .tab-item.cart a.router-link-exact-active{
    background-image: url("../assets/cart-active.png");
  }
  .tab-item.info a{
    background-image: url("../assets/info.png");
  }
  .tab-item.info a.router-link-exact-active{
    background-image: url("../assets/info-active.png");
  }
  .tab-item p{
    font-size: .24rem;
    font-family: "Microsoft YaHei UI";
    letter-spacing: 0;
    position: relative;
    top: 15px;
  }
  .tab-item a{
    display: block;
    color: #000;
    text-decoration: none;
    background-repeat: no-repeat;
    background-position: center 0.17333rem;
    background-size: .666667rem .666667rem;
  }
  .tab-item a.router-link-exact-active{
    color: #32ab42;
  }
</style>
