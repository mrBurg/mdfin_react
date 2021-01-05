import addressPage from './address-page.json';
import contactsPage from './contacts-page.json';
import copyright from './copyright.json';
import documentsPage from './documents-page.json';
import faqPage from './faq-page.json';
import inprocessPage from './inprocess-page.json';
import jobPage from './job-page.json';
import loanInfoForm from './loan-info-form.json';
import mainPage from './main-page.json';
import notifyPage from './notify-page.json';
import obligatoryPage from './obligatory-page.json';
import page404 from './page-404.json';
import repaymentPage from './repayment-page.json';
import sendmoneyPage from './sendmoney-page.json';
import signInPage from './sign-in-page.json';
import signUpPage from './sign-up-page.json';
import template from './template.json';
import wrongaccountPage from './wrongaccount-page.json';

import accountsForm from './accounts-form.json';
import attachmentsForm from './attachments-form.json';
import repaymentForm from './repayment-form.json';
import otpForm from './otp-form.json';
import productSelectorForm from './product-selector-form.json';

import { TJSON } from '@interfaces';

const data: TJSON = {
  static: {
    'address-page': addressPage,
    'contacts-page': contactsPage,
    'documents-page': documentsPage,
    'faq-page': faqPage,
    'inprocess-page': inprocessPage,
    'job-page': jobPage,
    'main-page': mainPage,
    'notify-page': notifyPage,
    'obligatory-page': obligatoryPage,
    'page-404': page404,
    'repayment-page': repaymentPage,
    'sendmoney-page': sendmoneyPage,
    'sign-in-page': signInPage,
    'sign-up-page': signUpPage,
    'wrongaccount-page': wrongaccountPage,
    copyright,
  },
  form: {
    'accounts-form': accountsForm,
    'attachments-form': attachmentsForm,
    'loan-info-form': loanInfoForm,
    'repayment-form': repaymentForm,
    'otp-form': otpForm,
    'product-selector-form': productSelectorForm,
  },
  template,
};

export function fetchTemporaryData(params: TJSON): TJSON {
  const { block, path } = params;

  try {
    return data[path][block];
  } catch (err) {
    console.info('Locales not found');

    return {};
  }
}
