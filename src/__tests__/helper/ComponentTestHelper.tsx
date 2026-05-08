import React, {ReactNode} from 'react';
import {cleanup, render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

type CalledParamsMap = {
  [key: string]: any[];
};

let calledParams: CalledParamsMap = {};

const add = (key: string, params: any) => {
  if (!(key in calledParams)) {
    calledParams[key] = [];
  }
  calledParams[key].push(params);
};

const get = (key: string) => {
  return calledParams[key] || [];
};

const reset = () => {
  calledParams = {};
};

const mockComponent =
  (
    key: string,
    testId: string,
    childrenParams: any = {}
  ) =>
  (props: any) => {
    add(key, props);

    if (props && typeof props === 'object' && 'children' in props) {
      return (
        <div data-testid={testId}>
          {typeof props.children === 'function'
            ? props.children(childrenParams)
            : props.children}
        </div>
      );
    }

    return <div data-testid={testId} />;
  };

const renderWithRouter = (children: ReactNode) => {
  return render(<MemoryRouter>{children}</MemoryRouter>);
};

const getKeyAndTestId = (prefix: string) => {
  return {
    key: `${prefix}Key`,
    testId: `${prefix}TestId`,
    childrenParams: {fakerHeaderProp: `${prefix} children props`},
  };
};

const getChildren = () => {
  const childrenTestId = 'children-test-id';
  return {
    childrenTestId,
    children: <div data-testid={childrenTestId} />,
  };
};

const prepare = () => {
  beforeAll(() => {
    global.ResizeObserver = class {
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    } as any;
  });

  beforeEach(() => {
    reset();
    cleanup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete (global as any).ResizeObserver;
  });
};

const ComponentTestHelper = {
  get,
  getChildren,
  getKeyAndTestId,
  mockComponent,
  prepare,
  renderWithRouter,
  reset,
};

export default ComponentTestHelper;
