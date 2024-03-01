<template>
  <q-btn
    class="q-mb-sm full-width"
    @click="visible.datePanel = true"
    :loading="loading"
  >
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
                {{ from?.format('YYYY/MM/DD HH:mm') }}
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
                {{ to?.format('YYYY/MM/DD HH:mm') }}
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
  <q-dialog
    v-model="visible.datePanel"
    persistent
    @before-show="
      () => {
        if (from) tempData.fromDate = from;
        if (to) tempData.toDate = to;
      }
    "
  >
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
        <span style="width: 45%">
          <div>
            <!-- Day -->
            <q-field label="從" stack-label class="q-mr-md cursor-pointer">
              <q-popup-proxy>
                <q-date
                  :model-value="fromFormat.date"
                  @update:model-value="
                    (newDate) => {
                      tempData.fromDate = useDayJs(newDate).hour(
                        tempData.fromDate.hour()
                      );
                    }
                  "
                  :options="options.fromDate"
                />
              </q-popup-proxy>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ fromFormat.date }}
                </div>
              </template>
              <template v-slot:append>
                <q-icon name="date_range" />
              </template>
            </q-field>
            <!-- Time -->
            <q-field label="從" stack-label class="q-mr-md cursor-pointer">
              <q-popup-proxy>
                <q-list bordered style="height: 30vh">
                  <div v-for="time in 24" :key="time">
                    <q-item
                      dense
                      clickable
                      @click="
                        () =>
                          (tempData.fromDate = useDayJs()
                            .set('hour', time)
                            .set('minute', 0))
                      "
                    >
                      <q-item-section
                        class="items-center"
                        style="user-select: none"
                      >
                        {{
                          useDayJs()
                            .set('hour', time)
                            .set('minute', 0)
                            .format('HH:mm')
                        }}
                      </q-item-section>
                    </q-item>
                    <q-separator />
                  </div>
                </q-list>
              </q-popup-proxy>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ fromFormat.time }}
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
                <q-date
                  :model-value="toFormat.date"
                  @update:model-value="
                    (newDate) => {
                      tempData.toDate = useDayJs(newDate).hour(
                        tempData.toDate.hour()
                      );
                    }
                  "
                  :options="options.toDate"
                />
              </q-popup-proxy>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ toFormat.date }}
                </div>
              </template>
              <template v-slot:append>
                <q-icon name="date_range" />
              </template>
            </q-field>
            <!-- time -->
            <q-field label="至" stack-label class="q-ml-md cursor-pointer">
              <q-popup-proxy>
                <q-list bordered style="height: 30vh">
                  <div v-for="time in 24" :key="time">
                    <q-item
                      dense
                      clickable
                      @click="
                        () =>
                          (tempData.toDate = useDayJs()
                            .set('hour', time)
                            .set('minute', 0))
                      "
                    >
                      <q-item-section
                        class="items-center"
                        style="user-select: none"
                      >
                        {{
                          useDayJs()
                            .set('hour', time)
                            .set('minute', 0)
                            .format('HH:mm')
                        }}
                      </q-item-section>
                    </q-item>
                    <q-separator />
                  </div>
                </q-list>
              </q-popup-proxy>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ toFormat.time }}
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
      <q-card-actions align="around">
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

        <q-btn
          color="blue-13"
          padding="5px 20px"
          @click="
            () => {
              visible.datePanel = false;
              emit('submit', {
                from: tempData.fromDate,
                to: tempData.toDate,
              });
            }
          "
        >
          送出
        </q-btn>
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
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, computed, toRefs, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

const props = defineProps<{
  from: Dayjs | null;
  to: Dayjs | null;
  dayjsSet?: () => Dayjs;
  disable?: boolean;
  loading?: boolean;
}>();
const emit = defineEmits(['submit']);

const useDayJs = props.dayjsSet ?? dayjs;
const { disable: disablePick } = toRefs(props);
type FocusingButton = 'today' | 'week' | 'month' | 'before' | 'next';
const focusButton = ref<FocusingButton>();

const handleToMonth = () => {
  focusButton.value = 'month';
  tempData.fromDate = useDayJs().startOf('month');
  tempData.toDate = useDayJs().startOf('month').add(1, 'month');
};

const handleToWeek = () => {
  focusButton.value = 'week';
  tempData.fromDate = useDayJs().startOf('week');
  tempData.toDate = useDayJs().startOf('week').add(1, 'week');
};

const handleToday = () => {
  focusButton.value = 'today';
  tempData.fromDate = useDayJs().startOf('day');
  tempData.toDate = useDayJs().startOf('day').add(1, 'day');
};

const handleNextDay = () => {
  focusButton.value = 'next';
  tempData.fromDate = tempData.fromDate.add(1, 'day');
  tempData.toDate = tempData.fromDate.add(1, 'day');
};

const handleDayBefore = () => {
  focusButton.value = 'before';
  tempData.fromDate = tempData.fromDate.subtract(1, 'day');
  tempData.toDate = tempData.fromDate.add(1, 'day');
};

const tempData = reactive({
  fromDate: useDayJs().startOf('week'),
  toDate: useDayJs().startOf('week').add(1, 'week'),
});

// from
const fromFormat = computed(() => {
  return {
    date: tempData.fromDate.format('YYYY/MM/DD'),
    time: tempData.fromDate.format('HH:mm'),
  };
});
const toFormat = computed(() => {
  return {
    date: tempData.toDate.format('YYYY/MM/DD'),
    time: tempData.toDate.format('HH:mm'),
  };
});

// set
const options = computed(() => {
  return {
    fromDate: (date: string) => !!date,
    toDate: (date: string) =>
      useDayJs(date).isAfter(tempData.fromDate) ||
      useDayJs(date).isSame(tempData.fromDate),
    toTime: (hr: number) => tempData.fromDate.hour() <= hr,
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
