<template>
    <section v-if="group" class="section_detail py-3">
        <div class="w-full bg-card p-2 box-shadow rounded-1">
            <div class="d-flex align-items-center justify-content-between">
                <div class="flex-center">
                    <div class="group_detail_image flex-center">
                        <img width="65px" height="65px" class="rounded-circle" :src="group.image.replace('~', domain)"
                            alt="">
                    </div>
                    <div class="d-flex flex-column ml-2">
                        <span class="text-color fs-medium fw-bold">{{ group.fullName }}</span>
                        <div class="d-flex align-items-center mt-1">
                            <div class="d-flex mr-1">
                                <img width="20px" :src="getLeague(group.league).path" alt="" />
                            </div>
                            <span class="description-color fs-small fw-bold">{{ getLeague(group.league).name }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="joined" @click="leaveGroup()" class="w-full flex-center flex-column mt-4">
                <button class="box-shadow p-2 rounded-1 group_detail_leave_button w-full">
                    <span class="fs-medium fw-bold">Leave Squad</span>
                </button>
            </div>
            <div v-if="!joined" @click="joinGroup()" class="w-full flex-center flex-column mt-4">
                <button class="box-shadow p-2 rounded-1 group_detail_join_button w-full">
                    <span class="fs-medium fw-bold">Join Squad</span>
                </button>
            </div>
        </div>
        <div class="flex-center flex-column">

            <div class="flex-center w-full flex-column box-shadow p-3 mt-4 bg-card rounded-2">
                <div class="w-full d-flex align-items-center justify-content-between">
                    <div class="flex-center">
                        <img width="30px" src="@/assets/images/coin/gold.svg" alt="" />
                        <div class="d-flex flex-column ml-2">
                            <span class="text-color fs-medium fw-bold">{{ formatNumber(group.balanceCoin) }}</span>
                            <span class="description-color fs-small fw-bold">Mined Coins</span>
                        </div>
                    </div>
                    <div class="group_detail_split_line">
                    </div>
                    <div class="flex-center">
                        <img width="46px" src="@/assets/images/icon/players.png" alt="" />

                        <div class="d-flex flex-column ml-2">
                            <span class="text-color fs-medium fw-bold">{{ formatNumber(group.countMember) }}</span>
                            <span class="description-color fs-small fw-bold">Players</span>
                        </div>
                    </div>

                </div>
                <div class="w-full flex-center flex-column mt-3">
                    <button class="box-shadow p-3 mt-2 rounded-1 bg-card w-full" @click="inviteFriend()">
                        <span class="fs-medium fw-bold text-color">Invite Frends 🎈</span>
                    </button>
                </div>

            </div>
            <div class="flex-center w-full flex-column box-shadow p-3 my-4 bg-card rounded-2">
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
        </div>
    </section>
</template>

<script>
import UserCard from '@/components/cards/UserCard.vue';
import { BASE_URL, BOT_LINK } from '@/constants/configuration';
import { getLeagueInfo } from '@/extensions/leagueExtension';
import { formatNumber } from '@/extensions/numberExtension';
import { IsAuthenticated, requestGet, requestPost } from '@/stores/commonStore';
import { ref } from 'vue';

export default {
    name: "GroupDetail",
    components: { UserCard },

    data() {
        return {
            user: null,
            users: ref([]),
            group: null,
            joined: false,
            domain: BASE_URL
        };
    },

    created() {
        if (IsAuthenticated()) {
            requestGet("/account/profile").then((json) => {
                if (!json) return;

                this.user = json.result;

                if (this.user.group && this.user.group.id == this.$route.params.id) {
                    this.joined = true;
                    this.group = this.user.group;
                }
            });
            if (!this.group) {
                requestGet("/group/get?id=" + this.$route.params.id).then((json) => {
                    if (!json) return;
                    this.group = json.result;
                });
            }
            requestGet("/group/users?id=" + this.$route.params.id).then((json) => {
                if (!json) return;
                this.users = ref(json.result);
            });
        }
    },
    methods: {
        formatNumber(number) {
            return formatNumber(number)
        },
        getLeague(index) {
            return getLeagueInfo(index);
        },
        leaveGroup() {
            window.Swal.fire({
                title: "Do you want to leave this squad?",
                showCancelButton: true,
                confirmButtonText: "Leave",
            }).then((result) => {
                if (result.isConfirmed) {
                    requestPost("/group/leave", {}).then((json) => {
                        if (!json) return;
                        this.joined = false;
                        localStorage.setItem("user", JSON.stringify(json.result));
                        window.Swal.fire("You Are Leave Squad", "", "success");
                    });
                }
            });
        },
        joinGroup() {
            if (!this.group) return;
            requestPost("/group/join?id=" + this.group.id, {}).then((json) => {
                if (!json) return;
                this.joined = true;
                this.users.join(this.user);
                window.Swal.fire("You Are Joined Squad", "", "success");

            });
        },
        inviteFriend(){
            window.Telegram.WebApp.openTelegramLink(`tg://msg_url?url=${BOT_LINK}?start=ref_${this.user.chatId}&text=Build your team to increase your mining rate and earn 500 tickets for a new friend!`);
        }
    }
};
</script>

<style>
.group_detail_split_line {
    width: 1px;
    height: 40px;
    background-color: rgba(var(--text-color), 0.4);
}

.group_detail_leave_button {
    color: rgb(var(--color-light));
    background-color: rgb(var(--color-error));
}

.group_detail_join_button {
    color: rgb(var(--color-light));
    background-color: rgb(var(--color-success));
}

.line {
    height: 2px;
    width: 100%;
    background-color: rgba(var(--description-color), 0.5);
}
</style>