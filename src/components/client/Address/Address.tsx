import { ReactElement, PureComponent, FormEvent } from 'react';
import { observer, inject } from 'mobx-react';
import InputMask from 'react-input-mask';
import classNames from 'classnames';
import Router from 'next/router';

import style from './Address.module.scss';

import { phoneMask } from '../../../config.json';
import { INPUT_TYPE, BUTTON_TYPE, FIELD_NAME } from '../../../constants';
import { gt } from '../../../utils';
import { ClientTabs } from '../ClientTabs';
import { STORE_IDS } from '../../../stores';
import { DIRECTORIES, URLS } from '../../../routes';
import { TOnInputChangeHandler, TJSON } from '../../../interfaces';
import { SelectWidget } from '../../widgets/SelectWidget';
import { Preloader } from '../../Preloader';
import { TUserAddress, TUserContacts } from '../../../stores/@types/userStore';
import { TAddress, TState } from './@types';

@inject(STORE_IDS.PAGE_STORE, STORE_IDS.USER_STORE)
@observer
export class Address extends PureComponent<TAddress> {
  public readonly state: TState = {
    isRender: false,
    userDataAddress: {},
    userDataContacts: [],
  };

  async componentDidMount() {
    const { pageStore, userStore } = this.props;

    if (pageStore && userStore) {
      Promise.all([
        userStore.getWizardData_Address(),
        pageStore.getDirectory(DIRECTORIES.dirThirdPartyRelation),
        pageStore.getDirectory(DIRECTORIES.dirCityProvince),
      ]).then(() => {
        new Promise((resolve) => {
          this.setState({
            isRender: true,
            userDataAddress: { ...userStore.userDataAddress }, //{ ...this.props.userDataAddress },
            userDataContacts: userStore.userDataContacts, //this.props.userDataContacts,
          });
          resolve();
        }).then(() => {
          if (this.state.userDataAddress.cityProvince_id)
            pageStore.getDirectory(
              DIRECTORIES.dirDistrict,
              '' + this.state.userDataAddress.cityProvince_id
            );

          if (this.state.userDataAddress.district_id)
            pageStore.getDirectory(
              DIRECTORIES.dirWardCommune,
              '' + this.state.userDataAddress.district_id
            );
        });
      });
    }
  }

  private async submitForm() {
    const { userStore } = this.props;

    if (userStore) {
      userStore.updateStore_Address(
        this.state.userDataAddress,
        this.state.userDataContacts
      );

      const newData: {
        address: TUserAddress;
        contacts?: Array<TUserContacts>;
      } = {
        address: { ...this.state.userDataAddress },
      };

      if (this.state.userDataContacts.length > 0) {
        newData.contacts = this.state.userDataContacts;
      }

      userStore.postWizardDataAddress(newData);

      const view = await userStore.getClientNextStep();
      if (view) return Router.push((URLS as TJSON)[view]);
    }
  }

  private onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.submitForm();
  };

  private onChangeHandler_Address: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    this.setState(
      (state: TState): TState => {
        return {
          ...state,
          userDataAddress: {
            ...state.userDataAddress,
            [name]: value.replace(/\s-\s/g, ''),
          },
        };
      }
    );
  };

  private handleChangeSelect_Address = (_event: any, data: any) => {
    new Promise((resolve) => {
      resolve(
        this.setState(
          (state: TState): TState => {
            return {
              ...state,
              userDataAddress: {
                ...state.userDataAddress,
                [data.name]: data.value,
              },
            };
          }
        )
      );
    }).then(() => {
      const { pageStore } = this.props;
      if (pageStore) {
        switch (data.name) {
          case 'cityProvince_id':
            return (
              pageStore.getDirectory(DIRECTORIES.dirDistrict, data.value),
              pageStore.getDirectory(DIRECTORIES.dirWardCommune, ''),
              this.setState({
                userDataAddress: {
                  ...this.state.userDataAddress,
                  shouldShow_DISTRICT: true,
                  shouldShow_WARD_COMMUNE: false,
                },
              })
            );
          case 'district_id':
            return (
              pageStore.getDirectory(DIRECTORIES.dirWardCommune, data.value),
              this.setState({
                userDataAddress: {
                  ...this.state.userDataAddress,
                  shouldShow_WARD_COMMUNE: true,
                },
              })
            );
        }
      }
    });
  };

  private onChangeHandler_Contacts: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }) => {
    this.setState(
      (state: TState): TState => {
        const { userDataContacts } = this.state;
        const newArray = {
          ...userDataContacts[0],
          [name]: value.replace(/\s-\s/g, ''),
        };
        return {
          ...state,
          userDataContacts: [newArray],
        };
      }
    );
  };

  private handleChangeSelect_Contacts = (_event: any, data: any) => {
    this.setState(
      (state: TState): TState => {
        const { userDataContacts } = this.state;
        const newArray = {
          ...userDataContacts[0],
          [data.name]: data.value,
        };
        return {
          ...state,
          userDataContacts: [newArray],
        };
      }
    );
  };

  public render(): ReactElement | null {
    const { staticData } = this.props;
    const { pageStore } = this.props;

    if (this.state.isRender && pageStore) {
      return (
        <ClientTabs>
          <form className={style.address} onSubmit={this.onSubmitHandler}>
            <h2 className={style.title}>{staticData.title}</h2>

            <div className={style.fields}>
              <SelectWidget
                name={FIELD_NAME.CITY_PROVINCE}
                value={this.state.userDataAddress.cityProvince_id}
                className={style.input}
                placeholder={staticData.cityProvince}
                options={pageStore.dirCityProvince}
                onChange={this.handleChangeSelect_Address}
                search={true}
                deburr={true}
              />
              <SelectWidget
                name={FIELD_NAME.DISTRICT}
                value={this.state.userDataAddress.district_id}
                className={classNames(style.input, {
                  [style.hidden]:
                    this.state.userDataAddress.shouldShow_DISTRICT != true,
                })}
                placeholder={staticData.district}
                options={pageStore.dirDistrict}
                onChange={this.handleChangeSelect_Address}
                search={true}
                deburr={true}
              />
              <SelectWidget
                name={FIELD_NAME.WARD_COMMUNE}
                value={this.state.userDataAddress.wardCommune_id}
                className={classNames(style.input, {
                  [style.hidden]:
                    this.state.userDataAddress.shouldShow_WARD_COMMUNE != true,
                })}
                placeholder={staticData.wardCommune}
                options={pageStore.dirWardCommune}
                onChange={this.handleChangeSelect_Address}
                search={true}
                deburr={true}
              />
              <input
                name={FIELD_NAME.STREET}
                value={this.state.userDataAddress.street || ''}
                className={style.input}
                type={INPUT_TYPE.TEXT}
                placeholder={staticData.street}
                onChange={this.onChangeHandler_Address}
                required={true}
                maxLength={100}
              />
              <input
                name={FIELD_NAME.BUILDING}
                value={this.state.userDataAddress.building || ''}
                className={style.input}
                type={INPUT_TYPE.TEXT}
                placeholder={staticData.building}
                onChange={this.onChangeHandler_Address}
                required={true}
                maxLength={4}
              />
              <input
                name={FIELD_NAME.APARTMENT}
                value={this.state.userDataAddress.apartment || ''}
                className={style.input}
                type={INPUT_TYPE.TEXT}
                placeholder={staticData.apartment}
                onChange={this.onChangeHandler_Address}
                required={true}
                maxLength={4}
              />
              <div className={style.livingPeriod}>
                <p className={style.livingPeriodTitle}>
                  {staticData.livingPeriod}
                </p>
                <input
                  name={FIELD_NAME.YEARS}
                  value={
                    this.state.userDataAddress.currentPlaceLivingYear || ''
                  }
                  className={style.input}
                  type={INPUT_TYPE.NUMBER}
                  placeholder={staticData.years}
                  onChange={this.onChangeHandler_Address}
                  required={true}
                  min={0}
                  max={99}
                />
                <input
                  name={FIELD_NAME.MONTHS}
                  value={
                    this.state.userDataAddress.currentPlaceLivingMonth || ''
                  }
                  className={style.input}
                  type={INPUT_TYPE.NUMBER}
                  placeholder={staticData.months}
                  onChange={this.onChangeHandler_Address}
                  required={true}
                  min={0}
                  max={99}
                />
              </div>

              <InputMask
                name={FIELD_NAME.THIRD_PARTY_PHONE}
                value={
                  this.state.userDataContacts &&
                  this.state.userDataContacts.length
                    ? this.state.userDataContacts[0].phoneNumber
                    : ''
                }
                className={style.input}
                type={INPUT_TYPE.TEL}
                mask={phoneMask}
                placeholder={
                  staticData.thirdPartyPhone || phoneMask.replace(/9/g, '*')
                }
                onChange={this.onChangeHandler_Contacts}
              />
              <input
                name={FIELD_NAME.THIRD_PARTY_NAME}
                value={
                  this.state.userDataContacts.length
                    ? this.state.userDataContacts[0].name
                    : ''
                }
                className={style.input}
                type={INPUT_TYPE.TEXT}
                placeholder={staticData.thirdPartyName}
                onChange={this.onChangeHandler_Contacts}
                maxLength={50}
              />
              <SelectWidget
                name={FIELD_NAME.THIRD_PARTY_RELATION}
                value={
                  this.state.userDataContacts.length
                    ? this.state.userDataContacts[0].type_id
                    : ''
                }
                className={style.input}
                placeholder={staticData.thirdPartyRelation}
                options={pageStore.dirThirdPartyRelation}
                onChange={this.handleChangeSelect_Contacts}
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
