<template>
  <div class="k-screen row justify-center items-center window-height window-width">
    <!--
      Header section
      -->
    <component :is="headerComponent" class="col-12 self-start" />
    <!--
      Content section
    -->
    <div class="k-screen-content">
      <!-- Frame -->
      <q-card class="k-screen-frame full-width q-pa-sm">
        <q-card-section v-if="banner">
          <div class="row justify-center">
            <img :src="banner" />
          </div>
        </q-card-section>
        <q-card-section v-if="title">
          <div class="text-h6 text-center">{{ $t(title) }}</div>
        </q-card-section>
        <q-card-section>
          <slot />
        </q-card-section>
        <q-card-section v-if="actions.length > 0">
          <k-panel id="frame-actions" class="q-pa-none justify-center" :content="actions" />
        </q-card-section>
      </q-card>
      <!-- links -->
      <div class="q-pa-sm row justify-center q-gutter-md">
        <template v-for="link in links" :key="link.id">
          <a v-if="link.label || link.icon" :id="link.id" @click="$router.push(link.route)">
            <q-icon v-if="link.icon" :name="link.icon"/>
            <span v-if="link.label" >{{ $t(link.label) }}</span>
          </a>
        </template>
      </div>
    </div>
    <!--
      Footer section
      -->
    <component :is="footerComponent" class="col-12 self-end" />
  </div>
</template>

<script>
import KPanel from '../frame/KPanel.vue'
import { loadComponent } from '../../utils.js'

export default {
  components: {
    KPanel
  },
  props: {
    title: {
      type: String,
      default: undefined
    },
    actions: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    headerComponent () {
      return loadComponent(this.header)
    },
    footerComponent () {
      return loadComponent(this.footer)
    }
  },
  data () {
    return {
      header: 'screen/KScreenHeader',
      backgroundColor: '#EFEFEF',
      textColor: 'black',
      banner: undefined,
      frameBackgroundColor: '#FFFFFF',
      frameTextColor: 'black',
      links: [],
      footer: 'screen/KScreenFooter'
    }
  },
  created () {
    // Configure this screen
    this.header = this.$config('screens.header', this.header)
    this.backgroundColor = this.$config('screens.backgroundColor', this.backgroundColor)
    this.textColor = this.$config('screens.textColor', this.textColor)
    this.banner = this.$config('screens.banner', this.banner)
    this.frameBackgroundColor = this.$config('screens.frameBackgroundColor', this.frameBackgroundColor)
    this.frameTextColor = this.$config('screens.frameTextColor', this.frameTextColor)
    this.links = this.$config('screens.links', this.links)
    this.footer = this.$config('screens.footer', this.footer)
  }
}
</script>

<style lang="scss" scoped>
.k-screen {
  background-color: v-bind(backgroundColor);
  color: v-bind(textColor);
}
.k-screen-content {
  min-width: 50%
}
.k-screen-frame {
  background-color: v-bind(frameBackgroundColor);
  color: v-bind(frameTextColor);
}
</style>
