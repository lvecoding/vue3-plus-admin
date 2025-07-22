<template>
  <div>
    <el-dropdown trigger="click" @command="handleSetSize">
      <div class="cursor-pointer">{{ language === 'en-US' ? 'English' : '中文' }}</div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item of languageOptions"
            :key="item.value"
            :disabled="language === item.value"
            :command="item.value"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import useAppStore from '@/store/modules/app'

const appStore = useAppStore()
const language = computed(() => appStore.language)
const languageOptions = ref([
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
])

function handleSetSize(language) {
  appStore.setLanguage(language)
}
</script>

<style lang="scss" scoped>
.size-icon--style {
  font-size: 18px;
  line-height: 50px;
  padding-right: 7px;
}
</style>
