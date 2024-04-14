<template>
    <section class="global_balance py-4">
        <div class="flex-center flex-column">
            <span class="text-color fs-small fw-bold">Global Coin Balance</span>
            <div class="flex-center mt-3">
                <img class="mr-2" width="40px" src="@/assets/images/coin/gold.svg" alt="" />
                <h1 class="fs-secondary-large fw-secondary-bold text-color ff-secondary">
                    {{ formatNumber(globalBalance) }}
                </h1>
            </div>
        </div>
    </section>
    <section class="website_information">
        <div class="box-shadow p-2 mt-2 bg-card rounded-1">
            <div class="d-flex align-items-center">
                <img src="@/assets/images/icon/users.png" width="70" alt="">
                <div class="d-flex flex-column ml-2">
                    <span class="text-color fs-medium fw-bold">{{ formatNumber(totalUsers) }}</span>
                    <span class="description-color fs-small fw-bold mt-1">Total <b class="theme-color">Users</b></span>
                </div>
            </div>
        </div>
        <div class="box-shadow p-2 mt-2 bg-card rounded-1">
            <div class="d-flex align-items-center">
                <img src="@/assets/images/icon/online.png" width="70" alt="">
                <div class="d-flex flex-column ml-2">
                    <span class="text-color fs-medium fw-bold">{{ formatNumber(totalOnlines) }}</span>
                    <span class="description-color fs-small fw-bold mt-1">Online <b class="theme-color">Users</b></span>
                </div>
            </div>
        </div>
        <div class="box-shadow p-2 mt-2 bg-card rounded-1">
            <div class="d-flex align-items-center">
                <img src="@/assets/images/icon/clock.png" width="70" alt="">
                <div class="d-flex flex-column ml-2">
                    <span class="text-color fs-medium fw-bold">{{ formatNumber(dailyUsers) }}</span>
                    <span class="description-color fs-small fw-bold mt-1">Daily <b class="theme-color">Users</b></span>
                </div>
            </div>
        </div>

    </section>

</template>
<script>
import { requestGet, IsAuthenticated } from "@/stores/commonStore";
import { formatNumber } from '@/extensions/numberExtension';

export default {
    name: "StateView",
    data() {
        return {
            globalBalance: 0,
            totalOnlines: 0,
            totalUsers: 0,
            dailyUsers: 0,
        };
    },
    created() {
        if (IsAuthenticated()) {
            requestGet("/game/state").then((json) => {
                if (!json) return;

                this.globalBalance = json.result.countGlobalCoin;
                this.totalUsers = json.result.countGlobalUsers;
                this.totalOnlines = json.result.countOnlineUsers;
                this.dailyUsers = json.result.dailyJoinUsers;
            });
        }
    },
    methods: {
        formatNumber(number) {
            return formatNumber(number)
        },
    }
}
</script>