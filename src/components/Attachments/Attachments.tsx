import { FC } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './Attachments.module.scss';

import { TAttachments } from './@types';
import { UploadedFile, AddFile } from '../File';
import { TDocument } from '../../stores/@types/loanStore';

export const Attachments: FC<TAttachments> = (props) => {
  const { documents, full, valid, ...fileProps } = props;

  return (
    <div
      className={classNames(style.group, {
        [style.notEmpty]: !!_.size(documents),
      })}
    >
      {!full && <AddFile className={style.button} {...fileProps} />}
      {_.map(documents, (item: TDocument, key) => {
        return (
          <UploadedFile
            key={key}
            className={style.file}
            title={fileProps.title}
            {...item}
          />
        );
      })}
    </div>
  );
};
