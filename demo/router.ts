import { createRouter, createWebHashHistory } from 'vue-router'

import BasicComponent from './components/basic.vue'
import CloneComponent from './components/clone.vue'
import TransitionComponent from './components/transition-group.vue'
import NestedComponent from './components/nested-component.vue'
import VuexComponent from './components/vuex-component.vue'
import VModelComponent from './components/v-model-component.vue'
import ThirdPartyComponent from './components/third-party.vue'
import FutureIndexComponent from './components/futureIndex.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'basic',
      path: '/',
      component: BasicComponent,
    },
    {
      name: 'clone',
      path: '/clone',
      component: CloneComponent,
    },
    {
      name: 'transition',
      path: '/transition',
      component: TransitionComponent,
    },
    {
      name: 'nested',
      path: '/nested',
      component: NestedComponent,
    },
    {
      name: 'vuex',
      path: '/vuex',
      component: VuexComponent,
    },
    {
      name: 'vmode',
      path: '/vmode',
      component: VModelComponent,
    },
    {
      name: 'third-party',
      path: '/third-party',
      component: ThirdPartyComponent,
    },
    {
      name: 'future-index',
      path: '/future-index',
      component: FutureIndexComponent,
    },
  ],
})

export { router }
