<!-- src/components/MusicPlayer.vue -->
<script setup>
import { ref, watch } from 'vue'
import { usePlayer } from '../services/player.js'

import iconPlay from '@/assets/icon-player-play.svg'

// 获取指挥中心的所有状态和方法
const player = usePlayer();
const {
  currentSong,
  isPlaying,
  volume,
  playMode,
  isMuted,
  seekRequestTime,
  _clearSeekRequest,
  _updateCurrentTime,
  _updateDuration,
  _onSongEnded,
} = player

// 创建一个对 <audio> 标签的引用
const audioRef = ref(null);
const timeRef = ref(null);
const volumeRef = ref(null);
const songAvatarRef = ref(null);

// --- 监听来自指挥中心的命令 ---

// 1. 监听当前歌曲的变化
watch(currentSong, (newSong) => {
  if (!newSong) {
    audioRef.value.src = ''
    return
  }
  // 设置新的音频源并重置时间
  audioRef.value.src = newSong.src
  audioRef.value.currentTime = 0
  
  // 如果意图是播放，则加载并播放
  if (isPlaying.value) {
    audioRef.value.play()
  }
})

// 2. 监听播放/暂停意图的变化
watch(isPlaying, (nowPlaying) => {
  if (nowPlaying) {
    audioRef.value?.play()
  } else {
    audioRef.value?.pause()
  }
})

// 3. 监听音量和静音的变化
watch(volume, (newVolume) => {
  audioRef.value.volume = newVolume
})
watch(isMuted, (muted) => {
  audioRef.value.muted = muted
})

// ✨ 新增: 监听来自指挥中心的 seek 指令
watch(seekRequestTime, (newTime) => {
  // 如果 newTime 不是 null，说明有跳转请求
  if (newTime !== null && audioRef.value) {
    // 执行跳转
    audioRef.value.currentTime = newTime
    
    // 跳转完成后，通知指挥中心，清除这次请求
    // 这样 _updateCurrentTime 就可以恢复正常工作
    _clearSeekRequest()
  }
})

// --- 向指挥中心汇报引擎的状态 ---

const onTimeUpdate = (event) => {
  _updateCurrentTime(event.target.currentTime)
}

const onLoadedMetadata = (event) => {
  _updateDuration(event.target.duration)
}

</script>

<template>
  <div class="music-player">
    <audio 
      ref="audioRef"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="_onSongEnded"
    ></audio>

    <img class="music-player-avatar" src="https://picsum.photos/200" ref="songAvatarRef"/>
    <div class="music-player-infobox">
        <p class="music-player-songname">{{ currentSong.name }} - {{ currentSong.artist }}</p>
        <input
          type="range"
          class="music-player-slider"
          id="music-player-time"
          name="time"
          min="0"
          :max="0"
          step="0.01"
          ref="timeRef"
          :value="currentTime"
          @input="player.seek($event.target.valueAsNumber)"
        />
    </div>
    <div class="music-player-controller">
        <button class="music-player-button" @click="isPlaying ? player.pause() : player.play()">
          <img v-if="!isPlaying" src="@/assets/icon-player-play.svg" alt="播放"/>
          <img v-if="isPlaying" src="@/assets/icon-player-pause.svg" alt="暂停"/>
        </button>
        <button class="music-player-button" @click="player.togglePlayMode()">
          <img v-if="playMode === 'loop-single'" class="music-player-button-playmode" src="@/assets/icon-player-playmode-loopsingle.svg" alt="单曲循环"/>
          <img v-if="playMode === 'loop-list'" class="music-player-button-playmode" src="@/assets/icon-player-playmode-looplist.svg" alt="列表循环"/>
          <img v-if="playMode === 'shuffle'" class="music-player-button-playmode" src="@/assets/icon-player-playmode-shuffle.svg" alt="列表随机"/>
        </button>
        <button class="music-player-volume-button" @click="player.toggleMute()">
            <img v-if="isMuted" class="music-player-volume-icon" src="@/assets/icon-player-volume-mute.svg" alt="静音"/>
            <img v-if="!isMuted && volume === 0" class="music-player-volume-icon" src="@/assets/icon-player-volume-zero.svg" alt="音量为零"/>
            <img v-if="!isMuted && volume <= 0.5 && volume > 0" class="music-player-volume-icon" src="@/assets/icon-player-volume-low.svg" alt="低音量（小于等于50%）"/>
            <img v-if="!isMuted && volume > 0.5" class="music-player-volume-icon" src="@/assets/icon-player-volume-high.svg" alt="高音量（大于50%）"/>
        </button>
        <input
          type="range"
          class="music-player-slider"
          id="music-player-volume"
          name="volume"
          min="0"
          max="1"
          step="0.01"
          ref="volumeRef"
          v-model="volume"
        />
    </div>
  </div>
  
</template>

<style scoped>
.music-player
{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 120px;
    border-top: 2px solid #181818;
    box-shadow: 0px -5px 10px #0c0c0c;
}

.music-player-avatar
{
    margin: 15px;
    height: calc(100% - 2 * 15px);
    aspect-ratio: 1;
    border-radius: 10px;
    border: 2px solid var(--color-border);
    translate: 0px -5px;
}

.music-player-infobox
{
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
}

.music-player-songname
{
    font-size: 32px;
}

.music-player-controller
{
    margin: 15px;
    display: flex;
    align-items: center;
}

.music-player-button
{
    margin-left: 10px;
    min-width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: transparent;
    border: 2px solid var(--color-border);
    transition: 0.3s all;
}
.music-player-button:hover
{
  background-color: var(--color-border);
}

.music-player-button-playmode
{
    width: 90%;
    translate: 0.5px 0px;
    height: 100%;
    transition: 0.5s all;
}

.music-player-volume-button
{
    margin-left: 25px;
    width: 20px;
    height: 20px;
    background-color: transparent;
    border: none;
    position: relative;
}

.music-player-volume-icon
{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    transition: 0.3s all;
}

.music-player-volume-icon:hover
{
  filter: brightness(0.8);
}

#music-player-volume
{
    margin-left: 10px;
    min-width: 100px;
    max-width: 100px;
}

[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
    outline: 0;
    background-color: transparent;
}

[type="range"]::-webkit-slider-runnable-track {
    height: 4px;
    background: #eee;
}
[type="range"]::-moz-range-track {
    height: 4px;
    background: #eee;
}

[type="range" i]::-webkit-slider-container {
    height: 20px;
    overflow: hidden;
    border-radius: 15px;
}


[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #fc3a6a;
    border: 1px solid transparent;
    margin-top: -8px;
    border-image: linear-gradient(#fc3a6a,#fc3a6a) 0 fill / 10 20 10 0 / 0px 0px 0 2000px;
    transition: 0.3s all;
}
[type="range"]::-webkit-slider-thumb:hover {

    background-color: #c12b50;
    border-image: linear-gradient(#c12b50,#c12b50) 0 fill / 10 20 10 0 / 0px 0px 0 2000px;
}
[type="range"]::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #fc3a6a;
    border: 1px solid transparent;
    margin-top: -8px;
    transition: 0.3s all;
}
[type="range"]::-moz-range-thumb:hover {
    background-color: #c12b50;
}

[type="range" i]::-moz-range-progress {
    height: 8px;
    overflow: hidden;
    background-color: #fc3a6a;
    border-radius: 4px;
    transition: 0.3s all;
}
</style>