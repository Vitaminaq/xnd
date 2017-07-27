<template>
    <div id="main">
    <router-link to="/person/address">
    	<div id="back2">
           <img class="arrowwh" src="../../../assets/back.png">
           <span>我的地址</span>
      </div>
    </router-link>
        <div class="licut">
  	   
        </div>
        <div id="content">
            <div class="addlist">
                <label>收货人</label><input type="text" @focus="hidit2" @blur="showit2" @keyup="isname" name="" v-model="name" />
            </div>
           <div class="licut">
       
            </div>
            <div class="addlist">
               <label>联系电话</label><input type="text" @focus="hidit2" @blur="showit2" @keyup="isphone" name="" v-model="phone"/>
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
            <textarea placeholder="请填写详细地址，如街道、楼牌号等" @focus="hidit2" @blur="showit2" @keyup="isdetail" v-model="detail"></textarea>
           </div>
           <div class="licut">
       
           </div>
           <vue-area :props-show="show" :props-result="result" v-on:result="areaResult"></vue-area>
           <div id="save" v-show="barhid" @click.stop="save">
             <div id="savecontent">
                <span>保存</span>
             </div>
          </div>
        </div>
       <bottombar v-show="barhid"></bottombar> 
    </div>
	
</template>
<script>
import vueArea from 'vue-area'
import utils from '../../../common/utils'
import request from '../../../common/request'
import bottombar from '../../../components/bottombar'
export default {
  name: 'add',
  components: {
    vueArea,
    bottombar
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
      barhid: true
    }
  },
  created: function () {
    this.$router.name = this.$route.name
  },
  methods: {
    areaResult: function (show, result) {
      this.show = show
      this.result = result
    },
    save () {
      if (!(/^[a-zA-Z\u4e00-\u9fa5]+$/.test(this.name)) || !(/^1\d{10}$/.test(this.phone)) || !(/^[\u0391-\uFFE5\d]+$/.test(this.detail))) {
        utils.toToast('请填写正确的信息')
      } else {
        if (this.state === true) {
          this.state = false
          request.post(this.$route, {
            name: this.name,
            phone: this.phone,
            province: this.result.province.code,
            city: this.result.city.code,
            area: this.result.area.code,
            detail: this.detail}, function (data) {
              utils.toToast('保存成功')
              if (this.$route.query.id1 === 'markadd1') {
                this.$router.push({path: '/preorder?goods_car_id=' + this.$route.query.goods_car_id})
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
    isname: function () {
      if (!(/^[a-zA-Z\u4e00-\u9fa5]+$/.test(this.name))) {
        utils.toToast('请输入汉字或字母')
      }
    },
    isphone: function () {
      if (!(/^1\d{10}$/.test(this.phone))) {
        utils.toToast('请输入正确的手机号')
      }
    },
    isdetail: function () {
      if (!(/^[\u0391-\uFFE5\d]+$/.test(this.detail))) {
        utils.toToast('请输入正确的详细地址')
      }
    },
    showit2: function () {
      this.barhid = true
    },
    hidit2: function () {
      this.barhid = false
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
	top: 0.413333rem;
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
	width: 88%;
	height: 1.746667rem;
	padding: 0.413333rem 0.533333rem 0.413333rem 0.533333rem;
	font-size: 0.4rem;
  color: #ADADAD;
}
#save
{ position: absolute;
  left: 1.733333rem;
  bottom: 2.04rem;
  width: 6.773333rem;
  height: 1.12rem;
  font-size: 0.4rem;
  background-color: white;
  border:green solid 0.013333rem;
  color: green;
}
#savecontent
{
  margin-top:0.333333rem; 
}
</style>
