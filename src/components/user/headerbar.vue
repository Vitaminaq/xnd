<template>
  <div class="headerbar">
    <div class="header">
      <img src="../assets/logo-right.png">
    </div>
    <div class="line-top"></div> 
  </div>     
</template>

<style>
  @import "../common/mixin.css";  
  .header{
    position: fixed;
    top: 0;
    width: 100%;
    height: .96rem;
    z-index: 300;
    background-color: #fff;
    background-image: url("../assets/logo.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 107.5px 27px;
  }
  .header img{
    float: right;
    height: 100%;
  }
  .line-top{
    position: fixed;
    top: .98rem;
    width: 100%;
    height: 0.023333rem;
    background: url("../assets/line-top.png");
    z-index: 300
  }    
</style>
