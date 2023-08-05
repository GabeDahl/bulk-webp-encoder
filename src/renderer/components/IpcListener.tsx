import React, { useEffect } from 'react';
import { finish } from 'renderer/redux/slices/encoding-status';
import { updateEncodingStatus } from 'renderer/redux/slices/files';
import { useAppDispatch } from 'renderer/redux/store';

export const IpcListener = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    window.electron.ipcRenderer.on('status-update', (update) => {
      dispatch(updateEncodingStatus(update));
    });
    window.electron.ipcRenderer.on('all-jobs-complete', () => {
      console.log('all jobs complete');
      dispatch(finish());
    });
  }, []);
  return null;
};
