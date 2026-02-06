<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import HomeParticles from './components/HomeParticles.vue'
import HomeHeroCanvas from './components/HomeHeroCanvas.vue'
import ClickEffect from './components/ClickEffect.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <HomeHeroCanvas />
    </template>
    <template #layout-bottom>
      <HomeParticles v-if="frontmatter.layout === 'home'" />
      <ClickEffect v-if="frontmatter.layout === 'home'" />
    </template>
  </Layout>
</template>
