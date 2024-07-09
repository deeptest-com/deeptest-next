<template>
  <div class="aibot-main">
    <Aibot serverUrl="http://127.0.0.1:8085/">
      <template #actions>
          <span class="icon-container" title="帮助">
            <span class="help icon dp-link"></span>
          </span>
          <span class="icon-container" title="评论">
            <span class="comments icon dp-link"></span>
          </span>
          <span class="icon-container" title="点赞">
            <span class="up icon dp-link"></span>
          </span>
          <span class="icon-container" title="拍砖">
            <span class="down icon dp-link"></span>
          </span>
      </template>
    </Aibot>
  </div>
</template>

<script lang="ts" setup>
import Aibot from "./component/Aibot/index.vue";


</script>

<style lang="less">
.aibot-main {
}
</style>

<style lang="less" scoped>
.aibot-main {
  padding: 16px;
  width: 320px;
}
</style>
