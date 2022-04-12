type iSBFolder = {
  id: number;
  name: string;
  parent: number;
  deleted_at: Date | null;
  inherit: boolean;
  image_hash: string | null;
  colour: string | null;
}

export default iSBFolder;
