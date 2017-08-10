<template>
    <div id="main">
    <headerbar></headerbar>
    	<div id="back2" @click="back">
           <img class="arrowwh" src="../../../assets/back.png">
           <span>我的地址</span>
      </div>
        <div class="licut">
  	   
        </div>
        <div id="content">
            <div class="addlist">
                <label>收货人</label><input type="text"  name="" v-model="name" />
            </div>
           <div class="licut">
       
            </div>
            <div class="addlist">
               <label>联系电话</label><input type="text"  @keyup="isphone" name="" v-model="phone"/>
            </div>
           <div class="licut">
       
           </div>
           <div class="addlist" @click="show = true">
               <label>所在地区</label><div id="makeoveradd" v-if="result"><span>{{result.province.name}}{{result.city.name}}{{result.area.name}}</span></div>

              <img class="arrowwh" id="toarrow" src="../../../assets/personcenter/arrow.png">
           </div>
           <div class="licut">
       
           </div>
           <div id="txtarea">
            <textarea id="ta" placeholder="请填写详细地址，如街道、楼牌号等" @focus="fontcolor" v-model="detail"></textarea>
           </div>
           <div class="licut">
       
           </div>
           <vue-area :props-show="show" :props-result="result" v-on:result="areaResult"></vue-area>
           <div id="save" @click.stop="save" v-show="hidshow">
             <div id="savecontent" >
                <span>保存</span>
             </div>
          </div>
        </div>
       <bottombar v-show="hidshow"></bottombar> 
    </div>
	
</template>
<script>
import vueArea from 'vue-area'
import utils from '../../../common/utils'
import request from '../../../common/request'
import bottombar from '../../../components/bottombar'
import headerbar from '../../../components/headerbar'
export default {
  name: 'add',
  components: {
    vueArea,
    bottombar,
    headerbar
  },
  data: function () {
    return {
      result: null,
      show: false,
      name: '',
      phone: '',
      detail: '',
      sex: 0,
      state: true,
      hidshow: true,
      screenHeight: '',
      screenHeight1: ''
    }
  },
  watch: {
    screenHeight: function (newval, oldval) {
      if (newval < this.screenHeight1) {
        this.hidshow = false
      } else {
        this.hidshow = true
      }
    }
  },
  created: function () {
    this.$router.name = this.$route.name
    if (this.detail.length > 0) {
      document.getElementById('ta').style.color = 'black'
    }
    // offsetTop
  },
  mounted: function () {
    this.screenHeight1 = document.documentElement.clientHeight
    const that = this
    window.onresize = () => {
      return (() => {
        that.screenHeight = document.documentElement.clientHeight
      })()
    }
  },
  methods: {
    areaResult: function (show, result) {
      this.show = show
      this.result = result
    },
    save () {
      if (!(/^1\d{10}$/.test(this.phone))) {
        utils.toToast('请填写正确的手机号')
      } else {
        if (this.state === true) {
          this.state = false
          request.post(this.$router, {
            name: this.name,
            phone: this.phone,
            province: this.result.province.code,
            city: this.result.city.code,
            area: this.result.area.code,
            detail: this.detail}, function (data) {
              utils.toToast('保存成功')
              if (this.$route.query.goods_car_id) {
                this.$router.push({path: '/preorder?goods_car_id=' + this.$route.query.goods_car_id})
              } else if (this.$route.query.goods_car_id1) {
                this.$router.push({path: '/person/address?&goods_car_id=' + this.$route.query.goods_car_id1})
              } else {
                this.$router.push({path: '/person/address'})
              }
            }.bind(this), function (err) {
              console.log(err)
              this.state = true
              utils.toToast('保存失败')
            }.bind(this))
        }
      }
    },
    isphone: function () {
      if (!(/\d/.test(this.phone))) {
        utils.toToast('请输入数字')
      }
      if (this.phone.length === 1) {
        if (this.phone !== '1') {
          utils.toToast('请输入1开头手机号')
        }
      }
      if (this.phone.length > 11) {
        utils.toToast('超出11位')
      }
    },
    fontcolor: function () {
      document.getElementById('ta').style.color = 'black'
    },
    back: function () {
      if (this.$route.query.goods_car_id1) {
        this.$router.push({path: '/person/address?&goods_car_id=' + this.$route.query.goods_car_id1})
      } else {
        this.$router.push({path: '/person/address'})
      }
    }
  }
}
</script>
<style>
@import "../../../common/mixin.css";
#back2
{
	margin-top: 0.96rem;
	width: 100%;
	height: 1.413333rem;
	text-align: left;
}
#back2 img
{
	margin-left: 0.6rem;
	margin-right: 0.6rem;
}
.arrowwh
{
	width: 0.2rem;
	height: 0.333333rem;
}
input
{
  outline: none;
}
#back2 span
{
	font-size: 0.4rem;
}
.licut
{
  width: 100%;
  height: 0.04rem;
  background: url(../../../assets/licut.png);
}
.addlist
{
	width: 100%;
	height: 1.24rem;
	text-align: left;
	position: relative;
	font-size: 0.4rem;
}
.addlist label
{
	position: absolute;
	top: 0.413333rem;
	left: 0.533333rem;
}
.addlist input
{
	width: 70%;
	height: 0.8rem;
	position: absolute;
	top: 0.2rem;
	left: 2.546667rem;
}
#txtarea
{
	width: 100%;
	height: 2.573333rem;
}
#makeoveradd
{
	position: absolute;
	padding-top: 0.133333rem;
  top: 0.3rem;
	right: 1.586667rem;
}
#toarrow
{
   position: absolute;
   right: 0.573333rem;
   top: 0.413333rem;
}
#txtarea
{
  height: 2.573333rem;
  width: 100%;
}
textarea
{
  margin-left: 0.013333rem;
	width: 89%;
	height: 1.746667rem;
	padding: 0.413333rem 0.533333rem 0.413333rem 0.533333rem;
	font-size: 0.4rem;
  border:none;
  outline: none;
  color: #ADADAD;
}
#save
{ 
  position: absolute;
  left: 1.733333rem;
  bottom: 2.04rem;
  width: 6.773333rem;
  height: 1.1rem;
  font-size: 0.4rem;
  background-color: white;
  border:green solid 0.013333rem;
  color: green;
  border-radius: 6px;
}
#savecontent
{
  margin-top:0.333333rem; 
}
</style>
