import { ReactElement } from 'react';

export function LanguagesSwitcher(): ReactElement {
  return (
    <div className='language'>
      <a href='#' className='language-button'>
        РУС
      </a>
      <ul>
        <li>
          <a href='#'>УКР</a>
        </li>
      </ul>
    </div>
  );
}
