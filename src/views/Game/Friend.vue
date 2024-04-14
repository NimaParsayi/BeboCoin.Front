<template>
    <section class="section_friends py-4">
        <div class="flex-center flex-column">
            <h1 class="fs-large fw-bold text-color">Your Frens</h1>
            <div class="flex-center">
                <span class="description-color fs-small fw-bold">{{ formatNumber(followers.length) }} Frens</span>
            </div>
        </div>
        <div @click="addfriend()"
            class="d-flex align-items-center justify-content-between bg-card p-3 my-4 box-shadow rounded-1">
            <div class="flex-center">
                <img src="@/assets/images/icon/referral.png" width="70" alt="">
                <div class="d-flex flex-column ml-2">
                    <span class="text-color fs-medium fw-bold">Invite Friends 💎 </span>
                    <span class="description-color fs-small fw-bold mt-1">Invite Friends and Get <b
                            class="theme-color">10%</b> bonus</span>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-between bg-card p-3 my-4 box-shadow rounded-1">
            <div class="flex-center">
                <img src="@/assets/images/icon/money.png" width="30" alt="">
                <span class="text-color fs-medium fw-bold">Total Profit is <b class="theme-color ml-2">{{ formatNumber(totalProfit) }}$</b> </span>
            </div>
        </div>
        <div class="flex-center w-full flex-column box-shadow p-3 my-4 bg-card rounded-1">
            <div class="d-flex flex-column w-full">
                <span class="text-color fs-medium fw-bold">Your Frens</span>
                <div class="line my-2"></div>
                <div class="flex-center flex-column w-full">
                    <h1 v-if="followers.length == 0" class="description-color fs-medium fw-bold mt-3">Can Not Found
                        Frens
                    </h1>

                    <FollowerCard v-for="(item, index) in followers" :key="index" :index="index" :user="item" />
                </div>
            </div>
        </div>
    </section>

</template>

<script>
import { ref } from 'vue';
import { requestGet, IsAuthenticated } from "@/stores/commonStore";
import FollowerCard from '@/components/cards/FollowerCard.vue';
import { BOT_LINK } from '@/constants/configuration';
import { formatNumber } from '@/extensions/numberExtension';

export default {
    name: "FriendView",
    components: { FollowerCard },
    data() {
        return {
            totalProfit: 0,
            followers: ref([]),
        };
    },
    created() {
        if (IsAuthenticated()) {
            requestGet("/account/followers").then((json) => {
                if (!json) return;

                this.totalProfit = json.result.totalProfit;
                this.followers = ref(json.result.followers);
            });

        }
    },
    methods: {
        formatNumber(number){
            return formatNumber(number)
        },
        addfriend() {
            window.Telegram.WebApp.openTelegramLink(BOT_LINK + '?start=invitefrends')
        }
    }

}
</script>

<style></style>import { IsAuthenticated } from '@/stores/commonStore';import { requestGet } from '@/stores/commonStore';
import { requestGet } from '@/stores/commonStore';
, IsAuthenticatedimport UserCard from '@/components/cards/UserCard.vue';
import UserCard from '@/components/cards/UserCard.vue';
import UserCard from '@/components/cards/UserCard.vue';import UserCard from '@/components/cards/UserCard.vue';
