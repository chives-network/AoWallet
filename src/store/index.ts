// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'
import email from '../store/apps/email'

export const store = configureStore({
  reducer: {
    email
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
