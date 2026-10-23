<script lang="ts" setup>
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition mode="out-in" name="page">
          <component :is="Component" :key="$route.path" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
    <el-backtop :bottom="36" :right="32" />
  </div>
</template>
