<template>
    <section class="section_earn py-4">
        <div class="flex-center flex-column">
            <h1 class="fs-large fw-bold text-color">Earn</h1>
        </div>
        <div @click="addfriend()" class="d-flex align-items-center justify-content-between bg-card p-3 my-4 box-shadow rounded-1">
            <div class="flex-center">
                <img src="@/assets/images/icon/referral.png" width="70" alt="" />
                <div class="d-flex flex-column ml-2">
                    <span class="text-color fs-medium fw-bold">Interaction! 💎 </span>
                    <span class="description-color fs-small fw-bold mt-1">Earn more by <span class="theme-color">Tasks</span></span>
                </div>
            </div>
        </div>
        <div class="flex-center w-full flex-column box-shadow p-3 my-4 bg-card rounded-1">
            <div class="d-flex flex-column w-full">
                <span class="text-color fs-medium fw-bold">Your Challenges</span>
                <div class="line my-2"></div>
                <div class="flex-center flex-column w-full">
                    <h1 v-if="challenges.length == 0" class="description-color fs-medium fw-bold mt-3">
                        Can Not Found challenges
                    </h1>
                    <swiper :slidesPerView="1" :grid="{ rows: 3, fill: 'row' }" :spaceBetween="10" :modules="modules"
                        :autoplay="{
                        delay: 2500,
                        disableOnInteraction: false,
                    }">
                        <swiper-slide v-for="(item, index) in challenges" :key="index">
                            <ChallengeCard :challenge="item" />
                        </swiper-slide>

                    </swiper>
                </div>
                <ReferralRewardCard></ReferralRewardCard>
            </div>
        </div>


    </section>
</template>

<script>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css/grid";
import "swiper/css/pagination";

import { Autoplay, Grid, Pagination } from "swiper/modules";
import ChallengeCard from "@/components/cards/ChallengeCard.vue";
import ReferralRewardCard from "@/components/cards/ReferralRewardCard.vue";
import { IsAuthenticated, requestGet } from "@/stores/commonStore";
import { BOT_LINK } from "@/constants/configuration";

export default {
    name: "EarnView",
    data() {
        return {
            challenges: ref([]),
        };
    },
    created() {
        if (!IsAuthenticated()) return;

        requestGet("/challenge/list").then((json) => {
            if (!json) return;

            this.challenges = ref(json.result);
        });
    },
    components: {
        Swiper,
        SwiperSlide,
        ChallengeCard,
        ReferralRewardCard
    },
    setup() {
        return {
            modules: [Autoplay, Grid, Pagination],
        };
    },
    methods: {
        addfriend() {
            window.Telegram.WebApp.openTelegramLink("https://t.me/share/url?url="+ BOT_LINK + '?start=invitefrends&text=test')
        }
    }
};
</script>

<style>
.swiper {
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
}
</style>
