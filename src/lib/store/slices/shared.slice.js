import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

function log () {
  console.log('[ sharedSlice ]', ...arguments)
}

const store = (set, get) => ({
  shared: {},
  selectedWish: null,
  participating: {},
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
      selectedWishInfo: null
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
  setSelectedWishInfo: ({ channelUuid, wishIndex }) => set(state => {
    log('setSelectedWishInfo', { channelUuid, wishIndex })
    if (wishIndex === undefined) return state

    return { 
      ...state,
      selectedWishInfo: { channelUuid, wishIndex }
    }
  }),
  setParticipation: ({ channelUuid, wish, user, participating }) => set(state => {
    log('setParticipation', { state, channelUuid, wish, user, participating })
    const draft = state.participating[channelUuid] || {}
    draft[wish.index] = participating

    // Update participation.
    return { 
      ...state,
      participating: {
        ...state.participating,
        [channelUuid]: draft
      }
    }
  }),
  addParticipant: ({ channelUuid, wishIndex, participant }) => set(state => {
    log('addParticipant', { channelUuid, wishIndex, participant })
    const draftWishes = state.shared[channelUuid]?.wishes
      .map((wish, i) => {
        if (i !== wishIndex) return wish
        return {
          ...wish,
          participants: [
            ...(wish.participants || []),
            participant
          ]
        }
      })

    return {
      ...state,
      shared: {
        ...state.shared,
        [channelUuid]: {
          ...state.shared[channelUuid],
          wishes: draftWishes
        }
      }
    }
  }),
  removeParticipant: ({ channelUuid, wishIndex, participant }) => set(state => {
    log('removeParticipant', { channelUuid, wishIndex, participant })
    const draftWishes = state.shared[channelUuid]?.wishes
      .map((wish, i) => {
        if (i !== wishIndex) return wish
        return {
          ...wish,
          participants: wish.participants.filter(p => p.name !== participant.name && p.email !== participant.email)
        }
      })
    
    return {
      ...state,
      shared: {
        ...state.shared,
        [channelUuid]: {
          ...state.shared[channelUuid],
          wishes: draftWishes
        }
      }
    }
  })
})

const persistedStore = persist(store, {
  name: 'shared-store',
  storage: createJSONStorage(() => window.localStorage)
})

export const useSharedStore = create(persistedStore)
