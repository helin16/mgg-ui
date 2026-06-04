// @ts-ignore
class AppLoader {
  #renderScripts(
    BASE_URL: string,
    mainJsUrl: string,
    mainCssUrl: string,
    loadCss = false,
    loadManifest = false
  ){
    const manifestId = "mgg-app-manifest";
    const cssId = "mgg-app-css";
    const jsId = "mgg-app-js";
    const header = document.getElementsByTagName("head")[0];
    if (!header) {
      return;
    }

    if (loadManifest === true && !document.getElementById(manifestId)) {
      const manifest = document.createElement("link");
      manifest.id = manifestId;
      // @ts-ignore
      manifest.ref = "manifest";
      manifest.href = `${BASE_URL}/manifest.json`;
      header.appendChild(manifest);
    }

    if (loadCss === true && !document.getElementById(cssId)) {
      const mainCss = document.createElement("link");
      mainCss.id = cssId;
      mainCss.rel = "stylesheet";
      mainCss.type = "text/css";
      mainCss.href = `${BASE_URL}${mainCssUrl}`;
      header.appendChild(mainCss);
    }

    if (!document.getElementById(jsId)) {
      const mainJs = document.createElement("script");
      mainJs.id = jsId;
      mainJs.defer = true;
      mainJs.async = true;
      mainJs.src = `${BASE_URL}${mainJsUrl}`;
      document.body.appendChild(mainJs);
    }
  };

  #fetchData(
    url: string,
    callback: (status: number, resp: any) => void
  ){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    // xhr.responseType = 'json';
    xhr.onload = function() {
      const status = xhr.status;
      callback(status, xhr.response);
    };
    xhr.send(null);
  };

  init(
    appJsScriptUrl: string,
    loadCss = true,
    loadManifest = true
  ){
    this.#fetchData(
      `${appJsScriptUrl}/asset-manifest.json?${Date.now()}`,
      (status: number, response: any) => {
        if (status !== 200) {
          return null;
        }
        try {
          const responseObj = JSON.parse(response);
          if (responseObj.files) {
            const mainJsString = `${responseObj.files["main.js"]}`.trim();
            const mainCssString = `${responseObj.files["main.css"]}`.trim();
            this.#renderScripts(
              appJsScriptUrl,
              mainJsString,
              mainCssString,
              loadCss,
              loadManifest
            );
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };
}

type iSchoolBoxAppLoaderConfig = {
  bypassHosts?: string[];
};

// @ts-ignore
class SchoolBoxAppLoader {
  #SCHOOL_BOX_APP_HTML_ID ='mgg-root'
  #REMOTE_IFRAME_SELECTOR = 'iframe#remote'

  #getRemoteIframe() {
    return document.querySelector(this.#REMOTE_IFRAME_SELECTOR);
  }

  #getNormalizedHosts(config: iSchoolBoxAppLoaderConfig = {}) {
    const hosts = Array.isArray(config?.bypassHosts) ? config.bypassHosts : [];
    return hosts
      .map(host => `${host || ''}`.trim().toLowerCase())
      .filter(host => host !== '');
  }

  #getDecodedRemoteUrl() {
    const iFrame = this.#getRemoteIframe();
    // @ts-ignore
    const remoteSrc = `${iFrame?.src || ''}`.trim();
    if (remoteSrc === '') {
      return null;
    }
    try {
      const url = new URL(remoteSrc);
      console.log('url', url);
      const matched = url.pathname.match(/^\/modules\/remote\/([^/?#]+)/);
      if (!matched || !matched[1]) {
        return null;
      }
      return atob(decodeURIComponent(matched[1]));
    } catch (error) {
      return null;
    }
  }

  #shouldBypassLoader(config: iSchoolBoxAppLoaderConfig = {}) {
    const allowedHosts = this.#getNormalizedHosts(config);
    if (allowedHosts.length <= 0) {
      return false;
    }

    const decodedRemoteUrl = this.#getDecodedRemoteUrl();
    if (!decodedRemoteUrl) {
      return false;
    }

    try {
      const decodedHost = `${new URL(decodedRemoteUrl).hostname || ''}`.trim().toLowerCase();
      return allowedHosts.includes(decodedHost);
    } catch (error) {
      return false;
    }
  }

  #checkAndInitHtml() {
    const iFrame = this.#getRemoteIframe();
    if (iFrame) {
      // @ts-ignore
      iFrame.style.display = 'none';
      const reactDiv = document.createElement("div");
      reactDiv.setAttribute('id', this.#SCHOOL_BOX_APP_HTML_ID);
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

  init(appScriptUrl: string, config: iSchoolBoxAppLoaderConfig = {}){
    if (this.#shouldBypassLoader(config)) {
      return;
    }
    const loadCss = this.#checkAndInitHtml();
    (new AppLoader()).init(appScriptUrl, loadCss, true);
  }
}
