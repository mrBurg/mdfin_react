import _ from 'lodash';
import moment from 'moment';

import { TJSON } from '../interfaces';
import { FIELD_NAME } from '../constants';
import { TField, TValidateProps } from '../stores/@types/userStore';
import { UserStore } from '../stores/UserStore';

const fields: TJSON = {
  [FIELD_NAME.NAME]: 'name',
  [FIELD_NAME.PHONE_NUMBER]: 'phoneNumber',
  [FIELD_NAME.BIRTH_DATE]: 'birthDate',
  [FIELD_NAME.ID]: 'cmnd_cccd',
  [FIELD_NAME.ISSUE_DATE]: 'issueDate',
  [FIELD_NAME.EXPIRE_DATE]: 'expireDate',
  [FIELD_NAME.GENDER_ID]: 'gender_id',
  [FIELD_NAME.MARITAL_STATUS_ID]: 'maritalStatus_id',
  [FIELD_NAME.NUMBER_OF_DEPENDENTS]: 'numberOfDependents',
  [FIELD_NAME.EMAIL]: 'email',
  [FIELD_NAME.LOAN_PURPOSE_ID]: 'loanPurpose_id',
  [FIELD_NAME.PHONE_BRAND_ID]: 'brand_id',
  [FIELD_NAME.PHONE_BRAND_OTHER]: 'brandOther',
  [FIELD_NAME.PHONE_MODEL_ID]: 'model_id',
  [FIELD_NAME.PHONE_MODEL_OTHER]: 'modelOther',
  [FIELD_NAME.OTHER_PHONE_NUMBER]: 'otherPhoneNumber',
};

/** Валидация поля
 * @params:
 * validateItems - массив имен полей и их значений
 * userStore
 */
export async function validator(
  validateItems: TValidateProps,
  userStore: UserStore
): Promise<string[]> {
  //console.log(validateItems);
  let invalidFields: Array<string> = [];

  _.map(validateItems, (item: TField) => {
    switch (fields[item.name]) {
      case 'name':
        if (!validateName(item.value)) invalidFields.push(item.name);
        break;
      case 'phoneNumber':
        if (!validatePhone(item.value)) invalidFields.push(item.name);
        break;
      case 'birthDate':
        if (!validateBirthDate(item.value)) invalidFields.push(item.name);
        break;
      case 'cmnd_cccd':
        if (!validateID(item.value)) invalidFields.push(item.name);
        break;
      case 'issueDate':
        if (!validateIssueDate(item.value)) invalidFields.push(item.name);
        break;
      case 'expireDate':
        if (!validateExpireDate(item.value, userStore.userData.cmnd_cccd!))
          invalidFields.push(item.name);
        break;
      case 'gender_id':
        console.log('gender_id');
        if (!validateSelectRequired(item.value)) invalidFields.push(item.name);
        break;
      case 'maritalStatus_id':
        console.log('maritalStatus_id');
        if (!validateSelectRequired(item.value)) invalidFields.push(item.name);
        break;
      case 'numberOfDependents':
        if (!validateNumberOfDependents(item.value))
          invalidFields.push(item.name);
        break;
      case 'email':
        if (!validateEmail(item.value)) invalidFields.push(item.name);
        break;
      case 'loanPurpose_id':
        if (!validateSelectRequired(item.value)) invalidFields.push(item.name);
        break;
      case 'brand_id':
        if (!validateSelectRequired(item.value)) invalidFields.push(item.name);
        break;
      case 'brandOther':
        if (
          !validateBrandOther(
            item.value,
            userStore.userData.shouldShow_PHONE_BRAND_OTHER!
          )
        )
          invalidFields.push(item.name);
        break;
      case 'model_id':
        if (!validateSelectRequired(item.value)) invalidFields.push(item.name);
        break;
      case 'modelOther':
        if (
          !validateModelOther(
            item.value,
            userStore.userData.shouldShow_PHONE_MODEL_OTHER!
          )
        )
          invalidFields.push(item.name);
        break;
      case 'otherPhoneNumber':
        if (!validateOtherPhoneNumber(item.value))
          invalidFields.push(item.name);
        break;
      default:
        invalidFields = [];
    }
  });
  return invalidFields;
}

/** Валидация - Имя Клиента (регистрация, визард) */
export const validateName = (value: string) => {
  return !!value && value.length <= 50 && /[\S]+(\s[\S])/.test(value);
};

/** Валидация - Номер телефона (логин, регистрация, визард) */
export const validatePhone = (value: string) => {
  value = value.replace(/[\s-_]/g, '');
  return !!value && value.length == 13;
};

/** Валидация - Даты рождения (визард) */
export const validateBirthDate = (value: Date) => {
  return (
    moment().diff(moment(value, 'DD/MM/YYYY'), 'years') <= 100 &&
    moment().diff(moment(value, 'DD/MM/YYYY'), 'years') > 10
  );
};

/** Валидация - Паспорт/ID (визард) */
export const validateID = (value: string) => {
  return !!value && (value.length == 9 || value.length == 12);
};

/** Валидация - Даты выдачи ID (визард) */
export const validateIssueDate = (value: Date) => {
  return (
    moment().diff(moment(value, 'DD/MM/YYYY'), 'years') <= 100 &&
    moment().diff(moment(value, 'DD/MM/YYYY')) > 0
  );
};

/** Валидация - Даты выдачи ID (визард) */
export const validateExpireDate = (value: Date, cmnd_cccd: string) => {
  return cmnd_cccd?.length == 12
    ? moment().diff(moment(value, 'DD/MM/YYYY'), 'years') <= 100
    : true;
};

/** Валидация - Стать, Семейное положение, Цель кредита, Бренд, Модель (визард) */
export const validateSelectRequired = (value: number | string) => {
  return !!value;
};

/** Валидация - Имя Клиента (регистрация, визард) */
export const validateNumberOfDependents = (value: number) => {
  const re = /^[0-9]{1,2}$/;
  return re.test(String(value)); /* !!value && value.length <= 2 && */
};

/** Валидация - Email */
export const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

/** Валидация - Brand Other (визард) */
export const validateBrandOther = (
  value: string,
  shouldShow_PHONE_BRAND_OTHER: string
) => {
  return shouldShow_PHONE_BRAND_OTHER == 'true'
    ? !!value && value.length <= 50
    : true;
};

/** Валидация - Model Other (визард) */
export const validateModelOther = (
  value: string,
  shouldShow_PHONE_MODEL_OTHER: string
) => {
  return shouldShow_PHONE_MODEL_OTHER == 'true'
    ? !!value && value.length <= 50
    : true;
};

/** Валидация -необязательное- Другой Номер телефона (визард) */
export const validateOtherPhoneNumber = (value: string) => {
  value = value?.replace(/[\s-_]/g, '');
  return !!value ? value.length == 13 : true;
};
