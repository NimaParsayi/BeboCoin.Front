<template>
    <div class="flex-center w-full flex-column box-shadow p-3 my-4 bg-card rounded-1">
        <div class="d-flex flex-column w-full">
            <span class="text-color fs-medium fw-bold">Invite Friends</span>
            <div class="line my-2"></div>
            <div class="flex-center flex-column w-full">
                <span class="p-1">Invite 3 of your friends and get $1.</span>
                <p class="p-1">You now invited {{ referralCount }}/3</p>
                <button class="box-shadow p-2 m-1 rounded-1 group_detail_join_button w-full" @click="getReward"
                    :disabled="isUserGotReferralReward">{{ isUserGotReferralReward ? 'You already got this reward' : 'Get Reward' }}</button>
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
            referralCount: 0
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
    },
    methods: {
        getReward() {
            requestPost('/Account/GetReferralReward').then((json) => {
                if (json.status) {
                    window.Swal.fire(`Task successfully completed.`, "", "ok");
                    this.isUserGotReferralReward = true;
                }
            }).catch((err) => {
                window.Swal.fire(err.response, "", "error");
            });
        }
    }
}
</script>
<style lang="">

</style>