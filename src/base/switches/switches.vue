<template>
    <ul class="switch">
        <li class="switch-item" @click="switchItem(index)" v-for="(item, index) in switches" :class="{'active': currentIndex === index}" >
            <span>{{item}}</span>
        </li>
    </ul>
</template>
<script>
export default {
    props: {
        switches: {
            type: Array,
            default: []
        },
        currentIndex: {
            type: Number,
            default: 0
        }
    },
    methods: {
        switchItem(index) {
            // this.currentIndex = index;
            this.$emit('switch', index)
        }
    }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .switch
        font-size: 14px
        .switch-item
            float: left
            padding: 5px 20px
            border: 1px solid #333
            color: rgba(255,255,255,0.3)
            &.active
                background: #333
                color: #fff

</style>


