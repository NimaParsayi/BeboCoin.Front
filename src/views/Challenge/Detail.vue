<template>
    <section v-if="challenge" class="section_complet_task py-4">
        <div class="flex-center flex-column">
            <h1 class="fs-large fw-bold text-color">Complete Task</h1>
            <div class="flex-center mt-1">
                <span class="description-color fs-small fw-bold">{{ challenge.title }}</span>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-between bg-card p-3 my-4 box-shadow rounded-1">
            <div class="flex-center">
                <img class="rounded-1" :src="domain + challenge.image.replace('~', '')" width="70" alt="">
                <div class="d-flex flex-column ml-2">
                    <span class="text-color d-flex align-items-center fs-medium fw-bold">
                        <img v-if="challenge.challengeBonus == 0" class="mr-1" width="18px"
                            src="@/assets/images/coin/gold.svg" alt="" />
                        <img v-if="challenge.challengeBonus == 1" class="mr-1" width="20px"
                            src="@/assets/images/icon/money.png" alt="" />
                        {{ formatNumber(challenge.bonus) }} <b class="theme-color ml-1"> Reward !</b>
                    </span>
                    <span class="description-color fs-small fw-bold mt-1">Complete task and get Reward.</span>
                </div>
            </div>
        </div>
        <div class="flex-center w-full flex-column box-shadow p-3 my-4 bg-card rounded-2">
            <div class="d-flex flex-column w-full">
                <span class="text-color fs-medium fw-bold">Tasks</span>
                <div class="line my-2"></div>
                <div class="flex-center flex-column w-full">
                    <h1 v-if="tasks.length == 0" class="description-color fs-medium fw-bold mt-3">Can Not Found
                        Tasks
                    </h1>

                    <TaskCard v-for="(item, index) in tasks" :key="index" :task="item" />
                </div>
            </div>
        </div>

        <div v-if="!joined" @click="challengeCompleted()" class="w-full flex-center flex-column mt-4">
            <button :class="!tasksCompleted() ? 'off-button' : ''"
                class="box-shadow p-2 rounded-1 group_detail_join_button w-full">
                <span class="fs-medium fw-bold">Get Reward</span>
            </button>
        </div>
    </section>

</template>

<script>
import TaskCard from '@/components/cards/TaskCard.vue';
import { BASE_URL } from '@/constants/configuration';
import { formatNumber } from '@/extensions/numberExtension';
import { IsAuthenticated, requestGet, requestPost } from '@/stores/commonStore';

export default {
    name: "ChallengeDetailView",

    data() {
        return {
            domain: BASE_URL,
            challenge: null,
            tasks: [],
            isCompleted: false
        };
    },

    created() {
        if (IsAuthenticated()) {
            requestGet("/challenge/get?id=" + this.$route.params.id).then((json) => {
                if (!json) return;
                this.challenge = json.result;
            });
            requestGet("/challenge/tasks?id=" + this.$route.params.id).then((json) => {
                if (!json) return;
                this.tasks = json.result;
            });

        }
    },
    methods: {
        formatNumber(number){
            return formatNumber(number)
        },
        tasksCompleted() {
            if (!this.tasks) return false;
            this.tasks.forEach(item => {
                if (!item.isCompleted) return false;
            });
            return true;
        },
        challengeCompleted() {
            if (this.isCompleted) {
                window.Swal.fire("You already received the prize", "", "info");
                return
            }
            if (!this.tasksCompleted()) return;

            requestPost("/challenge/completeChallenge?id=" + this.challenge.id, {}).then((json) => {
                if (!json) return;
                this.isCompleted = true;
                window.Swal.fire("Task Completed Successfully", "", "success");
            });
        }

    },
    components: { TaskCard }
};
</script>

<style>
.off-button {
    opacity: 0.5;
}
</style>