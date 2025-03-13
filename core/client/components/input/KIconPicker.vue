<template>
  <div>
    <q-btn id="icon-picker" :size="size" round>
      <q-icon :name="modelValue" :size="buttonIconSize">
          <q-tooltip>{{ modelValue }}</q-tooltip>
      </q-icon>
    </q-btn>
    <q-popup-proxy ref="popupProxyRef" cover transition-show="scale" transition-hide="scale">
      <q-virtual-scroll
        :style="'max-height:' + maxHeight + 'px;'"
        virtual-scroll-slice-size="4"
        virtual-scroll-item-size="32"
        :items="items"
        v-slot="{ item }"
      >
        <q-item dense class="row q-py-none">
          <q-item-section v-if="item.type === 'separator'">
            <q-separator />
          </q-item-section>
          <q-item-section v-else-if="item.type === 'title'">{{ _.capitalize($t('KIconChooser.categories.' + item.name)) }}</q-item-section>
          <q-item-section v-else class="row wrap">
            <div>
              <template v-for="icon in item.icons" :key="icon.name">
                <i :class="icon.name + (props.iconSet === 'font-awesome' ? ' q-ma-xs' : '')" :style="'font-size:' + iconSize" @click="onIconSelected(icon)">
                  <q-tooltip>{{ icon.title }}</q-tooltip>
                </i>
              </template>
            </div>
          </q-item-section>
        </q-item>
      </q-virtual-scroll>
    </q-popup-proxy>
  </div>
</template>

<script setup>
import _ from 'lodash'
import yaml from 'js-yaml'
import { ref, watch, computed } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: 'las la-atom'
  },
  iconSet: {
    type: String,
    default: 'line-awesome',
    validator: (value) => {
      return ['line-awesome', 'font-awesome'].includes(value)
    }
  },
  size: {
    type: String,
    default: 'sm'
  },
  iconsPerLine: {
    type: Number,
    default: 8
  },
  iconSize: {
    type: String,
    default: '1.8rem'
  },
  maxHeight: {
    type: Number,
    default: 400
  }
})

// Data
const icon = ref(props.modelValue)
const popupProxyRef = ref(null)
const items = await loadFontAwesomeIcons()

// Computed
// Reduce the icon size for font-awesome which appears bigger than line-awesome
const buttonIconSize = computed(() => {
  if (props.iconSet !== 'font-awesome') return props.size

  const quasarSizes = ['xs', 'sm', 'md', 'lg', 'xl']
  if (quasarSizes.includes(props.size)) {
    return quasarSizes[quasarSizes.indexOf(props.size) - 1] || '15px'
  }

  return props.size
})

// Functions
async function loadFontAwesomeIcons () {
  // Fetch available FA icons from the font awesome repository so we are always in sync for v5
  const response = await fetch('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/5.11.2/metadata/icons.yml')

  if (response.status !== 200) throw new Error('Impossible to retrieve fontawesome code points: ' + response.status)
  const text = await response.text()

  try {
    const icons = {}

    const yamlCodes = yaml.load(text)
    _.forOwn(yamlCodes, (value, key) => {
      addFontAwesomeIcons(icons, value, key)
    })

    if (_.isEmpty(icons)) throw new Error('Impossible to parse fontawesome code points')

    const categoryInfos = await loadFontAwesomeCategories()
    const categories = Object.keys(categoryInfos)

    const items = []
    _.forEach(categories, (category, index) => {
      if (index !== 0) items.push({ type: 'separator' })
      items.push({ type: 'title', name: category })
      let tmp = []
      let count = 0
      for (const icon of categoryInfos[category].icons) {
        tmp.push(icons[icon])

        count++
        if (count % props.iconsPerLine === 0) {
          items.push({ type: 'icons', icons: tmp, class: count <= 10 ? 'q-pb-none' : 'q-py-none' })
          tmp = []
        }
      }
      if (tmp.length > 0) {
        items.push({ type: 'icons', icons: tmp, class: 'q-pt-none' })
      }
    })

    return items
  } catch (error) {
    throw new Error('Impossible to parse fontawesome categories: ' + error)
  }
}

async function loadFontAwesomeCategories () {
  const response = await fetch('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/5.11.2/metadata/categories.yml')

  if (response.status !== 200) throw new Error('Impossible to retrieve fontawesome categories: ' + response.status)
  const text = await response.text()

  try {
    const yamlCodes = yaml.load(text)

    return yamlCodes
  } catch (error) {
    throw new Error('Impossible to parse fontawesome categories: ' + error)
  }
}
function addFontAwesomeIcons (list, value, key) {
  // We also support lineawesome, which is fontawesome compatible
  const prefix = (props.iconSet === 'line-awesome' ? 'la' : 'fa')
  if (!value.styles) {
    addFontAwesomeIcon(list, key, `${prefix}-${key}`)
  } else {
    if (value.styles.includes('brands')) {
      addFontAwesomeIcon(list, key, `${prefix}b ${prefix}-${key}`)
    } else {
      if (value.styles.includes('regular')) {
        addFontAwesomeIcon(list, key, `${prefix}r ${prefix}-${key}`)
      }
      if (value.styles.includes('solid')) {
        addFontAwesomeIcon(list, key, `${prefix}s ${prefix}-${key}`)
      }
      if (value.styles.includes('light')) {
        addFontAwesomeIcon(list, key, `${prefix}l ${prefix}-${key}`)
      }
    }
  }
}
function addFontAwesomeIcon (list, key, icon) {
  list[key] = { name: icon, title: key }
}
function onIconSelected (selectedIcon) {
  icon.value = selectedIcon.name
  popupProxyRef.value.hide()
}

// Emits
const emit = defineEmits(['update:modelValue'])

// Watch
watch(icon, newIcon => {
  emit('update:modelValue', newIcon)
})

</script>
