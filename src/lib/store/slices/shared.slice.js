import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

function log () {
  console.log('[ sharedSlice ]', ...arguments)
}

const store = (set, get) => ({
  shared: {},
  selectedWish: null,
  addSharedWishes: ({ channelUuid, details, wishes }) => set(state => {
    log('addSharedWishes', { details, wishes })

    // Compare wishes. Avoid overwriting if there are no changes.
    const currentWishes = state.shared[channelUuid]?.wishes
    if (JSON.stringify(currentWishes) === JSON.stringify(wishes)) {
      log('No changes in wishes. Skipping update.', { currentWishes, wishes })
      return state
    }

    return { 
      ...state,
      shared: {
        [channelUuid]: {
          details,
          wishes
        }
      },
      selectedWish: null
    }
  }),
  removeSharedWishes: ({ channelUuid }) => set(state => {
    log('removeSharedWishes', { channelUuid })
    const draft = { ...state.shared }
    delete draft[channelUuid]

    return { 
      ...state,
      shared: draft
    }
  }),
  setSelectedWish: ({ channelUuid, wishIndex }) => set(state => {
    log('setSelectedWish', { channelUuid, wishIndex })
    if (wishIndex === undefined) return state
    const selectedWish = state.shared[channelUuid]?.wishes[wishIndex]
    selectedWish.index = wishIndex
    log({ selectedWish })

    return { 
      ...state,
      selectedWish
    }
  })
})

const persistedStore = persist(store, {
  name: 'shared-store',
  storage: createJSONStorage(() => window.localStorage)
})

export const useSharedStore = create(persistedStore)
