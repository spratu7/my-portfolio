<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" size="20" @click="handlefold"><Fold /></el-icon>
      <ul class="flex-box">
        <li v-for="(item,index) in selectMenu" 
        :key="item.path"
        :class="[
          'tab flex-box',
          {selected: route.path === item.path}]"
        >
          <el-icon class="icon" size="20" ><component :is="item.icon"></component></el-icon>
          <RouterLink class="text flex-box" :to="{path: item.path}">{{ item.name }}</RouterLink>
          <el-icon class="icon close" size="20" @click="closeTag(item,index)"><Close /></el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right flex-box">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex-box">
           <el-avatar
              :src="userInfo.avatar"
          />
          <p class="user-name">{{ userInfo.name }}</p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
  import {computed} from 'vue'
  import {useStore} from 'vuex'
  import {useRoute,useRouter} from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))

  const selectMenu = computed(()=>{
    return store.state.menu.selectMenu
  })
  const handlefold = () => {
    store.commit('menu/collapseMenu')
  }
  const closeTag = (item,index)=> {
    //如果是当前页
    if(route.path !== item.path) {
      store.commit('menu/closeMenu',item)
      return
    }
    const selectMenuData = selectMenu.value
    //如果删的是最后一项
    if(index === (selectMenuData.length - 1)) {
      if(selectMenuData.length === 1){
        router.push('/')
      } else {
        router.push({
          path: selectMenuData[index - 1].path
        })
      }
    } else {
      router.push({
          path: selectMenuData[index + 1].path
        })
    }
    store.commit('menu/closeMenu',item)
  }

  const handleClick = (command) => {
    if(command === 'cancel'){
      localStorage.removeItem('pz_token')
      localStorage.removeItem('pz_userInfo')
      localStorage.removeItem('pz_v3')
      window.location.href = window.location.origin
    }
  }
  
</script>

<style lang="less" scoped>
  .flex-box {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .header-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color:#fff;
    padding-right: 20px;
  }
  .header-left {
    height: 100%;
    .icon {
      width: 45px;
      height: 100%;
    }
    .icon:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }
    .tab {
      padding: 0 10px;
      height: 100%;
      .text {
        margin: 0 5px;
      }
      .close {
        visibility: hidden;
      }
      &.selected {
        a {
          color: #409eff;
        }
        i {
          color: #409eff;
        }
        background-color: #f5f5f5;
      }
    }
    .tab:hover {
      background-color: #f5f5f5;
      .close {
        visibility: inherit;
        cursor: pointer;
        color: #333;
      }
    }
  }
  .header-right {
    .user-name {
      margin-left: 10px;
    }
  }
  a {
    height: 100%;
    color: #333;
    font-style: 15px;
  }
  
</style>