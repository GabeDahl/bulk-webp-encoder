import { createSlice } from '@reduxjs/toolkit';

interface EncodingStatusState {
  status: 'started' | 'finished' | null;
}

const initialState: EncodingStatusState = {
  status: null,
};
export const encodingStatusSlice = createSlice({
  name: 'encoding_status',
  initialState,
  reducers: {
    start: (state) => {
      state.status = 'started';
    },
    finish: (state) => {
      state.status = 'finished';
    },
  },
});

export const { start, finish } = encodingStatusSlice.actions;

export default encodingStatusSlice.reducer;
