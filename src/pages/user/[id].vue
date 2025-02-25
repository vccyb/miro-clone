<template>
  <div>
    <h1>User Detail Page</h1>
    <div>
      <p>User ID: {{ id }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useRoute } from 'vue-router'


const route = useRoute('/user/[id]')
const id = route.params.id ?? '0'

</script>

<style scoped></style>
