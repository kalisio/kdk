 <template>
  <pinch-zoom class="pinch-zoom-controller">
    <div id="image" class="fit row justify-center items-center">
      <img :src="source" style="max-width:100%; max-height:100%" />
    </div>
  </pinch-zoom>
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
  data () {
    return {
    }
  },
  methods: {
    restore () {
    }
  }
}
</script>
