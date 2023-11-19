import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

function log () {
  console.log('[ userSlice ]', ...arguments)
}

const store = (set, get) => ({
  user: {},
  setUser: ({ name, email }) => set(state => {
    log('setUser', { name, email })

    return { 
      ...state,
      user: { name, email }
    }
  })
})

const persistedStore = persist(store, {
  name: 'user-store',
  storage: createJSONStorage(() => window.localStorage)
})

export const useUserStore = create(persistedStore)
