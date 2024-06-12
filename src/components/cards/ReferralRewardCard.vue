<template>
    <div class="flex-center w-full flex-column box-shadow p-3 my-4 bg-card rounded-1" v-if="user.chatId === 1066096433">
            <div class="d-flex flex-column w-full">
                <span class="text-color fs-medium fw-bold">Invite Friends</span>
                <div class="line my-2"></div>
                <div class="flex-center flex-column w-full">
                    <span>Invite 3 of your friends and get $1.</span>
                    <p>You now invited {{ referralCount }}/3</p>
                    <button class="box-shadow p-2 rounded-1 group_detail_join_button w-full">Get Reward</button>
                </div>
            </div>
        </div>
</template>
<script>
import { IsAuthenticated, requestGet, requestPost } from '@/stores/commonStore';
export default {
    name: "ReferralReward",
    data() {
        return {
            user: null,
            isUserGotReferralReward: false,
            referralCount : 0
        }
    },
    created() {
        if (IsAuthenticated()) {
            requestGet("/Account/Profile").then((json) => {
                if (!json) return;
                this.user = json.result;
            });
            requestPost("/Account/IsUserGotReferralReward").then((json) => {
                if (!json) return;
                this.isUserGotReferralReward = json.result;
            });
            requestGet("/Account/GetUserReferrals").then((json) => {
                if (!json) return;
                this.referralCount = json.result;
            });
        }
    }
}
</script>
<style lang="">
    
</style>