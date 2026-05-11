import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CampusDisplayDraggableSlides from '../../../../components/CampusDisplay/DisplaySlide/CampusDisplayDraggableSlides';

jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({children}: any) => <div>{children}</div>,
  Droppable: ({children}: any) => children({innerRef: jest.fn(), droppableProps: {}, placeholder: null}),
  Draggable: ({children}: any) => children({innerRef: jest.fn(), draggableProps: {}, dragHandleProps: {}}),
}));
jest.mock('../../../../components/Asset/AssetThumbnail');
jest.mock('../../../../components/CampusDisplay/DisplaySlide/CampusDisplaySlideCreatePopupBtn');

describe('CampusDisplayDraggableSlides', () => {
  test('renders slides and forwards click / selection events', async () => {
    const onSlideClick = jest.fn();
    const onSlidesSelected = jest.fn();

    render(
      <CampusDisplayDraggableSlides
        campusDisplay={{id: 'display-1'} as any}
        slides={[{id: 'slide-1', Asset: {}}] as any}
        onSlidesReordered={jest.fn()}
        onSlideClick={onSlideClick}
        onSlidesSelected={onSlidesSelected}
      />
    );

    await userEvent.click(screen.getByTestId('AssetThumbnailTestId').parentElement as HTMLElement);
    expect(onSlideClick).toHaveBeenCalledWith(expect.objectContaining({id: 'slide-1'}));
    expect(onSlidesSelected).toHaveBeenCalledWith([expect.objectContaining({id: 'slide-1'})]);
  });
});
