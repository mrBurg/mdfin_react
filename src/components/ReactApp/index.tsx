import React, { Component, ReactElement } from 'react';
import logo from './logo.svg';
import style from './App.module.scss';

export default class App extends Component {
  render(): ReactElement {
    return (
      <div className={style.app}>
        <header className={style.header}>
          <img src={logo} className={style.logo} alt='logo' />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className={style.link}
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}
