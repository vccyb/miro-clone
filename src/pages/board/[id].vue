<template>
    <div>
        <info />
        <participants />
        <toolbar />
        </div>
</template>

<script setup>
import info from '@/components/board/info.vue'
import participants from '@/components/board/participants.vue'
import toolbar from '@/components/board/toolbar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
</script>
