import { ReactElement, Component } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './Inprocess.module.scss';

import { UploadedFile, AddFile } from '../File';
import { TOnClickHandler } from '../../interfaces';
import { DOC_TYPE } from '../../constants';
import { TInprocess, TInprocessState } from './@types';

export class Inprocess extends Component<TInprocess> {
  public readonly state = {
    [DOC_TYPE.OTHER]: [
      /* {
        title: `Tải lên CMND (Mặt Trước)`,
      }, */
    ],
  };

  private addFile: TOnClickHandler = (event) => {
    const { dataset } = event.currentTarget;

    event.preventDefault();

    this.setState((state: TInprocessState) => {
      const { type } = dataset;

      if (type) {
        return {
          [type]: [
            ...state[DOC_TYPE.OTHER],
            {
              title: `New Tải lên CMND (Mặt Trước) ${Math.round(
                Math.random() * 10
              )}`,
            },
          ],
        };
      }

      return null;
    });
  };

  render(): ReactElement {
    const { className } = this.props;
    const { [DOC_TYPE.OTHER]: otherDocs } = this.state;

    return (
      <div className={classNames(style.inprocess, className)}>
        <div className={style.buttons}>
          {_.map(otherDocs, (item, key) => {
            const { title } = item;

            return (
              <UploadedFile key={key} title={title} type={DOC_TYPE.OTHER} />
            );
          })}
          <AddFile
            title={'Giấy Tờ Khác'}
            addFileHandler={this.addFile}
            type={DOC_TYPE.OTHER}
          />
        </div>
      </div>
    );
  }
}
