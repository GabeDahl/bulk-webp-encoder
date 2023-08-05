import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import Paper from '@mui/material/Paper';
import { useAppDispatch, useAppSelector } from 'renderer/redux/store';
import Clear from '@mui/icons-material/Clear';
import { FixedSizeList } from 'react-window';
import { clearFiles, removeFile } from 'renderer/redux/slices/files';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useEffect } from 'react';
import { start } from 'renderer/redux/slices/encoding-status';

const Row = ({ index, style }: any) => {
  const { name, path } = useAppSelector(
    (state) => state.files.selectedFiles[index]
  );
  const numFiles = useAppSelector((state) => state.files.selectedFiles.length);
  const dispatch = useAppDispatch();
  const handleClear = () => {
    dispatch(removeFile(index));
  };
  useEffect(() => {}, []);
  return (
    <div style={style}>
      <ListItem
        secondaryAction={
          <IconButton onClick={handleClear}>
            <Clear color="error" />
          </IconButton>
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
export const SelectedFilesList = () => {
  const files = useAppSelector((state) => state.files.selectedFiles);
  const options = useAppSelector((state) => state.options.basicOptions);
  const dispatch = useAppDispatch();
  const handleClear = () => {
    dispatch(clearFiles());
  };
  const handleEncode = () => {
    dispatch(start());
    window.electron.ipcRenderer.encodeFiles(files, options).then((res) => {});
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 3,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {files.length === 0 ? (
        <Typography variant="h4" align="center">
          No Files Selected
        </Typography>
      ) : (
        <Card sx={{ minWidth: '100%', minHeight: '400px' }}>
          <CardHeader
            title="Images"
            action={
              <Button
                size="small"
                variant="outlined"
                onClick={handleClear}
                color="error"
              >
                Clear All
              </Button>
            }
          />

          <CardContent>
            <Paper
              variant="outlined"
              sx={{ minHeight: '300px', overflowX: 'hidden' }}
            >
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
          </CardContent>
          <CardActions>
            <Button
              fullWidth
              disabled={files.length < 1}
              size="large"
              variant="contained"
              onClick={handleEncode}
            >
              Encode
            </Button>
          </CardActions>
        </Card>
      )}
    </Box>
  );
};
