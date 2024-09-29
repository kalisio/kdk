<template>
  <KCard
    v-bind="$props"
    :header="header"
    :sections="sections"
    :footer="footer"
    :shadow="shadow"
    :dense="dense"
  >
    <template v-slot:card-heading>
      <div class="full-width row">
        <div :class="{ 'col-12': dense, 'col-8': !dense }">
          <div class="full-width row justify-between">
            <!-- name -->
            <div
              class="text-subtitle1 text-weight-medium ellipsis-2-lines"
              v-bind:class="{ 'q-py-xs': dense, 'q-py-sm': !dense }"
            >
              {{ item.name }}
            </div>
            <!-- location name if dense -->
            <div v-if="dense && item.location"
              class="row items-center justify-end q-gutter-x-sm k-location-name"
            >
              <q-icon v-if="dense" name="las la-map-marker" />
              <span class="ellipsis text-caption">{{ item.location.properties.name }}</span>
              <KLocationTip
                v-if="dense"
                :location="item.location"
              />
            </div>
          </div>
          <KDescriptionCardSection
            :item="item"
            :actions="descriptionActions"
            :dense="dense"
          />
        </div>
        <div v-if="!dense" class="q-pl-sm q-pb-sm col-4">
          <div v-if="item.location" class="fit column relative-position">
            <KLocationMap
              v-model="item.location"
              :tools="[]"
              class="col k-location-map"
            />
            <div class="full-width ellipsis text-caption k-location-map-caption">
              {{ item.location.properties.name }}
            </div>
            <KPanel 
              :content="locationActions" 
              class="k-location-actions" 
            />
          </div>
          <div v-else class="fit column k-location-map relative-position">
            <div class="absolute-center" >
              <KStamp
                icon="las la-map-marker"
                text="KLocationCardSection.NO_LOCATION"
              />
            </div>
            <KPanel 
              :content="locationActions"
              class="k-location-actions"
            />
          </div>
        </div>
      </div>
    </template>
  </KCard>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '../../../../core/client'
import KDescriptionCardSection from '../../../../core/client/components/collection/KDescriptionCardSection.vue'
import KLocationMap from './KLocationMap'
import KLocationTip from './KLocationTip'

export default {
  mixins: [kCoreMixins.baseItem],
  components: {
    KDescriptionCardSection,
    KLocationMap,
    KLocationTip
  },
  props: {
    header: {
      type: [Array, Object],
      default: () => null
    },
    sections: {
      type: Object,
      default: () => null
    },
    footer: {
      type: [Array, Object],
      default: () => null
    },
    shadow: {
      type: Number,
      default: 0,
      validator: (value) => {
        return value >= 0 && value <= 24
      }
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    descriptionActions () {
      return _.filter(this.itemActions, { scope: 'description' })
    },
    locationActions () {
      return _.filter(this.itemActions, { scope: 'location' })
    }
  }
}
</script>

<style lang="scss" scoped>
.k-location-name {
  user-select: none;
  cursor: pointer;
}
.k-location-map {
  border-radius: 5px 5px 0px 0px;
  border: 1px solid lightgrey;
}
.k-location-map-caption {
  user-select: none;
  padding-left: 4px;
  padding-right: 4px;
  background-color: #EEEEEE;
  border-radius: 0px 0px 5px 5px;
  border: 1px solid lightgrey;
}
.k-location-actions {
  position: absolute;
  top: 2px; 
  right: 2px;  
  background-color: #ffffffaa; 
  border-radius: 10px;
  z-index: 401; 
}
</style>
