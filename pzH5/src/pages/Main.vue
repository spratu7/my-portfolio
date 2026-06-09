<template>
  <div class="main-container">
    <div class="page-body">
    <RouterView></RouterView>
    </div>
    <van-tabbar v-model="active" class="custom-tabbar">
      <van-tabbar-item
      v-for="item in router.options.routes[0].children"
      :key="item.path"
      :icon="item.meta.icon"
      :url="`#/${item.path}`">        
      {{ item.meta.name }}
    </van-tabbar-item>
      </van-tabbar>
  </div>

</template>

<script setup>
  import { ref ,onMounted} from 'vue'
  import { useRoute,useRouter } from 'vue-router';
  const active = ref(0)
  const router = useRouter()
  const route = useRoute()

  onMounted(()=>{
    console.log(router,'router')
    const data = router.options.routes[0]
    active.value = data.children.findIndex(item => '/' + item.path === route.path)
  })
</script>

<style lang="less">
  .main-container {
      height: 100dvh; 
      width: 100%;
      position: relative; 
      overflow: hidden;
  } 
  .page-body {
     height: calc(100% - 50px);
     width: 100%;
     overflow-y: auto;
     padding-bottom: 0;
     }
  .custom-tabber {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      z-index: 9999 !important;
    }
    .custom-tabbar .van-tabbar__content {
       position: relative !important;}
</style>