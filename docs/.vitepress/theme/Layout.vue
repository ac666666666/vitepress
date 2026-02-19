<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { nextTick, provide, onMounted, onUnmounted } from "vue";
import HomeParticles from "./components/HomeParticles.vue";
import HomeHeroCanvas from "./components/HomeHeroCanvas.vue";
import ClickEffect from "./components/ClickEffect.vue";

const { Layout } = DefaultTheme;
const { frontmatter, isDark } = useData();

const enableTransitions = () =>
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

provide("toggle-appearance", async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value;
    return;
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`,
  ];

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  }).ready;

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: "ease-in",
      pseudoElement: `::view-transition-${isDark.value ? "old" : "new"}(root)`,
    }
  );
});

// 添加全局点击拦截，以支持默认主题的切换按钮
onMounted(() => {
  window.addEventListener("click", handleSwitchClick, { capture: true });
});

onUnmounted(() => {
  window.removeEventListener("click", handleSwitchClick, { capture: true });
});

function handleSwitchClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  // 检查是否点击了切换按钮 (VPSwitchAppearance)
  // VPSwitchAppearance 是默认主题中切换按钮的类名
  if (target.closest(".VPSwitchAppearance") && enableTransitions()) {
    event.preventDefault();
    event.stopPropagation();

    const x = event.clientX;
    const y = event.clientY;

    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const transition = document.startViewTransition(async () => {
      isDark.value = !isDark.value;
      await nextTick();
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 400,
          easing: "ease-in",
          pseudoElement: isDark.value
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
  }
}
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
