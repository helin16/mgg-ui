import React from 'react';
import ComponentTestHelper from '../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ExplanationPanel');

export const ExplanationPanelKey = key;
export const ExplanationPanelTestId = testId;

const BaseExplanationPanel = ComponentTestHelper.mockComponent(
  ExplanationPanelKey,
  ExplanationPanelTestId
);

const ExplanationPanel = (props: any) => {
  BaseExplanationPanel(props);

  return (
    <div data-testid={ExplanationPanelTestId}>
      {props.text}
      {props.children}
    </div>
  );
};

export default ExplanationPanel;
