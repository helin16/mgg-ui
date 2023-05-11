import styled from 'styled-components';
import {mainRed} from '../../AppWrapper';
import MathHelper from '../../helper/MathHelper';
import * as Icons from 'react-bootstrap-icons';
import {useEffect, useState} from 'react';
import mathHelper from '../../helper/MathHelper';

const overLineOffset = 46;
const pointerWidth = 12;


type iComparativeBarGraph = {
  cohortScores: number[];
  currentStudentScore: number;
  height?: number;
}
const ComparativeBarGraph = ({cohortScores, currentStudentScore, height = 46}: iComparativeBarGraph) => {
  const [cohortScoreMap, setCohortScoreMap] = useState<{[key: number]: number}>({});
  const [currentStudentScoreWidth, setCurrentStudentScoreWidth] = useState<number>(0);
  const Wrapper = styled.div`
    padding: 1rem;
    max-width: 700px;
    width: 100%;
    position: relative;
    
    .stacked-bars {
      width: 100%;
      display: flex;
      position: relative;
      .start {
        position: absolute;
        top: -18px;
        left: -9px;
      }
      .bar {
        position: relative;
        background-color: ${mainRed};
        height: ${height}px;
        min-width: 20px;
        flex-grow: 1;
        border-right: 0.1rem #eee solid;
        
        &:nth-child(2) {
          border-top-left-radius: ${Math.ceil(MathHelper.sub(height, 2))}px;
          border-bottom-left-radius: ${Math.ceil(MathHelper.sub(height, 2))}px;
        }
        &:nth-last-child(2) {
          border-top-right-radius: ${Math.ceil(MathHelper.sub(height, 2))}px;
          border-bottom-right-radius: ${Math.ceil(MathHelper.sub(height, 2))}px;
        }
        
        .txt {
          position: absolute;
          top: -18px;
          right: -15px;
        }
      }

      .pointer {
        position: absolute;
        color: white;
        bottom: 2px;
        display: inline-block;
        width: ${pointerWidth}px;
        text-align: center;
      }
    }
    
    .over-line {
      position: absolute;
      //width: calc(100% - ${MathHelper.mul(overLineOffset, 2)}px);
      height: 2px;
      background-color: #D88595;
      // left: ${overLineOffset}px;
      // right: ${overLineOffset}px;
      top: ${MathHelper.sub(overLineOffset, 6)}px;
      
      .start,
      .end{
        position: absolute;
        display: inline-block;
        background-color: #D88595;
        height: 10px;
        width: 10px;
        top: -4px;
        border-radius: 5px;
      }
      .start {
        left: -5px;
      }
      .end{
        right: -5px;
      }
    }
`;

  useEffect(() => {
    const sortedCohortScores = cohortScores.sort();
    const maxDiff = MathHelper.sub(sortedCohortScores.at(-1) || 100, sortedCohortScores[0]);
    setCohortScoreMap(sortedCohortScores.reduce((map, score, index) => {
      return {
        ...map,
        [score]: index === 0 ? 0 : MathHelper.mul(MathHelper.div(MathHelper.sub(score, sortedCohortScores[index - 1] || 0), maxDiff), 100),
      }
    }, {}));
    const width = MathHelper.mul(MathHelper.div(MathHelper.sub(currentStudentScore, sortedCohortScores[0]), maxDiff), 100);

    setCurrentStudentScoreWidth(width <= 0 ? 0 : width)
  }, [cohortScores, currentStudentScore])


  const getCurrentPointerStyle = () => {
    const sortedCohortScores = cohortScores.sort();
    const cohortScorePercentage = Object.values(cohortScoreMap)
    if (currentStudentScore <= sortedCohortScores[1]) {
      return { left: `calc(${cohortScorePercentage[1] || 0}% - ${mathHelper.add(MathHelper.div(pointerWidth, 2), 19)}px)`};
    }
    const lastScore = sortedCohortScores.at(-2) || 100;
    const rightPercentage = cohortScorePercentage.at(-1) || 0
    if (currentStudentScore >= lastScore) {
      return { right: `calc(${rightPercentage}% - ${mathHelper.add(MathHelper.div(pointerWidth, 2), 19)}px)`};
    }

    return {left: `${currentStudentScoreWidth}%`};
  }

  const getOverLineStyle = () => {
    const cohortScorePercentage = Object.values(cohortScoreMap);
    if (cohortScorePercentage.length <= 1) {
      return {};
    }
    const leftPercentage = cohortScorePercentage[1] || 0;
    const rightPercentage = cohortScorePercentage.at(-1) || 0
    return {
      left: `calc(${leftPercentage}% - 10px)`,
      right: `calc(${rightPercentage}% - 10px)`,
    }
  }

  if (cohortScores.length < 3 || Object.values(cohortScoreMap).length <= 0) {
    return null;
  }

  return (
    <Wrapper>
      <div className={'stacked-bars'}>
        {Object.keys(cohortScoreMap).map((score, index) => {
          if (index === 0) {
            return <div className={'start'} key={index}>{score}%</div>;
          }
          return (
            // @ts-ignore
            <div className={'bar'} key={index} style={{ width: `${cohortScoreMap[score]}%`}}>
              <div className={'txt'}>{score}%</div>
            </div>
          )
        })}
        <div className={'pointer'} style={getCurrentPointerStyle()} title={`Your Daughter`}>
          <Icons.TriangleFill />
        </div>
      </div>
      <div className={'over-line'} style={getOverLineStyle()}>
        <div className={'start'}/>
        <div className={'end'}/>
      </div>
    </Wrapper>
  )
}

export default ComparativeBarGraph;
