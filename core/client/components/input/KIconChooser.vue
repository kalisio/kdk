<template>
  <k-modal ref="modal" :buttons="getButtons()">
    <div slot="modal-content">
      <div class="column q-gutter-sm">
        <div class="row justify-between">
          <q-select id="icon-categories"
            v-if="categories"
            :label="$t('KIconChooser.SEARCH_CATEGORY_LABEL')"
            :options="categoryOptions"
            :value="selectedCategory ? selectedCategory.label : ''"
            @filter="filterCategoryAutocomplete"
            @input="onSelectCategory"
            use-input
            fill-input
            hide-selected
            input-debounce="0"
            clearable
            class="col-4"
            dense />
        </div>
        <div id="icons" class="row justify-start items-center q-gutter-sm">
          <template v-for="icon in iconsPage">
            <q-icon v-if="icon.name === selectedIcon.name" :key="icon.name"
              style="border-bottom: 0.25rem solid" :color="selectedIcon.color" :name="icon.name" size="2rem" @click="onIconSelected(icon)">
              <q-tooltip>
                {{icon.title}}
              </q-tooltip>
            </q-icon>
            <q-icon v-if="icon.name !== selectedIcon.name" :key="icon.name"
              color="grey-7" :name="icon.name" size="2rem" @click="onIconSelected(icon)">
              <q-tooltip>
                {{icon.title}}
              </q-tooltip>
            </q-icon>
          </template>
        </div>
        <div class="row justify-center items-center q-gutter-sm">
          <q-pagination v-model="currentPage" :max="maxPage" :input="true" />
        </div>
        <div v-if="palette" class="row justify-between items-center q-gutter-sm">
          <k-palette id="palette" shape="round" v-model="selectedIcon.color" />
        </div>
      </div>
    </div>
  </k-modal>
</template>

<script>
import { QPagination } from 'quasar'
import yaml from 'js-yaml'
import _ from 'lodash'

export default {
  name: 'k-icon-chooser',
  components: {
    QPagination
  },
  props: {
    iconSet: {
      type: String,
      default: 'font-awesome',
      validator: (value) => {
        return ['material-icons', 'line-awesome', 'font-awesome'].includes(value)
      }
    },
    palette: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      allIcons: [],
      categories: null,
      categoryInfos: null,
      categoryOptions: null,
      selectedCategory: null,
      filteredIcons: null,
      currentPage: 1,
      iconsPerPage: 70,
      selectedIcon: {
        name: '',
        color: 'dark'
      }
    }
  },
  computed: {
    icons () {
      // Return a filtered or unfiltered list of icons (depending on whether a filter was applied)
      this.filteredIcons = (this.selectedCategory ? this.getIconsForCategory(this.selectedCategory.value) : null)
      // If we have a filtered list then return it, otherwise return the complete list
      return this.filteredIcons || this.allIcons
    },
    maxPage () {
      return Math.ceil(this.icons.length / this.iconsPerPage)
    },
    iconsPage () {
      const firstIndex = (this.currentPage - 1) * this.iconsPerPage
      const lastIndex = Math.min(this.currentPage * this.iconsPerPage, this.icons.length)

      return this.icons.slice(firstIndex, lastIndex)
    }
  },
  methods: {
    getIconsForCategory (category) {
      const categoryIcons = this.categoryInfos[this.selectedCategory.value].icons
      const icons = []

      for (const categoryIcon of categoryIcons) {
        const icon = this.allIcons.find((e) => e.title === categoryIcon)

        if (icon) {
          icons.push(icon)
        }
      }

      return icons
    },
    filterCategoryAutocomplete (categoryInput, updateCallback) {
      if (categoryInput.trim() === '') {
        // empty input, return all categories
        updateCallback(() => {
          this.categoryOptions = this.getCategoryOptions(this.categories)
        })
      } else {
        // non-empty input, return filtered categories
        updateCallback(() => {
          const needle = categoryInput.trim().toLowerCase()

          this.categoryOptions = this.getCategoryOptions(this.categories).filter((option) => {
            return option.label.toLowerCase().indexOf(needle) > -1
          })
        })
      }
    },
    getCategoryOptions (categories) {
      return categories
        .map(category => ({ value: category, label: this.$t('KIconChooser.categories.' + category) }))
        // Alphabetical order
        .sort((c1, c2) => c1.label.localeCompare(c2.label))
    },
    onSelectCategory (value) {
      // Reset pagination as it might be different for the new category
      this.currentPage = 1
      // Similarly reset the selected icon because it might fall outside of the filtered icons
      this.resetSelectedIcon()
      // Trigger filtering by updating the category (see computed prop 'icons()')
      this.selectedCategory = value
    },
    getButtons () {
      return [
        { id: 'done-button', label: this.$t('KIconChooser.DONE_BUTTON'), color: 'primary', renderer: 'form-button', handler: (event) => this.doDone(event) }
      ]
    },
    open (defaultIcon) {
      this.reset()
      // Find the page that contains the current selected icon
      let index = -1
      // Assign the selected icon to the default one if any
      if (defaultIcon) {
        // Internally we use icon name + color but it can be configured to ony output icon
        if (typeof defaultIcon === 'string') {
          this.selectedIcon.name = defaultIcon
        } else {
          Object.assign(this.selectedIcon, defaultIcon)
        }
        index = _.findIndex(this.allIcons, icon => { return icon.name === this.selectedIcon.name })
      }
      if (index === -1) this.currentPage = 1
      else this.currentPage = Math.ceil(index / this.iconsPerPage)
      // Open the modal
      this.$refs.modal.open()
    },
    reset () {
      this.selectedCategory = null
      this.filteredIcons = null
      this.currentPage = 1
      this.resetSelectedIcon()
      this.resetSelectedColor()
    },
    iconSelected () {
      return this.selectedIcon.name.length > 0
    },
    doDone (event) {
      // Send back icon name + color if required
      this.$emit('icon-choosed', (this.palette ? this.selectedIcon : this.selectedIcon.name))
      this.doClose()
    },
    doClose (event) {
      this.$refs.modal.close()
    },
    onIconSelected (icon) {
      // When clicking again on the icon we remove it
      if (this.selectedIcon.name === icon.name) {
        this.resetSelectedIcon()
      } else {
        this.selectedIcon.name = icon.name
      }
    },
    resetSelectedIcon () {
      this.selectedIcon.name = ''
    },
    resetSelectedColor () {
      this.selectedIcon.color = 'dark'
    },
    async loadMaterialIcons () {
      // Fetch available material icons from the google repository so we are always in sync for v3
      // Seems now to be https://raw.githubusercontent.com/google/material-design-icons/font/MaterialIcons-Regular.codepoints
      const response = await fetch('https://raw.githubusercontent.com/google/material-design-icons/3.0.2/iconfont/codepoints')
      if (response.status !== 200) throw new Error('Impossible to retrieve material-icons code points: ' + response.status)
      const text = await response.text()

      // We have a list with on each new line 'icon_name icon-code' so we need to filter the codes
      // (there was also an 'empty' entry in the list so additionally we filter on iconName !== "")
      let icons = text.split(/\s+/).filter((iconName, index) => index % 2 === 0 && iconName !== '')

      if (icons.length === 0) throw new Error('Impossible to parse material-icons code points')
      icons.sort()

      icons = icons.map(icon => {
        return { name: icon, title: icon }
      })

      return { icons, categories: null, categoryInfos: null }
    },
    async loadFontAwesomeIcons () {
      // Fetch available FA icons from the font awesome repository so we are always in sync for v5
      const response = await fetch('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/5.11.2/metadata/icons.yml')

      if (response.status !== 200) throw new Error('Impossible to retrieve fontawesome code points: ' + response.status)
      const text = await response.text()

      try {
        const icons = []

        const yamlCodes = yaml.safeLoad(text)
        _.forOwn(yamlCodes, (value, key) => {
          this.addFontAwsomeIcons(icons, value, key)
        })

        const categoryInfos = await this.loadFontAwesomeCategories()
        const categories = Object.keys(categoryInfos)

        if (icons.length === 0) throw new Error('Impossible to parse fontawesome code points')

        return { icons, categoryInfos, categories }
      } catch (error) {
        throw new Error('Impossible to parse fontawesome categories: ' + error)
      }
    },
    async loadFontAwesomeCategories () {
      const response = await fetch('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/5.11.2/metadata/categories.yml')

      if (response.status !== 200) throw new Error('Impossible to retrieve fontawesome categories: ' + response.status)
      const text = await response.text()

      try {
        const yamlCodes = yaml.safeLoad(text)

        return yamlCodes
      } catch (error) {
        throw new Error('Impossible to parse fontawesome categories: ' + error)
      }
    },
    addFontAwsomeIcons (list, value, key) {
      // We also support lineawesome, which is fontawesome compatible
      const prefix = (this.iconSet === 'line-awesome' ? 'la' : 'fa')
      if (!value.styles) {
        this.addFontAwsomeIcon(list, key, `${prefix}-${key}`)
      } else {
        if (value.styles.includes('brands')) {
          this.addFontAwsomeIcon(list, key, `${prefix}b ${prefix}-${key}`)
        } else {
          if (value.styles.includes('regular')) {
            this.addFontAwsomeIcon(list, key, `${prefix}r ${prefix}-${key}`)
          }
          if (value.styles.includes('solid')) {
            this.addFontAwsomeIcon(list, key, `${prefix}s ${prefix}-${key}`)
          }
          if (value.styles.includes('light')) {
            this.addFontAwsomeIcon(list, key, `${prefix}l ${prefix}-${key}`)
          }
        }
      }
    },
    addFontAwsomeIcon (list, key, icon) {
      list.push({ name: icon, title: key })
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-palette'] = this.$load('input/KPalette')

    // Load the icons set
    let result

    if (this.iconSet === 'material-icons') {
      result = await this.loadMaterialIcons()
    } else {
      result = await this.loadFontAwesomeIcons()
    }

    this.allIcons = result.icons
    this.categories = result.categories
    this.categoryInfos = result.categoryInfos
  }
}
</script>
