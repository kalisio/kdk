<template>
  <div class="row q-gutter-md justify-around no-wrap">
    <template v-for="index in size">
      <q-input 
        :key="index" 
        v-model.number="digits[index - 1]" 
        :rules="[value => !!value]"
        mask="#" 
        outlined
        no-error-icon
        input-class="text-center" 
        @input="onChanged" />
    </template>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-code-input',
  props: {
    value: {
      type: Number,
      default: undefined
    },  
    size: {
      type: Number,
      default: 6
    }
  },
  data () {
    return {
      digits: new Array(this.size)
    }
  },
  methods: {
    onChanged () {
      const isValid = _.every(this.digits, (digit) => !_.isNil(digit) && digit !== '')
      if (isValid) {
        const code = _.reduce(this.digits, (code, digit) => { return code + digit.toString() }, '')
        this.$emit('input', parseInt(code))
      } else {
        this.$emit('input', undefined)
      }
    }
  }
}
</script>
