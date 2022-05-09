<template>
  <div class="k-screen q-pa-md fullscreen row justify-center items-center">
    <!--
      Header section
      -->
    <component :is="headerComponent" class="col-12 self-start" />
    <!--
      Content section
    -->
    <div class="k-screen-content">
      <div v-if="banner" class="row justify-center">
        <img :src="banner">
      </div>
      <!-- Frame -->
      <q-card class="k-screen-frame q-pa-sm">
        <q-card-section v-if="title">
          <div class="text-h6 text-center">{{ $t(title) }}</div>
        </q-card-section>
        <q-card-section>
          <slot />
        </q-card-section>
        <q-card-section v-if="actions.length > 0">
          <k-panel class="q-pa-none" id="frame-actions" :content="actions" />
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
import { defineAsyncComponent } from 'vue'
import KPanel from '../frame/KPanel.vue'

export default {
  name: 'k-screen',
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
      return defineAsyncComponent(this.$load('screen/KScreenHeader'))
    },
    footerComponent () {
      return defineAsyncComponent(this.$load('screen/KScreenFooter'))
    }
  },
  data () {
    return {
      header: 'screen/KScreenHeader',
      backgroundColor: '#EFEFEF',
      textColor: 'black',
      banner: null,
      frameBackgroundColor: '#EFEFEE',
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
    this.banner = this.$load(this.$config('screens.banner'), 'asset')
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