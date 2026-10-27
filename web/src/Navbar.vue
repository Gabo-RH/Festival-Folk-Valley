<script setup>
import { onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import BurgerIconImage from '../Assets/BurgerIcon.png'
import FolkValleyLogoImage from '../Assets/FolkValleyLogo.png'

const emit = defineEmits(['logo-click', 'burger-click'])
const overlay = ref(null)
const isMenuOpen = ref(false)
let overlayAnimation

const toggleMenu = () => {
  if (!overlay.value) return

  overlayAnimation?.kill()
  isMenuOpen.value = !isMenuOpen.value
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''

  if (isMenuOpen.value) {
    overlayAnimation = gsap.fromTo(
      overlay.value,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.35, ease: 'power2.out' },
    )
  } else {
    overlayAnimation = gsap.to(overlay.value, {
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power2.in',
    })
  }

  emit('burger-click')
}

onBeforeUnmount(() => {
  overlayAnimation?.kill()
  document.body.style.overflow = ''
})
</script>

<template>
 <div class="navbar-shell">
  <div
   ref="overlay"
   class="navbar-overlay"
   :aria-hidden="!isMenuOpen"
   @click="toggleMenu"
  ></div>
  <div class="navbar">
   <div class="navbar-content">
    <button class="navbar-button logo-button" type="button" aria-label="Go to the Folk Valley home page" @click="emit('logo-click')">
     <img logo :src="FolkValleyLogoImage" alt="" />
    </button>
    <button
     class="navbar-button burger-button"
     type="button"
     :aria-label="isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
     :aria-expanded="isMenuOpen"
     @click="toggleMenu"
    >
     <img burger :src="BurgerIconImage" alt="" />
    </button>
   </div>
  </div>
 </div>
</template>

<style scoped>
:global(html),
:global(body) {
  overscroll-behavior-y: none;
}

.navbar-shell {
  box-sizing: border-box;
  position: sticky;
  top: 2.5%;
  height: 86px;
  padding-top: 1rem;
  z-index: 1000;
}

.navbar,
.navbar-overlay {
  z-index: 1000;
  box-sizing: border-box;
  outline: #fcfafa15 solid 0.5px;
  background-color: #1d1b1983;
  backdrop-filter: blur(15px);
  border-radius: 8px;
  color: #f0ece7;
}

.navbar {
  position: relative;
  z-index: 1001;
  width: 85%;
  margin-inline: auto;
  height: 70px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1rem;
  margin-top: 0;
}

.navbar-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
}

.navbar-content {
  width: 100%;
  height: 38px;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.navbar-button {
  appearance: none;
  border: 0;
  padding: 0;
  margin: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.navbar-button:focus-visible {
  outline: 2px solid #f0ece7;
  outline-offset: 4px;
  border-radius: 4px;
}

.burger-button {
  margin-top: -2.5rem;
  margin-left: 10rem;
}

.navbar img[burger] {
  width: 6rem;
  height: 8rem;
}

.navbar img[logo] {
  width: 6rem;
  height: 4.5rem;
}

.logo-button {
  margin-left: 1rem;
  margin-top: -1rem;
}

</style>
