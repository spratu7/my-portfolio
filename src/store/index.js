import { createStore } from 'vuex'
import menu from './menu.js'
import createPersistedstate from 'vuex-persistedstate'

export default createStore({
  plugins: [createPersistedstate({
    key: 'pz_v3'
  })],
  modules: {
    menu
  }
}) 