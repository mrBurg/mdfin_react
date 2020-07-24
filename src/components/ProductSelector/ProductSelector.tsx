import { FC, ReactElement } from 'react';
import classNames from 'classnames';

import style from './ProductSelector.module.scss';

import LoanButton from '../LoanButton';
import { gt } from '../../utils';

type TProductSelectorProps = {
  className?: string;
};

export const ProductSelector: FC<TProductSelectorProps> = ({
  className,
}): ReactElement => {
  return (
    <div className={classNames(style.productSelector, className)}>
      <div className={classNames(style.item, style.calculator)}>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae
        deleniti voluptates libero quidem delectus, maxime vero odit
        perspiciatis commodi praesentium nisi, eveniet modi magnam, ducimus
        doloremque! Odit facere sapiente nostrum.
      </div>
      <div className={classNames(style.item, style.loanData)}>
        <h2 className={style.loanTitle}>Điều Khoản và Điều Kiện</h2>
        <table className={style.loanInfo}>
          <tbody>
            <tr>
              <td>Số Tiền Cần Vay</td>
              <td>2 500 000 {gt.gettext('Currency')}</td>
            </tr>
            <tr>
              <td>Tổng Tiền Cần Thanh Toán</td>
              <td>7 500 000 {gt.gettext('Currency')} </td>
            </tr>
            <tr>
              <td>Ngày đến hạn thanh toán</td>
              <td>24.06.2020</td>
            </tr>
          </tbody>
        </table>

        <LoanButton className={style.loanButton} />
      </div>
    </div>
  );
};
