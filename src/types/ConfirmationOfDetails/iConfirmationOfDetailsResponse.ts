import iVStudent from '../Synergetic/Student/iVStudent';
import iSynCommunity from '../Synergetic/iSynCommunity';

export type iCODAddressInfo = {
  full: string;
  object: {
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    countryCode?: string;
  }
}

export type iCODExtraResponse = {
  syncToSynAt?: string | null;
  syncToSynById?: number | null;
  readyForSubmission?: boolean;
}

export type iCODAddressResponse =  {
  AddressID?: number,
  homeAndPostalSame: boolean,
  home: iCODAddressInfo,
  postal: iCODAddressInfo
}

export type iCODParentResponse = {
  id: number;
  description: string;
  name: string;
  relationshipToStudent: string;
  mobile: string;
  email: string;
  address: iCODAddressResponse,
  occup: {
    company: string;
    position: string;
    phone: string;
    mobile: string;
    email: string | null;
  },
  syncToSynAt?: string | null;
  syncToSynById?: number | null;
}

export type iCODParentsResponse = iCODExtraResponse & {
  main: iCODParentResponse;
  spouse?: iCODParentResponse | null;
}

export type iCODStudentResponse = iCODExtraResponse & {
  is_future: boolean;
  is_international: boolean;
  ID: number;
  Surname: string;
  Given1: string;
  Given2: string | null;
  Preferred: string | null;
  MobilePhone: string | null;
  DateOfBirth: string;
  CountryOfBirthCode: string;
  NationalityCode: string;
  ReligionCode: string;
  HomeLanguageCode: string | number;
  IndigenousFlag: boolean | number;
  StudentTSIFlag: boolean | number;
  StudentsVisaType: string | null;
  StudentsVisaExpiryDate: string | null;
  StudentVisaNumber: string | null;
  StudentEntryYearLevel: number | string;
  StudentEntryDate: string | null;
  StudentPreviousSchool: string;
  address: iCODAddressResponse;
  isAustralian: boolean;
  syncToSynAt?: string | null;
  syncToSynById?: number | null;
  readyForSubmission?: boolean;
}

export type iCODResponseAsset = {
  key: string | null;
  name: string;
  url: string;
  mimeType?: string;
  size?: number;
}

export type iCODCourtOrderResponse = iCODExtraResponse & {
  hasCourtOrders: boolean;
  newDetails: null | string;
  courtOrderDate?: null | string;
  courtOrderType?: null | string;
  newCourtOrderFiles: iCODResponseAsset[];
  syncToSynAt?: string | null;
  syncToSynById?: number | null;
}

export type iCODMedicalResponse = iCODExtraResponse & {
  allowIbuprofen: boolean;
  immunisation: {
    hasSetOutToAusSchedule: boolean;
    ImmunisationFormDate?: string;
    ImmunisationFormStatus?: string;
    ImmunisationOtherDetails?: string;
    historyStatementFiles?: iCODResponseAsset[];
    gpLetterFiles?: iCODResponseAsset[];
  },
  syncToSynAt?: string | null;
  syncToSynById?: number | null;
}

export type iCODSiblingResponse = {
  name: string;
  id?: string | number;
  birthDate?: string;
  gender?: string;
  schoolCode?: string;
  yearLevelCode?: string;
}

export type iCODGovernmentFundingParentResponse = {
  ID: number;
  full_name: string;
  relationship: string;
  homeLanguageCode: string;
  secondary: string;
  tertiary: string;
  occupationGroup: string;
}

export type iCODGovernmentFundingResponse = iCODExtraResponse & {
  parent1: iCODGovernmentFundingParentResponse;
  parent2?: iCODGovernmentFundingParentResponse;
}

export type iCODPermissionsResponse = iCODExtraResponse & {
  excursionChecked: boolean;
  allowParentAssociation: boolean
  allowReceivingSMS: boolean
  agreeParentConsent: boolean
  agreeSchoolCommitment: boolean
  agreeLawfulAuthority: boolean
  agreePrivacyPolicy: boolean
  signature: string;
}

export type iCODSubmittedResponse = {
  student?: iCODStudentResponse;
  parent?: iCODParentsResponse;
  courtOrder?: iCODCourtOrderResponse;
  medicalDetails?: iCODMedicalResponse;
  siblings?: iCODSiblingResponse[];
  governmentFunding?: iCODGovernmentFundingResponse;
  permissions?: iCODPermissionsResponse;
}

type iConfirmationOfDetailsResponse = {
  id: number;
  StudentID: number;
  AuthorID: number;
  response: iCODSubmittedResponse | null;
  submittedAt: Date | string | null;
  submittedById: number;
  canceledAt: Date | string | null;
  canceledById: number | null;
  active: boolean;
  createdAt: Date | string | null;
  createdById: number;
  updatedAt: Date | string | null;
  updatedById: number;
  isCurrent: boolean;
  syncToSynAt: Date | string | null;
  syncToSynById: number | null;
  submittedResponse: iCODSubmittedResponse | null;
  Student?: iVStudent | null;
  SubmittedBy?: iSynCommunity | null;
  CanceledBy?: iSynCommunity | null;
  CreatedBy?: iSynCommunity | null;
  UpdatedBy?: iSynCommunity | null;
  SyncToSynBy?: iSynCommunity | null;
}

export default iConfirmationOfDetailsResponse;
