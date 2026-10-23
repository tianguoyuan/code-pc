<script lang="ts" setup>
import type { FormRules, TnFormInstance } from '@tuniao/tnui-vue3-uniapp'

import TnCheckboxGroup from '@tuniao/tnui-vue3-uniapp/components/checkbox/src/checkbox-group.vue'
import TnCheckbox from '@tuniao/tnui-vue3-uniapp/components/checkbox/src/checkbox.vue'
import TnDateTimePicker from '@tuniao/tnui-vue3-uniapp/components/date-time-picker/src/date-time-picker.vue'
import TnFormItem from '@tuniao/tnui-vue3-uniapp/components/form/src/form-item.vue'
import TnForm from '@tuniao/tnui-vue3-uniapp/components/form/src/form.vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import TnInput from '@tuniao/tnui-vue3-uniapp/components/input/src/input.vue'
import TnPicker from '@tuniao/tnui-vue3-uniapp/components/picker/src/picker.vue'
import regionData from '@tuniao/tnui-vue3-uniapp/components/region-picker/libs/region-data.json'
import TnRegionPicker from '@tuniao/tnui-vue3-uniapp/components/region-picker/src/region-picker.vue'
import TnSwitch from '@tuniao/tnui-vue3-uniapp/components/switch/src/switch.vue'
import { ref } from 'vue'

export interface FormConfig {
  config: FormItemConfig[]
  rules?: FormRules
}

export type FormItemConfig =
  | {
      type: 'slot'
      slotName: string
    }
  | {
      inputType?: 'text' | 'number' | 'idcard' | 'textarea' | 'password'
      label: string
      mode?: 'time' | 'date' | 'datetime' | 'year' | 'yearmonth'
      open?: boolean
      options?: { label: string; value: any }[] // 仅 select 类型使用
      placeholder?: string
      prop: string
      border?: boolean
      type: 'input' | 'select' | 'date' | 'regionPicker' | 'switch' | 'checkbox'
    }

const props = withDefaults(
  defineProps<{
    modelValue: Record<string, any>
    config: FormItemConfig[]
    rules?: FormRules
  }>(),
  { rules: undefined },
)

const formRef = ref<TnFormInstance | null>(null)

// regionPicker 地区数据处理
type RegionDataItem = { name: string; code: string; children?: RegionDataItem[] }
let _regionData: RegionDataItem[]
function getRegionData() {
  if (_regionData) return _regionData
  _regionData = regionData as RegionDataItem[]
  return _regionData
}
function getNameByCodes(codes: string[]): string[] {
  const names: string[] = []
  let data = getRegionData()
  const cs = [...codes]
  while (data.length && cs.length) {
    const code = cs.shift()!
    const item = data.find((d) => d.code === code)
    if (item) {
      names.push(item.name)
      data = item.children || []
    } else {
      break
    }
  }
  return names
}
function displayRegionValue(prop: string) {
  const val = props.modelValue[prop]
  if (!Array.isArray(val) || val.length === 0) return ''
  if (/^\d/.test(val[0])) return getNameByCodes(val).join(' / ')
  return val.join(' / ')
}

// 暴露验证方法
function validate() {
  return new Promise((resolve, reject) => {
    formRef.value?.validate().then(resolve).catch(reject)
  })
}

function resetFields() {
  formRef.value?.resetFields()
}

function getSelectName(value: any, options?: ({ label: string; value: any } | string)[]) {
  if (!options) return value
  const option = options.find((opt) =>
    typeof opt === 'string' ? opt === value : opt.value === value,
  )
  return option ? (typeof option === 'string' ? option : option.label) : value
}

defineExpose({
  resetFields,
  validate,
})
</script>

<template>
  <TnForm
    ref="formRef"
    labelPosition="left"
    labelWidth="80px"
    :model="modelValue"
    :rules="props.rules"
    size="sm"
  >
    <template v-for="(item, index) in props.config" :key="index">
      <view v-if="item.type === 'slot'">
        <slot :name="item.slotName"></slot>
      </view>
      <TnFormItem v-else :label="item.label" :prop="item.prop">
        <template v-if="item.type === 'input'">
          <TnInput
            v-if="item.inputType === 'textarea'"
            v-model="modelValue[item.prop]"
            border
            confirmType=""
            :height="200"
            :placeholder="item.placeholder"
            showWordLimit
            :type="item.inputType"
          />
          <TnInput
            v-else
            v-model="modelValue[item.prop]"
            :placeholder="item.placeholder"
            :type="item.inputType || 'text'"
            underline
          />
        </template>
        <template v-else-if="item.type === 'select'">
          <Picker
            v-model="modelValue[item.prop]"
            mode="selector"
            :range="item.options"
            @change="item.open = false"
          />
          <TnInput
            :modelValue="getSelectName(modelValue[item.prop], item.options)"
            :placeholder="item.placeholder"
            type="select"
            underline
            @click="item.open = true"
          >
            <template #suffix><TnIcon name="right" /></template>
          </TnInput>
          <TnPicker
            v-model="modelValue[item.prop]"
            v-model:open="item.open"
            :data="item.options"
            :immediateChange="false"
          />
        </template>
        <template v-else-if="item.type === 'date'">
          <TnInput
            v-model="modelValue[item.prop]"
            :placeholder="item.placeholder"
            type="select"
            underline
            @click="item.open = true"
          >
            <template #suffix><TnIcon name="right" /></template>
          </TnInput>
          <TnDateTimePicker
            v-model="modelValue[item.prop]"
            v-model:open="item.open"
            :mode="item.mode || 'date'"
          />
        </template>

        <template v-else-if="item.type === 'regionPicker'">
          <TnInput
            :modelValue="displayRegionValue(item.prop)"
            :placeholder="item.placeholder"
            type="select"
            underline
            @click="item.open = true"
          >
            <template #suffix><TnIcon name="right" /></template>
          </TnInput>
          <TnRegionPicker v-model="modelValue[item.prop]" v-model:open="item.open" />
        </template>

        <template v-else-if="item.type === 'switch'">
          <TnSwitch v-model="modelValue[item.prop]" />
        </template>

        <template v-else-if="item.type === 'checkbox'">
          <TnCheckboxGroup v-model="modelValue[item.prop]" :border="item.border">
            <TnCheckbox v-for="option in item.options" :key="option.value" :label="option.value">
              {{ option.label }}
            </TnCheckbox>
          </TnCheckboxGroup>
        </template>
      </TnFormItem>
    </template>
  </TnForm>
</template>

<style lang="scss" scoped>
.w-full {
  width: 100%;
}
</style>
