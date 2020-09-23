import _ from 'lodash';
import moment from 'moment';

import { TJSON } from '../interfaces';
import { FIELD_NAME } from '../constants';
import {
  TField,
  TUserContacts,
  TValidateProps,
} from '../stores/@types/userStore';
import { UserStore } from '../stores/UserStore';

const fields: TJSON = {
  /** Obligatory fields */
  [FIELD_NAME.NAME]: 'name',
  [FIELD_NAME.PHONE_NUMBER]: 'phoneNumber',
  [FIELD_NAME.BIRTH_DATE]: 'birthDate',
  [FIELD_NAME.ID]: 'cmnd_cccd',
  [FIELD_NAME.ISSUE_DATE]: 'issueDate',
  [FIELD_NAME.EXPIRE_DATE]: 'expireDate',
  [FIELD_NAME.GENDER_ID]: 'selectRequired',
  [FIELD_NAME.MARITAL_STATUS_ID]: 'selectRequired',
  [FIELD_NAME.NUMBER_OF_DEPENDENTS]: 'numRequiredLength2',
  [FIELD_NAME.EMAIL]: 'email',
  [FIELD_NAME.LOAN_PURPOSE_ID]: 'selectRequired',
  [FIELD_NAME.PHONE_BRAND_ID]: 'selectRequired',
  [FIELD_NAME.PHONE_BRAND_OTHER]: 'brandOther',
  [FIELD_NAME.PHONE_MODEL_ID]: 'selectRequired',
  [FIELD_NAME.PHONE_MODEL_OTHER]: 'modelOther',
  [FIELD_NAME.OTHER_PHONE_NUMBER]: 'otherPhoneNumber',

  /** Address fields */
  [FIELD_NAME.CITY_PROVINCE]: 'selectRequired',
  [FIELD_NAME.DISTRICT]: 'selectRequired',
  [FIELD_NAME.WARD_COMMUNE]: 'selectRequired',
  [FIELD_NAME.STREET]: 'street',
  [FIELD_NAME.BUILDING]: 'building',
  /* [FIELD_NAME.APARTMENT]: 'apartment', */
  [FIELD_NAME.YEARS]: 'numRequiredLength2',
  [FIELD_NAME.MONTHS]: 'numRequiredLength2',
  [FIELD_NAME.THIRD_PARTY_PHONE]: 'thirdParty',
  [FIELD_NAME.THIRD_PARTY_NAME]: 'thirdParty',
  [FIELD_NAME.THIRD_PARTY_RELATION]: 'thirdParty',
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
  let invalidFields: Array<string> = [];

  _.map(validateItems, (item: TField) => {
    switch (fields[item.name]) {
      case 'selectRequired':
        if (!validateSelectRequired(item.value)) invalidFields.push(item.name);
        break;

      case 'thirdParty':
        if (
          !validateThirdParty(item.value, item.name, userStore.userDataContacts)
        )
          invalidFields.push(item.name);
        break;

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
      case 'street':
        if (!validateTextRequiredMaxLength(item.value, 100))
          invalidFields.push(item.name);
        break;
      case 'building':
        if (!validateTextRequiredMaxLength(item.value, 4))
          invalidFields.push(item.name);
        break;
      case 'numRequiredLength2':
        if (!validateNumRequiredLength2(item.value))
          invalidFields.push(item.name);
        break;
      case 'email':
        if (!validateEmail(item.value)) invalidFields.push(item.name);
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
  //console.log(invalidFields);
  return invalidFields;
}

/** Валидация - обязательного текстового поля + максимальное кол-во символов */
export const validateTextRequiredMaxLength = (
  value: string,
  length?: number
) => {
  if (!!length) {
    return !!value && value.length <= length;
  } else {
    return !!value;
  }
};

/** Валидация - выпадающий список (обязательное поле) */
export const validateSelectRequired = (value: number | string) => {
  return !!value;
};

/** Валидация - обязательного числового поля + мин-макс длина */
export const validateNumRequiredLength2 = (value: number) => {
  const re = /^[0-9]{1,2}$/;
  return re.test(String(value));
};

/** Валидация - контакты третьего лица (визард) */
export const validateThirdParty = (
  value: string,
  fieldName: string,
  userDataContacts: TUserContacts[]
) => {
  //const { phoneNumber, name, type_id } = userDataContacts[0];

  const phoneNumber = !!_.size(userDataContacts)
      ? userDataContacts[0].phoneNumber
      : '',
    name = !!_.size(userDataContacts) ? userDataContacts[0].name : '',
    type_id = !!_.size(userDataContacts) ? userDataContacts[0].type_id : '';

  if (!!phoneNumber || !!name || !!type_id) {
    switch (fieldName) {
      case FIELD_NAME.THIRD_PARTY_PHONE:
        return validatePhone(value);
      case FIELD_NAME.THIRD_PARTY_NAME:
        return validateName(value);
      case FIELD_NAME.THIRD_PARTY_RELATION:
        return validateSelectRequired(value);
    }
  } else {
    return true;
  }
};

/** Валидация - Имя Клиента (регистрация, визард) */
export const validateName = (value: string) => {
  return !!value && value.length <= 50 && /[\S]+(\s[\S])/.test(value);
};

/** Валидация - Номер телефона (логин, регистрация, визард) */
export const validatePhone = (value: string) => {
  value = !!value ? value.replace(/[\s-_]/g, '') : '';
  return !!value && value.length == 13;
};

/** Валидация -необязательное- Другой Номер телефона (визард) */
export const validateOtherPhoneNumber = (value: string) => {
  value = !!value ? value.replace(/[\s-_]/g, '') : '';
  return !!value ? value.length == 13 : true;
};

/** Валидация - Даты рождения (визард) */
export const validateBirthDate = (value: Date) => {
  return (
    moment(new Date(), 'DD/MM/YYYY').diff(
      moment(value, 'DD/MM/YYYY'),
      'years'
    ) <= 100 &&
    moment(new Date(), 'DD/MM/YYYY').diff(
      moment(value, 'DD/MM/YYYY'),
      'years'
    ) > 10
  );
};

/** Валидация - Паспорт/ID (визард) */
export const validateID = (value: string) => {
  return !!value && (value.length == 9 || value.length == 12);
};

/** Валидация - Даты выдачи ID (визард) */
export const validateIssueDate = (value: Date) => {
  return (
    moment(new Date(), 'DD/MM/YYYY').diff(
      moment(value, 'DD/MM/YYYY').toDate(),
      'years'
    ) <= 100 &&
    moment(new Date(), 'DD/MM/YYYY').diff(
      moment(value, 'DD/MM/YYYY').toDate()
    ) > 0
  );
};

/** Валидация - Даты выдачи ID (визард) */
export const validateExpireDate = (value: Date, cmnd_cccd: string) => {
  return cmnd_cccd?.length == 12
    ? moment(new Date(), 'DD/MM/YYYY').diff(
        moment(value, 'DD/MM/YYYY').toDate(),
        'years'
      ) <= 100
    : true;
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
