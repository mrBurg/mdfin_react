import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import './scss/index.scss';
import ReactApp from './components/ReactApp';

render(
  <StrictMode>
    <ReactApp />
  </StrictMode>,
  document.getElementById('root')
);
