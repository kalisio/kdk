 <template>
  <div v-if="interactive === true" class="fit" >
    <pinch-zoom class="pinch-zoom-controller fit row justify-center items-center">
      <img :src="source" style="max-width:100%; max-height:100%" />
    </pinch-zoom>
  </div>
  <div v-else class="fit row justify-center items-center">
    <img :src="source" style="max-width:100%; max-height:100%" />
  </div>
</template>

<script>
import 'pinch-zoom-element/dist/pinch-zoom.js'

export default {
  name: 'k-image-viewer',
  props: {
    source: {
      type: String,
      default: ''
    },
    interactive: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    restore () {
      const controller = document.querySelector('.pinch-zoom-controller')
      controller.setTransform({
        scale: 1,
        x: 0,
        y: 0,
        allowChangeEvent: true
      })
    }
  },
  mounted () {
    this.restore()
  }
}
</script>
