import React from 'react';
import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('AssetListPanel');

export const AssetListPanelKey = key;
export const AssetListPanelTestId = testId;

const AssetListPanel = (props: any) => {
  ComponentTestHelper.mockComponent(
    AssetListPanelKey,
    AssetListPanelTestId
  )(props);

  return (
    <div data-testid={AssetListPanelTestId}>
      <button type="button" onClick={() => props?.onSelect?.(['asset-1'])}>
        Select Asset
      </button>
      <button type="button" onClick={() => props?.onFolderSelected?.(['folder-1'])}>
        Select Folder
      </button>
    </div>
  );
};

export default AssetListPanel;
