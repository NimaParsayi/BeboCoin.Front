<template>
    <div @click="completeTask()" class="d-flex align-items-center justify-content-between py-1 w-full">
        <div class="flex-center">
            <div class="card_image flex-center p-2 box-shadow bg-card mr-3 rounded-2">
                <img v-if="data.isCompleted" src="@/assets/images/icon/done.png" alt="">
                <img v-else src="@/assets/images/icon/clock.png" alt="">
            </div>
            <div class="d-flex flex-column">
                <span class="text-color fs-medium fw-bold">{{ data.title }}</span>
            </div>
        </div>
        <div v-if="!data.isCompleted" class="flex-center text-color">
            <ArrowRightShortIcon v-if="!isOpened" width="25" height="25" />
            <strong v-else style="padding: .3rem .5rem; border-radius: 0.5rem; background: #fff;">Check</strong>
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
            data: this.task,
            isOpened: false
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

            requestPost("/challenge/completeTask?id=" + this.data.id).then((json) => {
                if (!json) return;

                if (json.result.path.toLowerCase().includes("t.me") || json.result.path.toLowerCase().includes("telegram.org")) {
                    if (!json.result.isCompleted) {
                        this.isOpened = true;
                        window.Telegram.WebApp.openTelegramLink(json.result.path);
                    }
                    else if (json.result.path.toLowerCase().includes("bot")) {
                        window.Telegram.WebApp.openTelegramLink(json.result.path);
                        this.data.isCompleted = true;
                    }
                    else this.data.isCompleted = true;
                }
                else {
                    this.data.isCompleted = json.result.isCompleted;
                    window.Telegram.WebApp.openLink(json.result.path);
                }
            })
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