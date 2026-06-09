<template>
  <!-- <el-sub-menu index="1">
          <template #title>
            <el-icon><Location /></el-icon>
            <span>Navigator One</span>
          </template>
          <el-menu-item-group title="Group One">
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title>item four</template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><Menu/></el-icon>
          <span>Navigator Two</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <el-icon><Document /></el-icon>
          <span>Navigator Three</span>
        </el-menu-item> -->

        <template v-for="(item,index) in menuData">
            <el-menu-item 
            @click="handleClick(item, `${index}-${item.meta.id}`)"
            v-if="!item.children || item.children.length == 0"
            :index="`${index}-${item.meta.id}`"
            :key="`${index}-${item.meta.id}`"
            >
            <!-- <el-icon><Setting /></el-icon>
            <span>Navigator Four</span> -->
            <el-icon size="20">
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{item.meta.name}}</span>
            </el-menu-item>


            <el-sub-menu v-else :index="`${index}-${item.meta.id}`">
              <template #title>
                <el-icon size="20">
                <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{item.meta.name}}</span>
              </template>
              <TreeMenu :index="`${index}-${item.meta.id}`"
              :menuData="item.children"
              ></TreeMenu>
            </el-sub-menu>
        </template>





        
</template>

<script setup>
  import {Menu,Document,Setting,Location} from '@element-plus/icons-vue' 
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex'
  import {toRefs} from 'vue'

  const router = useRouter()
  const store = useStore()
  
  const props = defineProps(['menuData','index'])
  const {menuData,index} = toRefs(props)
  //console.log(props,'props')
  //点击菜单
  const handleClick =(item,active) =>{
    //console.log(item,'item')
    store.commit('menu/addMenu',item.meta)
    store.commit('menu/updataMenuActive',active)
    router.push(item.meta.path)
  }
</script>

<style lang="less" scoped>

</style>