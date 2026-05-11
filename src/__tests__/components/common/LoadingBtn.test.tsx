import React from 'react';
import {render, screen} from '@testing-library/react';
import LoadingBtn from '../../../components/common/LoadingBtn';

describe('LoadingBtn', () => {
  test('renders children when not loading and spinner when loading', () => {
    const {rerender} = render(<LoadingBtn>Save</LoadingBtn>);

    expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument();

    rerender(<LoadingBtn isLoading>Save</LoadingBtn>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
