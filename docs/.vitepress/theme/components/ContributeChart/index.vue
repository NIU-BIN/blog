<template>
  <div class="contribute_chart">
    <div class="chart_box" ref="chart"></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, ref, shallowRef, watch, nextTick } from "vue";
import dayjs from "dayjs";
import { useConfig } from "../../utils/client";

const props = defineProps<{
  data: [string, number][];
  isDark: boolean;
}>();

const { article } = useConfig();
const today = dayjs().format("YYYY-MM-DD");
const beforeOnYear = dayjs().subtract(1, "year").format("YYYY-MM-DD");

const chart = shallowRef<HTMLDivElement>();
const myChart = ref();

const option = {
  tooltip: {
    formatter: function (params) {
      return `${params.value[0]} <br/> ${params.value[1]} 篇文章`;
    },
  },
  visualMap: {
    show: false,
    min: 0,
    max: 5,
    inRange: {
      color: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127", "#196127"],
    },
  },
  calendar: {
    left: "center",
    itemStyle: {
      color: "#ebedf0",
      borderWidth: 5,
      borderColor: "#fff",
      shadowBlur: 0,
    },
    cellSize: [20, 20],
    range: [beforeOnYear, today],
    splitLine: true,
    dayLabel: {
      firstDay: 7,
      nameMap: "ZH",
      color: "#888",
    },
    monthLabel: {
      // nameMap: [
      //   "一月",
      //   "二月",
      //   "三月",
      //   "四月",
      //   "五月",
      //   "六月",
      //   "七月",
      //   "八月",
      //   "九月",
      //   "十月",
      //   "十一月",
      //   "十二月",
      // ],
      color: "#888",
    },
    yearLabel: {
      show: true,
      position: "right",
    },
    silent: {
      show: false,
    },
  },
  series: {
    type: "heatmap",
    coordinateSystem: "calendar",
    data: [],
  },
};

const renderChart = (data) => {
  option.calendar.itemStyle.borderColor = props.isDark ? "#000" : "#fff";
  option.calendar.itemStyle.color = props.isDark ? "#787878" : "#ebedf0";
  if (myChart.value) echarts.dispose(myChart.value);
  myChart.value = echarts.init(chart.value);
  option.series.data = data;
  myChart.value.setOption(option);
};

watch(
  () => props.data,
  (newValue) => {
    nextTick(() => renderChart(newValue));
  },
  {
    immediate: true,
  }
);

watch(
  () => props.isDark,
  (newValue) => {
    renderChart(props.data);
  }
);
</script>
<style lang="less" scoped>
.contribute_chart {
  width: 100%;
  height: 260px;
  .chart_box {
    margin: auto;
    width: 100%;
    height: 100%;
    // width: 100vw;
    // height: 260px;
  }
}
</style>
