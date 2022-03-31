import axios from 'axios';
import { enableMapSet } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';

import App from './App';

const GlobalStyle = createGlobalStyle`
  body, html {
    width: 100vw;
    height: 100vh;
	overflow-x: hidden;
	background: #121213;
  }

  * {
    font-family: "Comic Sans MS", serif !important;

    color: white;
    //font-family: Roboto,serif;
  }

  #root {
    height: 100%;
  }

  .app-button {
  }

  .app-icon {
    width: 50px;
    height: 50px;
  }

  .MuiDialog-container > .MuiPaper-root {
    background: #121213;
	* {
	  color: white;
	}
  }
`;

axios.defaults.baseURL = 'https://wordsapiv1.p.rapidapi.com/';

enableMapSet();

ReactDOM.render(
	<React.StrictMode>
		<GlobalStyle />
		<App />
	</React.StrictMode>,
	document.getElementById('root'),
);
