import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import ImageWithPlaceholder, {getImagePlaceHolder} from '../../../../components/common/MultiMedia/ImageWithPlaceholder';

describe('ImageWithPlaceholder', () => {
  test('shows the placeholder until the image loads', () => {
    render(
      <ImageWithPlaceholder
        src="image.png"
        alt="Preview"
        placeholder={getImagePlaceHolder(undefined, 'Loading image')}
      />
    );

    expect(screen.getByText('Loading image')).toBeInTheDocument();

    fireEvent.load(screen.getByAltText('Preview'));
    expect(screen.queryByText('Loading image')).not.toBeInTheDocument();
  });
});
