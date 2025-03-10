<template>
  <div>Home Page</div>
  <n-button @click="logout">注销</n-button>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { logoutFn } from "@/service/auth";
const logout = async () => {
  await logoutFn()
}

</script>

<style scoped></style>
