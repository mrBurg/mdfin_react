import { ReactElement, Component, FormEvent } from 'react';
import Router from 'next/router';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './Documents.module.scss';

import { ClientTabs } from '../ClientTabs';
import {
  BUTTON_TYPE,
  INPUT_TYPE,
  DOC_TYPE,
  FIELD_NAME,
} from '../../../constants';
import { gt } from '../../../utils';
import { SelectWidget } from '../../widgets/SelectWidget';
import { UploadedFile, AddFile } from '../../File';
import { TOnClickHandler, TJSON } from '../../../interfaces';
import { STORE_IDS } from '../../../stores';
import { TDocuments, TDocumentsState } from './@types';
import { URLS } from '../../../routes';

@inject(STORE_IDS.PAGE_STORE, STORE_IDS.USER_STORE)
@observer
export class Documents extends Component<TDocuments> {
  public readonly state: TDocumentsState = {
    wrongaccount: false,
    [DOC_TYPE.ATTACHMENTS]: [
      /* {
        title: 'Tải lên CMND (Mặt Trước)',
      }, */
    ],
    [DOC_TYPE.ACCOUNTS]: [
      /* {
        title: 'Tải Lên CMND (Mặt Sau)',
      }, */
    ],
    [DOC_TYPE.DOCS]: [
      /* {
        title: 'Tải Lên Ảnh Chụp Selfie Cầm CMND Trên Tay',
      }, */
    ],
    [DOC_TYPE.OTHER]: [
      /* {
        title: 'Giấy Tờ Khác',
      }, */
    ],
  };

  public componentDidMount(): void {
    console.info(this.props);
    //const { pageStore, userStore } = this.props;
  }

  private onClickHandler = (): void => {
    this.setState((state: TDocumentsState) => {
      return {
        ...state,
        wrongaccount: !this.state.wrongaccount,
      };
    });
  };

  private addFile: TOnClickHandler = (event) => {
    const { dataset } = event.currentTarget;

    event.preventDefault();

    this.setState((state: TDocumentsState) => {
      const { type } = dataset;

      if (type) {
        return {
          [type]: [
            ...state[type as DOC_TYPE],
            {
              title: `New Doc ${Math.round(Math.random() * 10)}`,
            },
          ],
        };
      }

      return null;
    });
  };

  private async submitForm() {
    console.info('submitForm');
    const { userStore } = this.props;

    if (userStore) {
      const view = await userStore.getClientNextStep();
      if (view) return Router.push((URLS as TJSON)[view]);
    }
  }

  private onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.submitForm();
  };

  render(): ReactElement {
    const { staticData } = this.props;
    const {
      wrongaccount,
      [DOC_TYPE.ATTACHMENTS]: attachments,
      [DOC_TYPE.ACCOUNTS]: accounts,
      [DOC_TYPE.DOCS]: docs,
      [DOC_TYPE.OTHER]: other,
    } = this.state;

    return (
      <ClientTabs>
        <form className={style.attachments} onSubmit={this.onSubmitHandler}>
          {wrongaccount ? (
            <h2>
              Xác Thực Tài Khoản Thất Bại, Vui lòng kiểm tra lại số tài khoản
              hoặc thay đổi tài khoản
            </h2>
          ) : (
            <div className={style.documents}>
              <h2 className={style.title}>{staticData.title}</h2>
              <div className={style.buttons}>
                <div
                  className={classNames(style.buttonsGroup, {
                    [style.notEmpty]: attachments.length,
                  })}
                >
                  {_.map(attachments, (item, key) => {
                    const { title } = item;

                    return (
                      <UploadedFile
                        key={key}
                        title={title}
                        type={DOC_TYPE.ATTACHMENTS}
                        className={style.file}
                      />
                    );
                  })}
                  <AddFile
                    addFileHandler={this.addFile}
                    title={'Tải lên CMND (Mặt Trước)'}
                    type={DOC_TYPE.ATTACHMENTS}
                    className={style.button}
                  />
                </div>
                <div
                  className={classNames(style.buttonsGroup, {
                    [style.notEmpty]: accounts.length,
                  })}
                >
                  {_.map(accounts, (item, key) => {
                    const { title } = item;

                    return (
                      <UploadedFile
                        key={key}
                        title={title}
                        type={DOC_TYPE.ACCOUNTS}
                      />
                    );
                  })}
                  <AddFile
                    addFileHandler={this.addFile}
                    title={'Tải Lên CMND (Mặt Sau)'}
                    type={DOC_TYPE.ACCOUNTS}
                  />
                </div>
                <div
                  className={classNames(style.buttonsGroup, {
                    [style.notEmpty]: docs.length,
                  })}
                >
                  {_.map(docs, (item, key) => {
                    const { title } = item;

                    return (
                      <UploadedFile
                        key={key}
                        title={title}
                        type={DOC_TYPE.DOCS}
                      />
                    );
                  })}
                  <AddFile
                    addFileHandler={this.addFile}
                    title={'Tải Lên Ảnh Chụp Selfie Cầm CMND Trên Tay'}
                    type={DOC_TYPE.DOCS}
                  />
                </div>
                <div
                  className={classNames(style.buttonsGroup, {
                    [style.notEmpty]: other.length,
                  })}
                >
                  {_.map(other, (item, key) => {
                    const { title } = item;

                    return (
                      <UploadedFile
                        key={key}
                        title={title}
                        type={DOC_TYPE.OTHER}
                      />
                    );
                  })}
                  <AddFile
                    addFileHandler={this.addFile}
                    title={'Giấy Tờ Khác'}
                    type={DOC_TYPE.OTHER}
                  />
                </div>
              </div>
            </div>
          )}
          <div className={style.bankAccount}>
            <h2 className={style.title}>
              {wrongaccount
                ? 'Chọn Tài Khoản Ngân Hàng'
                : 'Thêm Tài Khoản Ngân Hàng'}
            </h2>
            <div className={style.buttons}>
              <div className={style.fullrow}>
                <SelectWidget
                  name={FIELD_NAME.ACCOUNT_ID}
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
              <button className={style.button} onClick={this.onClickHandler}>
                Chọn Ngân Hàng
              </button>
              <input
                className={style.input}
                type={INPUT_TYPE.TEXT}
                placeholder='Số Tài Khoản Ngân Hàng'
              />
            </div>
          </div>
          <button className={style.nextStep} type={BUTTON_TYPE.SUBMIT}>
            {gt.gettext('Confirm')}
          </button>
        </form>
      </ClientTabs>
    );
  }
}
