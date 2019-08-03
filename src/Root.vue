<template>
  <div id="root" class="root">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="scss">
  body .el-table th.gutter{
    display: table-cell!important;
  }
  body .el-table colgroup.gutter{
    display: table-cell!important;
  }
  .root{
    width: 100%;
    height: 100%;
  }
  .el-scrollbar__thumb {
    width: 0px!important;
  }
</style>
