export default class AppLoader {
    #renderScripts(BASE_URL, mainJsUrl, mainCssUrl, loadCss = false, loadManifest = false) {
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
    }
    ;
    #fetchData(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        // xhr.responseType = 'json';
        xhr.onload = function () {
            const status = xhr.status;
            callback(status, xhr.response);
        };
        xhr.send(null);
    }
    ;
    init(appJsScriptUrl, loadCss = true, loadManifest = true) {
        this.#fetchData(`${appJsScriptUrl}/asset-manifest.json`, (status, response) => {
            if (status !== 200) {
                return null;
            }
            try {
                const responseObj = JSON.parse(response);
                if (responseObj.files) {
                    const mainJsString = `${responseObj.files["main.js"]}`.trim();
                    const mainCssString = `${responseObj.files["main.css"]}`.trim();
                    this.#renderScripts(appJsScriptUrl, mainJsString, mainCssString, loadCss, loadManifest);
                }
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    ;
}
