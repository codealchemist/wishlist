import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export { useWishesStore } from './slices/wishes.slice'
export { useSharingStore } from './slices/sharing.slice'
export { useSharedStore } from './slices/shared.slice'
export { useStore } from './useStore'


