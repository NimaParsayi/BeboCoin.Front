<template>
    <div @click="openChallengeDetail()"
        class="d-flex align-items-center justify-content-between py-1 w-full">
        <div class="flex-center">
            <div :class="challenge.isCompleted ? 'completed' : ''"
                class="card_image flex-center p-2 box-shadow bg-card mr-2 rounded-2">
                <img class="rounded-1" :src="domain + challenge.image.replace('~', '')" alt="">
            </div>
            <div class="d-flex flex-column" :class="challenge.isCompleted ? 'completed' : ''">
                <span class="text-color fs-small fw-bold">{{ challenge.title }}</span>
                <span class="mt-1 description-color fs-secondary-small fw-bold d-flex align-items-center">
                    <img v-if="challenge.challengeBonus == 0" class="mr-1" width="15px"
                        src="@/assets/images/coin/gold.svg" alt="" />
                    <img v-if="challenge.challengeBonus == 1" class="mr-1" width="20px"
                        src="@/assets/images/icon/money.png" alt="" />
                    {{ formatNumber(challenge.bonus) }}
                </span>
            </div>
        </div>
        <div class="flex-center text-color">
            <ArrowRightShortIcon v-if="!challenge.isCompleted" width="25" height="25" />
            <span v-if="challenge.isCompleted" class="description-color fs-small fw-bold">Completed</span>
        </div>
    </div>
</template>

<script>
import ArrowRightShortIcon from '@/components/Icons/ArrowRightShortIcon.vue';
import { BASE_URL } from '@/constants/configuration';
import { formatNumber } from '@/extensions/numberExtension';

export default {
    name: "ChallengeCard",
    components: {
        ArrowRightShortIcon
    },
    data() {
        return {
            domain: BASE_URL,
        };
    },
    props: {
        challenge: {
            type: Object,
        },

    },methods:{
        formatNumber(number){
            return formatNumber(number)
        },
        openChallengeDetail(){
            if (!this.challenge.isCompleted) {
                this.$router.push('/challenge/' + this.challenge.id);
            }
        }
    }
}
</script>

<style>
.card_image {
    width: 65px;
    height: 65px;
}

.completed {
    opacity: 0.7;
}
</style>