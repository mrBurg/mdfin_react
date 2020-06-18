import { ReactElement } from 'react';

export function PhoneList(): ReactElement {
  return (
    <div className='phone-list show'>
      <a href='#' className='phone-list-button'>
        +38 044 333 52 22
      </a>
      <ul>
        <li>
          <a href='tel:+38 067 373 37 57'>+38 067 373 37 57</a>
        </li>
        <li>
          <a href='tel:+38 099 373 37 57'>+38 099 373 37 57</a>
        </li>
        <li>
          <a href='tel:+38 063 373 37 57'>+38 063 373 37 57</a>
        </li>
      </ul>
    </div>
  );
}
