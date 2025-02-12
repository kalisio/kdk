<template>

  <div class="row">
    <div class="col-6">
      <q-input v-model="name" :label="$t('KStyleManager.NAME')" />
    </div>
    <div class="col-12 q-mt-md">
        <q-expansion-item header-class="bg-grey-2" :label="$t('KStyleManager.SECTION_TITLE_POINT')">
          <div class="row q-pl-lg q-pb-md bg-grey-1">
            <div class="col-9">
              <div class="row q-pl-lg items-center">
                <div class="col-10">
                  <p class="q-mb-none q-mt-lg"><q-icon name="las la-fill" size="2em"/> {{ $t('KStyleManager.COLOR') }}</p>
                </div>
                <div class="col-2">
                  <k-color-field values="" :properties="{name:'pointColor'}" model="#333333"/>
                </div>

                <div class="col-10">
                  <p class="q-mb-none q-mt-lg"><q-icon name="las la-ruler" size="2em"/> {{ $t('KStyleManager.SIZE') }}</p>
                </div>
                <div class="col-2">
                  <q-select v-model="size" :options="availableSizes" :label="$t('KStyleManager.SIZE')">
                    <template v-slot:selected-item="scope">{{ scope.opt }} px</template>
                  </q-select>
                </div>

                <div class="col-10">
                  <p class="q-mb-none q-mt-lg"><q-icon name="las la-shapes" size="2em"/> {{ $t('KStyleManager.SHAPE') }}</p>
                </div>
                <div class="col-2">
                  <q-select
                      v-model="shape"
                      :options="availableShapes"
                      :label="$t('KStyleManager.SHAPE')"
                  >
                    <template v-slot:selected-item="scope">
                      <q-icon :name="`las la-${scope.opt}`" size="1.8em"/>
                    </template>
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-icon :name="`las la-${scope.opt}`" size="1.8em"/>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-10">
                  <p class="q-mb-none q-mt-lg"><q-icon name="las la-icons" size="2em"/> {{ $t('KStyleManager.ICON') }}</p>
                </div>
                <div class="col-2">
                  <q-select
                      v-model="icon"
                      :options="availableIcons"
                      :label="$t('KStyleManager.ICON')"
                  >
                    <template v-slot:selected-item="scope">
                      <q-icon :name="`las la-${scope.opt}`" size="1.8em"/>
                    </template>
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                          <q-icon :name="`las la-${scope.opt}`" size="1.8em"/>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-10">
                  <p class="q-mb-none q-mt-lg"><q-icon name="las la-ruler" size="2em"/> {{ $t('KStyleManager.SIZE') }}</p>
                </div>
                <div class="col-2">
                  <q-select v-model="iconSize" :options="availableSizes" :label="$t('KStyleManager.SIZE')">
                    <template v-slot:selected-item="scope">{{ scope.opt }} px</template>
                  </q-select>
                </div>
              </div>

            </div>
            <div class="col-3">

            </div>
          </div>
        </q-expansion-item>

        <q-expansion-item header-class="bg-grey-2" :label="$t('KStyleManager.SECTION_TITLE_LINE')">
          <div class="row q-pl-lg q-pb-md bg-grey-1">
            <div class="col-9">
              <div class="row q-pl-lg">
                <div class="col-10">
                  <p><q-icon name="las la-fill" size="2em"/> {{ $t('KStyleManager.COLOR') }}</p>
                </div>
                <div class="col-2">
                  <k-color-field values="" :properties="{name:'red'}"/>
                </div>

                <div class="col-10">
                  <p><q-icon name="las la-ruler" size="2em"/> {{ $t('KStyleManager.SIZE') }}</p>
                </div>
                <div class="col-2">
                  <q-select v-model="size" :options="availableSize" :label="$t('KStyleManager.SIZE')" />
                </div>

                <div class="col-10">
                  <p><q-icon name="las la-shapes" size="2em"/> {{ $t('KStyleManager.SHAPE') }}</p>
                </div>
                <div class="col-2">
                  <q-select v-model="shape" :options="availableSize" :label="$t('KStyleManager.SIZE')" />
                </div>

              </div>

            </div>

            <div class="col-3">
<p>preview</p>
            </div>

          </div>
        </q-expansion-item>

        <q-expansion-item header-class="bg-grey-2" :label="$t('KStyleManager.SECTION_TITLE_POLYGON')">
          <div class="row q-pl-lg q-pb-md bg-grey-1">
            <div class="col-9">
              <div class="row q-pl-lg">
                <div class="col-10">
                  <p><q-icon name="las la-fill" size="2em"/> {{ $t('KStyleManager.COLOR') }}</p>
                </div>
                <div class="col-2">
                  <k-color-field values="" :properties="{name:'red'}"/>
                </div>

                <div class="col-10">
                  <p><q-icon name="las la-ruler" size="2em"/> {{ $t('KStyleManager.SIZE') }}</p>
                </div>
                <div class="col-2">
                  <q-select v-model="size" :options="availableSize" :label="$t('KStyleManager.SIZE')" />
                </div>

                <div class="col-10">
                  <p><q-icon name="las la-shapes" size="2em"/> {{ $t('KStyleManager.SHAPE') }}</p>
                </div>
                <div class="col-2">
                  <q-select v-model="shape" :options="availableSize" :label="$t('KStyleManager.SIZE')" />
                </div>

              </div>

            </div>

            <div class="col-3">
<p>preview</p>
            </div>

          </div>
        </q-expansion-item>

    </div>
  </div>

</template>

<script setup>

import { ref } from 'vue'
import KColorField from '../../../../core/client/components/form/KColorField.vue'

const availableSizes = ref([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
const availableShapes = ref(['ruler', 'shapes', 'car-alt'])
const availableIcons = ref(['ruler', 'shapes'])
const name = ref('')
const size = ref(12)
const shape = ref('')
const icon = ref('')
const iconSize = ref(12)

</script>
