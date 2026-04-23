type iSynVStudentParent =  {
  ID: number;
  Parent1ID: number | null;
  Parent1Gender: string | null;
  Parent1GenderSynergyMeaning: string | null;
  Parent2ID: number | null;
  Parent2Gender: string | null;
  Parent2GenderSynergyMeaning: string | null;
  FatherID: number | null;
  MotherID: number | null;
}

export default iSynVStudentParent;
