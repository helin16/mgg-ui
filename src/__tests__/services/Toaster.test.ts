import {toast} from 'react-toastify';
import Toaster, {TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS} from '../../services/Toaster';

jest.mock('react-toastify', () => ({
  toast: jest.fn(),
}));

const mockedToast = toast as jest.Mock;

describe('Toaster', () => {
  beforeEach(() => {
    mockedToast.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('showToast forwards the message and merged options', () => {
    Toaster.showToast('Saved', TOAST_TYPE_SUCCESS, {autoClose: 1000});

    expect(mockedToast).toHaveBeenCalledWith('Saved', {
      autoClose: 1000,
      theme: 'colored',
      type: TOAST_TYPE_SUCCESS,
    });
  });

  test('showApiError logs and shows the API error message', () => {
    Toaster.showApiError({
      message: 'Fallback',
      response: {
        data: {
          message: 'Request failed',
        },
      },
    });

    expect(console.error).toHaveBeenCalled();
    expect(mockedToast).toHaveBeenCalledWith('Request failed', {
      theme: 'colored',
      type: TOAST_TYPE_ERROR,
    });
  });

  test('showApiError falls back to the top-level error message', () => {
    Toaster.showApiError({
      message: 'Fallback only',
      response: {
        data: {},
      },
    });

    expect(mockedToast).toHaveBeenCalledWith('Fallback only', {
      theme: 'colored',
      type: TOAST_TYPE_ERROR,
    });
  });
});
