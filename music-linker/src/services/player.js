// src/services/player.js
import { ref, computed, readonly } from 'vue'

// --- 核心状态 (私有，模块级单例) ---
const playlist = ref([
  {
    name: "Rise up",
    artist: "*Luna",
    length: 303.24,
    src: "https://essentials.pixfort.com/original/wp-content/uploads/sites/4/2020/02/skanews.wav"
  }
])
const currentIndex = ref(0) // -1 表示没有歌曲被选中
const isPlaying = ref(false)
const volume = ref(0.8) // 默认音量 80%
const isMuted = ref(false)
const playMode = ref('loop-list') 
const playModes = ['loop-list', 'loop-single', 'shuffle']
const playedIndexs = ref([]) // 已播放的歌曲索引

// --- 派生/引擎状态 (由 UI 组件更新) ---
const currentTime = ref(0)
const duration = ref(0)
const seekRequestTime = ref(null) // ✨ 新增: 用于存放用户拖动进度条请求的时间


// --- Composable 函数 ---
export function usePlayer() {

  // --- 计算属性 (方便外部使用) ---
  const currentSong = computed(() => {
    return playlist.value[currentIndex.value] || null
  })

  // --- 内部方法 ---
  const _playSongAtIndex = (index) => {
    if (index >= 0 && index < playlist.value.length) {
      currentIndex.value = index
      isPlaying.value = true
    }
  }

  // --- 暴露给组件的方法 (API) ---
  // 👇 新增: 用户意图跳转到某个时间点
  const seek = (time) => {
    // 我们不直接修改 currentTime，而是记录一个“寻道请求”
    // currentTime 应该主要由 audio 标签驱动
    seekRequestTime.value = time
  }

  // --- 暴露给引擎室的特殊更新方法 ---
  const _updateCurrentTime = (time) => {
    // 当没有寻道请求时，才接受来自 audio 标签的时间更新
    if (seekRequestTime.value === null) {
      currentTime.value = time
    }
  }

  // 👇 新增: 清除寻道请求的方法
  const _clearSeekRequest = () => {
    seekRequestTime.value = null
  }
  
  const setPlaylistAndPlay = (songs, startIndex = 0) => {
    playlist.value = songs
    _playSongAtIndex(startIndex)
  }

  const play = () => { if (currentSong.value) isPlaying.value = true }
  const pause = () => { isPlaying.value = false }
  
  const playNext = () => {
    let nextIndex = 0;
    if (playMode.value === 'loop-list') {
      nextIndex = (currentIndex.value + 1) % playlist.value.length;
    } else if (playMode.value === 'loop-single') {
      nextIndex = currentIndex.value;
    } else if (playMode.value === 'shuffle') {
      nextIndex = Math.floor(Math.random() * playlist.value.length);
    }
    _playSongAtIndex(nextIndex)
  }
  
  const playPrev = () => {
    const prevIndex = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
    _playSongAtIndex(prevIndex)
  }

  const setVolume = (vol) => { volume.value = vol }
  const toggleMute = () => { isMuted.value = !isMuted.value }

  const togglePlayMode = () => {
    // playModes 应该是一个数组，比如 ['loop-list', 'loop-single', 'shuffle']
    // playMode.value 是当前模式的字符串
    const currentModeIndex = playModes.indexOf(playMode.value);
    // 计算下一个模式的索引
    const nextModeIndex = (currentModeIndex + 1) % playModes.length;
    playMode.value = playModes[nextModeIndex];
    // console.log('切换播放模式:', playMode.value)
  }

  // --- 暴露给引擎室（MusicPlayer.vue）的特殊更新方法 ---
  // 用下划线开头，表示它们是供内部系统使用的
  const _updateDuration = (d) => { duration.value = d }
  const _onSongEnded = () => {
    // 当一首歌自然播放结束时，根据播放模式决定下一步
    if (playMode.value === 'loop-list') {
      playNext()
    }
    // ...可以添加其他模式的逻辑
  }

  return {
    // 只读状态
    playlist: readonly(playlist),
    currentIndex: readonly(currentIndex),
    currentSong,
    isPlaying: readonly(isPlaying),
    volume: readonly(volume),
    isMuted: readonly(isMuted),
    playMode: readonly(playMode),
    currentTime: readonly(currentTime),
    duration: readonly(duration),
    seekRequestTime: readonly(seekRequestTime),

    // 控制方法
    setPlaylistAndPlay,
    play,
    pause,
    playNext,
    playPrev,
    setVolume,
    toggleMute,
    togglePlayMode,
    seek,

    // 内部更新方法
    _updateCurrentTime,
    _updateDuration,
    _onSongEnded,
  }
}