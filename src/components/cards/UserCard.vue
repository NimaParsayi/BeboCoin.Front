<template>
    <div class="w-full d-flex align-items-center justify-content-between mt-2">
        <div class="flex-center">
            <div class="user_card_image mr-2">
                <img width="55px" height="55px" class="rounded-circle" src="@/assets/images/group/image.jpg" alt="">
            </div>
            <div class="d-flex flex-column">
                <span class="text-color fs-medium fw-bold">{{ user.firstName }}</span>

                <div class="d-flex align-items-center">
                    <span class="d-flex mt-1 align-items-center description-color fs-small fw-bold mr-2">
                        <img class="mr-1" width="15px" :src="getLeague(user.league).path" alt="" />
                        {{ getLeague(user.league).name }}
                    </span>
                    <span class="d-flex mt-1 align-items-center description-color fs-small fw-bold">
                        <img class="mr-1" width="15px" src="@/assets/images/coin/gold.svg" alt="" />
                        {{ formatNumber(user.balanceCoin) }}
                    </span>
                </div>
            </div>
        </div>
        <span class="text-color fs-medium fw-bold">
            {{ index }}
        </span>

    </div>
</template>

<script>
import { getLeagueInfo } from "@/extensions/leagueExtension";
import { formatNumber } from "@/extensions/numberExtension";

export default {
    name: "UserCard",
    props: {
        user: {
            type: Object,
            default: () => ({}),
        },
        index: {
            type: Number,
        }
    },
    methods: {
        formatNumber(num){
            return formatNumber(num)
        },
        getLeague(index) {
            return getLeagueInfo(index);
        },
    },
}
</script>

<style>
.card_image {
    width: 65px;
    height: 65px;
}

.property_card {
    cursor: pointer;
}
</style>