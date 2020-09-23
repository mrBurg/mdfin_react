import { ReactElement, PureComponent, FormEvent } from 'react';
import { observer } from 'mobx-react';
import InputMask from 'react-input-mask';
import _ from 'lodash';
import classNames from 'classnames';

import style from './Address.module.scss';

import { phoneMask } from '../../../config.json';
import { INPUT_TYPE, BUTTON_TYPE, FIELD_NAME } from '../../../constants';
import { gt, validator } from '../../../utils';
import { ClientTabs } from '../ClientTabs';
import { DIRECTORIES, URIS } from '../../../routes';
import { TOnInputChangeHandler } from '../../../interfaces';
import { SelectWidget } from '../../widgets/SelectWidget';
import { Preloader } from '../../Preloader';
import {
  TField,
  TUserAddress,
  TUserContacts,
  TValidateProps,
} from '../../../stores/@types/userStore';
import { TAddress, TState } from './@types';

@observer
export class Address extends PureComponent<TAddress> {
  public readonly state: TState = {
    isRender: false,
    invalidFields: [],
  };

  async componentDidMount() {
    const { pageStore, userStore } = this.props;

    userStore.fetchWithAuth(async () => {
      await this.refreshView();

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
      contacts?: Array<TUserContacts>;
    } = {
      address: { ...userDataAddress },
    };

    if (_.size(userDataContacts) > 0) {
      newData.contacts = userDataContacts;
    }

    await userStore.saveWizardStep(URIS.address, newData);
    userStore.getClientNextStep();
  }

  /** Список полей для валидации */
  private async validateItems(): Promise<TValidateProps> {
    const {
      userStore: { userDataAddress, userDataContacts },
    } = this.props;

    const validateItems: TValidateProps = [
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
        value: !!_.size(userDataContacts)
          ? userDataContacts[0].phoneNumber
          : '',
      },
      {
        name: FIELD_NAME.THIRD_PARTY_NAME,
        value: !!_.size(userDataContacts) ? userDataContacts[0].name : '',
      },
      {
        name: FIELD_NAME.THIRD_PARTY_RELATION,
        value: !!_.size(userDataContacts) ? userDataContacts[0].type_id : '',
      },
    ];
    return validateItems;
  }

  private validateField: TOnInputChangeHandler = async ({
    currentTarget: { name, value },
  }) => {
    this.validateForm([{ name, value }]);
  };

  private validateFieldSelect = (_event: any, data: any) => {
    const { name, value } = data;
    this.validateForm([{ name, value }]);
  };

  private async validateForm(validateItems: TValidateProps): Promise<boolean> {
    const { userStore } = this.props;

    let validateItemsNames: string[] = [];
    _.map(validateItems, (itemName: TField) => {
      validateItemsNames.push(itemName.name);
    });
    let invalidFields: string[] = this.state.invalidFields;
    const validateResult: string[] = await validator(validateItems, userStore);

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

    return !_.size(this.state.invalidFields);
  }

  private onChangeHandler_Address: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    const { userStore } = this.props;

    userStore.updateStore_userDataAddress({
      [name]: value.replace(/\s-\s/g, ''),
    });
  };

  private handleChangeSelect_Address = (_event: any, data: any) => {
    const { userStore } = this.props;
    new Promise((resolve) => {
      resolve(
        userStore.updateStore_userDataAddress({ [data.name]: data.value })
      );
    }).then(() => {
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
    });
  };

  private onChangeHandler_Contacts: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    const { userStore } = this.props;

    // поскольку, у нас одинаковые ключи "name" для
    // для всех обьектов "имени" - изголяемся вот такой фигней.
    name = name.replace('thirdParty_', '');

    userStore.updateStore_userDataContacts({
      [name]: value.replace(/\s-\s/g, ''),
    });
  };

  private handleChangeSelect_Contacts = (_event: any, data: any) => {
    const { userStore } = this.props;
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
              <SelectWidget
                name={FIELD_NAME.CITY_PROVINCE}
                value={userDataAddress.cityProvince_id}
                className={classNames(style.input, {
                  [style.error]: invalidFields.includes(
                    FIELD_NAME.CITY_PROVINCE
                  ),
                })}
                placeholder={staticData.cityProvince}
                options={pageStore.dirCityProvince}
                onChange={this.handleChangeSelect_Address}
                search={true}
                deburr={true}
                onBlur={this.validateFieldSelect}
              />
              {(userDataAddress.shouldShow_DISTRICT ||
                !!userDataAddress.district_id) && (
                <SelectWidget
                  name={FIELD_NAME.DISTRICT}
                  value={userDataAddress.district_id}
                  className={classNames(style.input, {
                    [style.error]: invalidFields.includes(FIELD_NAME.DISTRICT),
                  })}
                  placeholder={staticData.district}
                  options={pageStore.dirDistrict}
                  onChange={this.handleChangeSelect_Address}
                  search={true}
                  deburr={true}
                  onBlur={this.validateFieldSelect}
                />
              )}
              {(userDataAddress.shouldShow_WARD_COMMUNE ||
                !!userDataAddress.wardCommune_id) && (
                <SelectWidget
                  name={FIELD_NAME.WARD_COMMUNE}
                  value={userDataAddress.wardCommune_id}
                  className={classNames(style.input, {
                    [style.error]: invalidFields.includes(
                      FIELD_NAME.WARD_COMMUNE
                    ),
                  })}
                  placeholder={staticData.wardCommune}
                  options={pageStore.dirWardCommune}
                  onChange={this.handleChangeSelect_Address}
                  search={true}
                  deburr={true}
                  onBlur={this.validateFieldSelect}
                />
              )}
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
              />
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
              />
              <input
                name={FIELD_NAME.APARTMENT}
                value={userDataAddress.apartment || ''}
                className={style.input}
                type={INPUT_TYPE.TEXT}
                placeholder={staticData.apartment}
                onChange={this.onChangeHandler_Address}
                maxLength={4}
              />
              <div className={style.livingPeriod}>
                <p className={style.livingPeriodTitle}>
                  {staticData.livingPeriod}
                </p>
                <input
                  name={FIELD_NAME.YEARS}
                  value={
                    !!userDataAddress.currentPlaceLivingYear
                      ? String(userDataAddress.currentPlaceLivingYear)
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
                />
                <input
                  name={FIELD_NAME.MONTHS}
                  value={
                    !!userDataAddress.currentPlaceLivingMonth
                      ? String(userDataAddress.currentPlaceLivingMonth)
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
                />
              </div>

              <InputMask
                name={FIELD_NAME.THIRD_PARTY_PHONE}
                value={
                  !!_.size(userDataContacts)
                    ? userDataContacts[0]?.phoneNumber || ''
                    : ''
                }
                className={classNames(style.input, {
                  [style.error]: invalidFields.includes(
                    FIELD_NAME.THIRD_PARTY_PHONE
                  ),
                })}
                type={INPUT_TYPE.TEL}
                mask={phoneMask}
                placeholder={
                  staticData.thirdPartyPhone || phoneMask.replace(/9/g, '*')
                }
                onChange={this.onChangeHandler_Contacts}
                onBlur={this.validateField}
              />
              <input
                name={FIELD_NAME.THIRD_PARTY_NAME}
                value={
                  !!_.size(userDataContacts)
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
                onBlur={this.validateField}
              />
              <SelectWidget
                name={FIELD_NAME.THIRD_PARTY_RELATION}
                value={
                  !!_.size(userDataContacts)
                    ? userDataContacts[0].type_id || ''
                    : ''
                }
                className={classNames(style.input, {
                  [style.error]: invalidFields.includes(
                    FIELD_NAME.THIRD_PARTY_RELATION
                  ),
                })}
                placeholder={staticData.thirdPartyRelation}
                options={pageStore.dirThirdPartyRelation}
                onChange={this.handleChangeSelect_Contacts}
                onBlur={this.validateFieldSelect}
              />
            </div>

            <button className={style.nextStep} type={BUTTON_TYPE.SUBMIT}>
              {gt.gettext('More')}
            </button>
          </form>
        </ClientTabs>
      );
    }

    return <Preloader />;
  }
}
