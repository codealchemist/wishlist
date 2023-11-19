import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

function log () {
  console.log('[ wishesSlice ]', ...arguments)
}

const store = (set, get) => ({
  wishes: [],
  add: wish => set(state => {
    log('add', wish)
    return { 
      ...state,
      wishes: state.wishes.concat(wish)
    }
  }),
  update: (index, updatedWish) => set(state => {
    log('update', { index, updatedWish })
    return {
      ...state,
      wishes: state.wishes.map((currentWish, i) => i === index ? updatedWish : currentWish)
    }
  }),
  remove: index => set(state => {
    log('remove', { index })
    return {
      ...state,
      wishes: state.wishes.filter((_, i) => i !== index)
    }
  }),
  removeAll: () => set(state => {
    log('removeAll')
    return {
      ...state,
      wishes: []
    }
  }),
  addParticipant: ({ index, participant }) => set(state => {
    log('addParticipant', { index, participant })
    const updatedWish = {
      ...state.wishes[index],
      participants: [
        ...(state.wishes[index].participants || []),
        participant
      ]
    }

    return {
      ...state,
      wishes: state.wishes.map((currentWish, i) => i === index ? updatedWish : currentWish)
    }
  }),
  removeParticipant: ({ index, participant }) => set(state => {
    log('removeParticipant', { index, participant })
    const updatedWish = {
      ...state.wishes[index],
      participants: state.wishes[index]
        .participants
        .filter(p => p.name !== participant.name && p.email !== participant.email)
    }

    return {
      ...state,
      wishes: state.wishes.map((currentWish, i) => i === index ? updatedWish : currentWish)
    }
  })
})

const persistedStore = persist(store, {
  name: 'wishes-store',
  storage: createJSONStorage(() => window.localStorage)
})

export const useWishesStore = create(persistedStore)
