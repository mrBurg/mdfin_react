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
  products: Array<TProductParams>;
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
  documents: Array<TDocument>; //должно быть обязательным
};

export type TAccount = {
  accountNumber: string;
  account_id?: number;
  bank_id?: number;
  index?: number;
};

export type TAccountUnit = {
  accounts: Array<TAccount>;
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
  documentUnits?: Array<TDocumentUnit>;
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
  documentUnits?: Array<TDocumentUnit>;
  maskedName?: string;
};

// сделака из ЛК
export type TCabinetDeals = {
  dealInfos: Array<TDealInfo>;
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
  notificationIds?: Array<number>;
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

/* export type TUpdatePaymentAmountProps = {
  value: number;
}; */
