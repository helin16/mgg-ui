import iSynCommunity from '../iSynCommunity';
import iSynLuImmunisationFormStatus from '../Lookup/iSynLuImmunisationFormStatus';

type iSynMedicalDetails = {
  MedicalDetailsSeq: number;
  ID: number;
  AmbulanceFlag: boolean | null;
  AmbulanceNo: string | null;
  BloodGroup: string | null;
  DisabilityLevel: string | null
  HealthCareCardExpiryDate: Date | string | null;
  HealthCareCardFlag: boolean | null;
  HealthCareCardNo: string | null;
  ImmunisationFormDate: Date | string | null;
  ImmunisationFormFlag: boolean | null;
  ImmunisationFormStatus: string | null;
  ImmunisationOtherDetails: string | null;
  MedicareExpiryDate: Date | string | null;
  MedicareLineNo: number | null;
  MedicareNo: string | null;
  PrivateHealthFundExpiryDate: Date | string | null;
  PrivateInsuranceExtraCoverFlag: boolean | null;
  PrivateInsuranceFlag: boolean | null;
  PrivateInsuranceFund: string | null;
  PrivateInsuranceNo: string | null;
  PrivateInsuranceTable: string | null;
  ModifiedBy: string | null;
  ModifiedDate: Date | string | null;
  SynCommunity?: iSynCommunity;
  SynLuImmunisationFormStatus?: iSynLuImmunisationFormStatus;
}

export default iSynMedicalDetails;
