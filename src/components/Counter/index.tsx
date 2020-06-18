import React, { Component, ReactElement } from 'react';
import { STORE_IDS } from '../../stores';
import MainStore from '../../stores/mainStore';
import { observer, inject } from 'mobx-react';

@inject(STORE_IDS.MAIN_STORE)
@observer
export default class Counter extends Component<{
  [STORE_IDS.MAIN_STORE]?: MainStore;
}> {
  public render(): ReactElement {
    const { mainStore } = this.props;

    return <h1>{mainStore?.counter}</h1>;
  }
}
