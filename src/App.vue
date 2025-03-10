<template>
    <n-message-provider>
        <RootLayout>
            <RouterView></RouterView>
        </RootLayout>
    </n-message-provider>
</template>

<script setup lang="ts">
import RootLayout from '@/components/Layout/RootLayout.vue'
import { supabase } from '@/lib/supabaseClient'
import { NMessageProvider } from 'naive-ui'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
console.log(supabase);

onMounted(() => {
    useAuthStore().trackAuthChanges()
});

</script>

<style scoped></style>
