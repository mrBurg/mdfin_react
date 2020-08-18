import { FC, ReactElement } from 'react';
import Head from 'next/head';
import _ from 'lodash';

import style from './Documents.module.scss';

import { TClientStepProps } from '../../Client';
import { BUTTON_TYPE, INPUT_TYPE } from '../../../../constants';
import { gt } from '../../../../utils';
import { SelectWidget } from '../../../widgets/SelectWidget';

export const Documents: FC<TClientStepProps> = ({
  switchNextStepHendler,
}): ReactElement => {
  return (
    <>
      <Head>
        <title>Documents</title>
      </Head>

      <div className={style.attachments}>
        <div className={style.documents}>
          <h2 className={style.title}>Thông Tin Tài Khoản và Chứng Từ</h2>
          <ul className={style.buttons}>
            <li>
              <label className={style.button}>
                <input type={INPUT_TYPE.FILE} className={style.file} />
                <p>Tải lên CMND (Mặt Trước)</p>
                <div className={style.icon} />
              </label>
            </li>
            <li>
              <label className={style.button}>
                <input type={INPUT_TYPE.FILE} className={style.file} />
                <p>Tải Lên CMND (Mặt Sau)</p>
                <div className={style.icon} />
              </label>
            </li>
            <li>
              <label className={style.button}>
                <input type={INPUT_TYPE.FILE} className={style.file} />
                <p>Tải Lên Ảnh Chụp Selfie Cầm CMND Trên Tay</p>
                <div className={style.icon} />
              </label>
            </li>
            <li>
              <label className={style.button}>
                <input type={INPUT_TYPE.FILE} className={style.file} />
                <p>Giấy Tờ Khác</p>
                <div className={style.icon} />
              </label>
            </li>
          </ul>
        </div>
        <div className={style.bankAccount}>
          <h2 className={style.title}>Thêm Tài Khoản Ngân Hàng</h2>
          <div className={style.buttons}>
            <div className={style.fullrow}>
              <SelectWidget
                className={style.select}
                placeholder={'Chọn Tài Khoản Ngân Hàng'}
                options={_.times(5, (index) => {
                  return {
                    value: String(index),
                    text: `Option ${index}`,
                  };
                })}
              />
            </div>
            <button className={style.button}>Chọn Ngân Hàng</button>
            <input
              className={style.input}
              type={INPUT_TYPE.TEXT}
              placeholder='Số Tài Khoản Ngân Hàng'
            />
          </div>
        </div>
        <button
          className={style.nextStep}
          onClick={switchNextStepHendler}
          type={BUTTON_TYPE.BUTTON}
        >
          {gt.gettext('Confirm')}
        </button>
      </div>
    </>
  );
};
