import { FC, ReactElement, Fragment } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './LoanInfo.module.scss';

import { TLoanInfoProps } from './@types';
import { gt } from '../../utils';
import { CellData } from '../hocs';

function renderSeparator(): ReactElement {
  return (
    <tr>
      <td colSpan={2}>
        <hr className={style.separator} />
      </td>
    </tr>
  );
}

export const LoanInfo: FC<TLoanInfoProps> = ({
  className,
  title,
  params,
}): ReactElement => {
  return (
    <div className={classNames(className, style.info)}>
      <table className={style.datatable}>
        <thead>
          <tr>
            <td colSpan={2} className={style.title}>
              {title}
            </td>
          </tr>
        </thead>
        <tbody>
          {_.map(params, (item, key) => {
            const { text, value, link } = item;
            if (!value) return;

            return (
              <Fragment key={key}>
                {!!key && renderSeparator()}
                <tr>
                  <td>{gt.gettext(text)}</td>
                  <td>
                    {link ? (
                      <a href={link} className={style.link}>
                        {value}
                      </a>
                    ) : (
                      <CellData type={text} value={value} />
                    )}
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
