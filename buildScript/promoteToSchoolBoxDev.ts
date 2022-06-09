import * as fs from 'fs';
import { Client } from 'node-scp'

const schoolBoxStaticAssetUrlPath = '/static/mggs';
// const SCHOOLBOX_DEV_HOST = 'mconnectdev.mentonegirls.vic.edu.au';
const SCHOOLBOX_DEV_HOST = '10.114.37.40';
const SCHOOLBOX_DEV_PORT = 22;
const SCHOOLBOX_DEV_STATIC_ASSET_FOLDER = '/usr/share/schoolbox/www/';
const SCHOOLBOX_DEV_USERNAME = 'alaress';
const SCHOOLBOX_DEV_PRIRVATE_KEY_FILE = '/Users/helin16/.ssh/id_rsa';
const SCHOOLBOX_DEV_IFRAME_HTML_FILE = '/usr/share/schoolbox/templates/core/modules/remote/frame.html';
const SCHOOLBOX_IFRAME_HTML_RUNNING_FILE = '/usr/share/schoolbox/templates/core/modules/remote/frame.html';

const getBuildFolder = () => {
  return `${__dirname}/../build/`
}

const readManifestJson = () => {
  const rawData = fs.readFileSync(`${getBuildFolder()}asset-manifest.json`);
  // @ts-ignore
  return JSON.parse(rawData);
}

const replaceSchoolBoxIndex = async (mainCssPath: string, mainJsPath: string) => {
  const rawData = fs.readFileSync(`${__dirname}/schoolBox.html`, {encoding:'utf8', flag:'r'});
  const replacedData = rawData
    .replace(/%SCHOOLBOX_ASSET_PATH%/g, schoolBoxStaticAssetUrlPath)
    .replace(/%MAIN_CSS%/g, mainCssPath)
    .replace(/%MAIN_JS%/g, mainJsPath);
  await fs.writeFileSync(`${getBuildFolder()}/schoolBox.html`, replacedData, {encoding:'utf8'});
}

const uploadAssets = async () => {
  try {
    const client = await Client({
      host: SCHOOLBOX_DEV_HOST,
      port: SCHOOLBOX_DEV_PORT,
      username: SCHOOLBOX_DEV_USERNAME,
      // password: 'password',
      privateKey: fs.readFileSync(SCHOOLBOX_DEV_PRIRVATE_KEY_FILE),
      // passphrase: 'your key passphrase',
    })
    await client.uploadDir(`${getBuildFolder()}`, `${SCHOOLBOX_DEV_STATIC_ASSET_FOLDER}${schoolBoxStaticAssetUrlPath}/`);
    await client.uploadFile(`${getBuildFolder()}/schoolBox.html`, SCHOOLBOX_DEV_IFRAME_HTML_FILE);
    await client.uploadFile(`${getBuildFolder()}/schoolBox.html`, SCHOOLBOX_IFRAME_HTML_RUNNING_FILE);
    client.close() // remember to close connection after you finish
  } catch (e) {
    console.error(e)
  }
}

const PromoteToSchoolBox = async () => {
  const {files} = await readManifestJson();
  const mainCssPath = files['main.css'];
  const mainJsPath = files['main.js'];

  await replaceSchoolBoxIndex(mainCssPath, mainJsPath);
  await uploadAssets();
};

if (require.main === module) {
  PromoteToSchoolBox();
}

export default PromoteToSchoolBox;
