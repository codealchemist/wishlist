import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

function log () {
  console.log('[ sharingSlice ]', ...arguments)
}

const store = (set, get) => ({
  sharing: {
    channelUuid: null,
    clientUuid: null,
    details: {}
  },
  setChannelUuid: channelUuid => set(state => {
    log('setChannelUuid', channelUuid)
    return { 
      ...state,
      sharing: {
        ...state.sharing,
        channelUuid
      }
    }
  }),
  setClientUuid: clientUuid => set(state => {
    log('setClientUuid', clientUuid)
    return { 
      ...state,
      sharing: {
        ...state.sharing,
        clientUuid
      }
    }
  }),
  setDetails: ({ userName, description }) => set(state => {
    log('setUserName', { userName, description })
    return { 
      ...state,
      sharing: {
        ...state.sharing,
        details: {
          userName,
          description
        }
      }
    }
  })
})

const persistedStore = persist(store, {
  name: 'sharing-store',
  storage: createJSONStorage(() => window.localStorage)
})

export const useSharingStore = create(persistedStore)
