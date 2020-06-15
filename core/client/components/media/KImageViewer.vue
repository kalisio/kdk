 <template>
  <div class="row">
    <q-img 
      :style="styleTransform" 
      :src="source" 
      spinner-color="primary" 
      contain 
      @mousewheel="onMouseWheel"
      v-pan="onPan"
      v-pinch="onPinch" />
  </div>
</template>

<script>
import { QImg } from 'quasar'
import Vue from 'vue'
import Hammer from 'hammerjs'

Vue.directive("pan", {
  bind: function(el, binding) {
    if (typeof binding.value === "function") {
      const mc = new Hammer(el)
      mc.get("pan").set({ direction: Hammer.DIRECTION_ALL })
      mc.on("pan", binding.value)
    }
  }
})

Vue.directive("pinch", {
  bind: function(el, binding) {
    if (typeof binding.value === "function") {
      const mc = new Hammer(el)
      mc.get("pinch")
      mc.on("pinch", binding.value);
    }
  }
})

export default {
  name: 'k-image-viewer',
  components: {
    QImg
  },
  props: {
    source: {
      type: String,
      default: ''
    },
    transform: {
      type: Object,
      default: () => {
        return {
          scale: 1,
          translate: {
            x: 0, 
            y: 0
          },
          rotate: 0
        }
      }
    },
    interactive: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    styleTransform () {
      return 'transform: scale(' + this.scale + ') translate(' + this.translate.x + 'px ,' + this.translate.y + 'px);'
    }
  },
  data () {
    return {
      scale: 1,
      translate: {
        X: 0,
        y: 0
      },
      rotate: 0
    }
  },
  methods: {
    restore () {
      this.scale = this.transform.scale
      this.translate.x = this.transform.translate.x
      this.translate.y = this.transform.translate.y
      this.rotate = this.transform.rotate
    },
    onMouseWheel (event) {
      if (!this.interactive) return
      let less = this.scale > 1 ? -0.5 : -0.1
      let more = this.scale > 1 ? 0.5 : 0.1
      this.scale += event.wheelDeltaY < 0 ? less : more
      this.scale = Math.max(this.scale, 0.025)
      event.preventDefault()
    },
    onPan (event) {
      if (!this.interactive) return
      if (!this.first) {
        this.first = event
        this.previousDeltaX = event.deltaX
        this.previousDeltaY = event.deltaY
      } else if (event.isFinal) {
        this.first = null
      } else {
        this.translate.x += (event.deltaX - this.previousDeltaX) / this.scale
        this.translate.y += (event.deltaY - this.previousDeltaY) / this.scale
        this.previousDeltaX = event.deltaX
        this.previousDeltaY = event.deltaY
      }
    },
    onPinch (event) {
      if (!this.interactive) return
      this.scale = event.scale
    }
  },
  created () {
    this.restore()
    this.first = null
  }
}
</script>
