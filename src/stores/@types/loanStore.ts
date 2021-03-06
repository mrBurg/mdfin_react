export type TProductSelectorData = {
  productId: number;
  term: number;
  amount: number;
};

export type TLoanData = {
  totalAmount?: number;
  dateFrom?: string;
  dateTo?: string;
  advisoryFee?: number;
  informationServicesFee?: number;
  extensionAmount?: number;
} & TProductSelectorData;

export type TProductParams = {
  id: number;
  minTerm: number;
  maxTerm: number;
  termStep: number;
  termFraction: string;
  minAmount: number;
  maxAmount: number;
  amountStep: number;
  currency: string;
  defaultAmount: number;
  defaultTerm: number;
};

export type TProductsParams = {
  products: TProductParams[];
};

export type TDocument = {
  id: number;
  index: number;
  filename: string;
  url: string;
};

export type TDocumentUnit = {
  type_id: number;
  type: string;
  index: number;
  valid: boolean;
  full: boolean;
  documents: TDocument[];
};

export type TAccountsFormStatic = {
  isPresent: {
    title: string;
  };
  notPresent: {
    title: string;
  };
  buttons: {
    add: string;
    select: string;
    enter: string;
    confirm: string;
  };
};

export type TAttachmentsFormStatic = {
  isPresent: {
    title: string;
    buttons: {
      idFront: string;
      idBack: string;
      selfie: string;
      other: string;
    };
  };
  notPresent: {
    title: string;
    buttons: {
      idFront: string;
      idBack: string;
      selfie: string;
      other: string;
    };
  };
};

export type TProductSelectorFormStatic = {
  notification: string;
  loanAmountText: string;
  totalAmountText: string;
  loanTermText: string;
  termsAndCondition: string;
  signIn: string;
  registerLoan: string;
  paymentDateText: string;
};

export type TAccount = {
  accountNumber: string;
  account_id?: number;
  bank_id?: number;
  index?: number;
};

export type TAccountUnit = {
  accounts: TAccount[];
  editable: boolean;
  selectedAccount_id: number;
};

export type TReasonId = {
  reason_id?: number;
};

export type TCreditParams = {
  creditParams: TLoanData;
  appnum?: string;
};

export type TCabinetApplication = {
  application?: TCreditParams;
  accountUnit?: TAccountUnit;
  documentUnits?: TDocumentUnit[];
  notification?: string;
};

export type TDealInfo = {
  dealNo: string;
  closingDate: string;
  closingAmount: number;
  extensionAmount: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  paymentAmount: number;
  documentUnits?: TDocumentUnit[];
  maskedName?: string;
};

// сделака из ЛК
export type TCabinetDeals = {
  dealInfos: TDealInfo[];
};

//сделка из сайта (страница repayment)
export type TCabinetDeal = {
  dealInfo: TDealInfo;
};

export type TCabinetNotify = {
  id?: number;
  text?: string;
  displayConfirmation?: boolean;
  closable?: boolean;
};

export type TNotificationIds = {
  notificationIds?: number[];
};

export type TUpdateAccountProps = {
  name: string;
  value: any;
};

export type TAppDealParams = any;

export type TCabinetPay = {
  dealNo: string;
  paymentAmount: number;
  inCabinet: boolean;
};
