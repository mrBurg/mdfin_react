import _ from 'lodash';
import moment from 'moment';

import {
  alphabet_vns,
  dateFormat,
  accountNumberFormat,
  emailFormat,
} from '@src/config.json';
import { TJSON } from '@interfaces';
import { FIELD_NAME } from '@src/constants';
import { TField, TUserContacts, TUserJob } from '@stores-types/userStore';
import { UserStore } from '@src/stores/UserStore';

const fields: TJSON = {
  /** Authorization */
  [FIELD_NAME.OTP_AGREE_CHECKBOX]: 'otpAgreeCheckbox',

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

  /** Job fields */
  [FIELD_NAME.SOCIAL_STATUS_ID]: 'selectRequired',
  [FIELD_NAME.EDUCATION_ID]: 'selectRequired',
  [FIELD_NAME.COMPANY_NAME]: 'ifRequiredJobSocial',
  [FIELD_NAME.INDUSTRY_ID]: 'ifRequiredJobSocial',
  [FIELD_NAME.INDUSTRY_DETAILED_ID]: 'ifRequiredJobSocial',
  [FIELD_NAME.POS_TYPE_ID]: 'ifRequiredJobSocial',
  [FIELD_NAME.POS_NAME]: 'ifRequiredJobSocial',
  [FIELD_NAME.WORK_YEARS]: 'ifRequiredJobSocial',
  [FIELD_NAME.WORK_MONTHS]: 'ifRequiredJobSocial',
  [FIELD_NAME.JOB_CONTACT_PHONE]: 'ifRequiredJobSocial',
  [FIELD_NAME.JOB_CONTACT_NAME]: 'ifRequiredJobSocial',
  [FIELD_NAME.JOB_CONTACT_TYPE_ID]: 'ifRequiredJobSocial',
  [FIELD_NAME.INCOME]: 'income',
};

/** Валидация поля
 * @params:
 * validateItems - массив имен полей и их значений
 * userStore
 */
export async function validator(
  validateItems: TField[],
  userStore: UserStore
): Promise<string[]> {
  let invalidFields: string[] = [];
  const regexp2num = /^[0-9]{1,2}$/;
  const regexp1_15 = /^[0-9]{1,15}$/;

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
      case 'otpAgreeCheckbox':
        if (!validateBoolean(item.value)) invalidFields.push(item.name);
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
        //if (!validateNumRequiredLength2(item.value)) invalidFields.push(item.name);
        if (!validateNumRegexp(item.value, regexp2num))
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

      case 'ifRequiredJobSocial':
        if (
          !validateIfRequiredJobSocial(
            item.value,
            item.name,
            userStore.userDataJob!
          )
        )
          invalidFields.push(item.name);
        break;

      case 'income':
        if (!validateNumRegexp(item.value, regexp1_15))
          invalidFields.push(item.name);
        break;
      default:
        invalidFields = [];
    }
  });
  //console.log(invalidFields);
  return invalidFields;
}

export const validateBoolean = (value: boolean): boolean => {
  return value;
};

/** Валидация - обязательного текстового поля + максимальное кол-во символов */
export const validateTextRequiredMaxLength = (
  value: string,
  length?: number
): boolean => {
  if (length) {
    return !!value && value.length <= length;
  } else {
    return !!value;
  }
};

/** Валидация - выпадающий список (обязательное поле) */
export const validateSelectRequired = (value: number | string): boolean => {
  return !!value;
};

/** Валидация - обязательного числового поля + мин-макс длина 1-2
 * на замену пришел "validateNumRegexp"
 */
/* export const validateNumRequiredLength2 = (value: number) => {
  const re = /^[0-9]{1,2}$/;
  return re.test(String(value));
}; */

/** Валидация - обязательного числового поля + regexp */
export const validateNumRegexp = (
  value: number | string,
  regexp: RegExp
): boolean => {
  return regexp.test(String(value));
};

/** Валидация - обязательного текстового поля + regexp */
export const validateTextRegexp = (
  value: number | string,
  regexp: RegExp
): boolean => {
  return regexp.test(String(value));
};

/** Валидация - контакты третьего лица (визард) */
export const validateThirdParty = (
  value: string,
  fieldName: string,
  userDataContacts: TUserContacts[]
): boolean => {
  //const { phoneNumber, name, type_id } = userDataContacts[0];

  const phoneNumber = _.size(userDataContacts)
      ? userDataContacts[0].phoneNumber
      : '',
    name = _.size(userDataContacts) ? userDataContacts[0].name : '',
    type_id = _.size(userDataContacts) ? userDataContacts[0].type_id : '';

  if (!!phoneNumber || !!name || !!type_id) {
    switch (fieldName) {
      case FIELD_NAME.THIRD_PARTY_PHONE:
        return validateRequiredOtherPhone(value);
      case FIELD_NAME.THIRD_PARTY_NAME:
        return validateName(value);
      case FIELD_NAME.THIRD_PARTY_RELATION:
        return validateSelectRequired(value);
      default:
        return false;
    }
  } else {
    return true;
  }
};

/** Валидация - полей со вкладки Работа (визард) */
export const validateIfRequiredJobSocial = (
  value: string | number,
  fieldName: string,
  userDataJob: TUserJob
): boolean => {
  const IDs = [1, 2, 3, 4, 5];
  const regexp0_99 = /^([0-9]|[0-9][0-9])$/;
  const regexp0_12 = /^([0-9]|1[012])$/;
  const regexpText50 = new RegExp('^[\\s' + alphabet_vns + ']{1,50}$');

  if (~IDs.indexOf(userDataJob.socialStatus_id!)) {
    //клиент - работающий (проверять текущее поле)
    switch (fieldName) {
      case FIELD_NAME.COMPANY_NAME:
        return validateTextRequiredMaxLength(String(value), 100);
      case FIELD_NAME.INDUSTRY_ID:
        return validateSelectRequired(value);
      case FIELD_NAME.INDUSTRY_DETAILED_ID:
        return validateSelectRequired(value);
      case FIELD_NAME.POS_TYPE_ID:
        return validateSelectRequired(value);
      case FIELD_NAME.POS_NAME:
        return validateTextRequiredMaxLength(String(value), 100);
      case FIELD_NAME.WORK_YEARS:
        return validateNumRegexp(value, regexp0_99);
      case FIELD_NAME.WORK_MONTHS:
        return validateNumRegexp(value, regexp0_12);

      case FIELD_NAME.JOB_CONTACT_PHONE:
        //console.log(userDataJob.contact?.name);
        return !!userDataJob.contact?.name || !!value
          ? validateRequiredOtherPhone(String(value))
          : true;
      case FIELD_NAME.JOB_CONTACT_NAME:
        //console.log(userDataJob.contact?.phoneNumber);
        return !!userDataJob.contact?.phoneNumber || !!value
          ? validateTextRegexp(String(value), regexpText50)
          : true;
      case FIELD_NAME.JOB_CONTACT_TYPE_ID:
        //console.log(userDataJob.contact?.name);
        //console.log(userDataJob.contact?.phoneNumber);
        return !!userDataJob.contact?.phoneNumber || !!userDataJob.contact?.name
          ? validateSelectRequired(value)
          : true;
      default:
        return false;
    }
  } else {
    //клиент - НЕ работает (текущее поле НЕ проверять)
    return true;
  }
};

/** Валидация - Имя Клиента (регистрация, визард) */
export const validateName = (value: string): boolean => {
  const regexp = new RegExp(
    '^[' + alphabet_vns + ']+(\\s[' + alphabet_vns + ']+)+$'
  );
  return !!value && value.length <= 50 && regexp.test(value);
};

/** Валидация - Номер телефона (логин, регистрация, визард) */
export const validatePhone = (value: string): boolean => {
  value = value ? value.replace(/[\s-_]/g, '') : '';
  return !!value && value.length == 12;
};

/** Валидация -обязательное- Номер телефона (прочие номера) */
export const validateRequiredOtherPhone = (value: string): boolean => {
  value = value ? value.replace(/[\s-_]/g, '') : '';
  return !!value && value.length >= 12 && value.length <= 13;
};

/** Валидация -необязательное- Другой Номер телефона (визард) */
export const validateOtherPhoneNumber = (value: string): boolean => {
  value = value ? value.replace(/[\s-_]/g, '') : '';
  return value ? value.length == 12 : true;
};

/** Валидация - Даты рождения (визард) */
export const validateBirthDate = (value: Date): boolean => {
  return (
    moment(new Date(), dateFormat.toUpperCase()).diff(
      moment(value, dateFormat.toUpperCase()),
      'years'
    ) <= 100 &&
    moment(new Date(), dateFormat.toUpperCase()).diff(
      moment(value, dateFormat.toUpperCase()),
      'years'
    ) > 9
  );
};

/** Валидация - Паспорт/ID (визард) */
export const validateID = (value: string): boolean => {
  return !!value && (value.length == 9 || value.length == 12);
};

/** Валидация - Даты выдачи ID (визард) */
export const validateIssueDate = (value: Date): boolean => {
  return (
    moment(new Date(), dateFormat.toUpperCase()).diff(
      moment(value, dateFormat.toUpperCase()).toDate(),
      'years'
    ) <= 100 &&
    moment(new Date(), dateFormat.toUpperCase()).diff(
      moment(value, dateFormat.toUpperCase()).toDate()
    ) > 0
  );
};

/** Валидация - Даты выдачи ID (визард) */
export const validateExpireDate = (value: Date, cmnd_cccd: string): boolean => {
  return cmnd_cccd?.length == 12
    ? moment(new Date(), dateFormat.toUpperCase()).diff(
        moment(value, dateFormat.toUpperCase()).toDate(),
        'years'
      ) <= 100
    : true;
};

/** Валидация - Email */
export const validateEmail = (email: string): boolean => {
  const emailRegExp = new RegExp(emailFormat);

  return emailRegExp.test(email);
};

/** Валидация - Brand Other (визард) */
export const validateBrandOther = (
  value: string,
  shouldShow_PHONE_BRAND_OTHER: string
): boolean => {
  return shouldShow_PHONE_BRAND_OTHER == 'true'
    ? !!value && value.length <= 50
    : true;
};

/** Валидация - Model Other (визард) */
export const validateModelOther = (
  value: string,
  shouldShow_PHONE_MODEL_OTHER: string
): boolean => {
  return shouldShow_PHONE_MODEL_OTHER == 'true'
    ? !!value && value.length <= 50
    : true;
};

/** Валидация - счёта */
export const validateAccountNumber = (accountNumber: string): boolean => {
  const accountNumberRegExp = new RegExp(accountNumberFormat);

  return accountNumberRegExp.test(accountNumber);
};
