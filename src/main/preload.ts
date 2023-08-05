// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ImageFile } from 'models/ImageFile';
import { BasicOptions } from 'models/Options';
import { EncodingStatusUpdate } from 'models/EncodingStatusUpdate';

export type Channels = 'status-update' | 'all-jobs-complete';
type IPCMessages = {
  'status-update': EncodingStatusUpdate;
  'all-jobs-complete': null;
};

const electronHandler = {
  ipcRenderer: {
    sendMessage<T extends Channels>(channel: T, ...args: IPCMessages[T][]) {
      ipcRenderer.send(channel, ...args);
    },
    on<T extends Channels>(
      channel: T,
      func: (...args: IPCMessages[T][]) => void
    ) {
      const subscription = (
        _event: IpcRendererEvent,
        ...args: IPCMessages[T][]
      ) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    selectFiles: () => ipcRenderer.invoke('dialog:selectFiles'),
    selectDestinationFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
    encodeFiles: (files: ImageFile[], options: BasicOptions) =>
      ipcRenderer.invoke('encoder:encode', { files: files, options: options }),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
export type ElectronHandler = typeof electronHandler;
