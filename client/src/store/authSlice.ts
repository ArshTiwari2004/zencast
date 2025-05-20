import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  user: null | {
    id: string
    name: string
    email: string
  }
  token: string | null
  refreshToken: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{
      user: AuthState['user']
      token: string | null
      refreshToken: string | null
    }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
    }
  }
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer