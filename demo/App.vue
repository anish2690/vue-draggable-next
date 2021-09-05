<template>
  <a class="ribbon" href="https://github.com/anish2690/vue-draggable-next"
    >Fork me on Github</a
  >
  <div class="pt-5 rounded bg-gradient-to-r from-teal-400 to-blue-500 h-screen">
    <div
      class="text-center text-5xl font-extrabold leading-none tracking-tight my-10"
    >
      vue-draggable-next
    </div>
    <div class="flex justify-center">
      <router-link
        v-for="tab in tabs"
        :key="tab"
        class="bg-gray-200 p-4 cursor-pointer border hover:bg-gray-300"
        :to="{ name: tab.path }"
      >
        {{ tab.name }}
      </router-link>
    </div>
    <div class="mx-10 my-10 shadow-xl p-5 component-container">
      <!-- <div v-for="(tab, index) of tabs" :key="index">
        <component :is="tab.component" v-if="tab.component === activeTab" />
      </div> -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue'

const tabs = [
  { path: 'basic', name: 'Simple', component: 'basic' },
  { path: 'clone', name: 'Clone', component: 'clone' },
  {
    path: 'transition',
    name: 'Transition Group',
    component: 'transition-group',
  },
  { path: 'nested', name: 'Nested', component: 'nested-component' },
  { path: 'vuex', name: 'Vuex', component: 'vuex-component' },
  { path: 'vmode', name: 'V-Model', component: 'v-model-component' },
  {
    path: 'third-party',
    name: 'Third Party',
    component: 'third-party',
  },
]

const components = tabs.reduce((comps, item) => {
  comps[item.component] = defineAsyncComponent(() =>
    import(`./components/${item.component}.vue`)
  )
  return comps
}, {})

export default defineComponent({
  name: 'App',
  components,
  setup() {
    const activeTab = ref('basic')
    return {
      tabs,
      activeTab,
    }
  },
})
</script>
<style>
.component-container {
  min-height: 600px;
}
.router-link-active {
  @apply bg-gray-400 !important;
}
</style>
