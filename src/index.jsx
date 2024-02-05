import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import {mode} from '@chakra-ui/theme-tools';
import { BrowserRouter } from 'react-router-dom';

//Cretaing object 'styles' with global func. or global key 'props' to change the background theme from light to dark mode.
const styles = {
  global:(props) => ({
    body:{ //body selector
      bg:mode("gray.100","#000")(props), //("lighter color for light mode", "draker color for dark mode")
      color:mode("gray.800", "whiteAlpha.900")(props)
    },
  }),
};

// 2. Add your color mode config
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({ config, styles }) //passing object & styles to extended theme, in order to overwrite the default colour provided by ChakraProvider.

//Passing the theme to <App />
//NB: ReactDOM - Renders components & elements on the web.
//<BrowserRouter>.....</BrowserRouter> - allows to use any component from 'react-router-dom' library.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <ChakraProvider theme={theme}> 
      <App />
    </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
