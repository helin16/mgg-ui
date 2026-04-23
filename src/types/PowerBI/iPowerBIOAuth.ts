type iPowerBIOAuth = {
  token_type: string;
  scope: string;
  expires_in: number;
  ext_expires_in: number;
  expires_on: number;
  not_before: number;
  resource: string; // url
  access_token: string;
};

export default iPowerBIOAuth;
