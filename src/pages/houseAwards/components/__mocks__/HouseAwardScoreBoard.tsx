import ComponentTestHelper from '../../../../__tests__/helper/ComponentTestHelper';

const {key, testId} = ComponentTestHelper.getKeyAndTestId('HouseAwardScoreBoard');

export const HouseAwardScoreBoardKey = key;
export const HouseAwardScoreBoardTestId = testId;

const HouseAwardScoreBoard = ComponentTestHelper.mockComponent(
  HouseAwardScoreBoardKey,
  HouseAwardScoreBoardTestId
);

export default HouseAwardScoreBoard;
