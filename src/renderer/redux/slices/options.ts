import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  AdvancedLossyOptions,
  BasicOptions,
  BooleanBasicOptionKey,
  CropOptions,
  LossyOptions,
  NumericBasicOptionKey,
  Preset,
  ResizeOptions,
} from 'models/Options';

interface State {
  basicOptions: BasicOptions;
  lossyOptions: LossyOptions;
  advancedLossyOptions: AdvancedLossyOptions;
  cropOptions: CropOptions;
  resizeOptions: ResizeOptions;
}
// Define the initial state using that type
const initialState: State = {
  basicOptions: {
    destinationFolder: null,

    preset: 'none',
    q: 75,
    lossless: false,
    near_lossless: 100,
    alpha_q: 100,
    m: 6,
    mt: false,
    low_memory: false,
  },
  lossyOptions: {
    size: null,
    psnr: null,
    pass: null,
    af: false,
    jpeg_like: false,
  },
  advancedLossyOptions: {
    f: null,
    sharpness: null,
    strong: false,
    nostrong: false,
    sns: null,
    segments: null,
    partition_limit: null,
  },
  cropOptions: {
    enabled: false,
    x_position: null,
    y_position: null,
    width: null,
    height: null,
  },
  resizeOptions: {
    enabled: false,
    width: null,
    height: null,
  },
};

export const optionsSlice = createSlice({
  name: 'options',
  initialState,
  reducers: {
    setNumericalBasicOption: (
      state,
      action: PayloadAction<{ key: NumericBasicOptionKey; value: number }>
    ) => {
      state.basicOptions[action.payload.key] = action.payload.value;
    },
    setBooleanBasicOption: (
      state,
      action: PayloadAction<{ key: BooleanBasicOptionKey; value: boolean }>
    ) => {
      state.basicOptions[action.payload.key] = action.payload.value;
    },
    setPreset: (state, action: PayloadAction<Preset>) => {
      state.basicOptions.preset = action.payload;
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
    setDestinationFolder: (
      state,
      { payload }: PayloadAction<string | null>
    ) => {
      state.basicOptions.destinationFolder = payload;
    },
  },
});

export const {
  setBooleanBasicOption,
  setNumericalBasicOption,
  setPreset,
  reset,
  setDestinationFolder,
} = optionsSlice.actions;

export default optionsSlice.reducer;
