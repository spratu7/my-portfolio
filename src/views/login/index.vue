<template>
      <el-row class="login-container"  justify="center" align="middle">
            <el-col :span="24" class="col-wrapper">
            <el-card style="max-width: 480px">
                  <template #header>
                        <div class="card-header">
                              <img :src="imgUrl" >
                        </div>
                  </template>
                  <div class="jump-link">
                        <el-link type="primary" @click="handleChange">{{ formType ? '返回登录'  : '注册账号'}}</el-link>
                  </div>
                  <el-form 
                        ref="loginFormRef"
                        :model="loginForm"
                        style="max-width:600px"
                        class="demo-ruleForm"
                        :rules="rules"
                        @submit.prevent>
                        <el-form-item prop="userName">
                              <el-input v-model="loginForm.userName" placeholder="手机号" :prefix-icon="UserFilled"/>
                        </el-form-item>
                        <el-form-item prop="passWord">
                              <el-input v-model="loginForm.passWord" type="password" placeholder="密码" :prefix-icon="Lock"/>
                        </el-form-item>
                        <el-form-item v-if="formType" prop="validCode">
                              <el-input v-model="loginForm.validCode" placeholder="验证码" :prefix-icon="Lock">
                                    <template #append>
                                          <span 
                                          @click.stop="countDownChange"
                                          style="cursor: pointer"
                                          >{{ countDown.validText }}</span>
                                    </template>
                              </el-input>
                              
                        </el-form-item>
                        <el-form-item>
                              <el-button type="primary" :style="{width: '100%'}" @click="submitForm(loginFormRef)">
                                    {{ formType ? '注册账号' : '登录'}}
                              </el-button>
                        </el-form-item>
                  </el-form>
            </el-card>
            </el-col>
      </el-row>
</template>

<script setup>
import {ref,reactive,onMounted,toRaw,computed, nextTick} from 'vue' 
import {UserFilled,Lock} from '@element-plus/icons-vue'
import { getCode,useAuthentication,login,menuPermissions } from '../../api'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from  'vuex'

const imgUrl = new URL('../../../public/login-head.png',import.meta.url).href

//表单数据
const loginForm = reactive({
      userName:'',
      passWord:'',
      validCode:''
})

const formType = ref(0)
const handleChange = () =>{
      formType.value = formType.value ? 0 : 1
  }


//账号校验规则
const validateUser = (rule,value,callback) => {
      if(value === '') {
            callback(new Error('请输入账号'))
      } else {
            const phoneReg = /^1[3-9]\d{9}$/
            phoneReg.test(value) ? callback() : callback(new Error('手机号格式不对,请输入正确手机号'))
      }
}


//密码校验
const validatePass = (rule,value,callback) => {
      if(value === '') {
            callback(new Error('请输入密码'))
      } else {
            const pass = /^[a-zA-Z0-9_]{4,16}$/
            pass.test(value) ?callback() : callback(new Error('密码格式不对，请确认格式'))
      }
}

//验证码校正
const validateCode = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入验证码'))
  } else {
    const codeReg = /^\d{4}$/
    codeReg.test(value) ? callback() : callback(new Error('验证码格式不对'))
  }
}

//表单校验
const rules = reactive({
      userName:[{validator:validateUser, trigger:'blur'}],
      passWord:[{validator:validatePass, trigger:'blur'}],
      validCode:[{validator:validateCode, trigger:'blur'}],
})



//发送短信
const countDown = reactive({
      validText:'获取验证码',
      time:60
})
//如果发送不处理
let timer = null
let flag = ref(false)
const countDownChange = () =>{
      if(flag.value) return
      
      //判断手机号是否正确
      const phoneReg =  /^1[3-9]\d{9}$/;
      if(!loginForm.userName || !phoneReg.test(loginForm.userName)){
            ElMessage.warning('请检查手机号是否正确')
            return
      }
      flag.value = true
      if(timer) clearInterval(timer)
      timer = setInterval(()=>{
            if(countDown.time <= 0) {
                  countDown.time = 60
                  countDown.validText = '获取验证码'
                  flag.value = false
                  clearInterval(timer)
            } else {
                  countDown.time -= 1
                  countDown.validText = `剩余${countDown.time}秒`
            }
      },1000)
      

      getCode({tel:loginForm.userName}).then(({data}) =>{
            console.log(data,'data')
            if(data.code === 10000) {
                  ElMessage.success('发送成功')
            }
            }).catch(()=>{
                  ElMessage.error('发送失败')
                  flag.value = false
                  clearInterval(timer)
                  countDown.time = 60
                  countDown.validText = '获取验证码'
            })
      }

const loginFormRef = ref()
const router = useRouter()
const store = useStore()
const routerList = computed(() => store.state.menu.routerList || [])


//表单提交
const submitForm = async (formEl) => {
      if(!formEl) return
      try {
            const valid = await formEl.validate()
            if(valid) {
                  if(formType.value) {
                        const {data} = await useAuthentication(loginForm)
                              if(data.code === 10000) {
                                    ElMessage.success('注册成功,请登录')
                                    formType.value = 0
                              } else {
                                    ElMessage.error(data.msg || '注册失败')
                              }
                  }else {
                        const {data} = await login(loginForm)
                        if(data.code === 10000) {
                              ElMessage.success('登录成功')
                              localStorage.setItem('pz_token',data.data.token)
                              localStorage.setItem('pz_userInfo',JSON.stringify(data.data.userInfo))
                              try {
                                    // 等待菜单权限接口返回
                                    const { data: menuData } = await menuPermissions()
                                    const menuList = menuData?.data || [] // 兜底为空数组
                                    if (!Array.isArray(menuList)) {
                                    throw new Error('菜单数据格式错误，不是数组')
                                    }
                                    // 提交到Vuex
                                    await store.dispatch('menu/generateDynamicRoutes', menuData.data)
                                    console.log(routerList, 'routerList')
                        
                                    // 跳转到首页
                                    const routesToAdd = toRaw(routerList.value) || []
                                    routesToAdd.forEach(item => {
                                    router.addRoute('main', item)
                                    })

                                    // 4. 跳转到首页
                                    router.push('/')
                                    } catch (err) {
                                    console.error('获取菜单权限失败', err)
                                    // 可在这里做错误处理，比如退出登录、提示用户
                                    localStorage.removeItem('pz_token')
                                    localStorage.removeItem('pz_userInfo')
                                    router.push('/login')
                                    }
                        } else {
                              ElMessage.error(data.msg || '登录失败')
                        }
            }
       } else {
                  console.log('error submit!')
            }
      } catch (err) {
            ElMessage.error('网络异常,请重试')
      }
}
                  
            
      







</script>

<style lang="less" scoped>
  :deep(.el-card__header) {
    padding: 0 ;
    margin: 0 
  }
  .col-wrapper {
      height: 100%;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;

  }
  .login-container {
    height: 100vh !important;
    .card-header{
      background-color: #899fe1;
      img {
            width: 100%;
      }
    }
    .jump-link {
      width: 100%;
      text-align: right;
      margin-bottom: 10px;
    }
  }
</style>