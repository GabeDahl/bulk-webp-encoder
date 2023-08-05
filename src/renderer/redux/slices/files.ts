import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { EncodingStatusUpdate } from 'models/EncodingStatusUpdate';
import { ImageFile } from 'models/ImageFile';

interface FilesState {
  selectedFiles: ImageFile[];
}

const initialState: FilesState = {
  selectedFiles: [],
};
export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    addFile: (state, { payload }: PayloadAction<ImageFile>) => {
      const newFile = payload;
      const isDuplicate = state.selectedFiles.some(
        (file) => file.path === newFile.path
      );

      if (!isDuplicate) {
        state.selectedFiles.push(newFile);
      }
    },
    addFiles: (state, { payload }: PayloadAction<ImageFile[]>) => {
      const newFiles = payload.filter((newFile) => {
        return !state.selectedFiles.some((file) => file.path === newFile.path);
      });
      state.selectedFiles.push(...newFiles);
    },
    removeFile: (state, { payload }: PayloadAction<number>) => {
      const indexToRemove = payload;
      if (indexToRemove >= 0 && indexToRemove < state.selectedFiles.length) {
        state.selectedFiles.splice(indexToRemove, 1);
      }
    },
    clearFiles: (state) => {
      state.selectedFiles = [];
    },
    updateEncodingStatus: (
      state,
      { payload }: PayloadAction<EncodingStatusUpdate>
    ) => {
      const i = state.selectedFiles.findIndex((file) => {
        return file.path === payload.filePath;
      });
      if (i === -1) return;
      state.selectedFiles[i].encodingStatus = payload.status;
    },
    resetEncodingStatuses: (state) => {
      state.selectedFiles.forEach((file) => {
        file.encodingStatus = 'pending';
      });
    },
  },
});

export const {
  addFile,
  addFiles,
  removeFile,
  clearFiles,
  updateEncodingStatus,
  resetEncodingStatuses,
} = filesSlice.actions;

export default filesSlice.reducer;
