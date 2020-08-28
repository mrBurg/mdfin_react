import moment from 'moment';

import { TJSON } from '../interfaces';
import { CommonApi } from '../apis';
import { URIS } from '../routes';
import { observable, runInAction } from 'mobx';
import { TDirectory } from './@types/pageStore';

export class PageStore {
  constructor(private commonApi: CommonApi) {}

  public documentTitle: string = '';
  public pageData: TJSON = {};
  public copyright: string = '';
  public footerTags: TJSON = {
    year: `${moment().format('YYYY')}`,
  };

  /* Справочники */
  @observable public dirGender: TDirectory = [];
  @observable public dirMaritalStatus: TDirectory = [];
  @observable public dirLoanPurpose: TDirectory = [];
  @observable public dirMobilePhoneBrand: TDirectory = [];
  @observable public dirMobilePhoneModel: TDirectory = [];

  @observable public dirCityProvince: TDirectory = [];
  @observable public dirDistrict: TDirectory = [];
  @observable public dirWardCommune: TDirectory = [];
  @observable public dirThirdPartyRelation: TDirectory = [];

  @observable public dirSocialStatus: TDirectory = [];
  @observable public dirEducation: TDirectory = [];
  @observable public dirIndustry: TDirectory = [];
  @observable public dirIndustryDetailed: TDirectory = [];
  @observable public dirJobPosType: TDirectory = [];
  @observable public dirJobRelationType: TDirectory = [];

  @observable public dirBank: TDirectory = [];

  /* Взять Справочник. Сервис: /directory/{directoryName} */
  public async getDirectory(directoryUrl: string, parent_id?: string) {
    let url = URIS.DIRECTORY + directoryUrl;
    if (parent_id) {
      url = URIS.DIRECTORY + directoryUrl + '?parent_id=' + parent_id;
    }

    const response = await this.commonApi.getDirectory(url);
    //console.log(directoryUrl, response);
    if (response) {
      runInAction(() => {
        switch (directoryUrl) {
          case 'gender':
            return (this.dirGender = response);
          case 'marital_status':
            return (this.dirMaritalStatus = response);
          case 'loan_purpose':
            return (this.dirLoanPurpose = response);
          case 'mobile_phone_brand':
            if (parent_id) {
              return (this.dirMobilePhoneModel = response);
            } else {
              return (this.dirMobilePhoneBrand = response);
            }
          case 'city_province':
            return (this.dirCityProvince = response);
          case 'district':
            return (this.dirDistrict = response);
          case 'ward_commune':
            return (this.dirWardCommune = response);
          case 'third_party_relation':
            return (this.dirThirdPartyRelation = response);
          case 'social_status':
            return (this.dirSocialStatus = response);
          case 'education':
            return (this.dirEducation = response);
          case 'industry':
            if (parent_id) {
              return (this.dirIndustryDetailed = response);
            } else {
              return (this.dirIndustry = response);
            }
          case 'job_pos_type':
            return (this.dirJobPosType = response);
          case 'job_relation_type':
            return (this.dirJobRelationType = response);
          case 'bank':
            return (this.dirBank = response);
        }
      });
    }
  }
}
