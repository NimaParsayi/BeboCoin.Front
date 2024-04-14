<template>
    <div @click="$router.push('/game/state')"
        class="d-flex align-items-center justify-content-between bg-card p-3 my-4 box-shadow rounded-1">
        <div class="flex-center">
            <img src="@/assets/images/icon/squad.png" width="70" alt="" />
            <div class="d-flex flex-column ml-2">
                <span class="text-color fs-medium fw-bold">State Bebe Coin </span>
                <span class="description-color fs-small fw-bold mt-1">Show Description about BebeCoin</span>
            </div>
        </div>
    </div>
    <div class="flex-center w-full flex-column box-shadow py-5 my-4 bg-card rounded-2">
        <swiper :navigation="true" :modules="modules" class="mySwiper">
            <swiper-slide v-slot="{ isActive }">
                {{ isActive ? onSlideChange("bronze") : () => { } }}
                <div class="flex-center flex-column">
                    <img class="image_league mt-4" width="160px" src="@/assets/images/rank/bronze-large.png" alt="">
                    <h1 class="fs-large fw-bold text-color mt-4">Bronze League</h1>
                    <span class="fs-medium fw-bold description-color mt-2">from <b class="theme-color">0</b> bebe
                        Coin</span>
                </div>
            </swiper-slide>
            <swiper-slide v-slot="{ isActive }">
                {{ isActive ? onSlideChange("Silver") : () => { } }}
                <div class="flex-center flex-column">
                    <img class="image_league mt-4" width="160px" src="@/assets/images/rank/silver-large.png" alt="">
                    <h1 class="fs-large fw-bold text-color mt-4">Silver League</h1>
                    <span class="fs-medium fw-bold description-color mt-2">from <b class="theme-color">50,000</b> bebe
                        Coin</span>
                </div>
            </swiper-slide>
            <swiper-slide v-slot="{ isActive }">
                {{ isActive ? onSlideChange("Gold") : () => { } }}
                <div class="flex-center flex-column">
                    <img class="image_league mt-4" width="160px" src="@/assets/images/rank/gold-large.png" alt="">
                    <h1 class="fs-large fw-bold text-color mt-4">Gold League</h1>
                    <span class="fs-medium fw-bold description-color mt-2">from <b class="theme-color">500,000</b> bebe
                        Coin</span>
                </div>
            </swiper-slide>
            <swiper-slide v-slot="{ isActive }">
                {{ isActive ? onSlideChange("Platinum") : () => { } }}
                <div class="flex-center flex-column">
                    <img class="image_league mt-4" width="160px" src="@/assets/images/rank/platinum-large.png" alt="">
                    <h1 class="fs-large fw-bold text-color mt-4">Platinum League</h1>
                    <span class="fs-medium fw-bold description-color mt-2">from <b class="theme-color">1,000,000</b>
                        bebe
                        Coin</span>
                </div>
            </swiper-slide>
            <swiper-slide v-slot="{ isActive }">
                {{ isActive ? onSlideChange("diamond") : () => { } }}
                <div class="flex-center flex-column">
                    <img class="image_league mt-4" width="160px" src="@/assets/images/rank/diamond-large.png" alt="">
                    <h1 class="fs-large fw-bold text-color mt-4">Diamond League</h1>
                    <span class="fs-medium fw-bold description-color mt-2">from <b class="theme-color">10,000,000</b>
                        bebe
                        Coin</span>
                </div>
            </swiper-slide>
        </swiper>
        <div class="flex-center px-3 w-full mt-5">
            <div class="w-full flex-center bg-card rounded-1 p-1 box-shadow">
                <div @click="getSquadList" class="col-6">
                    <div class="flex-center p-3">
                        <span :class="getGroup ? 'text-color' : 'description-color blur_opacity'"
                            class="fs-medium fw-bold">Squads</span>
                    </div>
                </div>
                <div @click="getMinersList" class="col-6">
                    <div class="flex-center p-3">
                        <span :class="!getGroup ? 'text-color' : 'description-color blur_opacity'"
                            class="fs-medium fw-bold">Miners</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div v-if="!getGroup" class="flex-center w-full flex-column box-shadow p-3 my-4 bg-card rounded-2">
        <div class="d-flex flex-column w-full">
            <span class="text-color fs-medium fw-bold">Members</span>
            <div class="line my-2"></div>
            <div class="flex-center flex-column w-full">
                <h1 v-if="users.length == 0" class="description-color fs-medium fw-bold mt-3">Can Not Found
                    Members
                </h1>

                <UserCard v-for="(item, index) in users" :key="index" :index="index + 1" :user="item" />
            </div>
        </div>
    </div>
    <div v-if="getGroup" class="flex-center w-full flex-column box-shadow p-3 my-4 bg-card rounded-2">
        <div class="d-flex flex-column w-full">
            <span class="text-color fs-medium fw-bold">Squads</span>
            <div class="line my-2"></div>
            <div class="flex-center flex-column w-full">
                <h1 v-if="users.length == 0" class="description-color fs-medium fw-bold mt-3">Can Not Found
                    Squads
                </h1>

                <div v-for="(item, index) in users" :key="index" @click="$router.push('/group/detail/' + item.id)"
                    class="w-full d-flex rounded-1 p-2 align-items-center justify-content-between mt-2 bg-card box-shadow">
                    <div class="flex-center">
                        <img class="rounded-circle" width="65px" height="65px" :src="item.image.replace('~', domain)"
                            alt="">
                        <div class="d-flex flex-column ml-2">
                            <span class="text-color fs-medium fw-bold">{{ item.fullName }}</span>
                            <span class="d-flex mt-1 align-items-center description-color fs-small fw-bold">
                                <img class="mr-1" width="18px" :src="getLeague(item.league).path" alt="" />
                                {{ getLeague(item.league).name }}
                            </span>
                        </div>
                    </div>
                    <span class="fs-medium description-color">
                        <ArrowRightShortIcon width="25px" height="25px" />
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import UserCard from '@/components/cards/UserCard.vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { requestGet } from "@/stores/commonStore";
import { formatNumber } from '@/extensions/numberExtension';
import { BASE_URL } from '@/constants/configuration';
import ArrowRightShortIcon from '@/components/Icons/ArrowRightShortIcon.vue';
import { getLeagueInfo } from '@/extensions/leagueExtension';
export default {
    name: "LeagueView",
    data() {
        return {
            users: [],
            getGroup: false,
            domain: BASE_URL,
            league: "bronze"
        };
    },

    setup() {

        return {
            modules: [Navigation],
        };
    },
    components: {
        Swiper,
        SwiperSlide,
        UserCard,
        ArrowRightShortIcon
    },
    created() {
        this.getList()
    },
    methods: {
        getLeague(league) {
            return getLeagueInfo(league)
        },
        onSlideChange(league) {
            this.league = league;
            this.getList()
        },
        formatNumber(number) {
            return formatNumber(number)
        },
        getList(league = this.league, group = this.getGroup) {
            this.users = [];

            requestGet(`/game/leagueList?league=${league}&group=${group}`).then((json) => {
                if (!json) return;

                this.users = json.result;
            });
        },

        getMinersList() {
            this.getGroup = false;
            this.getList()
        },

        getSquadList() {
            this.getGroup = true;
            this.getList()
        }
    }
}
</script>
<style>
.blur_opacity {
    opacity: 0.5;
}

.image_league {
    margin-right: -40px;
}
</style>