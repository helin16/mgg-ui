import AppLoader from './AppLoader';

const SCHOOL_BOX_APP_HTML_ID = 'mgg-root';
export default class SchoolBoxAppLoader {
  #checkAndInitHtml() {
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

  init(appScriptUrl: string){
    const loadCss = this.#checkAndInitHtml();
    (new AppLoader()).init(appScriptUrl, loadCss, true);
  }
}
