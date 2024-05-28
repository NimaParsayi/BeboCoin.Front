<template>
    <div @click="completeTask()" class="d-flex align-items-center justify-content-between py-1 w-full">
        <div class="flex-center">
            <div class="card_image flex-center p-2 box-shadow bg-card mr-3 rounded-2">
                <img v-if="data.isCompleted" src="@/assets/images/icon/done.png" alt="">
                <img v-if="!data.isCompleted" src="@/assets/images/icon/clock.png" alt="">
            </div>
            <div class="d-flex flex-column">
                <span class="text-color fs-medium fw-bold">{{ data.title }}</span>
            </div>
        </div>
        <div v-if="!data.isCompleted" class="flex-center text-color">
            <ArrowRightShortIcon width="25" height="25" />
        </div>
    </div>
</template>

<script>
import ArrowRightShortIcon from '@/components/Icons/ArrowRightShortIcon.vue';
import { requestPost } from '@/stores/commonStore';

export default {
    name: "TaskCard",
    data() {
        return {
            data: this.task
        };
    },
    components: {
        ArrowRightShortIcon
    },
    props: {
        task: {
            type: Object,
        },
    },
    methods: {
        completeTask() {
            if (this.data.isCompleted) return;


            let resultPath;

            requestPost("/challenge/completeTask?id=" + this.data.id).then((json) => {
                if (!json) return;

                this.data.isCompleted = json.result.isCompleted;
                this.resultPath = json.result.path;
            })
            
            window.Telegram.WebApp.openLink(resultPath);
        }
    }
}
</script>

<style>
.card_image {
    width: 65px;
    height: 65px;
}
</style>