import { FC } from 'react';
import classNames from 'classnames';

import style from './File.module.scss';

import { INPUT_TYPE } from '../../constants';
import { TFile } from './@types';

export const AddFile: FC<TFile> = ({
  title,
  type,
  addFileHandler,
  className,
}) => {
  return (
    <label
      data-type={type}
      className={classNames(className, style.button)}
      onClick={addFileHandler}
    >
      <input type={INPUT_TYPE.FILE} className={style.input} />
      <p>{title}</p>
      <div className={style.addIcon} />
    </label>
  );
};

export const UploadedFile: FC<TFile> = ({ title, type, className }) => {
  return (
    <div data-type={type} className={classNames(className, style.file)}>
      <p>{title}</p>
      <div className={style.fileIcon} />
    </div>
  );
};
