<template>
  <q-btn class="q-mb-sm full-width" @click="visible.datePanel = true">
    <div class="row items-center justify-around q-pa-xs full-width">
      <div class="col-5">
        <q-field
          label="從"
          stack-label
          label-color="grey-5"
          class="cursor-pointer"
          borderless
        >
          <template v-slot:control>
            <div class="no-outline" tabindex="0">
              <span>
                {{ fromDate + ' ' }}
              </span>
              <span>
                {{ fromTime }}
              </span>
            </div>
          </template>
        </q-field>
      </div>
      <div class="col-5">
        <q-field
          label="至"
          stack-label
          label-color="grey-5"
          class="cursor-pointer"
          borderless
        >
          <template v-slot:control>
            <div class="no-outline" tabindex="0">
              <span>
                {{ toDate + ' ' }}
              </span>
              <span>
                {{ toTime }}
              </span>
            </div>
          </template>
        </q-field>
      </div>
      <div class="col-auto">
        <q-icon name="search" color="blue-13" />
      </div>
    </div>
  </q-btn>
  <q-dialog v-model="visible.datePanel" persistent>
    <q-card style="width: 60vh">
      <!-- header -->
      <q-card-section
        class="row items-center"
        style="background-color: #242e47"
      >
        <q-btn
          color="blue-13"
          class="q-mr-sm"
          @click="handleToday"
          :disable="disablePick && focusButton === 'today'"
          :loading="disablePick && focusButton === 'today'"
        >
          今日
        </q-btn>
        <q-btn
          color="blue-13"
          class="q-mr-sm"
          @click="handleToWeek"
          :disable="disablePick && focusButton === 'week'"
          :loading="disablePick && focusButton === 'week'"
        >
          本週
        </q-btn>
        <q-btn
          color="blue-13"
          class="q-mr-sm"
          @click="handleToMonth"
          :disable="disablePick && focusButton === 'month'"
          :loading="disablePick && focusButton === 'month'"
        >
          本月
        </q-btn>
        <q-space />
        <q-btn icon="close" color="white" flat round dense v-close-popup />
      </q-card-section>
      <!-- body -->
      <div class="picker-body">
        <!-- 從 -->
        <span style="width: 45%" >
          <div>
            <!-- Day -->
            <q-field label="從" stack-label class="q-mr-md cursor-pointer">
              <q-popup-proxy>
                <q-date v-model="fromDate" :options="options.fromDate" />
              </q-popup-proxy>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ fromDate }}
                </div>
              </template>
              <template v-slot:append>
                <q-icon name="date_range" />
              </template>
            </q-field>
            <!-- Time -->
            <q-field label="從" stack-label class="q-mr-md cursor-pointer">
              <q-popup-proxy>
                <q-time
                  v-model="fromTime"
                  format24h
                  :minute-options="[0]"
                  now-btn
                />
              </q-popup-proxy>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ fromTime }}
                </div>
              </template>
              <template v-slot:append>
                <q-icon name="schedule" />
              </template>
            </q-field>
          </div>
        </span>
        <!-- 至 -->
        <span style="width: 45%">
          <div>
            <!-- day -->
            <q-field label="至" stack-label class="q-ml-md cursor-pointer">
              <q-popup-proxy>
                <q-date v-model="toDate" :options="options.toDate" />
              </q-popup-proxy>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ toDate }}
                </div>
              </template>
              <template v-slot:append>
                <q-icon name="date_range" />
              </template>
            </q-field>
            <!-- time -->
            <q-field label="至" stack-label class="q-ml-md cursor-pointer">
              <q-popup-proxy>
                <q-time
                  v-model="toTime"
                  :options="options.toTime"
                  format24h
                  now-btn
                />
              </q-popup-proxy>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ toTime }}
                </div>
              </template>
              <template v-slot:append>
                <q-icon name="schedule" />
              </template>
            </q-field>
          </div>
        </span>
      </div>
      <!-- footer -->
      <q-card-actions align="center">
        <!-- 前一天 -->
        <q-btn
          icon="arrow_back"
          dense
          size="large"
          outline
          color="blue-13"
          @click="handleDayBefore"
          :disable="disablePick && focusButton === 'before'"
          :loading="disablePick && focusButton === 'before'"
        />
        <!-- 後一天 -->
        <q-btn
          icon="arrow_forward"
          color="blue-13"
          dense
          size="large"
          outline
          class="q-ml-md"
          @click="handleNextDay"
          :disable="disablePick && focusButton === 'next'"
          :loading="disablePick && focusButton === 'next'"
        />
      </q-card-actions>
      <div class="picker-body">
        <q-btn
          color="blue-13"
          padding="5px 20px"
          v-if="!!props.needSubmit"
          @click="emit('submit')"
        >
          送出
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, computed, toRefs, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

const props = defineProps<{
  from: string;
  to: string;
  needSubmit?: boolean;
  dayjsSet?: () => Dayjs;
  disable?: boolean;
}>();
const emit = defineEmits(['update:from', 'update:to', 'submit']);

const useDayJs = props.dayjsSet ?? dayjs;
const { disable: disablePick } = toRefs(props);
type FocusingButton = 'today' | 'week' | 'month' | 'before' | 'next';
const focusButton = ref<FocusingButton>();

const handleToMonth = () => {
  focusButton.value = 'month';
  const newFromDate = useDayJs().startOf('month').format('YYYY-MM-DD HH:mm');
  const newToDate = useDayJs().endOf('month').format('YYYY-MM-DD HH:mm');
  emit('update:from', newFromDate);
  emit('update:to', newToDate);
};

const handleToWeek = () => {
  focusButton.value = 'week';
  const newFromDate = useDayJs().startOf('week').format('YYYY-MM-DD HH:mm');
  const newToDate = useDayJs().endOf('week').format('YYYY-MM-DD HH:mm');
  emit('update:from', newFromDate);
  emit('update:to', newToDate);
};

const handleToday = () => {
  focusButton.value = 'today';
  const newFromDate = useDayJs().startOf('day').format('YYYY-MM-DD HH:mm');
  const newToDate = useDayJs().endOf('day').format('YYYY-MM-DD HH:mm');
  emit('update:from', newFromDate);
  emit('update:to', newToDate);
};

const handleNextDay = () => {
  focusButton.value = 'next';
  const newFromDate = useDayJs(props.from.substring(0, 10))
    .add(1, 'day')
    .format('YYYY-MM-DD');
  const newToDate = useDayJs(props.to.substring(0, 10))
    .add(1, 'day')
    .format('YYYY-MM-DD');
  fromDate.value = newFromDate;
  toDate.value = newToDate;
};

const handleDayBefore = () => {
  focusButton.value = 'before';
  const newFromDate = useDayJs(props.from.substring(0, 10))
    .subtract(1, 'day')
    .format('YYYY-MM-DD');
  const newToDate = useDayJs(props.to.substring(0, 10))
    .subtract(1, 'day')
    .format('YYYY-MM-DD');
  fromDate.value = newFromDate;
  toDate.value = newToDate;
};

const fromDate = computed({
  get() {
    return props.from.slice(0, 10).replaceAll('-', '/');
  },
  set(newValue) {
    const newFrom = newValue.replaceAll('/', '-') + props.from.slice(-6);
    emit('update:from', newFrom);
  },
});
const fromTime = computed({
  get() {
    return props.from.slice(-5).replaceAll('-', '/');
  },
  set(newValue) {
    const newFrom = props.from.replaceAll('/', '-').slice(0, 11) + newValue;
    emit('update:from', newFrom);
  },
});

//  to
const toDate = computed({
  get() {
    return props.to.slice(0, 10).replaceAll('-', '/');
  },
  set(newValue) {
    const newTo = newValue.replaceAll('/', '-') + props.to.slice(-6);
    emit('update:to', newTo);
  },
});
const toTime = computed({
  get() {
    return props.to.slice(-5).replaceAll('-', '/');
  },
  set(newValue) {
    const newTo = props.to.slice(0, 11).replaceAll('/', '-') + newValue;
    emit('update:to', newTo);
  },
});

// set
const options = computed(() => {
  return {
    fromDate: (date: string) => !!date,
    toDate: (date: string) => date >= fromDate.value,
    toTime: (hr: number) => Number(fromTime.value.substring(0, 2)) <= hr,
  };
});
const visible = reactive({
  datePanel: false,
});
</script>

<style lang="scss" scoped>
.picker-body {
  display: flex;
  padding: 3% 0;
  justify-content: center;
  align-items: center;
}
</style>
```
