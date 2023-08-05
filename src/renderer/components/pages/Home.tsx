import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import { FileCatcher } from '../FileCatcher';
import { SelectedFilesList } from '../SelectedFilesList';
import { OptionsPanel } from '../OptionsPanel';
import { EncodingStatusDialog } from '../EncodingStatusDialog';
import { styled } from '@mui/material/styles';
const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

export const Home = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Main open={true}>
        <Grid container spacing={3} alignItems="center" sx={{ height: '100%' }}>
          <Grid item xs={12} sm={6}>
            <FileCatcher />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SelectedFilesList />
          </Grid>
        </Grid>
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={true}
      >
        <OptionsPanel />
      </Drawer>
      <EncodingStatusDialog />
    </Box>
  );
};
