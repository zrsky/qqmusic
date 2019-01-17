<template>
  <transition name="slide">
    <div class="myhome-wrapper">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <Switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex" class="switch-wrapper"></Switches>
      <div class="playBtn" @click="random">
        <i class="icon-play"></i>
        <span>随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll v-if="currentIndex === 0" :data="favoriteList">
          <div class="list-inner">
            <song-list @select="selectItem" :songs="favoriteList"></song-list>
          </div>
        </scroll>
        <scroll v-if="currentIndex === 1" :data="playHistory">
          <div class="list-inner">
            <song-list @select="selectItem" :songs="playHistory"></song-list>
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>
<script>
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import {mapGetters, mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      currentComponent: null,
      currentIndex: 0,
      switches: ['我喜欢的', '最近听的'],
    }
  },
  computed: {
    ...mapGetters([
      'favoriteList',
      'playHistory',
      'playlist'
    ])
  },
  methods: {
    random() {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        if (list.length === 0) {
          return
        }
        // list = list.map((song) => {
        //   return new Song(song)
        // })
        this.randomPlay({
          list
        })
      },
    back() {
      this.$router.back();
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    selectItem(song, index) {
				this.insertSong(song)
    },
    handlePlaylist() {
      const bottom = this.playlist.length > 0 ? '60px' : 0;
      this.$refs.listWrapper.style.bottom = bottom;
    },
    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  },
  components: {
    Switches,
    Scroll,
    SongList
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .myhome-wrapper
        width: 100%
        position: fixed
        background: #222
        top: 0
        bottom: 0
        z-index: 100
        &.slide-enter-active, &.slide-leave-active
            transition: all 0.3s
        &.slide-enter, &.slide-leave-to
            transform: translate3d(100%, 0, 0)
        .back
            color: #ffcd32
            margin: 10px 15px
            font-size: 20px
        .switch-wrapper
            position: absolute
            top: 11px
            left: 50%
            transform: translate3d(-50%, 0, 0)
        .playBtn
            color: rgba(255,255,255,0.5)
            font-size: 13px
            text-align: center
            display: inline-block
            padding: 7px 20px
            border: 1px solid rgba(255,255,255,0.5)
            border-radius: 24px
            margin-left: 50%
            transform: translate3d(-50%,0,0)
            margin-top: 20px
            margin-bottom: 10px
          .list-wrapper
            position: absolute
            top: 110px
</style>


