import { TJSON } from '../../interfaces';

import mainPage from './main-page.json';
import contactsPage from './contacts-page.json';
import faqPage from './faq-page.json';
import inprocessPage from './inprocess-page.json';
import notifyPage from './notify-page.json';
import repaymentPage from './repayment-page.json';
import sendmoneyPage from './sendmoney-page.json';
import signInPage from './sign-in-page.json';
import signUpPage from './sign-up-page.json';
import wrongaccountPage from './wrongaccount-page.json';
import dealPage from './deal-page.json';
import applicationPage from './application-page.json';
import page404 from './page-404.json';
import addressPage from './address-page.json';
import documentsPage from './documents-page.json';
import jobPage from './job-page.json';
import obligatoryPage from './obligatory-page.json';
import copyright from './copyright.json';
import template from './template.json';
import repaymentForm from './repayment-form.json';

const data: TJSON = {
  static: {
    'main-page': mainPage,
    'deal-page': dealPage,
    'application-page': applicationPage,
    'contacts-page': contactsPage,
    'faq-page': faqPage,
    'repayment-page': repaymentPage,
    'sendmoney-page': sendmoneyPage,
    'sign-in-page': signInPage,
    'sign-up-page': signUpPage,
    'wrongaccount-page': wrongaccountPage,
    'inprocess-page': inprocessPage,
    'notify-page': notifyPage,
    'page-404': page404,
    'address-page': addressPage,
    'documents-page': documentsPage,
    'job-page': jobPage,
    'obligatory-page': obligatoryPage,
    copyright,
  },
  form: {
    'repayment-form': repaymentForm,
  },
  template,
};

export function fetchTemporaryData(params: TJSON) {
  const { block, path } = params;

  try {
    return data[path][block];
  } catch (err) {
    console.info('Locales not found');

    return {};
  }
}
