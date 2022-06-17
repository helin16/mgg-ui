type iBuffer = {
  type: string;
  data: number[] | string[];
}

type iSynPhoto = {
  ID: number;
  Photo: iBuffer;
  ModifiedDate: Date;
  ModifiedBy: string;
  SourceDesc: string;
  PhotoType: string;
  Thumbnail: iBuffer;
  MediumRes: iBuffer;
}

export default iSynPhoto;
