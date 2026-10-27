<script setup>
import Navbar from './Navbar.vue'
import stagecardImage from '../Assets/Stagecard.png'
import FestivalVideo from '../Assets/Festival.mp4'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const goToGenre = (genre) => {
  router.push({
    name: 'genre',
    params: { genre },
  })
}
</script>

<template>
  <div class="app-shell">
    <Navbar />
    <main v-if="route.name === 'home'" class="page-content">
      <div class="video-container">
        <video autoplay muted loop playsinline>
          <source :src="FestivalVideo" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="stagecards">
        <button
          type="button"
          class="stagecard"
          aria-label="View Hip-Hop artists"
          @click="goToGenre('Hip Hop')"
        >
          <img :src="stagecardImage" alt="" />
        </button>
        <button
          type="button"
          class="stagecard"
          aria-label="View Rock artists"
          @click="goToGenre('Rock')"
        >
          <img :src="stagecardImage" alt="" />
        </button>
        <button
          type="button"
          class="stagecard"
          aria-label="View Pop artists"
          @click="goToGenre('Pop')"
        >
          <img :src="stagecardImage" alt="" />
        </button>
      </div>
    </main>
    <RouterView v-else />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #1d1b19;
  color: #f0ece7;
}

.page-content {
  margin-top: -86px;
  padding: 0 2rem 2rem;
}

.video-container {
  width: calc(100% + 4rem);
  height: 95vh;
  margin-left: -2rem;
  margin-bottom: 2rem;
  overflow: hidden;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.stagecards {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: min(25rem, 100%);
  margin-inline: auto;
}

.stagecard {
  display: block;
  width: 90%;
  height: 10rem;
  padding: 0;
  border: 0;
  border-radius: 8px;
  overflow: hidden;
  background: transparent;
  cursor: pointer;
}

.stagecard img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stagecard:focus-visible {
  outline: 2px solid white;
  outline-offset: 4px;
}

@media (max-width: 48rem) {
  .page-content {
    padding: 0 1rem 1rem;
  }

  .video-container {
    width: calc(100% + 2rem);
    margin-left: -1rem;
    margin-bottom: 1rem;
  }

  .stagecards {
    width: 100%;
  }
}

:global(body) {
  margin: 0;
  background-color: #1d1b19;
}
</style>
