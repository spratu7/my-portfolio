<template>
  <PanelHeader :route="route"></PanelHeader>
  <div class="form">
    <el-form :inline="true" :model="searchForm">
        <el-form-item prop="out_trade_no">
          <el-input v-model="searchForm.out_trade_no" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData.list">
    <el-table-column prop="out_trade_no" label="订单号" width="150" fixed="left"></el-table-column>
    <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
    <el-table-column prop="service_name" label="陪诊服务"></el-table-column>
    <el-table-column label="陪护师头像">
      <template #default="scope">
          <el-image style="width: 40px;height: 40px;" :src="scope.row.companion.avatar"></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="companion.mobile" label="陪诊师手机号" width="120"></el-table-column>
    <el-table-column prop="price" label="总价"></el-table-column>
    <el-table-column prop="paidPrice" label="已付"></el-table-column>
    <el-table-column label="下单时间" width="120">
        <template #default="scope">
            {{ dayjs(scope.row.order_start_time).format('YYYY-MM-DD') }}
        </template>
    </el-table-column>
    <el-table-column label="订单状态">
        <template #default="scope">
            <el-tag :type="statusMap(scope.row.trade_state)">{{ scope.row.trade_state }}</el-tag>
        </template>
    </el-table-column>
    <el-table-column prop="service_state" label="接单状态"></el-table-column>
    <el-table-column prop="tel" label="联系人手机号" width="120"></el-table-column>
    <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
            <el-popconfirm
              v-if="scope.row.trade_state === '待服务'"
              confirm-button-text="Yes"
              cancel-button-text="No"
              width="220"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="Are you sure to delete this?"
              @confirm="confirmEvent(scope.rw.out_trade_no)"
            >
        <template #reference>
            <el-button type="primary" link>服务完成</el-button>
        </template>  
      </el-popconfirm>
      <el-button v-else type="primary" link disabled>暂无服务</el-button>
        </template>
      </el-table-column>
  </el-table>
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :background="false"
      size="small"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
   </div>
</template>

<script setup>
  import { onMounted ,reactive} from 'vue';
  import { useRoute } from 'vue-router'
  import { adminOrder, updataUser} from '../../../api'
  import dayjs from 'dayjs'
  import {Plus,InfoFilled,Delete} from '@element-plus/icons-vue'

  const route = useRoute()
  onMounted(() =>{
    getListData()
  })
  const paginationData = reactive({
  pageNum :1,
  pageSize:10
  })

//列表数据
  const tableData = reactive({
    list:[],
    total:0
  })

  //表单搜索
  const searchForm = reactive({
    out_trade_no:''
  })

  const onSubmit = () => {
    getListData(searchForm)
  }

  const getListData = (params = {}) => {
    adminOrder({...paginationData,...params}).then((res)=> {
       if (res && res.data) {
         const { list, total } = res.data.data;
         tableData.list = list;
         tableData.total = total;
       } else {
         console.error('接口返回数据异常', res);
         tableData.list = [];
         tableData.total = 0;
       }
     })
     .catch((err) => {
       console.error('请求失败', err);
       tableData.list = [];
       tableData.total = 0;
     });
 }

 const handleSizeChange = (val) =>{
    paginationData.pageSize = val
    getListData()
  }

  const handleCurrentChange = (val)=>{
    paginationData.pageNum = val
    getListData()
  }

const statusMap = (key) =>{
  const obj = {
    '已取消':'info',
    '待支付':'warning',
    '已完成':'success'
  }
  return obj[key]
}
const confirmEvent =(id) => {
  updataOrder({id}).then(({data}) => {
    if(data.code === 10000) {
      getListData()
    }
  }) 
}
</script>

<style lang="less" scoped>
  .form {
    display: flex;
    justify-content: flex-end;
    padding: 10px 0 10px 10px;
    background-color: #fff;
  }
</style>