import React, { PureComponent, ReactElement } from 'react';
import { inject } from 'mobx-react';
import classNames from 'classnames';
import path from 'path';

import style from './File.module.scss';

import { allowedFileTypes } from '@src/config.json';
import { WithTracking } from '@components/hocs';
import { TOnInputChangeHandler } from '@interfaces';
import { INPUT_TYPE, GRAPHIC_FILES, PO_PROJECT_HOST } from '@src/constants';
import { AbstractRoles } from '@src/roles';
import { EMouseEvents } from '@src/trackingConstants';
import { STORE_IDS } from '@stores';
import { TAddFile, TUploadedFile } from './@types';

@inject(STORE_IDS.LOAN_STORE)
export class AddFile extends PureComponent<TAddFile> {
  private addFileHandler: TOnInputChangeHandler = (event) => {
    const { loanStore } = this.props;
    const {
      files,
      dataset: { type },
    } = event.target;

    if (loanStore && files && type) loanStore.uploadAttachment(files, type);
  };

  public render(): ReactElement {
    const { title, type_id, className, multiple } = this.props;

    return (
      <label className={classNames(style.button, className)}>
        <WithTracking
          id={`File-${AbstractRoles.input}-${INPUT_TYPE.FILE}`}
          events={[EMouseEvents.CLICK]}
        >
          <input
            data-type={type_id}
            type={INPUT_TYPE.FILE}
            className={style.input}
            onChange={this.addFileHandler}
            multiple={multiple}
            accept={allowedFileTypes.join(',')}
            role={AbstractRoles.input}
          />
        </WithTracking>
        <p>{title}</p>
        <div className={style.addIcon} />
      </label>
    );
  }
}

export const UploadedFile = ({
  title,
  url,
  filename,
  className,
}: TUploadedFile): ReactElement => {
  let fileStyle;

  if (GRAPHIC_FILES.includes(path.extname(filename).toLowerCase())) {
    fileStyle = {
      backgroundImage: `url('${PO_PROJECT_HOST + url}')`,
    };
  }

  return (
    <div className={classNames(style.file, className)} title={filename}>
      <p>{title}</p>
      <div
        className={classNames(style.fileIcon, { [style.docIcon]: fileStyle })}
        style={fileStyle}
      />
    </div>
  );
};
