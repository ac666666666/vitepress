<script setup>
import { onMounted, onUnmounted, ref, shallowRef, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});

const chartContainer = ref(null);
const chartInstance = shallowRef(null);

const getOption = (type) => {
  switch (type) {
    case "bar":
      return {
        title: { text: "销量统计" },
        tooltip: {},
        xAxis: { data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"] },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      };
    case "line":
      return {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: { type: "value" },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true,
            areaStyle: {},
          },
        ],
      };
    case "pie":
      return {
        series: [
          {
            name: "Nightingale Chart",
            type: "pie",
            radius: [20, 100],
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: { borderRadius: 8 },
            data: [
              { value: 40, name: "rose 1" },
              { value: 38, name: "rose 2" },
              { value: 32, name: "rose 3" },
              { value: 30, name: "rose 4" },
              { value: 28, name: "rose 5" },
            ],
          },
        ],
      };
    case "radar":
      return {
        radar: {
          indicator: [
            { name: "销售", max: 6500 },
            { name: "管理", max: 16000 },
            { name: "信息技术", max: 30000 },
            { name: "客服", max: 38000 },
            { name: "研发", max: 52000 },
          ],
        },
        series: [
          {
            name: "预算 vs 开销",
            type: "radar",
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000],
                name: "预算分配",
              },
            ],
          },
        ],
      };
    default:
      return {};
  }
};

const initChart = () => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
  if (!chartContainer.value) return;

  chartInstance.value = echarts.init(chartContainer.value);
  chartInstance.value.setOption(getOption(props.type));
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  chartInstance.value?.resize();
};

watch(
  () => props.type,
  () => {
    initChart();
  }
);
</script>

<template>
  <div ref="chartContainer" class="echarts-demo"></div>
</template>

<style scoped>
.echarts-demo {
  width: 100%;
  height: 400px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin: 16px 0;
  background-color: var(--vp-c-bg-soft);
}
</style>
