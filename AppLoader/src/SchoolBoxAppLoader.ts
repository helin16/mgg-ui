import AppLoader from './AppLoader';

const SCHOOL_BOX_APP_HTML_ID = 'mgg-root';


const checkAndInitHtml = () => {
  const iFrame = document.querySelector('iframe#remote');
  if (iFrame) {
    // @ts-ignore
    iFrame.style.display = 'none';
    const reactDiv = document.createElement("div");
    reactDiv.setAttribute('id', SCHOOL_BOX_APP_HTML_ID);
    // @ts-ignore
    reactDiv.setAttribute('data-url', `${iFrame.src || ''}`);
    if(iFrame.nextSibling){
      // @ts-ignore
      iFrame.parentNode.insertBefore(reactDiv, iFrame.nextSibling);
    } else{
      // @ts-ignore
      iFrame.parentNode.appendChild(reactDiv);
    }
    return true;
  }
  return false;
}

const init = (appScriptUrl: string) => {
  const loadCss = checkAndInitHtml();
  AppLoader.init(appScriptUrl, loadCss, true);
}

const SchoolBoxAppLoader = {
  init
}

export default SchoolBoxAppLoader;
