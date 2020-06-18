import { ReactElement } from 'react';

export function ClientMenu(): ReactElement {
  return (
    <div className='mobile-customer'>
      <div className='user-men'>
        <div className='client-menu'>
          <ul className='client-menu__menu'>
            <li>Данные</li>
            <li>Заявки</li>
            <li>Выйти</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
