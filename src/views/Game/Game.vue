<template>
  <div v-if="user" :style="isTurbo ? `background-image: url(${require('@/assets/images/coin/gold.svg')})` : ''"
    :class="isTurbo ? 'background_turbo' : ''" class="h-screen d-flex flex-column py-3">
    <section @click="$router.push('/group/squad')" v-if="user && !user.group"
      class="section_group box-shadow p-2 mt-2 bg-card rounded-2">
      <div class="flex-center h-full">
        <span class="text-color flex-center fs-medium fw-bold">
          Json Squad
          <ArrowRightShortIcon width="25" height="25" />
        </span>
      </div>
    </section>
    <section v-if="user && user.group" @click="$router.push('/group/detail/' + user.group.id)"
      class="section_group box-shadow p-2 mt-2 bg-card rounded-2">
      <div class="d-flex align-items-center justify-content-between w-full h-full">
        <div class="flex-center">
          <div class="group_image rounded-1 mr-2">
            <img :src="user.group.image.replace('~', domain)" alt="" />
          </div>
          <div class="d-flex flex-column">
            <span class="group_name fs-small fw-bold text-color">{{ user.group.fullName }}</span>
            <span class="group_name fs-small fw-bold description-color d-flex align-items-center mt-1">
              <div class="group_icon_image d-flex mr-1">
                <img width="15px" src="@/assets/images/coin/gold.svg" alt="" />
              </div>
              {{ formatNumber(miningGroup) }}
            </span>
          </div>
        </div>
        <div class="flex-center">
          <div class="group_rank_image d-flex mr-2">
            <img width="25px" :src="getLeague(user.group.league).path" alt="" />
          </div>
          <span class="fs-small fw-bold description-color">{{ getLeague(user.group.league).name }}</span>
        </div>
      </div>
    </section>

    <section class="section_balance py-4">
      <div class="flex-center flex-column">
        <div class="user_coin_balance flex-center">
          <img class="mr-2" width="40px" src="@/assets/images/coin/gold.svg" alt="" />
          <h1 class="fs-secondary-large fw-secondary-bold text-color ff-secondary">
            {{ formatNumber(mining) }}
          </h1>
        </div>
        <div v-if="user" class="flex-center mt-3">
          <div class="flex-center">
            <div @click="$router.push('/game/state')" class="flex-center state_button mr-3 rounded-1 ">
              <BranchIcon />
              <span class="fs-small fw-bold">State</span>
              <BranchIcon class="reverce" />
            </div>
            <div @click="$router.push('/game/league')" class="flex-center">
              <div class="user_rank_image d-flex mr-2">
                <img width="25px" :src="getLeague(user.league).path" alt="" />
              </div>
              <span class="fs-small fw-bold description-color">{{ getLeague(user.league).name }}</span>
            </div>

          </div>
        </div>
      </div>
    </section>

    <section class="section_game py-4">
      <div class="flex-center mx-auto section_click">
        <img @click="setMarker" :src="user.skin.replace('~', domain)" alt="" />
        <div v-for="(item, index) in scores" :key="index" :style="`top: ${item.y}; left:${item.x};`"
          class="scores_user">
          <span class="text-color fs-secondary-large fw-bold">{{ receiveScoreClick() }}</span>
        </div>
      </div>
    </section>
    <section class="section_footer my-auto py-4">
      <div v-if="user.turbo" @click="getTurbo()" class="turbo mb-4">
        <div class="turbo_button bg-card flex-center p-2 box-shadow rounded-1">
          <div class="flex-center">
            <img width="35px" src="@/assets/images/icon/turbo.png" alt="">

            <span v-if="turboIsActive()" class="text-color fs-medium fw-bold ml-3">
              Boost Speed
            </span>

            <span v-if="!turboIsActive() && timeoutTurbo" class="text-color fs-medium fw-bold ml-3">
              {{ timeoutTurbo.hours }}:{{ timeoutTurbo.minutes }}:{{ timeoutTurbo.seconds }}
            </span>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-between">
        <div class="flex-center">
          <div class="available_coin_icon mr-2">
            <img src="@/assets/images/icon/clock.webp" width="40px" alt="" />
          </div>
          <div class="d-flex flex-column">
            <span class="fs-large fw-secondary-bold text-color">{{
    user ? formatNumber(user.miningLimit) : 0
  }}</span>
            <span class="fs-medium fw-bold description-color mt-1">/ {{ user ? formatNumber(user.availableCoins) : 0
              }}</span>
          </div>
        </div>
        <div class="flex-center bg-card rounded-2 py-2">
          <div @click="$router.push('/game/boost')" class="footer_item flex-center flex-column">
            <div class="flex-center">
              <img width="35px" src="@/assets/images/icon/boost.png" alt="" />
            </div>
            <span class="flex-center text-color mt-1 fs-secondary-small fw-bold">Boost</span>
          </div>
          <div @click="$router.push('/game/earn')" class="footer_item flex-center flex-column">
            <div class="flex-center">
              <img width="35px" src="@/assets/images/icon/earn.webp" alt="" />
            </div>
            <span class="flex-center text-color mt-1 fs-secondary-small fw-bold">Earn</span>
          </div>
          <div @click="$router.push('/game/frens')" class="footer_item flex-center flex-column">
            <div class="flex-center">
              <img width="35px" src="@/assets/images/icon/frens.webp" alt="" />
            </div>
            <span class="flex-center text-color mt-1 fs-secondary-small fw-bold">Frens</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import ArrowRightShortIcon from "@/components/Icons/ArrowRightShortIcon.vue";
import BranchIcon from "@/components/Icons/BranchIcon.vue";
import { BASE_URL } from "@/constants/configuration";
import { getCurrentDateInUTC } from "@/extensions/dateExtension";
import { getLeagueInfo } from "@/extensions/leagueExtension";
import { formatNumber } from "@/extensions/numberExtension";
import { IsAuthenticated, requestGet, requestPost } from "@/stores/commonStore";

export default {
  name: "GameView",
  components: { ArrowRightShortIcon, BranchIcon },
  data() {
    return {
      user: null,
      countClick: 0,
      mining: 0,
      miningGroup: 0,
      domain: BASE_URL,
      scores: [],
      lastClickTime: null,
      botMining: 0,
      isTurbo: false,
      countTurbo: 0,
      turboMultiple: 1,
      timeoutTurbo: null
    };
  },
  created() {
    if (!IsAuthenticated()) return;

    requestGet("/account/profile").then((json) => {
      if (!json) return;

      this.user = json.result;

      this.mining = this.user.balanceCoin;

      if (this.user.group) this.miningGroup = this.user.group.balanceCoin;

      if (!this.user.autoClick) return;

      requestPost("/game/checkAutoClick", {}).then((json) => {
        if (!json) return;

        this.botMining = json.result.autoMiningCount;

        this.mining += this.botMining;

        window.Swal.fire(`You received ${this.botMining} coin from your automaton`, "", "info");
      });

    });
  },
  mounted() {

    setInterval(() => {
      if (!this.user) return;

      if (this.user.availableCoins < this.user.miningLimit)
        this.user.availableCoins += this.user.miningPerTime;
      if (this.lastClickTime && getCurrentDateInUTC() - this.lastClickTime >= 2000) {
        this.submitMining();
        this.lastClickTime = null;
      }
      this.timeoutTurbo = this.turboTimeOut()
    }, 1000);
  },
  methods: {
    formatNumber(number) {
      return formatNumber(number)
    },
    getTurbo() {
      requestGet("/game/turbo").then((json) => {
        if (!json) return;

        this.isTurbo = true;
        this.turboMultiple = json.result.turboMultiple;

        setTimeout(() => {
          this.isTurbo = false;

          requestPost("/game/click", {
            count: this.countTurbo,
            turbo: true
          }).then((json) => {
            if (!json) return;

            this.user = json.result;
            this.countTurbo = 0;

          });
        }, 1000 * 20);
      });
    },
    getLeague(index) {
      return getLeagueInfo(index);
    },
    turboIsActive() {
      if (!this.user) return false;

      var date1 = getCurrentDateInUTC();
      var date2 = new Date(this.user.dateLastTurbo);

      var difference_seconds = date1 - date2;

      if (!this.user.turbo || difference_seconds < 86400000) {
        return false;
      }
      return true;
    },
    turboTimeOut() {
      var currentTime = new Date(this.user.dateLastTurbo);
      var futureDate = new Date(currentTime.getTime() + (24 * 60 * 60 * 1000));

      var diff = futureDate.getTime() - getCurrentDateInUTC().getTime();
      const hours = Math.floor(diff / 1000 / 60 / 60);
      diff -= hours * 1000 * 60 * 60;
      const minutes = Math.floor(diff / 1000 / 60);
      diff -= minutes * 1000 * 60;
      const seconds = Math.floor(diff / 1000);

      return { hours, minutes, seconds }
    },
    setMarker(e) {
      const x = e.offsetX;
      const y = e.offsetY;

      this.click();

      const buttonData = { x: x + "px", y: y + "px", id: getCurrentDateInUTC() };

      this.scores.push(buttonData);

      setTimeout(() => {
        this.removeNumberFromList(buttonData);
      }, 2000);

    },
    receiveScoreClick() {
      if (this.isTurbo)
        return this.turboMultiple * this.user.multipleClick;

      return this.user.multipleClick;
    },
    click() {
      if (this.isTurbo) {
        this.countTurbo++;

        const score = this.countTurbo * (this.user.multipleClick * this.turboMultiple);

        this.addBalanceCoin(score);

        return;
      }

      this.lastClickTime = getCurrentDateInUTC();

      this.countClick++;
      const score = this.countClick * this.user.multipleClick;

      if (this.user.availableCoins < this.user.multipleClick) {
        window.Swal.fire(`Please wait for recharge`, "", "error");
        return;
      }


      this.addBalanceCoin(score);

      this.user.availableCoins -= this.user.multipleClick;
    },
    submitMining() {
      requestPost("/game/click", {
        count: this.countClick + this.botMining,
      }).then((json) => {
        if (!json) return;

        localStorage.setItem("user", JSON.stringify(json.result));
        this.user = json.result;

        this.countClick = 0;
        this.botMining = 0;
      });
    },
    addBalanceCoin(number) {
      this.mining = this.user.balanceCoin + number;

      if (this.user.group)
        this.miningGroup = this.user.group.balanceCoin + number;
    },
    removeNumberFromList(obj) {
      let index = this.scores.indexOf(obj);
      if (index !== -1) {
        this.scores.splice(index, 1);
      }
    },
  },
};
</script>

<style>
@keyframes animationTurbo {
  0% {
    background-position-y: 0%;
  }

  100% {
    background-position-y: 100%;
  }
}

.state_button {
  color: rgb(var(--color-light));
  background: hsl(var(--theme-color));
}

.background_turbo {
  backdrop-filter: blur(-20px);
  background-size: 14%;
  background-position: center center;
  animation: animationTurbo 3s infinite;
}

.section_footer {
  position: relative;
}

.turbo {
  width: max-content;
}

.section_group {
  height: 70px;
}

.section_game {
  position: relative;
}

.scores_user {
  position: absolute;
  z-index: var(--z-index-fixed);
}

@keyframes AnimationScore {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(-100px);
  }
}

.scores_user {
  animation: AnimationScore both var(--transition-slow);
}

.group_image {
  width: 55px;
  height: 55px;
  overflow: hidden;
}

.section_click {
  width: 100%;
  height: 100%;
  max-width: 350px;
  max-height: 350px;
  transition: ease all 0.2s;
}

.section_click img {
  user-select: none;
}

.section_footer {
  margin-bottom: var(--size-space-1) !important;
}

.footer_item {
  width: 75px;
  cursor: pointer;
  position: relative;
}

.footer_item:after {
  right: 0;
  width: 1px;
  content: "";
  height: 34px;
  position: absolute;
  background: rgba(var(--text-color), 0.16);
}

.footer_item:last-child:after {
  display: none;
}

.section_click:active {
  transform: scale(0.95);
}

@media (max-width:400px) {
  .available_coin_icon {
    display: none;
  }
}
</style>
