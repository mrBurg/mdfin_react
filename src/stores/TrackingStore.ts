import { TEvents } from '@components/hocs/WithTracking/@types';
import { TJSON } from '@interfaces';
import { URIS } from '@routes';
import { TrackingApi } from '@src/apis';
import { EXTERNAL_SESSION_KEY } from '@src/constants';
import {
  EUIEvents,
  EResourceEvents,
  ETouchEvents,
  ETrackingActions,
} from '@src/trackingConstants';
import {
  getFromLocalStorage,
  getMD5,
  setToLocalStorage,
  makeApiUri,
  jsonToQueryString,
  isDev,
  handleErrors,
  Browser,
  getGeolocation,
  delay,
} from '@utils';
import { UserStore } from './UserStore';

export class TrackingStore {
  public externalSessionID?: any;
  private isScrolled_bottom = false;
  private isScrolled = false;
  private isFinished = false;

  constructor(private trackingApi: TrackingApi, private userStore: UserStore) {}

  public async getExternalSessionData(options?: TJSON): Promise<void | string> {
    const externalSession = getFromLocalStorage(getMD5(EXTERNAL_SESSION_KEY));

    if (externalSession || this.externalSessionID) {
      this.externalSessionID = externalSession || this.externalSessionID;
      setToLocalStorage(getMD5(EXTERNAL_SESSION_KEY), this.externalSessionID);

      return;
    }

    const externalSessionData = await this.trackingApi.initExternalTracking(
      options
    );

    if (externalSessionData) {
      const { external_session_id, headers } = externalSessionData;

      this.userStore.setSessionID(headers['sessionid']);

      if (external_session_id) {
        this.externalSessionID = external_session_id;
        setToLocalStorage(getMD5(EXTERNAL_SESSION_KEY), this.externalSessionID);
      }
    }
  }

  public updateDataOnScroll(): void {
    this.isScrolled =
      window.innerHeight + window.scrollY >= document.body.offsetHeight;
    this.isScrolled_bottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 10;

    delay(() => {
      this.sendEvent(EUIEvents.SCROLL);
    }, 500);
  }

  public updateDataBeforeUnload(): void {
    this.isFinished = true;

    this.sendPageInfo(EResourceEvents.BEFORE_UNLOAD);
  }

  private makeRequest(eventType: TEvents, trackingData: TJSON) {
    const uriData = `${makeApiUri()}${
      URIS.EXTERNAL_TRACKING_API
    }${jsonToQueryString(trackingData, true)}`;

    try {
      if (isDev) {
        console.groupCollapsed(
          `Event @@tracking/${eventType} sent from ${window.location}`
        );
        console.info(uriData);
        console.info(trackingData);
        console.groupEnd();
      }

      document.createElement('img').setAttribute('src', uriData);
    } catch (err) {
      handleErrors(err);
    }
  }

  public async sendSessionInfo(eventType: TEvents): Promise<void> {
    const browser = new Browser();
    const { device, fingerprint, session_id } = this.userStore;

    if (device) {
      this.makeRequest(eventType, {
        JSESSIONID: session_id,
        user_agent: navigator.userAgent,
        browser_id: browser.fullname,
        os: device.os,
        ismobile: device.mobile(),
        add_info: JSON.stringify({
          browser: browser.name,
          os: device.os,
          mobile: device.mobile(),
          touch:
            ETouchEvents.TOUCH_START.toLowerCase() in document.documentElement,
          tablet: device.tablet(),
        }),
        gps: JSON.stringify(getGeolocation()),
        referrer: document.referrer || window.location.href,
        fp: fingerprint?.visitorId,
        fp_components: JSON.stringify(fingerprint?.components),
        action: eventType,
      });
    }
  }

  public async sendPageInfo(eventType: TEvents): Promise<void> {
    const pageInfoData = {
      referrer: document.referrer || window.location.href,
      action: eventType,
      url: window.location.href,
      page_link: window.location.origin,
      is_scrolled_bottom: this.isScrolled_bottom,
      is_scrolled: this.isScrolled,
      is_finished: this.isFinished,
      session_page_info_id: 0,
    };

    this.makeRequest(eventType, pageInfoData);
  }

  public async sendEvent(eventType: TEvents, eventData?: TJSON): Promise<void> {
    const { fingerprint, session_id } = this.userStore;

    const trackingData = {
      u: this.externalSessionID,
      action: ETrackingActions.EVENTS,
      fp: fingerprint?.visitorId,
      sr: this.trackingApi.getScreen,
      url: window.location.href,
      e: eventType,
      ts: new Date().getTime(),
      session_id,
      ...eventData,
    };

    this.makeRequest(eventType, trackingData);
  }
}
