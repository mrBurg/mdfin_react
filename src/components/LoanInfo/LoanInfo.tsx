import React, { ReactElement, Fragment } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './LoanInfo.module.scss';
import { WithTracking, FieldDataConverter } from '@components/hocs';
import { LINK_TARGET } from '@src/constants';
import { WidgetRoles } from '@src/roles';
import { EMouseEvents } from '@src/trackingConstants';
import { TLoanInfoProps } from './@types';
import { gt } from '@utils';

function renderSeparator(): ReactElement {
  return (
    <tr>
      <td colSpan={2}>
        <hr className={style.separator} />
      </td>
    </tr>
  );
}

export const LoanInfo = ({
  className,
  title,
  params,
}: TLoanInfoProps): ReactElement => {
  return (
    <div className={classNames(style.info, className)}>
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
                      <WithTracking
                        id={`LoanInfo-${WidgetRoles.link}`}
                        events={[EMouseEvents.CLICK]}
                      >
                        <a
                          role={WidgetRoles.link}
                          href={link}
                          className={style.link}
                          target={LINK_TARGET.BLANK}
                        >
                          {value}
                        </a>
                      </WithTracking>
                    ) : (
                      <FieldDataConverter type={text} value={value} />
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
