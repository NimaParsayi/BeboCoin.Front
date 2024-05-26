<template>
    <section v-if="wallet" class="home_wallet_user py-4">
        <div class="bg-card box-shadow p-3 rounded-2">
            <div class="d-flex flex-column">
                <span class="description-color d-flex align-items-center fs-small fw-bold">
                    <WalletIcon width="16px" height="16px" />
                    Wallet Balance
                </span>
                <h1 class="text-color fs-large fw-bold mt-1">${{ formatNumber(wallet.balance) }}</h1>
                <div class="d-flex align-items-center mt-3">
                    <div @click="$router.push({ path: '/wallet' })"
                        class="col-6 px-1">
                        <div class="wallet_button flex-center rounded-2 box-shadow p-2">
                            <span class="text-color fs-medium fw-bold flex-center">
                                <BoxArrowInDownIcon />
                                Deposit
                            </span>
                        </div>
                    </div>
                    <div @click="$router.push('/game/earn')" class="col-6 px-1">
                        <div class="freecash_button flex-center rounded-2 box-shadow p-2">
                            <span class="fs-medium fw-bold flex-center">
                                <CoinIcon />
                                Free Cash
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="section_game py-3">
        <div @click="$router.push('/game/start')"
            class="d-flex align-items-center justify-content-between bg-card p-2 box-shadow rounded-2">
            <div class="flex-center">
                <div class="flex-center mr-2">
                    <img width="75px" src="@/assets/images/icon/game.png" alt="">
                </div>
                <div class="d-flex flex-column">
                    <span class="fs-medium fw-bold text-color">Start Mining</span>
                    <span class="fs-small fw-bold description-color">Mining <b class="theme-color">Bebo</b> by
                        tapping !</span>
                    <span v-if="user" class="fs-small mt-2 d-flex align-items-center fw-bold description-color">
                        <img class="mr-1" width="15px" src="@/assets/images/coin/gold.svg" alt="">
                        {{ formatNumber(user.balanceCoin) }}
                    </span>

                </div>
            </div>
            <div class="text-color">
                <ArrowRightShortIcon width="25px" height="25px" />
            </div>
        </div>
    </section>
    <section class="section_products py-3">
        <h1 class="text-color fs-medium fw-bold mb-3">Boost by <b class="theme-color">purchasing</b> NFT</h1>
        <swiper :slides-per-view="1" :space-between="10" :modules="modules"
            :autoplay="{ delay: 2500, disableOnInteraction: false, }">
            <swiper-slide v-for="(item, index) in products" class="product_card" :key="index">
                <div class="product_card_container bg-card p-3 box-shadow rounded-1">
                    <div class="flex-center flex-column">
                        <div class="w-full d-flex align-items-center">
                            <div class="col-8">
                                <div class="d-flex flex-column pr-1">
                                    <div class="product_card_name pb-2">
                                        <span class="text-color fs-medium fw-bold">{{ item.title }}</span>
                                        <div
                                            class="mt-2 product_card_price d-flex align-items-center justify-content-between">
                                            <span class="description-color fs-small fw-bold">
                                                $ <b>{{ formatNumber(item.amount) }}</b>
                                            </span>
                                            <button v-if="!item.isBought" @click="buyProduct(item)"
                                                class="product_card_button px-3 py-1 rounded-1 fs-secondary-small fw-bold">
                                                Buy
                                            </button>
                                            <button v-if="item.isBought"
                                                class="bg-card px-3 py-1 rounded-1 fs-secondary-small fw-bold">
                                                Bought
                                            </button>
                                        </div>
                                    </div>

                                    <div class="product_card_line my-2"></div>
                                    <div class="d-flex flex-column mt-2">
                                        <span class="text-color fs-small fw-bold">Ability UnLocked</span>
                                        <div class="flex-center flex-column mt-2">
                                            <div class="flex-center mt-1 w-full rounded-1 p-1">
                                                <img class="mr-2" width="18px" src="@/assets/images/icon/hand.png"
                                                    alt="">
                                                <div class="flex-center flex-column w-full">
                                                    <div
                                                        class="d-flex align-items-center justify-content-between w-full">
                                                        <span class="text-color fs-secondary-small fw-bold">Multi
                                                            Tap</span>
                                                        <span class="text-color fs-secondary-small fw-bold">+ {{
        formatNumber(item.multipleClick) }}</span>
                                                    </div>
                                                    <div class="w-full bg-card rounded-2 mt-1 product_progress ">
                                                        <div class="product_progress_green rounded-1 h-full"
                                                            style="width: 50%;"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="product_card_line mt-1"></div>
                                            <div class="flex-center mt-1 w-full rounded-1 p-1">
                                                <img class="mr-2" width="18px"
                                                    src="@/assets/images/icon/clock_paint.png" alt="">
                                                <div class="flex-center flex-column w-full">
                                                    <div
                                                        class="d-flex align-items-center justify-content-between w-full">
                                                        <span class="text-color fs-secondary-small fw-bold">Recharging
                                                            Speed</span>
                                                        <span class="text-color fs-secondary-small fw-bold">+ {{
        formatNumber(item.miningPerTime) }}</span>
                                                    </div>
                                                    <div class="w-full bg-card rounded-2 mt-1 product_progress ">
                                                        <div class="product_progress_red rounded-1 h-full"
                                                            style="width: 50%;">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="product_card_line mt-1"></div>

                                            <div class="flex-center mt-1 w-full rounded-1 p-1">
                                                <img class="mr-2" width="18px" src="@/assets/images/icon/limit.png"
                                                    alt="">
                                                <div class="flex-center flex-column w-full">
                                                    <div
                                                        class="d-flex align-items-center justify-content-between w-full">
                                                        <span class="text-color fs-secondary-small fw-bold">Energy
                                                            Limit</span>
                                                        <span class="text-color fs-secondary-small fw-bold">+ {{
        formatNumber(item.miningLimit) }}</span>
                                                    </div>
                                                    <div class="w-full bg-card rounded-2 mt-1 product_progress ">
                                                        <div class="product_progress_blue rounded-1 h-full"
                                                            style="width: 50%;">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="product_card_line mt-1 mb-2"></div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="product_card_image">
                                    <img :src="domain + item.skin.replace('~', '')" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="mt-1 w-full d-flex align-items-center justify-content-between rounded-1 p-1">
                            <div class="flex-center ">
                                <img class="mr-2" width="20px" src="@/assets/images/icon/robot.png" alt="">
                                <span class="text-color fs-secondary-small fw-bold">Robot Online <b
                                        class="theme-color">{{
                                        item.autoClickHours }}h</b></span>
                            </div>
                            <div class="flex-center ">
                                <img class="mr-2" width="20px" src="@/assets/images/icon/turbo.png" alt="">
                                <span class="text-color fs-secondary-small fw-bold">Turbo <b class="theme-color">{{
                                        item.turbo ? 'Online' : 'Offline' }}</b></span>
                            </div>
                        </div>
                    </div>

                </div>
            </swiper-slide>
        </swiper>
    </section>
</template>

<script>
import WalletIcon from '@/components/Icons/WalletIcon.vue';
// import BoxArrowInUpIcon from '@/components/Icons/BoxArrowInUpIcon.vue';
import BoxArrowInDownIcon from '@/components/Icons/BoxArrowInDownIcon.vue';
import CoinIcon from '@/components/Icons/CoinIcon.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import ArrowRightShortIcon from '@/components/Icons/ArrowRightShortIcon.vue';
import { requestGet, requestPost } from '@/stores/commonStore';
import { BASE_URL } from '@/constants/configuration';
import { formatNumber } from '@/extensions/numberExtension';
import { Autoplay, Grid, Pagination } from "swiper/modules";

export default {
    name: "IndexView",
    data() {
        return {
            wallet: null,
            products: [],
            user: null,
            domain: BASE_URL
        };
    },
    methods: {
        formatNumber(number) {
            return formatNumber(number);
        },
        deposit() {
            // requestPost("/wallet/deposit").then((json) => {
            //     if (!json) return;
            //     this.wallet = json.result;
            // });
        },
        buyProduct(product) {
            if (product.isBought) return;

            const amount = product.amount;

            if (amount > this.wallet.balance) {
                window.Swal.fire("Your Balance not enough", "", "error");
                return;
            }
            window.Swal.fire({
                title: `Are you sure to buy product ${product.title}?`,
                showCancelButton: true,
                confirmButtonText: "Buy",
            }).then((result) => {
                if (result.isConfirmed) {
                    requestPost("/product/buy?id=" + product.id).then((json) => {
                        if (!json) return;
                        product.isBought = true;
                        this.wallet.balance -= amount;
                        window.Swal.fire("You have successfully purchased the product", "", "success");
                    });
                }
            });
        }
    },
    created() {
        requestGet("/wallet/get").then((json) => {
            if (!json) return;
            this.wallet = json.result;
        });
        requestGet("/account/profile").then((json) => {
            if (!json) return;
            this.user = json.result;
        });
        requestGet("/product/list").then((json) => {
            if (!json) return;
            this.products = json.result;
        });
    },
    components: {
        Swiper,
        CoinIcon,
        SwiperSlide,
        WalletIcon,
        BoxArrowInDownIcon,
        ArrowRightShortIcon
    },
    setup() {
        return {
            modules: [Autoplay, Grid, Pagination]
        };

    },
}
</script>

<style>
.wallet_button {
    background-color: hsl(var(--theme-color));
    cursor: pointer;
}

.wallet_button[disabled] {
    background-color: grey;
    cursor: text;
}

.freecash_button {
    color: rgba(var(--color-light), 0.8);
    background-color: #1f212b;
}


.product_card_image {
    top: 20%;
    right: 2px;
    max-width: 120px;
    position: absolute;
}

.product_card_button {
    color: rgb(var(--color-light));
    background: hsl(var(--theme-color));
}

.product_progress {
    height: 7px;
    overflow: hidden;
    padding: 1px;

}

.product_progress div {
    position: relative !important;
}

.product_progress div::after {
    top: 0;
    right: 0;
    content: '';
    position: absolute;
    box-shadow: 0px 0px 6px rgb(var(--border-color));
    width: 1px;
    height: 100%;
}

.product_progress_green,
.product_progress_blue {
    box-shadow: inset 0px 10px rgba(var(--border-color), 0.3);
}

.product_progress_blue {
    background: #4291eb;

}

.product_progress_yellow {
    background: #e9d947;

}

.product_progress_red {
    background: #da5e5e;

}

.product_progress_green {
    background: #1ebe54;

}

.product_card {
    position: relative;
    padding-right: 10px;

}

.wallet_connect {
    width: 100% !important;
}

.v-btn-container {
    width: 100% !important;

}

.product_card_container {
    border: 2px solid rgba(var(--border-color), 0.5);
}

.product_image {
    min-width: 100px;
    min-height: 100px;
    overflow: hidden;
}

.product_button_buy {
    background: hsl(var(--theme-color));
}

.product_card_line {
    width: 100%;
    height: 1px;
    box-shadow: 0px 0px 7px hsla(var(--border-color), 0.7);
    background: rgba(var(--border-color), 0.5);
}

.product_image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}
</style>