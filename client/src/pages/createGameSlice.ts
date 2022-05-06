import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CreateGameState {
  name: string
  playerCount: number
  creating: boolean
  invalidGameName: boolean,
  invalidGamePlayerCount: boolean
}

const initialState: CreateGameState = {
  name: '',
  playerCount: 2,
  creating: false,
  invalidGameName: false,
  invalidGamePlayerCount: false
}

export const createGameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload
    },
    setPlayerCount: (state, action: PayloadAction<number>) => {
      state.playerCount = action.payload
    },
    creating: (state) => {
      state.creating = true
    }
  },
})

export const { setName, setPlayerCount } = createGameSlice.actions

export default createGameSlice.reducer
