import React, { PureComponent, ReactElement } from 'react';

import { Preloader } from '@components/Preloader';
import { TStores } from '@stores';

export class Router extends PureComponent<TStores> {
  public async componentDidMount(): Promise<void> {
    const { userStore } = this.props;

    if (userStore) {
      await this.refreshView();
    }
  }

  private async refreshView() {
    const { userStore } = this.props;
    if (userStore) {
      userStore.getClientNextStep();
    }
  }

  public render(): ReactElement {
    return <Preloader />;
  }
}

/* export const Router: FC<TStores> = (props) => {
  const { children } = props;
  const router = useRouter();
  const [count, setCount] = useState(3);

  console.log('children: ', children);

  useEffect(() => {
    if (count > 1) {
      setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    } else {
      router.push(BASE_URLS.HOME);
    }
  });

  return (
    <>
      <span>
        {gt.xnpgettext('Will be redirected', '%d second', '%d seconds', count)}
      </span>
      {children}
    </>
  );
}; */
