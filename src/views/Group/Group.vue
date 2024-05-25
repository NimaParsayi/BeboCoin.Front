<template>
    <section class="section_groups py-4">
        <div class="flex-center">
            <div class="w-full flex-center flex-column">
                <div class="flex-center flex-column">
                    <h1 class="fs-large fw-bold text-color">Join Squad</h1>
                </div>
                <div @click="createSquad()"
                    class="w-full d-flex align-items-center bg-card mt-5 p-3 box-shadow rounded-1">
                    <img src="@/assets/images/icon/squad.png" width="70" alt="">
                    <div class="d-flex flex-column ml-2">
                        <span class="text-color fs-medium fw-bold">Join Other Squad </span>
                        <span class="description-color fs-small fw-bold mt-1">Join Other Squad Or <b
                                class="theme-color">Create</b> New Squad</span>
                    </div>
                </div>
                <!-- <div class="ranking_image_icon w-full flex-center mt-5 mb-3">
                    <img width="100px" src="@/assets/images/icon/ranking.png" alt="">
                </div> -->
                <div class="w-full flex-center flex-column mt-3">
                    <div class="w-full mb-2">
                        <span class="text-color fs-medium fw-bold">Top Squads</span>
                    </div>
                    <div v-for="(item, index) in groups" :key="index" @click="$router.push('/group/detail/' + item.id)"
                        class="w-full d-flex rounded-1 p-2 align-items-center justify-content-between mt-2 bg-card box-shadow">
                        <div class="flex-center">
                            <img class="rounded-circle" width="65px" height="65px"
                                :src="domain + item.image.replace('~', '')" alt="">
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
    </section>
</template>

<script>
import ArrowRightShortIcon from '@/components/Icons/ArrowRightShortIcon.vue';
import { BASE_URL, BOT_LINK } from '@/constants/configuration';
import { getLeagueInfo } from '@/extensions/leagueExtension';
import { IsAuthenticated, requestGet } from '@/stores/commonStore';
import { ref } from 'vue';

export default {
    name: "GroupView",
    data() {
        return {
            groups: ref([]),
            domain: BASE_URL,
        };
    },
    methods: {
        getLeague(index) {
            return getLeagueInfo(index);
        }, createSquad() {
            window.Telegram.WebApp.openTelegramLink(BOT_LINK + '?start=joinsquad')
        }
    },
    created() {
        if (IsAuthenticated()) {
            requestGet("/group/list").then((json) => {
                if (!json)
                    return;
                this.groups = ref(json.result);
            });
        }
    },
    components: { ArrowRightShortIcon }
};
</script>

<style>
@keyframes AnimationImage {
    50% {
        transform: translateY(-5px);
    }

    100% {
        transform: translateY(0px);
    }
}

.ranking_image_icon {
    animation: AnimationImage infinite var(--transition-slow);
}
</style>