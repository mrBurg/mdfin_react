import { TJSON } from '@interfaces';
import { TGetBrowserData } from './@types';

export class Browser {
  public agent = navigator.userAgent;
  public ignoredBrowsers = ['opera-ios', 'opera-mini'];
  public name = (() => {
    let name = '';

    switch (true) {
      //SamsungBrowser
      case !!~this.agent.search(/SamsungBrowser/):
        name = 'samsung-browser';
        break;
      //YaBrowser
      case !!~this.agent.search(/YaBrowser/):
        name = 'yandex-browser';
        break;
      //IE
      case !!~this.agent.search(/MSIE/):
        name = 'ie';
        break;
      case !!~this.agent.search(/Trident/):
        name = 'trident';
        break;
      case !!~this.agent.search(/Edge/):
        name = 'edge';
        break;
      //Opera
      case !!~this.agent.search(
        /OPiOS|(iPhone.+(Mobile|Tablet))(?!(.+Safari))/
      ):
        name = 'opera-ios';
        break;
      case !!~this.agent.search(/Opera Mini|((wv).+OPR)/):
        name = 'opera-mini';
        break;
      case !!~this.agent.search(/Opera/):
        name = 'opera-presto';
        break;
      case !!~this.agent.search(/OPR/):
        name = 'opera';
        break;
      //Firefox
      case !!~this.agent.search(/FxiOS/):
        name = 'firefox-ios';
        break;
      case !!~this.agent.search(/Firefox/):
        name = 'firefox';
        break;
      //Chrome
      case !!~this.agent.search(/CriOS/):
        name = 'chrome-ios';
        break;
      case !!~this.agent.search(/Chrome/):
        name = 'chrome';
        break;
      //Safari
      case !!~this.agent.search(/Safari/):
        name = 'safari';
        break;
      //Other
      default:
        name = 'unnamed';
    }

    for (let i = 0; i < this.ignoredBrowsers.length; i++) {
      if (this.ignoredBrowsers[i] == name) {
        name = 'unsupported';
      }
    }

    return name;
  })();

  public version = (() => {
    let res = null;

    switch (this.name) {
      case 'samsung-browser':
        res = this.agent.split('SamsungBrowser/')[1].split(' ')[0];
        break;
      case 'yandex-browser':
        res = this.agent.split('YaBrowser/')[1].split(' ')[0];
        break;
      case 'ie':
        res = this.agent.split('MSIE ')[1].split(';')[0];
        break;
      case 'trident':
        res = this.agent.split('rv:')[1].split(')')[0];
        break;
      case 'edge':
        res = this.agent.split('Edge/')[1];
        break;
      case 'opera-presto':
        res = this.agent.split('Version/')[1];
        break;
      case 'opera':
        res = this.agent.split('OPR/')[1];
        break;
      case 'firefox':
        res = this.agent.split('Firefox/')[1];
        break;
      case 'chrome':
        res = this.agent.split('Chrome/')[1].split(' ')[0];
        break;
      case 'safari':
        res = this.agent.split('Version/')[1].split(' ')[0];
        break;
    }

    if (res) res = parseFloat(res);

    return res;
  })();

  public fullname =
    this.name + (this.version ? String(this.version).split('.')[0] : '');

  public getData = (obj: TJSON): TGetBrowserData => {
    let name;
    let result = null;

    if (obj) {
      result = obj.none || 'none';
      for (const key in obj) {
        if (obj.hasOwnProperty.call(obj, key)) {
          const trg = key.toLowerCase();

          if (trg.indexOf(this.fullname) > -1 || trg.indexOf(this.name) > -1) {
            name = obj[key];
          } else {
            const nsymbol = trg.charAt(
              trg.indexOf(this.name) + this.name.length
            );

            if (
              trg.indexOf(this.name) > -1 &&
              (nsymbol === ' ' || nsymbol === '')
            ) {
              name = obj[key];
            }
          }
        }
        if (name) {
          result = name;
          break;
        }
      }
      return result;
    } else {
      result = {
        name: this.name,
        version: this.version,
        fullname:
          this.name + this.version ? String(this.version).split('.')[0] : '',
      };
    }

    return result;
  };
}
