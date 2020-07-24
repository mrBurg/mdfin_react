import { observable, action, runInAction } from 'mobx';
import { OTPApi } from '../apis';
import { isDev } from '../utils';

type TUserData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  otpId: number;
  fingerprint?: string;
};

export default class OTPStore {
  @observable otpReady: boolean = false;
  @observable otpCode?: string;

  private userData?: TUserData;

  constructor(private otpApi: OTPApi) {}

  @action
  public async setUserData(userData: TUserData) {
    if (userData) {
      const { otpId } = userData;

      this.userData = userData;

      if (otpId) {
        this.otpReady = true;

        if (isDev) {
          const otpData = await this.otpApi.getOtp({ otpId });

          if (otpData) {
            const { otpCode } = otpData;

            runInAction(() => {
              this.otpCode = otpCode;
            });
          }
        }
      }

      console.info(this.userData);
    }
  }
}
