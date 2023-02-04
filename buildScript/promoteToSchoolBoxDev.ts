import * as fs from 'fs';
// import { Client } from 'node-scp'
import {exec} from 'child_process';

const schoolBoxStaticAssetUrlPath = '/static/mggs';
// const SCHOOLBOX_HOST = 'mconnectdev.mentonegirls.vic.edu.au';
const SCHOOLBOX_HOST = '10.114.37.40';
// const SCHOOLBOX_PORT = 22;
const SCHOOLBOX_STATIC_ASSET_FOLDER = '/usr/share/schoolbox/www/';
const SCHOOLBOX_USERNAME = 'alaress';
// const SCHOOLBOX_PRIRVATE_KEY_FILE = '/Users/helin16/.ssh/id_rsa';
const SCHOOLBOX_IFRAME_HTML_FILE = '/usr/share/schoolbox/templates/core/modules/remote/frame.html';
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
  const commandToUploadAllFiles = `scp -r ${getBuildFolder()}* ${SCHOOLBOX_USERNAME}@${SCHOOLBOX_HOST}:${SCHOOLBOX_STATIC_ASSET_FOLDER}${schoolBoxStaticAssetUrlPath}/;`;
  const commandToUploadFrameFile = `scp ${getBuildFolder()}schoolBox.html ${SCHOOLBOX_USERNAME}@${SCHOOLBOX_HOST}:${SCHOOLBOX_IFRAME_HTML_FILE};`;
  const commandToUploadRunningFrameFile = `scp ${getBuildFolder()}schoolBox.html ${SCHOOLBOX_USERNAME}@${SCHOOLBOX_HOST}:${SCHOOLBOX_IFRAME_HTML_RUNNING_FILE};`;
  exec(`${commandToUploadAllFiles} ${commandToUploadFrameFile} ${commandToUploadRunningFrameFile}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  // try {
  //   const client = await Client({
  //     host: SCHOOLBOX_HOST,
  //     port: SCHOOLBOX_PORT,
  //     username: SCHOOLBOX_USERNAME,
  //     // password: 'password',
  //     privateKey: fs.readFileSync(SCHOOLBOX_PRIRVATE_KEY_FILE),
  //     // passphrase: 'your key passphrase',
  //   })
  //   await client.uploadDir(`${getBuildFolder()}`, `${SCHOOLBOX_STATIC_ASSET_FOLDER}${schoolBoxStaticAssetUrlPath}/`);
  //   await client.uploadFile(`${getBuildFolder()}/schoolBox.html`, SCHOOLBOX_IFRAME_HTML_FILE);
  //   await client.uploadFile(`${getBuildFolder()}/schoolBox.html`, SCHOOLBOX_IFRAME_HTML_RUNNING_FILE);
  //   client.close() // remember to close connection after you finish
  // } catch (e) {
  //   console.error(e)
  // }
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
