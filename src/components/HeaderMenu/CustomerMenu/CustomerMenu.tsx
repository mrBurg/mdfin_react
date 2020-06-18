import { ReactElement } from 'react';
import ClientMenu from '../ClientMenu';

export function CustomerMenu(): ReactElement {
  return (
    <div className='customer-menu'>
      <button>Зареєструватися</button>
      <button>Войти</button>
      <button>Выйти</button>
      <ClientMenu />
    </div>
  );
}
