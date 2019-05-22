<template>
    <!-- 可开票订单列表页面 !-->
    <div>
      <x-header :left-options="{backText: ''}" @on-click-back="goBack()">可开票订单</x-header>
      <!-- 订单列表 -->
      <scroller ref="scroller" lock-x height="621" @on-scroll-bottom="onScrollBottom">
        <div>
          <group :gutter="0" class="body">
            <div v-for="(prodcut,index) of orderList" :key="index">
              <p class="date-time">{{prodcut.dateTime}}</p>
              <table class="list-box" v-for="(item,itemIndex) of prodcut.children" :key="itemIndex" @click="toCreateInvoiceFn">
                <tr>
                  <td class="list-title">订单号：</td>
                  <td colspan="2">{{item.orderNum}}</td>
                </tr>
                <tr>
                  <td class="list-title">产品：</td>
                  <td>
                    <p v-for="(items,itemsIndex) of item.productList" :key="itemsIndex">
                      {{items.title}}<span style="margin-left: 5px;">x{{items.number}}</span>
                    </p>
                  </td>
                  <td class="goto-icon">
                    <img src="../assets/images/goto.png"/>
                  </td>
                </tr>
                <tr>
                  <td class="list-title">总价：</td>
                  <td colspan="2" style="color: #FF9308;font-size: 16px;">￥{{item.total}}</td>
                </tr>
              </table>
            </div>
          </group>  <!-- 订单列表结束 -->

          <divider v-show="noMore">没有订单了</divider>
          <loading :show="loading" text=""></loading>
        </div>
     </scroller> 
   </div>
</template>
<script>
import { XHeader, Scroller, Group, Divider, Loading  } from "vux";
export default {
    name:'index',
    data(){
      return {
        noMore: false,
        pageindex: 1,
        timer: null,  // 下拉加载延迟
        orderList: [
          {
            dateTime: '19年02月',
            children: [{
              orderNum: 'qtz201905201253',
              productList: [
                {
                  title:  'cs-益阳方案a',
                  number: 1
                }
              ],
              total: 2999.00
            }, {
                orderNum: 'qtz201905201253',
                productList: [
                  {
                    title:  '芦荟软胶囊',
                    number: 1
                  }, {
                    title:  '扶正胶囊',
                    number: 2
                  },
                ],
                total: 88
              }]            
          }, {
             dateTime: '19年01月',
              children: [{
                orderNum: 'qtz201905201253',
                productList: [
                  {
                    title:  '芦荟软胶囊',
                    number: 1
                  }
                ],
                total: 88
              }] 
          }, {
            dateTime: '19年01月',
              children: [{
               orderNum: 'qtz201905201253',
                productList: [
                  {
                    title:  'cs-益阳方案a',
                    number: 1
                  }
                ],
                total: 2999.00
              } ] 
          }, {
             dateTime: '19年01月',
              children: [{
                orderNum: 'qtz201905201253',
                productList: [
                  {
                    title:  '芦荟软胶囊',
                    number: 1
                  }
                ],
                total: 88
              }] 
          }, {
            dateTime: '19年01月',
              children: [{
               orderNum: 'qtz201905201253',
                productList: [
                  {
                    title:  'cs-益阳方案a',
                    number: 1
                  }
                ],
                total: 2999.00
              } ] 
          }, {
             dateTime: '19年01月',
              children: [{
                orderNum: 'qtz201905201253',
                productList: [
                  {
                    title:  '芦荟软胶囊',
                    number: 1
                  }
                ],
                total: 88
              }] 
          }, {
            dateTime: '19年01月',
              children: [{
               orderNum: 'qtz201905201253',
                productList: [
                  {
                    title:  'cs-益阳方案a',
                    number: 1
                  }
                ],
                total: 2999.00
              } ] 
          },], // 可开票列表
          loading: false,
      }
    },
    mounted () {
      //设置title 
      document.title = "可开票订单";
      this.getOrderList();
    },
    methods: {
      goBack(){
        this.$route.go(-1);
      },
      toCreateInvoiceFn(){
        this.$router.push({name: "createInvoice"});
      },
      /**
       * 2、符合开票条件的订单，才出现在列表里。该判断由BRM提供，大概为：
          1）未到可开票期：不出现在列表
          2）已到可开票期：出现在列表
          3）已过可开票期，但已申请开票：出现在列表
          4）已过可开票期，但未申请开票：不出现在列表
      */
      getOrderList(){
        // this.loading = true;
        // this.$api.all.getOrderList().then(res => {
        //   clearTimeout(this.timer);
        //   if(res.status == 200){
        //     // 判断是否还有数据，如果没有了，那么下一页也必然没有了，再下拉时就没必要调用了
        //     if (res.data.list.length < 10) this.noMore = true;
        //     if (res.data.list.length > 0) this.orderList.push(...res.data.list);
        //     this.loading = false;
        //   } else {
        //     this.loading = false;
        //     this.$vux.toast.show({
        //       text: "获取订单数据失败",
        //       type: "warn"
        //     });
        //   }
        // });
      },
      // 滚动到底部时触发
      onScrollBottom(){
        // if (this.noMore) return;
        // // 如果正在请求数据就，不重复请求了
        // if (!this.loading) {
        //   this.loading = true;
        //   // 分页加一
        //   this.pageindex ++;
        //   // 延迟下拉加载
        //   this.timer = setTimeout(() => {
        //     this.getOrderList();
        //   }, 500);
        // }
      }
    },
    components: {
      XHeader,
      Scroller,
      Group,
      Divider,
      Loading 
    },
}
</script>

<style lang="less" scoped>
.body{
  width: 100%;
  overflow: hidden;
  background: #fff;
  box-sizing: border-box;
}
.vux-divider{
  color: #909399FF !important;
  background: rgb(247, 246, 246) !important;
}
.vux-divider:after, .vux-divider:before{
    content: '';
    display: table-cell;
    position: relative;
    top: 50%;
    width: 50%;
    background-image: url('') !important; 
}
.date-time{
  color: #909399;
  font-size: 14px;
  height: 35px;
  line-height: 35px;
  background: #f7f6f6;
  padding-left: 15px;
  box-sizing: border-box;
}
.list-box {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0px 10px;
  border-bottom: 1px solid #E6E6E6;
  border-right: 0;
  border-top: 0;
  border-left: 0;
  font-size: 16px;
  background: #fff;
  .list-title{
    width: 85px;
    text-align: right;
  }
  .goto-icon{
    text-align: center;
    vertical-align: middle;
    width: 50px;
    img{
      height: 12px;
      width: 7px;
    }
  }
}
</style>


