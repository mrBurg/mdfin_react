import { FC, ReactElement, Fragment } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './LoanInfo.module.scss';
import { TLoanInfoProps } from './@types';

export const LoanInfo: FC<TLoanInfoProps> = ({
  className,
  title,
  tableData,
}): ReactElement => {
  return (
    <div className={classNames(className, style.info)}>
      <table className={style.datatable}>
        <thead>
          <tr>
            <td colSpan={2}>{title}</td>
          </tr>
        </thead>
        <tbody>
          {_.map(tableData, (item, key, data) => {
            const notLastElement = key < data.length - 1;
            const { text, value, link } = item;

            return (
              <Fragment key={key}>
                <tr>
                  <td>{text}</td>
                  <td
                    className={classNames({ [style.accent]: !notLastElement })}
                  >
                    {link ? (
                      <a href={link} className={style.link}>
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </td>
                </tr>
                {notLastElement && (
                  <tr>
                    <td colSpan={2}>
                      <hr className={style.separator} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
