<template>
    <!-- 申请开票页面 !-->
    <div>
      <x-header :left-options="{backText: ''}" @on-click-back="goBack()">可开票订单</x-header>
      <!-- 表单 -->
      <group :gutter="0" class="content">
          <div style="height: 44px; line-height: 44px;display: flex;">
            <div class="input-title">抬头类型</div>
            <div>
              <check-icon :value.sync="orderMsg.orderPersonal" @click.native="checkOrderFn('orderPersonal', 'orderEnterprise')">个人</check-icon>
              <check-icon style="margin-left: 55px;" :value.sync="orderMsg.orderEnterprise" @click.native="checkOrderFn('orderEnterprise', 'orderPersonal')">企业</check-icon>
            </div>
          </div>

          <!-- 企业类型 -->  
            <div style="display: flex;position: relative;" class="add-border-top">
              <x-input class="required-icon" title="发票抬头" type="tel" placeholder="请输入发票抬头"  label-width="150" :disabled="isAbled"  
                v-model.trim="orderMsg.orderTitle" :show-clear="false"
                @on-blur="verifyRequiredFn('orderTitleFocus')" 
                @on-focus="onFocusFn('orderTitleFocus')"
                @on-change="showOrderTitleFn(true)"
                v-show="!isOrderPersonal">
              </x-input> 
              <i type="clear" style="margin-top: 3px;" v-show="orderMsg.orderTitle && !orderTitleFocus" class="weui-icon weui_icon_clear weui-icon-clear" @click="clearFn('orderTitle')"></i>
            </div> 
              <!-- 发票抬头列表  -->
            <div class="selectOrderTitle-tip" v-show="showOrderTitleLoad">匹配中…</div> 
            <div class="selectOrderTitle-box" v-show="showOrderTitleList">
              <div @click="checkItemFn(items)" v-for="(items,index) of orderTitleList" :key="index" class="item">
                <p>{{items.title}}</p>
                <p class="num">{{items.num}}</p>
              </div>
              <div class="title-btn" @click="showOrderTitleFn(false)">关闭</div>
            </div>
          
          <div style="display: flex;position: relative;"  class="add-border-top">
            <x-input class="required-icon" title="税号" type="tel" placeholder="请输入税号" label-width="150" :disabled="isAbled"
              v-model.trim="orderMsg.ein" :show-clear="false"
              @on-blur="verifyRequiredFn('einFocus')"
              @on-focus="onFocusFn('einFocus')"
              v-show="!isOrderPersonal">
              </x-input>
            <i type="clear" style="margin-top: 3px;" v-show="orderMsg.ein && !einFocus" class="weui-icon weui_icon_clear weui-icon-clear" @click="clearFn('ein')"></i>
          </div>    

          <!-- 公有字段 -->    
          <div style="display: flex;position: relative;"  class="add-border-top">
            <x-input class="required-icon"  title="电子邮箱" type="tel" placeholder="请输入您的电子邮箱" label-width="150"
              v-model.trim="orderMsg.email" :show-clear="false"
              @on-focus="onFocusFn('emailFocus')"
              @on-blur="verifyRequiredFn('emailFocus')">
            </x-input>
            <i type="clear" style="margin-top: 3px;" v-show="orderMsg.email && !emailFocus" class="weui-icon weui_icon_clear weui-icon-clear" @click="clearFn('email')"></i>
          </div>      
            
          <div class="add-border-top amount-box">
            <div class="input-title">发票金额</div>
            <div style="color: #FF9308;font-size: 14px;">{{orderMsg.amount}} <span style="color: #CCCCCC">元</span></div>
          </div> 
          <!-- 必填提示语 -->
          <div class="tipsMsg" v-show="showTipsMsg">{{tipsMsg}}</div>
      </group>  <!-- 表单结束 -->

      <!-- 申请按钮 -->
      <XButton class="saveBtn" @click.native="verifyFn" :disabled="isSave">申请</XButton>
      <div class="saveBtn-desc">电子发票与纸质发票具有相同法律效力，可正常报销。</div>
      <!-- 提交成功提示 -->
      <alert v-model="showAlert" title="已提交申请" :button-text="'回到订单列表（'+ seconds +'S）'">稍后请于邮箱查收电子发票<br>若未收到，请耐心等待</alert>
    </div>
</template>
<script>
import { XHeader, Group, CheckIcon, XButton, Alert, XInput, CellBox } from "vux";
export default {
    name:'index',
    data(){
      return {
        orderMsg: {
          orderPersonal: true,      // 个人抬头票类型
          orderEnterprise: false,      // 企业抬头票类型
          orderTitle: '',      // 发票抬头
          ein: '',      // 税号
          email: '',      // 电子邮箱
          amount: 0      // 发票金额
        },
        isOrderPersonal: true, // true： 个人抬头票类型， false： 企业抬头票类型        
        showAlert: false,
        msgToast: '',
        orderTitleList: [
          {
            title: '绿瘦',
            num: '35476435465445X',
            amount: 87
          }, {
            title: '绿瘦健康产业集团有限公司',
            num: '354764354654455X',
            amount: 88
          }, {
            title: '绿瘦',
            num: '354764354654455X',
            amount: 89
          }], // 发票抬头列表
        showOrderTitleList: false, // 是否显示发票抬头列表
        showOrderTitleLoad: false,  // 提示发票抬头列表匹配中
        isSelect: false,   // 是否为发票抬头列表选择的
        seconds: 5, // 倒数5S
        tipsMsg: '', // 必填提示语
        showTipsMsg: false,  // 是否显示必填提示语
        isSave: true, // 是否可点击提交按钮
        isAbled: false, // 已过可开票期，但已申请开票类型订单，只可修改电子邮箱，其它字段都读取首次开票提交的信息，且不可变
        orderTitleFocus: false, // 发票抬头输入框失去焦点
        einFocus: false, // 税号输入框失去焦点
        emailFocus: false, // 电子邮箱输入框失去焦点
      }
    },
    mounted () {
      //设置title 
      document.title = "我的订单";
    },
    methods: {
      goBack(){
        this.$route.go(-1);
      },
      // 个人 || 企业 填写切换(某部分字段是否展示，必填提示语,抬头发票等隐藏)
      checkOrderFn(fieldName1, fieldName2) {
        this.orderMsg[fieldName1] = this.orderMsg[fieldName1] ? this.orderMsg[fieldName1] : !this.orderMsg[fieldName1];
        this.orderMsg[fieldName2] = this.orderMsg[fieldName1] ? false : true;
        this.isOrderPersonal = this.orderMsg.orderPersonal ? true : false;        
        this.showTipsMsg = false;
        this.showOrderTitleFn(false);
        this.emptyFn();
      },
      // 原来开始设置
      emptyFn(){
        this.orderMsg = {
          orderPersonal: this.orderMsg.orderPersonal,      // 个人抬头票类型
          orderEnterprise: this.orderMsg.orderEnterprise,      // 企业抬头票类型
          orderTitle: '',      // 发票抬头
          ein: '',      // 税号
          email: '',      // 电子邮箱
          amount: 0      // 发票金额
        }
      },
      // 是否显示匹配抬头发票选卡, 及获取抬头发票列表
      showOrderTitleFn(show){
        let val = show;
        if(this.isSelect || !this.orderMsg.orderTitle){
          this.isSelect = false;
          val = false;
        }
        this.showOrderTitleList = this.showOrderTitleLoad = val;
        if(val){
          // this.$api.all.getOrderTitleList().then(res => {
          //   if(res.status == 200){
          //     this.orderTitleList = res.data.list;
          //     this.showOrderTitleLoad = false;
          //   } else {
          //     this.showOrderTitleLoad = false;
          //     this.$vux.toast.show({
          //       text: "获取抬头发票数据失败",
          //       type: "warn"
          //     });
          //   }
          // });
        }
      },
      // 选中某个抬头发票
      checkItemFn(item){
        console.log(item)
        this.isSelect = true;
        this.orderMsg.orderTitle = item.title;
        this.orderMsg.ein = item.num;
        this.orderMsg.amount = item.amount;
        this.einFocus = true;
        this.tipsMsg = "";
      },
      // 清空某字段值
      clearFn(fieldName){
        this.orderMsg[fieldName] = '';
        this.verifyRequiredFn(true);
      },
      // 输入框获得焦点
      onFocusFn(isFocus){
        this[isFocus] = false;
      },
      // 必填字段,参数：记录失去焦点
      verifyRequiredFn(isFocus){
        this.isSave = true;  
        setTimeout(()=> { this[isFocus] = true; }, 200); // 解决当点击清除按钮时，先执行失去焦点事件，导致清空事件失效    
        if(this.orderMsg.orderEnterprise){ // 企业
          if (!this.orderMsg.orderTitle) {  // 提示抬头发票
            this.tipsMsg = "请填写抬头发票";
            this.showTipsMsg = true;
            return;
          } else if (!this.orderMsg.ein) { // 提示税号
            this.tipsMsg = "请填写税号";
            this.showTipsMsg = true;
            return;
          }
        }
        // 提示邮箱
        let reg = new RegExp(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/);
        if (!this.orderMsg.email || !reg.test(this.orderMsg.email)) {
           console.log(1)
          this.tipsMsg = "请输入正确的邮箱";
          this.showTipsMsg = true;
          return;
        } else {
          this.showTipsMsg = false;
          this.isSave = false;
        }        
      },
      // 提交
      verifyFn(){
        this.verifyRequired();
        if(!this.isSave){
          // this.$api.all.saveFn().then(res => {
          //   if(res.status == 200){
              this.showAlert = true;
              this.emptyFn(); 
              this.calTimeFn();  
          //   } else {
          //     this.$vux.toast.show({
          //       text: "提交失败:" + res.msg,
          //       type: "warn"
          //     });
          //   }
          // });          
        } 
      },
      // 倒计时5S
      calTimeFn(){
        setTimeout(() => {
          this.seconds--;
          if (this.seconds <= 1 ) {
            this.showAlert = false;
            clearTimeout(this.seconds);
            this.$router.push({name: "/"});
          }
          else this.calTime(this.seconds);
        }, 1000);        
      }
    },
    components: {
      XHeader,
      Group,
      CheckIcon,
      XButton,
      XInput,
      Alert,
      CellBox
    },
}
</script>
<style lang="less" scoped>
.content{
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 609px;  
  margin-top: 12px;
  position: relative;
}
.input-title {
  color: #333;
  width: 130px;
  box-sizing: border-box;
  text-align: center;
}
.selectOrderTitle-tip{
  position: absolute;
  width: 50px;
  z-index: 9;
  top: 59px;
  right: 38px;
  text-align: right; 
  box-sizing: border-box;
  overflow: hidden;
  font-size: 12px;
  color: #D9D9D9;
}
.selectOrderTitle-box{
  padding-left: 120px;
  position: absolute;
  width: 100%;
  background: #fff;
  z-index: 9;
  top: 95px;
  left: 0; 
  box-sizing: border-box;
  overflow: hidden;
  .item{
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    z-index: 9;
  } 
  .num{
    color: #b5b4b4;
    font-size: 12px;
  }
  .title-btn{
    color: #03A9F4;
    font-size: 14px;
    text-align: center;
    right: 15px;
    position: relative;
    margin-bottom: 10px;
    float: right;
    width: 40px;
    z-index: 9;
  }
}
.tipsMsg {
  width: 100%;
  text-align: center;
  padding: 20px 0 0 0;
  font-size: 14px;
  color: #F25643;
  background: #f7f6f6;
}
.amount-box{
  position: relative;
  height: 44px;
  line-height: 44px;
  display: flex;
}
button.saveBtn {
  display: block;
  position: fixed;
  bottom: 70px;
  height: 44px;
  line-height: 44px;
  border: none;
  border-radius: 0;
  color: #fff;
  font-size: 14px;
  background: #2196F3;
  width: 92% !important;
  z-index: 9;
  left: 4%;
  right: 4%;
}
.weui-btn:after{
  border: none;
}
.saveBtn-desc{
  display: block;
  position: fixed;
  bottom: 45px;
  text-align: center;
  color: #D9D9D9;
  font-size: 12px;
  width: 100%;
}
.add-border-top::before {
  content: " ";
  position: absolute;
  top: 0;
  right: 0;
  height: 1px;
  width: 92%;
  margin: 0 auto;
  border-top: 1px solid #D9D9D9;
  color: #D9D9D9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  left: 0px;
  opacity: 0.5;
  -webkit-transform: scaleY(0.7);
  transform: scaleY(0.7);
}
</style>