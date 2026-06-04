import fs from 'fs';
import path from 'path';
import vm from 'vm';
import ts from 'typescript';

type iRunLoaderOptions = {
  config?: Record<string, any>;
  moduleResponse?: {
    status: number;
    body: string;
  };
  remoteSrc?: string;
};

type iRecordedRequest = {
  method?: string;
  url?: string;
  asyncFlag?: boolean;
  headers: Record<string, string>;
};

const loaderSourcePath = path.resolve(process.cwd(), 'AppLoader/src/MggAppLoader.ts');

const compileLoaderSource = () => {
  const source = fs.readFileSync(loaderSourcePath, 'utf8');
  const {outputText} = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.None,
    },
  });
  return outputText;
};

const getRemoteUrl = (targetUrl = 'https://www.mcbschools.com/Integration/mentonegirls/schoolboxstaff') => {
  return `https://schoolbox.example/modules/remote/${Buffer.from(targetUrl).toString('base64')}`;
};

const runLoader = ({
  config = {},
  moduleResponse = {
    status: 200,
    body: JSON.stringify({settings: {bypassHosts: ['www.mcbschools.com']}}),
  },
  remoteSrc = getRemoteUrl(),
}: iRunLoaderOptions = {}) => {
  const compiledSource = compileLoaderSource();
  const requests: iRecordedRequest[] = [];
  const headChildren: any[] = [];
  const bodyChildren: any[] = [];
  const createdElements: any[] = [];
  const iframe = {
    id: 'remote',
    src: remoteSrc,
    style: {},
    nextSibling: null,
    parentNode: {
      appendChild: jest.fn(),
      insertBefore: jest.fn(),
    },
  };
  const header = {
    appendChild: (node: any) => headChildren.push(node),
  };
  const body = {
    appendChild: (node: any) => bodyChildren.push(node),
  };

  const context = {
    URL,
    atob: (value: string) => Buffer.from(value, 'base64').toString('binary'),
    decodeURIComponent,
    console,
    document: {
      body,
      getElementsByTagName: (tagName: string) => tagName === 'head' ? [header] : [],
      getElementById: () => null,
      querySelector: (selector: string) => selector === 'iframe#remote' ? iframe : null,
      createElement: (tagName: string) => {
        const element: any = {
          tagName,
          style: {},
          children: [],
          setAttribute(name: string, value: string) {
            this[name] = value;
          },
          appendChild(child: any) {
            this.children.push(child);
          },
        };
        createdElements.push(element);
        return element;
      },
    },
    XMLHttpRequest: function XMLHttpRequest(this: any) {
      const request: iRecordedRequest = {headers: {}};
      this.open = (method: string, url: string, asyncFlag: boolean) => {
        request.method = method;
        request.url = url;
        request.asyncFlag = asyncFlag;
      };
      this.setRequestHeader = (key: string, value: string) => {
        request.headers[key] = value;
      };
      this.send = () => {
        requests.push(request);
        if ((request.url || '').includes('/syn/mggsModule/')) {
          this.status = moduleResponse.status;
          this.response = moduleResponse.body;
        } else {
          this.status = 200;
          this.response = JSON.stringify({
            files: {
              'main.js': '/static/js/main.js',
              'main.css': '/static/css/main.css',
            },
          });
        }
        this.onload();
      };
      this.onload = () => {};
    },
  };

  vm.createContext(context);
  vm.runInContext(compiledSource, context);
  vm.runInContext(
    `(new SchoolBoxAppLoader()).init('https://app.example.test', ${JSON.stringify(config)})`,
    context
  );

  return {
    requests,
    iframe,
    headChildren,
    bodyChildren,
    createdElements,
  };
};

describe('SchoolBoxAppLoader', () => {
  test('keeps current behaviour when no bypass config is provided', () => {
    const result = runLoader();

    expect(result.iframe.style.display).toBe('none');
    expect(result.requests).toEqual([
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('https://app.example.test/asset-manifest.json?'),
        asyncFlag: false,
        headers: {},
      }),
    ]);
    expect(result.createdElements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'mgg-root',
          'data-url': getRemoteUrl(),
        }),
      ])
    );
  });

  test('bypasses loader takeover for direct bypassHosts matches', () => {
    const result = runLoader({
      config: {
        bypassHosts: ['www.mcbschools.com'],
      },
    });

    expect(result.iframe.style.display).toBeUndefined();
    expect(result.requests).toEqual([]);
    expect(result.createdElements).toEqual([]);
  });

  test('loads bypass hosts from the module settings API', () => {
    const result = runLoader({
      config: {
        apiBaseUrl: 'https://api.example.test',
        appToken: 'token-123',
        moduleId: 11,
        settingsKey: 'bypassHosts',
      },
    });

    expect(result.requests).toEqual([
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.example.test/syn/mggsModule/11',
        asyncFlag: false,
        headers: {
          'X-MGGS-TOKEN': 'token-123',
        },
      }),
    ]);
    expect(result.iframe.style.display).toBeUndefined();
  });

  test('fails closed to the current behaviour when module settings lookup fails', () => {
    const result = runLoader({
      config: {
        apiBaseUrl: 'https://api.example.test',
        appToken: 'token-123',
        moduleId: 11,
        settingsKey: 'bypassHosts',
      },
      moduleResponse: {
        status: 500,
        body: '{}',
      },
    });

    expect(result.requests).toEqual([
      expect.objectContaining({
        url: 'https://api.example.test/syn/mggsModule/11',
      }),
      expect.objectContaining({
        url: expect.stringContaining('https://app.example.test/asset-manifest.json?'),
      }),
    ]);
    expect(result.iframe.style.display).toBe('none');
  });
});
