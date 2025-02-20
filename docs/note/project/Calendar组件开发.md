---
category: project
cover: https://cdn.pixabay.com/photo/2024/01/21/12/37/chiemsee-lake-8523044_640.jpg
---

# Calendar 组件开发

## 日历实现

跟之前一样我们先创建下面这样的文件结构，开始我们的布局和样式的开发。

![](http://tuchuang.niubin.site/image/project-20250218-1.png)

我们先想一下日历组件的规则，首先默认显示当前月份的日历，然后通过点击上个月、下个月按钮来切换月份，同时如果当前的日历中有上个月的日期和下个月的日期，我点击的时候也能直接切换到对应的月份。

那具体实现我们也来构思一下

![](http://tuchuang.niubin.site/image/project-20250218-2.png)

我们可以把每一月分为三部分，红色的是上个月的，蓝色框起来的是当月的日期，绿色的是下个月的日期。上月的和下个月的日期是不一定存在的，完全看当前月的起始天和结束天分别是周几；也可以这么理解，上月的日期和下月的日期是为了补齐方格的。那具体怎么去实现呢，在代码中怎么补齐呢？

首先，我们的周是从周天开始，然后到周六，我们可以获取当前月的第一天对应的周几，我们把每一行当做一个数组，比如，当月第一天是周三，那就对应的下标是 3，意味着他的前面还有三个空位置用来放入上个月的后三天。对应的如果这个月最后一天是周 5，那就对应的下标是 5，那就还有 2 个空位置用来放入下个月的前两天。

我们先来画一下大概的布局

```html
<template>
  <div class="t-calendar">
    <div class="t-calendar__header">
      <div class="t-calendar__button-group">
        <span class="t-calendar__button-prev">
          <i class="t-icon icon-arrow-left-bold"></i>
        </span>
        <span>
          {{ currentYear }}年{{ currentMonth.toString().padStart(2, "0") }}月
        </span>
        <span class="t-calendar__button-next">
          <i class="t-icon icon-arrow-right-bold"></i>
        </span>
      </div>
      <t-button size="small">回到今天</t-button>
    </div>
    <div class="t-calendar__body">
      <table cellspacing="0" cellpadding="0" class="t-calendar-table">
        <thead>
          <tr>
            <th v-for="day in week" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  defineOptions({
    name: "t-calendar",
  });

  const week = ["日", "一", "二", "三", "四", "五", "六"];
  const cellData = ref([]);
  const currentYear = ref(2025);
  const currentMonth = ref(2);
</script>
```

```less
.t-calendar {
  width: 100%;
  border: 1px solid var(--t-border-color);
  .t-calendar__header {
    padding: 0 16px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .t-calendar__button-group {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #363636;
    }
    .t-calendar__button-prev,
    .t-calendar__button-next {
      width: 30px;
      height: 30px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:hover {
        background-color: var(--t-hover-color);
      }
    }
  }
}

.t-calendar-table {
  width: 100%;
  table-layout: fixed;
  thead {
    width: 100%;
    color: #757575;
    th {
      height: 30px;
    }
  }
}
```

![](http://tuchuang.niubin.site/image/project-20250218-3.png)

现在我们大概的样子就是这样，接下来我们来实现一下这个日历的渲染逻辑。

1. 我们所有的日期是一个数组，然后每周也就是一行，也是一个数组，从星期天开始到星期六。
2. 首先我们获取到当前月份的天数，然后获取当前月份的第一天是星期几，两个加起来，然后除以 7，向下取整，就可以得到我们当前月份的周数，有几周我们先给数组中 push 几个空数组。
3. 然后遍历这月的日期，我们的日期+第一天的星期然后除以 7，向下取整就知道我们当前的日期在第几周，push 到对应周的数组里面。
4. 然后看我们第一天是否是周天开始的，如果不是，那就需要补齐上个月的天数，直到第一周补齐。
5. 最后看我们这个月的最后一天是否是周六，如果不是，那就需要补齐下个月的天数，直到最后一周补齐。

思路明白了，我们来开始写：

```js
const createCellData = (
  year = currentYear.value,
  month = currentMonth.value
) => {
  const currentMonthdayNum = new Date(year, month - 1, 0).getDate();
  const firstDayNum = new Date(year, month - 1, 1).getDay(); // 本月第一天是星期几
  const endDayNum = new Date(year, month - 1, currentMonthdayNum).getDay(); // 本月最后一天是星期几
  const rowNum = Math.ceil((firstDayNum + currentMonthdayNum) / 7); // 行数
  cellData.value = [...Array(rowNum)].map(() => []);
  [...Array(currentMonthdayNum)].forEach((_, i) => {
    const rowIndex = Math.floor((i + firstDayNum) / 7);
    cellData.value[rowIndex].push(i + 1);
  });
};
```

我们可以通过 `new Date(year, month-1, 0).getDate()` 获取到当前月份的天数，然后通过 `new Date(year, month-1, 1).getDay()` 获取到当前月份的第一天是星期几，最后一天同理。

现在我们可以获取到当前月在每一周的分布，现在我们需要补齐上个月和下个月的天数。

```js
const createCellData = (
  year = currentYear.value,
  month = currentMonth.value
) => {
  const currentMonthdayNum = new Date(year, month - 1, 0).getDate();
  const firstDayNum = new Date(year, month - 1, 1).getDay(); // 本月第一天是星期几
  const endDayNum = new Date(year, month - 1, currentMonthdayNum).getDay(); // 本月最后一天是星期几
  const rowNum = Math.ceil((firstDayNum + currentMonthdayNum) / 7); // 行数
  cellData.value = [...Array(rowNum)].map(() => []);
  [...Array(currentMonthdayNum)].forEach((_, i) => {
    const rowIndex = Math.floor((i + firstDayNum) / 7);
    cellData.value[rowIndex].push(i + 1);
  });
  if (firstDayNum !== 0) {
    const lastYear = month - 1 < 1 ? year - 1 : year;
    const lastMonth = month - 1 < 1 ? 12 : month - 1;
    [...Array(firstDayNum)].forEach((_, i) => {
      const dayNum = new Date(lastYear, lastMonth - 1, 0 - i).getDate();
      cellData.value[0].unshift(dayNum);
    });
  }
  if (endDayNum !== 6) {
    [...Array(6 - endDayNum)].forEach((_, i) => {
      cellData.value[rowNum - 1].push(i + 1);
    });
  }
};
```

我们可以通过 `new Date(year, month-1, -1).getDate()` 获取到上个月的倒数第 2 天是几号， `new Date(year, month-1, 0).getDate()` 获取到上个月的倒数第 1 天是几号，然后通过 `unshift` 方法插入到第一行的数组中，周后一周也同理。

这样我们每个月的日期的获取就算是封装完了。接下来我们需要根据我们的这个数组来渲染日期表格了。

```html
<template>
  <div class="t-calendar">
    <div class="t-calendar__header">
      <div class="t-calendar__button-group">
        <span class="t-calendar__button-prev">
          <i class="t-icon icon-arrow-left-bold"></i>
        </span>
        <span>
          {{ currentYear }}年{{ currentMonth.toString().padStart(2, "0") }}月
        </span>
        <span class="t-calendar__button-next">
          <i class="t-icon icon-arrow-right-bold"></i>
        </span>
      </div>
      <t-button size="small">回到今天</t-button>
    </div>
    <div class="t-calendar__body">
      <table cellspacing="0" cellpadding="0" class="t-calendar-table">
        <thead>
          <tr>
            <th v-for="day in week" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, index) in cellData" :key="'week' + index">
            <td v-for="day in week" :key="day">
              <div class="t-calendar-day">
                <div class="t-calendar-day-number">{{ day }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
```

```less
.t-calendar {
  width: 100%;
  border: 1px solid var(--t-border-color);
  .t-calendar__header {
    padding: 0 16px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .t-calendar__button-group {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #363636;
    }
    .t-calendar__button-prev,
    .t-calendar__button-next {
      width: 30px;
      height: 30px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:hover {
        background-color: var(--t-hover-color);
      }
    }
  }
}

.t-calendar-table {
  width: 100%;
  table-layout: fixed;
  thead {
    width: 100%;
    color: #757575;
    th {
      height: 42px;
      font-weight: 500;
      color: #363636;
      border-bottom: 1px solid var(--t-border-color);
    }
  }
  tbody {
    td {
      border-right: 1px solid var(--t-border-color);
      border-bottom: 1px solid var(--t-border-color);
      &:nth-last-child(1) {
        border-right: none;
      }
    }
    tr:nth-last-child(1) td {
      border-bottom: none;
    }
    .t-calendar-day {
      padding: 10px;
      height: 80px;
      text-align: center;

      cursor: pointer;
      &:hover {
        background-color: var(--t-hover-color);
      }
    }
    .t-calendar-day-number {
      text-align: right;
    }
  }
}
```

![](http://tuchuang.niubin.site/image/project-20250218-4.png)

这下基本都差不多了，但是我们需要给上个月和下个月添加样式，让它们一眼能和当月的日期区分出来。这时候我们就没办法区分了，其实有个笨办法，就是第一行如果大于 7 的肯定是上个月的，最后一行小于 6 的肯定是下个月的，但是我们后期也需要点击的时候 emit 的时候想直接告诉使用者你当天点击的是上月的还是该月的，所以我们需要修改一下我们的数组这块。

我们需要把每一天修改成一个对象，包含年、月、日、类型、是否是当前月。

```js
const createCellData = (
  year = currentYear.value,
  month = currentMonth.value
) => {
  const currentMonthdayNum = new Date(year, month - 1, 0).getDate();
  const firstDayNum = new Date(year, month - 1, 1).getDay(); // 本月第一天是星期几
  const endDayNum = new Date(year, month - 1, currentMonthdayNum).getDay(); // 本月最后一天是星期几
  const rowNum = Math.ceil((firstDayNum + currentMonthdayNum) / 7); // 行数
  cellData.value = [...Array(rowNum)].map(() => []);
  [...Array(currentMonthdayNum)].forEach((_, i) => {
    const rowIndex = Math.floor((i + firstDayNum) / 7);
    const dayInfo = {
      year,
      month,
      day: i + 1,
      type: "normal",
      date: new Date(year, month - 1, i + 1),
    };
    cellData.value[rowIndex].push(dayInfo);
  });
  if (firstDayNum !== 0) {
    const lastYear = month - 1 < 1 ? year - 1 : year;
    const lastMonth = month - 1 < 1 ? 12 : month - 1;
    [...Array(firstDayNum)].forEach((_, i) => {
      const dayNum = new Date(lastYear, lastMonth - 1, 0 - i).getDate();
      cellData.value[0].unshift({
        year: lastYear,
        month: lastMonth,
        day: dayNum,
        type: "prev",
        date: new Date(lastYear, lastMonth - 1, dayNum),
      });
    });
  }
  if (endDayNum !== 6) {
    const nextYear = month + 1 > 12 ? year + 1 : year;
    const nextMonth = month + 1 > 12 ? 1 : month + 1;
    [...Array(6 - endDayNum)].forEach((_, i) => {
      cellData.value[rowNum - 1].push({
        year: nextYear,
        month: nextMonth,
        day: i + 1,
        type: "next",
        date: new Date(nextYear, nextMonth - 1, i + 1),
      });
    });
  }
};
```

然后根据我们的 type 给添加上类型然后设置样式。

```html
<!-- ... -->
<tbody>
  <tr v-for="(week, index) in cellData" :key="'week' + index">
    <td v-for="dayInfo in week" :key="dayInfo.day">
      <div
        :class="`t-calendar-day ${
                  dayInfo.type === 'prev'
                    ? 't-calendar-day__prev'
                    : dayInfo.type === 'next'
                    ? 't-calendar-day__next'
                    : ''
                }`"
      >
        <div class="t-calendar-day-number">{{ dayInfo.day }}</div>
      </div>
    </td>
  </tr>
</tbody>
<!-- ... -->
```

```less
.t-calendar-day__prev,
.t-calendar-day__next {
  color: var(--t-placeholder-color);
}
```

![](http://tuchuang.niubin.site/image/project-20250218-5.png)

现在日历的样子算是出来了，接下来我们完善一下日历的基本交互。

## 日历交互

1. 点击左就是上个月，点击右就是下个月
2. 默认高亮当天，点击某一天高亮某一天，但是当天依旧文字高亮
3. 点击回到今天，则恢复到默认状态
4. 点击当前月日历上的上月的某一天，则切换到上月的日历，且高亮该日期，下月同理
5. 切换月份的时候左上角的年月也随之变动

好了，我们先添加左上角上月和下月的切换。

```html
<!-- ... -->
<div class="t-calendar__button-group">
  <span class="t-calendar__button-prev" @click="handleChangeMonth('prev')">
    <i class="t-icon icon-arrow-left-bold"></i>
  </span>
  <span>
    {{ currentYear }}年{{ currentMonth.toString().padStart(2, "0") }}月
  </span>
  <span class="t-calendar__button-next" @click="handleChangeMonth('next')">
    <i class="t-icon icon-arrow-right-bold"></i>
  </span>
</div>
<!-- ... -->
```

```js
const handleChangeMonth = (type) => {
  if (type === "prev") {
    if (currentMonth.value - 1 < 1) {
      currentMonth.value = 12;
      currentYear.value -= 1;
    } else {
      currentMonth.value -= 1;
    }
  } else {
    if (currentMonth.value + 1 > 12) {
      currentMonth.value = 1;
      currentYear.value += 1;
    } else {
      currentMonth.value += 1;
    }
  }
  createCellData(currentYear.value, currentMonth.value);
};
```

我们添加一下点击高亮的功能。首先先给当天文字高亮，然后点击某天的时候某天高亮。

```html
<template>
  <div class="t-calendar">
    <!-- ... -->
    <div class="t-calendar__body">
      <table cellspacing="0" cellpadding="0" class="t-calendar-table">
        <thead>
          <tr>
            <th v-for="day in week" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, index) in cellData" :key="'week' + index">
            <td v-for="dayInfo in week" :key="dayInfo.day">
              <div
                :class="`t-calendar-day ${
                  dayInfo.type === 'prev'
                    ? 't-calendar-day__prev'
                    : dayInfo.type === 'next'
                    ? 't-calendar-day__next'
                    : ''
                } ${
                  dayInfo.dateFormated === activeDate
                    ? 't-calendar-day__active'
                    : ''
                } ${
                  dayInfo.dateFormated === today ? 't-calendar-day__today' : ''
                }
                `"
                @click="handleClickDate(dayInfo)"
              >
                <div class="t-calendar-day-number">{{ dayInfo.day }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  // ...
  const today =
    new Date().getFullYear() +
    "-" +
    (new Date().getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    new Date().getDate().toString().padStart(2, "0");
  const activeDate = ref(today);

  const handleClickDate = (dayInfo) => {
    activeDate.value = dayInfo.dateFormated;
  };
  // ...
</script>
```

```less
.t-calendar-day.t-calendar-day__active {
  background-color: #d7dbf7;
  color: var(--t-primary);
}
.t-calendar-day.t-calendar-day__today {
  color: var(--t-primary);
}
```

![](http://tuchuang.niubin.site/image/project-20250218-6.png)

这样高亮也好了，然后是点击上月的日期或者下月的日期，我们只要修改一下点击日期的事件

```js
const handleClickDate = (dayInfo) => {
  activeDate.value = dayInfo.dateFormated;
  if (dayInfo.type !== "normal") {
    currentYear.value = dayInfo.year;
    currentMonth.value = dayInfo.month;
    createCellData(currentYear.value, currentMonth.value);
  }
};
```

回到今天很简单，给按钮设置一个点击事件然后把 `activeDate` 设置为 `today`，然后将日历渲染为当前月份即可。

```js
const resetToday = () => {
  activeDate.value = today;
  currentYear.value = new Date().getFullYear();
  currentMonth.value = new Date().getMonth() + 1;
  createCellData();
};
```

这下日历基本功能就算完成了。

## 自定义日期内容

一般情况下我们可能有需求要给日历某一天添加一些内容，比如，待办，打卡之类的。

我们可以将每一天内容这块这块设置为插槽，然后给用户暴露出去对应日期的一些信息，这样就可以控制在某一天显示什么了。

```html
<div class="t-calendar">
  <!-- ... -->
  <div class="t-calendar__body">
    <table cellspacing="0" cellpadding="0" class="t-calendar-table">
      <thead>
        <tr>
          <th v-for="day in week" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in cellData" :key="'week' + index">
          <td v-for="dayInfo in week" :key="dayInfo.day">
            <div
              :class="`t-calendar-day ${
                  dayInfo.type === 'prev'
                    ? 't-calendar-day__prev'
                    : dayInfo.type === 'next'
                    ? 't-calendar-day__next'
                    : ''
                } ${
                  dayInfo.dateFormated === activeDate
                    ? 't-calendar-day__active'
                    : ''
                } ${
                  dayInfo.dateFormated === today ? 't-calendar-day__today' : ''
                }
                `"
              @click="handleClickDate(dayInfo)"
            >
              <div class="t-calendar-day-number">
                <slot name="date-cell" v-bind="dayInfo">
                  {{ dayInfo.day }}
                </slot>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

```html
<t-calendar>
  <template #date-cell="{ date, dateFormated }">
    <div>
      <span>{{ dateFormated }}</span>
    </div>
  </template>
</t-calendar>
```

![](http://tuchuang.niubin.site/image/project-20250218-7.png)

再比如我们做一个简单的待办

```html
<template>
  <t-calendar class="todo-demo">
    <template #date-cell="{ date, dateFormated }">
      <div class="todo-cell">
        <span>{{ dateFormated }}</span>
        <ul v-if="todoList[dateFormated]" class="todo_list">
          <li
            v-for="item in todoList[dateFormated]"
            :key="item.title"
            class="todo_item"
          >
            <span>{{ item.time }}</span>
            <span>{{ item.title }}</span>
          </li>
        </ul>
      </div>
    </template>
  </t-calendar>
</template>
<script setup>
  const todoList = {
    "2025-02-06": [
      { title: "待办1", time: "09:00" },
      { title: "待办2", time: "10:00" },
    ],
    "2025-02-10": [
      { title: "炒股", time: "09:00" },
      { title: "干饭", time: "10:00" },
      { title: "夜生活开始", time: "10:00" },
    ],
  };
</script>
<style scoped>
  .todo-cell {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .todo_list {
    flex: 1;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden;
  }
  .todo_item {
    margin: 6px 0;
    padding: 0 10px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 26px;
    border: 1px solid #ccc;
    border-radius: 4px;
    list-style: none;
    box-sizing: border-box;
    font-size: 14px;
  }
  .todo-demo :deep(.t-calendar-table) tbody .t-calendar-day {
    height: 120px;
  }
</style>
```

![](http://tuchuang.niubin.site/image/project-20250218-8.png)
