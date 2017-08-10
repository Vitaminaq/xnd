<template lang="html">
<div>
<headerbar></headerbar>
    <router-link to="/person">
	<div id="back1">
       <img class="arrowwh" src="../../assets/back.png">
       <span>我的地址</span>
    </div>
    </router-link>
    <div  id="top" class="licut">
       
    </div>
    <scroller
    :on-refresh="refresh"
    :on-infinite="infinite"  ref="my_scroller" style="height:15rem;margin-top: 2.26667rem">

    	<ul>
    	<li v-for="(item,index) in addressList" @click="selectadd(item.msg.id)">
    		<div class="addressdetail">
    			<div class="name f1"><span>{{item.msg.name}}</span></div> <div class="tel f1"><span>{{item.msg.phone}}</span></div>
    			<div class="address">{{item.msg.fullAddr}}</div>
          <img class="select" v-show="!item.msg.status" @click.stop="setDefault(item.msg.id)" src="../../assets/personaddress1/noselect.png"  />
    			<img class="select" v-show="item.msg.status" @click.stop="setDefault(item.msg.id)" src="../../assets/personaddress1/selected.png"  />
                <img  @click="toedit(item.msg.id)" class="edit"  src="../../assets/personaddress1/edit.png" />
                <img class="delete" @click.stop="deletes(item.msg.id)" src="../../assets/personaddress1/delete.png" />
    		</div>
    		<div class="licut">
  	   
            </div>
    	</li>
       </ul>
    </scroller>
       <!--添加新地址按钮-->
      
       <div id="add2" @click="toadd">
          <div id="add2content">
            <span> + 添加新地址</span>
          </div>
       </div>

       <bottombar></bottombar>
</div>

</template>

<script>
import utils from '../../common/utils'
import VueScroller from 'vue-scroller'
import bottombar from '../../components/bottombar'
import headerbar from '../../components/headerbar'
import request from '../../common/request'
export default {
  name: 'address',
  components: {
    bottombar,
    VueScroller,
    headerbar
  },
  data: function () {
    return {
      addressList: [],
      data: [],
      mark: false,
      currentPage: 1,
      limit: 8,
      state: true
    }
  },
  created () {
    this.$router.name = this.$route.name
  },
  methods: {
    toadd: function () {
      if (!this.$route.query.goods_car_id) {
        this.$router.push({path: '/person/address/add'})
      } else {
        this.$router.push({path: '/person/address/add?&goods_car_id1=' + this.$route.query.goods_car_id})
      }
    },
    // 跳转编辑地址界面
    toedit: function (addid) {
      if (!this.$route.query.goods_car_id) {
        this.$router.push({path: '/person/address/update?addr_id=' + addid})
      } else {
        this.$router.push({path: '/person/address/update?addr_id=' + addid + '&goods_car_id1=' + this.$route.query.goods_car_id})
      }
    },
    // 设置默认地址
    setDefault: function (addressID) {
      for (var i = 0; i < this.addressList.length; i++) {
        if (this.addressList[i].msg.id === addressID) {
          this.data.rootName = 'setaddress'
          this.data.addr_id = addressID
          this.addressList[i].msg.status = true
          request.put(this.$router, this.data, function (data) {
            utils.toToast('设置成功')
          }, function (err) {
            console.log(err)
            utils.toToast('设置失败')
          })
        } else {
          this.addressList[i].msg.status = false
        }
      }
    },
    // 删除收货地址
    deletes: function (addressid) {
      if (!this.$route.query.goods_car_id && this.state === true) {
        request.patch(this.$router, {
          rootName: 'deladdress',
          addr_id: addressid}, function (data) {
            for (var i = 0; i < this.addressList.length; i++) {
              if (this.addressList[i].msg.id === addressid) {
                this.addressList.splice(i, 1)
              }
            }
            utils.toToast('删除成功')
          }.bind(this), function (err) {
            console.log(err)
            utils.toToast('删除失败')
          })
      }
    },
    // 选择收货地址
    selectadd: function (addressId) {
      if (this.$route.query.goods_car_id) {
        this.$router.push({path: '/preorder?addid=' + addressId + '&goods_car_id=' + this.$route.query.goods_car_id})
      }
    },
    refresh: function (done) {
      this.currentPage = 1
      request.get(this.$router, {page: this.currentPage, limit: this.limit}, function (data) {
        this.currentPage ++
        this.addressList = data
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
          this.addressList = this.addressList.concat(refreshData)
          done(true)
        } else {
          for (var i = refreshData.length - 1; i >= 0; i--) {
            this.addressList.push(refreshData[i])
          }
          done()
        }
      }.bind(this))
    }
  }
}

</script>
<style>
@import "../../common/mixin.css";
#contain
{
  margin-top: 1.226667rem;
  height:12rem; 
  overflow-y: auto;
}
#back1
{
  position: fixed;
	margin-top: 0.96rem;
	width: 100%;
  background-color: white;
  z-index: 299;
	height: 1.24rem;
	text-align: left;
  /* border-bottom: #ADADAD solid 0.013333rem; */
}
#top
{
  margin-top: 2.2rem;
  position: fixed;
}
.arrowwh
{
	width: 0.2rem;
	height: 0.333333rem;
}
#back1 img
{
	margin-left: 0.6rem;
	margin-right: 0.6rem;
}
#back1 span
{
	font-size: 0.4rem;
}
.licut
{
  width: 100%;
  height: 0.04rem;
  background: url(../../assets/licut.png);
}
.addressdetail
{
	width: 100%;
	height: 3.053333rem;
	position: relative;
}
.addressdetail .f1
{
	float: left;
}
.name
{
	font-size: 0.48rem;
	margin: 0.48rem 0.533333rem 0 0.48rem;
}
.tel,.address
{
	font-size: 0.346667rem;
}
.tel
{
	margin-top: 0.533333rem;
}
.address
{
	position: absolute;
  width: 9.333333rem;
  height: 0.4rem;
  text-align: left;
  padding-top: 0.133333rem;
	top: 1.146667rem;
	left: 0.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.select
{
	width: 0.586667rem;
	height: 0.586667rem;
	position: absolute;
	bottom:0.48rem;
	left: 0.5555rem;
}
.edit,.delete
{
	width: 1.253333rem;
	height: 0.56rem;
	position: absolute;
	bottom: 0.48rem;
}
.edit
{
    right: 2.186667rem;
}
.delete
{
	right: 0.573333rem;
}
#add2
{ position: absolute;
  left: 1.733333rem;
  bottom: 2.04rem;
  width: 6.773333rem;
  height: 1.1rem;
  font-size: 0.4rem;
  background-color: white;
  border:#ADADAD solid 0.013333rem;
  color: #ADADAD;
  border-radius: 6px;
}
#add2content
{
  margin-top:0.333333rem; 
}
</style>
