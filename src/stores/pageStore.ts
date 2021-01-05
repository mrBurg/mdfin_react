import { TJSON } from '@interfaces';
import { URIS } from '@routes';
import { CommonApi } from '@src/apis';
import { observable, runInAction } from 'mobx';
import { TDirectoryItem } from './@types/pageStore';

export class PageStore {
  constructor(private commonApi: CommonApi) {}

  public documentTitle = '';
  public pageData: TJSON = {};
  public copyright = '';

  /* Справочники */
  @observable public dirGender: TDirectoryItem[] = [];
  @observable public dirMaritalStatus: TDirectoryItem[] = [];
  @observable public dirLoanPurpose: TDirectoryItem[] = [];
  @observable public dirMobilePhoneBrand: TDirectoryItem[] = [];
  @observable public dirMobilePhoneModel: TDirectoryItem[] = [];

  @observable public dirCityProvince: TDirectoryItem[] = [];
  @observable public dirDistrict: TDirectoryItem[] = [];
  @observable public dirWardCommune: TDirectoryItem[] = [];
  @observable public dirThirdPartyRelation: TDirectoryItem[] = [];

  @observable public dirSocialStatus: TDirectoryItem[] = [];
  @observable public dirEducation: TDirectoryItem[] = [];
  @observable public dirIndustry: TDirectoryItem[] = [];
  @observable public dirIndustryDetailed: TDirectoryItem[] = [];
  @observable public dirJobPosType: TDirectoryItem[] = [];
  @observable public dirJobRelationType: TDirectoryItem[] = [];

  @observable public dirBank: TDirectoryItem[] = [];

  @observable public dirDeclinedByClientReason: TDirectoryItem[] = [];

  /* Взять Справочник. Сервис: /directory/{directoryName} */
  public async getDirectory(
    directoryUrl: string,
    parent_id?: string
  ): Promise<void> {
    let url = URIS.DIRECTORY + directoryUrl;
    if (parent_id) {
      url = URIS.DIRECTORY + directoryUrl + '?parent_id=' + parent_id;
    }

    const requestConfig = this.commonApi.getHeaderRequestConfig(url);
    const response = await this.commonApi.getDirectory(requestConfig);

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
          case 'declined_by_client_reason':
            return (this.dirDeclinedByClientReason = response);
        }
      });
    }
  }
}
