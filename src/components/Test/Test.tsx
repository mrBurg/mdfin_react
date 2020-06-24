import { ReactElement, Component } from 'react';
import { isBrowser } from '../../utils';

type TTestState = {
  isCSR?: boolean;
};

export class Test extends Component {
  public readonly state: TTestState = {};

  componentDidMount() {
    if (isBrowser) {
      this.setState((state) => {
        return {
          ...state,
          isCSR: isBrowser,
        };
      });
    }
  }

  render(): ReactElement | null {
    const { isCSR } = this.state;
    const randomNumber: number = Math.random();
    console.info(randomNumber);

    if (isCSR) {
      return <h1>{randomNumber}</h1>;
    }

    return null;
  }
}
