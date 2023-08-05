import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ImageFile } from 'models/ImageFile';
import { DragEvent, useState } from 'react';
import { addFile, addFiles } from 'renderer/redux/slices/files';
import { useAppDispatch } from 'renderer/redux/store';

const allowedFileTypes = [
  'image/png',
  'image/jpeg',
  'image/tiff',
  'image/webp',
];

export const FileCatcher = () => {
  const dispatch = useAppDispatch();
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragging) {
      setDragging(true);
    }
    if (e.dataTransfer.items) {
      [...e.dataTransfer.items].forEach((item) => {
        if (!allowedFileTypes.includes(item.type)) {
          setFileError('Invalid File Type');
          return;
        }
      });
    }
  };
  const handleClick = async () => {
    const files = await window.electron.ipcRenderer.selectFiles();
    console.log(files);
    dispatch(addFiles(files));
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    setDragging(false);
    setFileError(null);
  };
  const handleDrop = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    setDragging(false);
    [...ev.dataTransfer.items].forEach((item, i) => {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          const imageFile: ImageFile = {
            name: file.name,
            path: file.path,
            size: file.size,
            lastModified: file.lastModified,
            type: file.type,
            encodingStatus: 'pending',
          };

          dispatch(addFile(imageFile));
        } else {
          console.log('no file');
        }
      }
    });
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  return (
    <Stack
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
      sx={{
        width: '100%',
        flexGrow: 2,
        border: ({ palette: { error, success, info } }) =>
          `4px solid ${
            dragging ? (fileError ? error.main : success.main) : 'white'
          }`,
        boxSizing: 'border-box',
        borderStyle: 'dashed',
        strokeWidth: '10px',
        borderRadius: 1,
        height: { xs: null, sm: '80vh' },
      }}
      justifyContent="center"
      alignItems="center"
      spacing={4}
    >
      <Typography variant="h3" align="center">
        Drag & Drop Files
      </Typography>
      <Typography align="center" variant="h5">
        or
      </Typography>
      <Button onClick={handleClick} size="small" variant="contained">
        Browse Files
      </Button>
      <Typography variant="body2" whiteSpace="pre-line" align="center">
        Supported formats:{`\n`} PNG, JPEG, TIFF, WebP
      </Typography>
    </Stack>
  );
};
