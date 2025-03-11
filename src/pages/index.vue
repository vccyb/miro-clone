<template>
  <div>Home Page</div>
  <n-button @click="logout">注销</n-button>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { logoutFn } from "@/service/auth";
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = async () => {
  await logoutFn()
  router.push('/login')
}

</script>

<style scoped></style>
