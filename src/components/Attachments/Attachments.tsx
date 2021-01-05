import React, { ReactElement } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './Attachments.module.scss';
import { AddFile, UploadedFile } from '@components/File';
import { TJSON } from '@interfaces';
import { DOC_TYPE } from '@src/constants';
import { TAttachments } from './@types';
import { TDocument } from '@stores-types/loanStore';

export const Attachments = (props: TAttachments): ReactElement => {
  const { documents, full, locales, ...fileProps } = props;
  const getTitle = (data: string): string =>
    ((locales as TJSON)[data].buttons as TJSON)[DOC_TYPE[props.type_id]];

  return (
    <div
      className={classNames(style.group, {
        [style.notEmpty]: !!_.size(documents),
      })}
    >
      {!full && (
        <AddFile
          className={style.button}
          title={getTitle('notPresent')}
          {...fileProps}
        />
      )}
      {_.map(documents, (item: TDocument, key) => {
        return (
          <UploadedFile
            key={key}
            className={style.file}
            title={getTitle('isPresent')}
            {...item}
          />
        );
      })}
    </div>
  );
};
