import React, { ReactElement, PureComponent, FormEvent } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import classNames from 'classnames';

import style from './Address.module.scss';

import { phoneMask, otherPhoneMask } from '@src/config.json';
import { TAddress, TState } from './@types';
import { gt, handleErrors, isDev, validator } from '@utils';
import { DIRECTORIES, URIS } from '@routes';
import { BUTTON_TYPE, FIELD_NAME, INPUT_TYPE } from '@src/constants';
import { TOnInputChangeHandler } from '@interfaces';
import { TSelectData } from '@components/widgets/ReactSelectWidget/@types';
import { ClientTabs } from '../ClientTabs';
import { ReactSelectWidget } from '@components/widgets/ReactSelectWidget';
import { WithTracking } from '@components/hocs';
import { AbstractRoles, WidgetRoles } from '@src/roles';
import {
  EFocusEvents,
  EKeyboardEvents,
  EMouseEvents,
} from '@src/trackingConstants';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { Preloader } from '@components/Preloader';
import { TField, TUserAddress, TUserContacts } from '@stores-types/userStore';

@observer
export class Address extends PureComponent<TAddress> {
  public readonly state: TState = {
    isRender: false,
    invalidFields: [],
  };

  async componentDidMount(): Promise<void> {
    const { pageStore, userStore } = this.props;

    userStore.fetchWithAuth(async () => {
      if (!isDev) {
        await this.refreshView();
      }

      await userStore.getWizardData_Address();

      pageStore.getDirectory(DIRECTORIES.dirThirdPartyRelation);
      pageStore.getDirectory(DIRECTORIES.dirCityProvince);

      if (userStore.userDataAddress.cityProvince_id)
        await pageStore.getDirectory(
          DIRECTORIES.dirDistrict,
          String(userStore.userDataAddress.cityProvince_id)
        );

      if (userStore.userDataAddress.district_id)
        await pageStore.getDirectory(
          DIRECTORIES.dirWardCommune,
          String(userStore.userDataAddress.district_id)
        );

      this.setState({
        isRender: true,
      });
    });
  }

  /** Берем следующий / проверяем текущий шаг визарда */
  private async refreshView() {
    const { userStore } = this.props;
    if (userStore) userStore.getClientNextStep();
  }

  private onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.submitForm();
  };

  private async submitForm() {
    const {
      userStore,
      userStore: { userDataAddress, userDataContacts },
    } = this.props;

    const validateItems = await this.validateItems();
    const res = await this.validateForm(validateItems);

    if (!res) return;

    const newData: {
      address: TUserAddress;
      contacts?: TUserContacts[];
    } = {
      address: { ...userDataAddress },
    };

    /** нужно проверять не только размер, но и отсутствие "пустого" обьекта */
    if (_.size(userDataContacts) > 0 && !_.isEmpty(userDataContacts[0])) {
      newData.contacts = userDataContacts;
    }

    await userStore.saveWizardStep(URIS.address, newData);
    userStore.getClientNextStep();
  }

  /** Список полей для валидации */
  private async validateItems(): Promise<TField[]> {
    const {
      userStore: { userDataAddress, userDataContacts },
    } = this.props;

    const validateItems: TField[] = [
      {
        name: FIELD_NAME.CITY_PROVINCE,
        value: userDataAddress.cityProvince_id!,
      },
      { name: FIELD_NAME.DISTRICT, value: userDataAddress.district_id! },
      { name: FIELD_NAME.WARD_COMMUNE, value: userDataAddress.wardCommune_id! },
      { name: FIELD_NAME.STREET, value: userDataAddress.street! },
      { name: FIELD_NAME.BUILDING, value: userDataAddress.building! },
      {
        name: FIELD_NAME.YEARS,
        value: userDataAddress.currentPlaceLivingYear!,
      },
      {
        name: FIELD_NAME.MONTHS,
        value: userDataAddress.currentPlaceLivingMonth!,
      },
      {
        name: FIELD_NAME.THIRD_PARTY_PHONE,
        value: _.size(userDataContacts) ? userDataContacts[0].phoneNumber : '',
      },
      {
        name: FIELD_NAME.THIRD_PARTY_NAME,
        value: _.size(userDataContacts) ? userDataContacts[0].name : '',
      },
      {
        name: FIELD_NAME.THIRD_PARTY_RELATION,
        value: _.size(userDataContacts) ? userDataContacts[0].type_id : '',
      },
    ];
    return validateItems;
  }

  private validateField: TOnInputChangeHandler = async ({
    currentTarget: { name, value },
  }) => {
    this.validateForm([{ name, value }]);
  };

  /** Валидация полей "третьего лица"
   *  Тут же, убирается признак невалидности всех полей, если все три поля - валидны
   */
  private validateField_thirdParty: TOnInputChangeHandler = async ({
    currentTarget: { name, value },
  }) => {
    const {
      userStore,
      userStore: { userDataContacts },
    } = this.props;

    const invalidFieldsList: string[] = await validator(
      [{ name, value }],
      userStore
    );
    this.setInvalidFields(invalidFieldsList, [name]);

    const filedsList: TField[] = [
      {
        name: FIELD_NAME.THIRD_PARTY_PHONE,
        value: _.size(userDataContacts) ? userDataContacts[0].phoneNumber : '',
      },
      {
        name: FIELD_NAME.THIRD_PARTY_NAME,
        value: _.size(userDataContacts) ? userDataContacts[0].name : '',
      },
      {
        name: FIELD_NAME.THIRD_PARTY_RELATION,
        value: _.size(userDataContacts) ? userDataContacts[0].type_id : '',
      },
    ];

    const validateItemsNames: string[] = [
      FIELD_NAME.THIRD_PARTY_PHONE,
      FIELD_NAME.THIRD_PARTY_NAME,
      FIELD_NAME.THIRD_PARTY_RELATION,
    ];

    if (!_.size(invalidFieldsList)) {
      const invalidAllFieldsList: string[] = await validator(
        filedsList,
        userStore
      );
      if (!_.size(invalidAllFieldsList)) {
        this.setInvalidFields(invalidAllFieldsList, validateItemsNames);
      }
    }
  };

  private validateFieldSelect = (data: TSelectData) => {
    this.validateForm([data]);
  };

  /* private validateSelectField = (data: TSelectData) => {
    this.validateForm([data]);
  }; */

  private async validateForm(validateItems: TField[]): Promise<boolean> {
    const { userStore } = this.props;

    const validateItemsNames: string[] = [];
    _.map(validateItems, (itemName: TField) => {
      validateItemsNames.push(itemName.name);
    });
    /*let invalidFields: string[] = this.state.invalidFields;*/
    const validateResult: string[] = await validator(validateItems, userStore);

    await this.setInvalidFields(validateResult, validateItemsNames);

    return !_.size(this.state.invalidFields);
  }

  /** добавить невалидные/убрать валидные поля из State
   * @param validateResult - список невалидных полей
   * @param validateItemsNames - список имен полей для валидации
   */
  private setInvalidFields = async (
    validateResult: string[],
    validateItemsNames: string[]
  ) => {
    const invalidFields: string[] = this.state.invalidFields;

    if (_.size(validateResult)) {
      this.setState(
        (state: TState): TState => {
          return {
            ...state,
            invalidFields: _.union(validateResult, invalidFields),
          };
        }
      );
    } else {
      this.setState(
        (state: TState): TState => {
          return {
            ...state,
            invalidFields: _.difference(invalidFields, validateItemsNames),
          };
        }
      );
    }
  };

  private onChangeHandler_Address: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    const { userStore } = this.props;

    userStore.updateStore_userDataAddress({
      [name]: value.replace(/\s-\s/g, ''),
    });
  };

  private handleChangeSelect_Address = (data: TSelectData) => {
    const { userStore } = this.props;
    if (data.value) {
      new Promise((resolve) => {
        resolve(
          userStore.updateStore_userDataAddress({ [data.name]: data.value })
        );
      })
        .then(() => {
          const { pageStore } = this.props;

          switch (data.name) {
            case 'cityProvince_id':
              return (
                pageStore.getDirectory(DIRECTORIES.dirDistrict, data.value),
                pageStore.getDirectory(DIRECTORIES.dirWardCommune, ''),
                userStore.updateStore_userDataAddress({
                  shouldShow_DISTRICT: true,
                  shouldShow_WARD_COMMUNE: false,
                })
              );
            case 'district_id':
              return (
                pageStore.getDirectory(DIRECTORIES.dirWardCommune, data.value),
                userStore.updateStore_userDataAddress({
                  shouldShow_WARD_COMMUNE: true,
                })
              );
          }

          return;
        })
        .catch((err) => {
          handleErrors(err);
        });
    }
  };

  private onChangeHandler_Contacts: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    const { userStore } = this.props;

    // поскольку, у нас одинаковые ключи "name" для
    // для всех обьектов "имени" - изголяемся вот такой фигней.
    name = name.replace('thirdParty_', '');

    if (value) {
      userStore.updateStore_userDataContacts({
        [name]: value.replace(/\s-\s/g, ''),
      });
    } else {
      userStore.removeStore_userDataContacts(name);
    }
  };

  private handleChangeSelect_Contacts = (data: TSelectData) => {
    const { userStore } = this.props;
    // поскольку, у нас одинаковые ключи "name" для
    // для всех обьектов "имени" - изголяемся вот такой фигней.
    data.name = data.name.replace('thirdParty_', '');

    userStore.updateStore_userDataContacts({ [data.name]: data.value });
  };

  public render(): ReactElement | null {
    const {
      staticData,
      pageStore,
      userStore: { userDataAddress, userDataContacts },
    } = this.props;
    const { invalidFields } = this.state;

    if (this.state.isRender && pageStore) {
      return (
        <ClientTabs className={style.address}>
          <form onSubmit={this.onSubmitHandler}>
            <h2 className={style.title}>{staticData.title}</h2>

            <div className={style.fields}>
              <ReactSelectWidget
                name={FIELD_NAME.CITY_PROVINCE}
                value={userDataAddress.cityProvince_id}
                className={style.reactSelectWidget}
                invalid={invalidFields.includes(FIELD_NAME.CITY_PROVINCE)}
                placeholder={staticData.cityProvince}
                options={pageStore.dirCityProvince}
                onChange={this.handleChangeSelect_Address}
                onBlur={this.validateFieldSelect}
                isSearchable
              />
              {(userDataAddress.shouldShow_DISTRICT ||
                !!userDataAddress.district_id) && (
                <ReactSelectWidget
                  name={FIELD_NAME.DISTRICT}
                  value={userDataAddress.district_id}
                  className={style.reactSelectWidget}
                  invalid={invalidFields.includes(FIELD_NAME.DISTRICT)}
                  placeholder={staticData.district}
                  options={pageStore.dirDistrict}
                  onChange={this.handleChangeSelect_Address}
                  onBlur={this.validateFieldSelect}
                  isSearchable
                />
              )}
              {(userDataAddress.shouldShow_WARD_COMMUNE ||
                !!userDataAddress.wardCommune_id) && (
                <ReactSelectWidget
                  name={FIELD_NAME.WARD_COMMUNE}
                  value={userDataAddress.wardCommune_id}
                  className={style.reactSelectWidget}
                  invalid={invalidFields.includes(FIELD_NAME.WARD_COMMUNE)}
                  placeholder={staticData.wardCommune}
                  options={pageStore.dirWardCommune}
                  onChange={this.handleChangeSelect_Address}
                  onBlur={this.validateFieldSelect}
                  isSearchable
                />
              )}
              <WithTracking
                id={`Address-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.STREET}`}
                events={[
                  EFocusEvents.FOCUS,
                  EFocusEvents.BLUR,
                  EKeyboardEvents.KEY_UP,
                ]}
              >
                <input
                  name={FIELD_NAME.STREET}
                  value={userDataAddress.street || ''}
                  className={classNames(style.input, {
                    [style.error]: invalidFields.includes(FIELD_NAME.STREET),
                  })}
                  type={INPUT_TYPE.TEXT}
                  placeholder={staticData.street}
                  onChange={this.onChangeHandler_Address}
                  maxLength={100}
                  onBlur={this.validateField}
                  role={AbstractRoles.input}
                />
              </WithTracking>
              <WithTracking
                id={`Address-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.BUILDING}`}
                events={[
                  EFocusEvents.FOCUS,
                  EFocusEvents.BLUR,
                  EKeyboardEvents.KEY_UP,
                ]}
              >
                <input
                  name={FIELD_NAME.BUILDING}
                  value={userDataAddress.building || ''}
                  className={classNames(style.input, {
                    [style.error]: invalidFields.includes(FIELD_NAME.BUILDING),
                  })}
                  type={INPUT_TYPE.TEXT}
                  placeholder={staticData.building}
                  onChange={this.onChangeHandler_Address}
                  maxLength={4}
                  onBlur={this.validateField}
                  role={AbstractRoles.input}
                />
              </WithTracking>
              <WithTracking
                id={`Address-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.APARTMENT}`}
                events={[
                  EFocusEvents.FOCUS,
                  EFocusEvents.BLUR,
                  EKeyboardEvents.KEY_UP,
                ]}
              >
                <input
                  name={FIELD_NAME.APARTMENT}
                  value={userDataAddress.apartment || ''}
                  className={style.input}
                  type={INPUT_TYPE.TEXT}
                  placeholder={staticData.apartment}
                  onChange={this.onChangeHandler_Address}
                  maxLength={4}
                  role={AbstractRoles.input}
                />
              </WithTracking>
              <div className={style.livingPeriod}>
                <p className={style.livingPeriodTitle}>
                  {staticData.livingPeriod}
                </p>
                <WithTracking
                  id={`Address-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.YEARS}`}
                  events={[
                    EFocusEvents.FOCUS,
                    EFocusEvents.BLUR,
                    EKeyboardEvents.KEY_UP,
                  ]}
                >
                  <input
                    name={FIELD_NAME.YEARS}
                    value={
                      userDataAddress.currentPlaceLivingYear != null
                        ? userDataAddress.currentPlaceLivingYear
                        : ''
                    }
                    className={classNames(style.input, {
                      [style.error]: invalidFields.includes(FIELD_NAME.YEARS),
                    })}
                    type={INPUT_TYPE.TEL}
                    placeholder={staticData.years}
                    onChange={this.onChangeHandler_Address}
                    // min={0}
                    // max={99}
                    maxLength={2}
                    onBlur={this.validateField}
                    role={AbstractRoles.input}
                  />
                </WithTracking>
                <WithTracking
                  id={`Address-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.MONTHS}`}
                  events={[
                    EFocusEvents.FOCUS,
                    EFocusEvents.BLUR,
                    EKeyboardEvents.KEY_UP,
                  ]}
                >
                  <input
                    name={FIELD_NAME.MONTHS}
                    value={
                      userDataAddress.currentPlaceLivingMonth != null
                        ? userDataAddress.currentPlaceLivingMonth
                        : ''
                    }
                    className={classNames(style.input, {
                      [style.error]: invalidFields.includes(FIELD_NAME.MONTHS),
                    })}
                    type={INPUT_TYPE.TEL}
                    placeholder={staticData.months}
                    onChange={this.onChangeHandler_Address}
                    //min={0}
                    //max={99}
                    maxLength={2}
                    onBlur={this.validateField}
                    role={AbstractRoles.input}
                  />
                </WithTracking>
              </div>
              <WithTracking
                id={`Address-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.THIRD_PARTY_PHONE}`}
                events={[
                  EFocusEvents.FOCUS,
                  EFocusEvents.BLUR,
                  EKeyboardEvents.KEY_UP,
                ]}
              >
                <ReactInputMaskWidget
                  name={FIELD_NAME.THIRD_PARTY_PHONE}
                  value={
                    _.size(userDataContacts)
                      ? userDataContacts[0]?.phoneNumber || ''
                      : ''
                  }
                  className={style.inputMask}
                  invalid={invalidFields.includes(FIELD_NAME.THIRD_PARTY_PHONE)}
                  type={INPUT_TYPE.TEL}
                  mask={otherPhoneMask}
                  placeholder={
                    staticData.thirdPartyPhone || phoneMask.replace(/9/g, '*')
                  }
                  onChange={this.onChangeHandler_Contacts}
                  onBlur={this.validateField_thirdParty}
                  maskChar={null}
                  role={AbstractRoles.input}
                />
              </WithTracking>
              <WithTracking
                id={`Address-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.THIRD_PARTY_NAME}`}
                events={[
                  EFocusEvents.FOCUS,
                  EFocusEvents.BLUR,
                  EKeyboardEvents.KEY_UP,
                ]}
              >
                <input
                  name={FIELD_NAME.THIRD_PARTY_NAME}
                  value={
                    _.size(userDataContacts)
                      ? userDataContacts[0].name || ''
                      : ''
                  }
                  className={classNames(style.input, {
                    [style.error]: invalidFields.includes(
                      FIELD_NAME.THIRD_PARTY_NAME
                    ),
                  })}
                  type={INPUT_TYPE.TEXT}
                  placeholder={staticData.thirdPartyName}
                  onChange={this.onChangeHandler_Contacts}
                  maxLength={50}
                  onBlur={this.validateField_thirdParty}
                  role={AbstractRoles.input}
                />
              </WithTracking>
              <ReactSelectWidget
                name={FIELD_NAME.THIRD_PARTY_RELATION}
                value={
                  _.size(userDataContacts)
                    ? userDataContacts[0].type_id || ''
                    : ''
                }
                className={style.reactSelectWidget}
                invalid={invalidFields.includes(
                  FIELD_NAME.THIRD_PARTY_RELATION
                )}
                placeholder={staticData.thirdPartyRelation}
                options={pageStore.dirThirdPartyRelation}
                onChange={this.handleChangeSelect_Contacts}
                onBlur={this.validateFieldSelect}
              />
            </div>
            <WithTracking
              id={`Obligatory-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}`}
              events={[EMouseEvents.CLICK]}
            >
              <button
                role={WidgetRoles.button}
                className={style.nextStep}
                type={BUTTON_TYPE.SUBMIT}
              >
                {gt.gettext('More')}
              </button>
            </WithTracking>
          </form>
        </ClientTabs>
      );
    }

    return <Preloader />;
  }
}
