import Check from '@mui/icons-material/Check';
import Error from '@mui/icons-material/Error';
import Pending from '@mui/icons-material/Pending';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { useAppDispatch, useAppSelector } from 'renderer/redux/store';
import AutoSizer from 'react-virtualized-auto-sizer';
import { resetEncodingStatuses } from 'renderer/redux/slices/files';

export const EncodingStatusDialog = () => {
  const files = useAppSelector((state) => state.files.selectedFiles);
  const status = useAppSelector((state) => state.encodingStatus.status);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    dispatch(resetEncodingStatuses());
  };
  useEffect(() => {
    if (status === 'started') {
      setOpen(true);
    }
  }, [status]);
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Encoding Status
        {status === 'started' && <CircularProgress variant="indeterminate" />}
        {status === 'finished' && <Check color="success" />}
      </DialogTitle>
      <EncodingProgress />
      <Paper variant="outlined" sx={{ width: '400px', height: '300px', m: 2 }}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              itemSize={70}
              itemCount={files.length}
              width={width}
              height={height}
            >
              {Row}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Paper>
      <EncodingProgress />
    </Dialog>
  );
};

const EncodingProgress = () => {
  const files = useAppSelector((state) => state.files.selectedFiles);
  const [progress, setProgress] = useState(0);
  const calculateProgress = (): number => {
    if (files.length === 0) return 0;

    const completedFiles = files.filter(
      (file) => file.encodingStatus === 'succeeded'
    ).length;
    return (completedFiles / files.length) * 100;
  };

  useEffect(() => {
    setProgress(calculateProgress());
  }, [files]);
  return <LinearProgress variant="determinate" value={progress} />;
};
const Row = ({ index, style }: any) => {
  const { name, encodingStatus, path } = useAppSelector(
    (state) => state.files.selectedFiles[index]
  );
  const numFiles = useAppSelector((state) => state.files.selectedFiles.length);

  useEffect(() => {}, []);
  return (
    <div style={style}>
      <ListItem
        secondaryAction={
          encodingStatus === 'pending' ? (
            <IconButton>
              <Pending color="info" />
            </IconButton>
          ) : encodingStatus === 'succeeded' ? (
            <IconButton>
              <Check color="success" />
            </IconButton>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Encoding Error">
                <Error color="error" />
              </Tooltip>
            </div>
          )
        }
      >
        <ListItemText
          secondaryTypographyProps={{
            noWrap: true,
            fontSize: 10,
          }}
          primaryTypographyProps={{ noWrap: true }}
          primary={name}
          secondary={path}
        />
      </ListItem>
      {index !== numFiles - 1 && <Divider />}
    </div>
  );
};
