<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const artists = ref([])
const error = ref('')
const isLoading = ref(false)

const loadArtists = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const response = await fetch(
      `/api/artists?genre=${encodeURIComponent(route.params.genre)}`
    )

    if (!response.ok) {
      throw new Error('Could not load artists')
    }

    artists.value = await response.json()
  } catch (requestError) {
    artists.value = []
    error.value = 'The artists could not be loaded.'
    console.error(requestError)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadArtists)
watch(() => route.params.genre, loadArtists)

const formatTime = (date) => {
  if (!date) return 'Time unavailable'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
</script>

<template>
  <main class="lineup-page">
    <div class="lineup-header">
      <RouterLink class="back-link" to="/">Back to stages</RouterLink>
      <h1>{{ route.params.genre }} lineup</h1>
      <p class="lineup-intro">Discover the artists performing in this genre.</p>
    </div>

    <p v-if="isLoading" class="status-message">Loading artists...</p>
    <p v-else-if="error" class="status-message error-message" role="alert">{{ error }}</p>
    <p v-else-if="artists.length === 0" class="status-message">
      No artists found for this genre.
    </p>

    <div v-else class="artist-grid">
      <article v-for="artist in artists" :key="artist.id" class="artist-card">
        <img
          class="artist-image"
          :src="artist.photo_url"
          :alt="`${artist.name} portrait`"
        />
        <div class="artist-content">
          <h2>{{ artist.name }}</h2>
          <p class="artist-genres">{{ artist.genre }}</p>
          <dl class="artist-details">
            <div>
              <dt>Stage</dt>
              <dd>{{ artist.stage }}</dd>
            </div>
            <div>
              <dt>Performance</dt>
              <dd>{{ formatTime(artist.start_time) }} - {{ formatTime(artist.end_time) }}</dd>
            </div>
          </dl>
          <p class="artist-bio">{{ artist.bio }}</p>
        </div>
      </article>
    </div>
  </main>
</template>

<style scoped>
.lineup-page {
  min-height: calc(100vh - 86px);
  box-sizing: border-box;
  max-width: 72rem;
  margin: 0 auto;
  padding: 1rem 2rem 3rem;
}

.lineup-header {
  margin: 0 auto 2rem;
  text-align: center;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #e4a45c;
  text-decoration: none;
}

.back-link:hover,
.back-link:focus-visible {
  color: #f0ece7;
  text-decoration: underline;
}

h1 {
  margin: 0;
  color: #f0ece7;
  font-size: clamp(2rem, 5vw, 3.5rem);
}

.lineup-intro {
  margin: 0.75rem 0 0;
  color: #bcb5ae;
}

.artist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
  gap: 1.25rem;
}

.artist-card {
  overflow: hidden;
  border: 1px solid #e4a45c38;
  border-radius: 8px;
  background: #292522;
  box-shadow: 0 0.75rem 2rem #00000025;
}

.artist-image {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  background: #1d1b19;
}

.artist-content {
  padding: 1.25rem;
}

h2 {
  margin: 0;
  color: #f0ece7;
  font-size: 1.4rem;
}

.artist-genres {
  margin: 0.4rem 0 1rem;
  color: #e4a45c;
}

.artist-details {
  display: grid;
  gap: 0.75rem;
  margin: 0;
}

.artist-details div {
  display: grid;
  gap: 0.15rem;
}

dt {
  color: #938b83;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

dd {
  margin: 0;
  color: #f0ece7;
}

.artist-bio {
  margin: 1rem 0 0;
  color: #cbc4bd;
  line-height: 1.5;
}

.status-message {
  margin: 3rem auto;
  color: #f0ece7;
  text-align: center;
}

.error-message {
  color: #e99b88;
}

@media (max-width: 48rem) {
  .lineup-page {
    padding: 1rem 1rem 2rem;
  }
}
</style>