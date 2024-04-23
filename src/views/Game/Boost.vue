<template>
    <section v-if="user" class="user_balance py-4">
        <div class="flex-center flex-column">
            <span class="text-color fs-small fw-bold">Your Balance Is</span>
            <div class="flex-center mt-3">
                <img class="mr-2" width="40px" src="@/assets/images/coin/gold.svg" alt="" />
                <h1 class="fs-secondary-large fw-secondary-bold text-color ff-secondary">
                    {{ user.balanceCoin }}
                </h1>
            </div>
        </div>
    </section>

    <div v-if="user" class="section_boost">
        <div class="d-flex flex-column ">
            <span class="text-color fs-medium fw-bold">Boosters</span>
            <div class="flex-center flex-column">
                <PropertyCard @click="$router.push('/')" title="Multi Tap" icon="👆" link="/"
                    :caption="`🏆 Multi Tap ` + formatNumber(user.multipleClick)" />
                <PropertyCard @click="$router.push('/')" title="Energy Limit" icon="⚡" link="/"
                    :caption="`⌛ Limit is ` + formatNumber(user.miningLimit)" />
                <PropertyCard @click="$router.push('/')" title="Recharging Speed" icon="🔋" link="/"
                    :caption="'⏰ ' + formatNumber(user.miningPerTime) + ` per second `" />
                <PropertyCard @click="$router.push('/')" title="Auto Tap Bot" icon="🤖" link="/"
                    :caption="user.autoClick ? '🟢 Is online' : '🔴 Is offline'" />
            </div>
        </div>
    </div>
    <section v-if="user" class="user-product mt-4 d-flex flex-column">
        <span class="text-color fs-medium fw-bold mb-2">Your Skins</span>
        <div class="flex-center">
            <swiper :slides-per-view="2" :space-between="5" :autoplay="{ delay: 500, disableOnInteraction: false, }">

                <swiper-slide>
                    <div :class="checkSelectSkin(user.skin, '~/images/product/default.png') ? 'selected' : ''"
                        @click="!checkSelectSkin(user.skin, '~/images/product/default.png') ? defaultSkin() : () => { }"
                        class="bg-card p-3 box-shadow rounded-1 flex-center">
                        <div class="product_skin_image flex-center rounded-1">
                            <img :src="domain + '/images/Product/default.png'" alt="">
                        </div>
                    </div>
                </swiper-slide>

                <swiper-slide v-for="(item, index) in products" :key="index">
                    <div :class="checkSelectSkin(user.skin, item.skin) ? 'selected' : ''"
                        @click="!checkSelectSkin(user.skin, item.skin) ? setSkin(item.id) : () => { }"
                        class="bg-card p-3 box-shadow rounded-1 flex-center">
                        <div class="product_skin_image flex-center rounded-1">
                            <img :src="domain + item.skin.replace('~', '')" alt="">
                        </div>
                    </div>
                </swiper-slide>
            </swiper>
        </div>

    </section>
</template>

<script>
import { requestGet, requestPost } from '@/stores/commonStore';
import { Autoplay } from "swiper/modules";
import PropertyCard from "@/components/cards/PropertyCard.vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { BASE_URL } from '@/constants/configuration';
import "swiper/css/grid";
import "swiper/css/pagination";
import { formatNumber } from '@/extensions/numberExtension';

export default {
    name: "BoostView",
    data() {
        return {
            user: null,
            products: [],
            domain: BASE_URL

        };
    },
    created() {
        requestGet("/account/profile").then((json) => {
            if (!json) return;
            this.user = json.result;
        });
        requestGet("/product/userBought").then((json) => {
            if (!json) return;
            this.products = json.result;
        });
    },
    methods: {
        formatNumber(number) {
            return formatNumber(number)
        },
        defaultSkin() {
            requestPost("/game/defaultSkin", {}).then((json) => {
                if (!json) return;
                this.user = json.result;
                window.Swal.fire("skin changed successfully", "", "success");

            });
        },
        setSkin(id) {
            requestPost("/game/setSkin?id=" + id, {}).then((json) => {
                if (!json) return;
                this.user = json.result;
                window.Swal.fire("skin changed successfully", "", "success");

            });

        },
        checkSelectSkin(url_1, url_2) {
            return url_1.toLowerCase() == url_2.toLowerCase()
        }
    },
    components: {
        Swiper,
        SwiperSlide,
        PropertyCard
    },
    setup() {
        return {
            modules: [Autoplay],
        };
    },
}
</script>

<style>
.product_skin_image {
    width: 150px;
    height: 150px;
}

.product_skin_image img {
    width: 100%;
    object-fit: contain;
    object-position: center;
}

.selected {
    opacity: 0.5;
}
</style>