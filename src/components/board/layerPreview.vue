<template>
    <path>
    </path>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LayerType } from "@/types/canvas"


interface LayerPreviewProps {
    id: string
}

defineProps<LayerPreviewProps>()

const layer = ref(null)



</script>
