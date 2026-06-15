import ComponentTestHelper from '../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('ClipboardMusicSyncPage');

export const ClipboardMusicSyncPageKey = key;
export const ClipboardMusicSyncPageTestId = testId;

const ClipboardMusicSyncPage = ComponentTestHelper.mockComponent(
  ClipboardMusicSyncPageKey,
  ClipboardMusicSyncPageTestId
);

export default ClipboardMusicSyncPage;
