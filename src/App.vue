<template>
    <RootLayout>
        <RouterView></RouterView>
    </RootLayout>
</template>

<script setup lang="ts">
import RootLayout from '@/components/Layout/RootLayout.vue'
import {supabase} from '@/lib/supabaseClient'
console.log(supabase);

</script>

<style scoped></style>
