<template>
  <PanelHeader :route="route"></PanelHeader>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id"/>
    <el-table-column prop="name" label="昵称"/>
    <el-table-column prop="permission_id" label="所属组别">
      <template #default="scope">
        {{ permissionName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号"></el-table-column>
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag class="ml-2" :type="scope.row.active ? 'success': 'danger'">{{ scope.row.active ? '成功' : '失效' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock/></el-icon>
          <span style="margin-left: 10px;">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="handleOpen(scope.row)">编辑</el-button>
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

   <el-dialog v-model="dialogFormVisible"
   title="添加权限"
   width="500"
  >
      <el-form 
      ref="formRef" 
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rules"
      >
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" disabled />
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="菜单权限" prop="permissions_id">
          <el-select
            v-model="form.permissions_id"
            placeholder="请选择菜单权限"
            style="width: 240px;"
          >
            <el-option 
              v-for="item in options"
              key="item.id"
              :label="item.name"
              :value="item.id"
              ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
   </el-dialog>
    
  
</template>

<script setup>
import { authAdmin,menuSelectList,updataUser} from '../../../api'
import { ref,reactive ,onMounted, nextTick} from 'vue';
import dayjs from 'dayjs'
import PanelHeader from '../../../components/panelHeader.vue';
import {useRoute} from 'vue-router'

const route = useRoute()
console.log(route,'route')

const paginationData = reactive({
  pageNum :1,
  pageSize:10
})

//列表数据
const tableData = reactive({
    list:[],
    total:0
  })

//创建响应式变量
const options = ref([])

onMounted(()=>{
    getListData()
    menuSelectList().then(({data})=>{
      options.value = data.data
    
  })
})

//根据权限id匹配权限名称
const permissionName = (id) =>{
  const data = options.value.find(el => el.id === id)
  return data ? data.name : '超级管理员'
}

const dialogFormVisible = ref(false)
const handleOpen = (rowData) =>{
    dialogFormVisible.value = true
    Object.assign(form,{mobile:rowData.mobile, name:rowData.name,permissions_id:rowData.permissions_id})
}

const handleSizeChange = (val) =>{
    paginationData.pageSize = val
    getListData()
  }

const handleCurrentChange = (val)=>{
    paginationData.pageNum = val
    getListData()
  }
//弹窗

/* const beforeClose = () =>{
  dialogFormVisible.value = false
  formRef.value?.resetFields()
} */
const rules = reactive({
  name:[{required: true,trigger:'change',message:'请填写昵称'}],
  permissions_id:[{required: true,trigger:'change',message:'请选择菜单权限'}]
})

const formRef = ref()
//编辑表单
const form = reactive({
  name:'',
  permissions_id:'',
  mobile:''
})

//请求列表
const getListData = () => {
    authAdmin(paginationData).then(({data}) => {
    console.log(data,'authAdmin')
    const {list,total} = data.data
    list.forEach(item => {
      item.create_time = dayjs(item.create_item).format('YYYY-MM-DD')
    })
    tableData.list = list
    tableData.total = total
    })
}

//表单提交
const confirm = async (formEl) =>{
  console.log('函数执行')
  if(!formEl) return
  try {
    await formEl.validate()
    const {name,permissions_id,mobile} = form
    const data = await updataUser({name,permissions_id,mobile})
    console.log('接口返回',data)
    if(data.data.code === 10000) {
          dialogFormVisible.value = false
          formRef.value?.resetFields()
          getListData()
          console.log('弹窗关闭')
          await nextTick()
        }
    } catch (error) {
    console.log('校验失败或接口出错',error)
    ElMessage.error('请检查表单或网络')
  }
}
</script>

<style lang="less" scoped>
  .flex-box {
    display: flex;
    align-items: center;
  }
</style>