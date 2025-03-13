<template>
    <div class="container mx-auto">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">收藏的白板</h1>
        </div>

        <div class="grid grid-cols-3 gap-6">
            <div v-for="i in 3" :key="i"
                class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                <div class="h-40 bg-gray-50 flex items-center justify-center relative">
                    <iconify-icon icon="material-symbols:dashboard-outline" width="48" height="48"
                        class="text-gray-400" />
                    <div class="absolute top-2 right-2">
                        <iconify-icon icon="material-symbols:star" class="text-yellow-400" width="24" height="24" />
                    </div>
                </div>

                <div class="p-5">
                    <div class="flex items-center mb-3">
                        <div>
                            <div class="font-medium text-lg">收藏的白板 {{ i }}</div>
                            <div class="text-sm text-gray-500">收藏于 {{ i }} 天前</div>
                        </div>
                    </div>

                    <div class="flex justify-between items-center mt-2">
                        <div class="text-xs text-gray-500">
                            创建者: 用户{{ i }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>