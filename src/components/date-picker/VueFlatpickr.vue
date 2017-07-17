<template>
  <input type="text" :class="inputClass" :placeholder="placeholder" :value="value" @input="onInput">
</template>

<script>
import Flatpickr from './assets/flatpickr'
import './assets/flatpickr.scss'

export default {
  props: {
    inputClass: {
      type: String
    },
    placeholder: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => { return {} }
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      fp: null
    }
  },
  computed: {
    fpOptions () {
      return JSON.stringify(this.options)
    }
  },
  watch: {
    fpOptions: {
      handler(newOpt) {
        const option = JSON.parse(newOpt)
        for (let o in option) {
          if (o !== 'dateFilterID') {
            this.fp.set(o, option[o])
          }
        }
      }, 
      deep: true
    }
  },
  mounted () {

    // emit events here, so we have access to the Vue instance in the callbacks in the importing component.
    this.options.onOpen = (selectedDates, dateStr, instance) => {
      this.$emit('opened', selectedDates, dateStr, instance, this.inputID)
    }

    this.options.onClose = (selectedDates, dateStr, instance) => {
      this.$emit('closed', selectedDates, dateStr, instance, this.inputID)
    }

    const self = this
    const origOnValUpdate = this.options.onValueUpdate
    this.fp = new Flatpickr(this.$el, Object.assign(this.options, {
      onValueUpdate () {
        self.onInput(self.$el.value)
        if (typeof origOnValUpdate === 'function') {
          origOnValUpdate()
        }
      }
    }))
    
    this.$emit('FlatpickrRef', this.fp)
  },
  destroyed () {
    this.fp.destroy()
    this.fp = null
  },
  methods: {
    onInput (e) {
      typeof e === 'string' ? this.$emit('input', e) : this.$emit('input', e.target.value)
    }
  }
}
</script>