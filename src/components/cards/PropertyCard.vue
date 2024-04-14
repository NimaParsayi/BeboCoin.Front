<template>
    <div
        class="box-shadow p-2 mt-2 bg-card rounded-2 property_card d-flex align-items-center justify-content-between py-1 w-full">
        <div class="flex-center">
            <div class="card_image flex-center p-2 box-shadow bg-card mr-2 rounded-2">
                <span class="fs-large">{{ icon }}</span>
            </div>
            <div class="d-flex flex-column">
                <span class="text-color fs-small fw-bold">{{ title }}</span>
                <span class="mt-1 description-color fs-secondary-small fw-bold d-flex align-items-center">
                    {{ caption }}
                </span>
            </div>
        </div>
        <div class="flex-center text-color">
            <span class="fs-small fw-bold text-color">🎗 Upgrade</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "PropertyCard",

    props: {
        icon: {
            type: String,
        },
        title: {
            type: String,
        },
        caption: {
            type: String,
        },
        link: {
            type: String,
        }
    }
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