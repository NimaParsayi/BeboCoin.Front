<template>
    <svg :width="width" :height="height" :fill="fill" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
        <path
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m5.904-2.803a.5.5 0 1 0-.707.707L9.293 10H6.525a.5.5 0 0 0 0 1H10.5a.5.5 0 0 0 .5-.5V6.525a.5.5 0 0 0-1 0v2.768z" />

    </svg>
</template>

<script>
export default {
    name: "BoxArrowInDownIcon",
    props: {
        width: {
            type: [Number, String],
            default: 18
        },
        height: {
            type: [Number, String],
            default: 18
        },
        fill: {
            type: String,
            default: 'currentColor'
        }
    }
}
</script>