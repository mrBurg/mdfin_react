import { FC, PureComponent, ReactElement } from 'react';
import { inject } from 'mobx-react';
import classNames from 'classnames';
import path from 'path';

import style from './File.module.scss';

import { INPUT_TYPE, PO_PROJECT_HOST, GRAPHIC_FILES } from '../../constants';
import { TAddFile, TUploadedFile } from './@types';
import { allowedFileTypes } from './../../config.json';
import { TOnInputChangeHandler } from '../../interfaces';
import { STORE_IDS } from '../../stores';

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
    const { title, type, className, multiple } = this.props;

    return (
      <label className={classNames(className, style.button)}>
        <input
          data-type={type}
          type={INPUT_TYPE.FILE}
          className={style.input}
          onChange={this.addFileHandler}
          multiple={multiple}
          accept={allowedFileTypes.join(',')}
        />
        <p>{title}</p>
        <div className={style.addIcon} />
      </label>
    );
  }
}

export const UploadedFile: FC<TUploadedFile> = ({
  title,
  url,
  filename,
  className,
}) => {
  let fileStyle;

  if (GRAPHIC_FILES.includes(path.extname(filename).toLowerCase())) {
    fileStyle = {
      backgroundImage: `url('${PO_PROJECT_HOST + url}')`,
    };
  }

  return (
    <div className={classNames(className, style.file)} title={filename}>
      <p>{title}</p>
      <div
        className={classNames(style.fileIcon, { [style.docIcon]: fileStyle })}
        style={fileStyle}
      />
    </div>
  );
};
