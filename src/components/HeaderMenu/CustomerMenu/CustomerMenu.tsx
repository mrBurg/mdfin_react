import { ReactElement } from 'react';
import ClientMenu from '../ClientMenu';
import { gt } from '../../../utils';

export function CustomerMenu(): ReactElement {
  return (
    <div className='customer-menu'>
      <button>Зареєструватися</button>
      <button>Войти</button>
      <button>{gt.gettext('bye')}</button>
      <ClientMenu />
    </div>
  );
}
