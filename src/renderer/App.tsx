import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Home } from './components/pages/Home';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeOptions } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { IpcListener } from './components/IpcListener';

const theme: ThemeOptions = createTheme({
  palette: {
    primary: {
      main: '#1E8E3E',
    },
    background: {
      paper: '#d8d8d8',
    },
    text: {
      primary: '#383838',
    },
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <IpcListener />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}
