import styled from 'styled-components';
import {mainRed} from '../../AppWrapper';
import MathHelper from '../../helper/MathHelper';
import * as Icons from 'react-bootstrap-icons';
import {useEffect, useState} from 'react';
import mathHelper from '../../helper/MathHelper';

const overLineOffset = 46;
const pointerWidth = 12;
const defaultHeight = 46;

const maxRight = 34;
const maxLeft = 34;

const Wrapper = styled.div`
    padding: 1rem;
    max-width: 700px;
    width: 100%;
    position: relative;
    
    .stacked-bars {
      width: 100%;
      display: block;
      position: relative;
      border-top-left-radius: ${Math.ceil(MathHelper.sub(defaultHeight, 2))}px;
      border-bottom-left-radius: ${Math.ceil(MathHelper.sub(defaultHeight, 2))}px;
      border-top-right-radius: ${Math.ceil(MathHelper.sub(defaultHeight, 2))}px;
      border-bottom-right-radius: ${Math.ceil(MathHelper.sub(defaultHeight, 2))}px;
      background-color: ${mainRed};
      
      .bar {
        position: absolute;
        top: 0px;
        height: ${defaultHeight}px;
        //flex-grow: 1;
        border-right: 0.1rem #eee solid;
        
        &.start {
          width: 0px;
          //.txt {display: none}
        }

        &:first-child {
          border-right: none;
          .txt {
            left: 0px;
          }
        }
        &:last-child {
          border-right: none;
          left: 100%;
          .txt {
            right: 0px;
          }
        }

        .txt {
          right: -15px;
          top: -12px;
        }
      }
      
      .txt {
        position: absolute;
        top: 10px;
        font-size: 10px;
        transform: rotate(-45deg); /* Adjust the angle as needed */
        transform-origin: 0 0; /* Set the origin of rotation */
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

      .pointer {
        position: absolute;
        color: white;
        display: inline-block;
        width: ${pointerWidth}px;
        text-align: center;
      }
    }
`;

type iComparativeBarGraphDisplay = {
  cohortScores: number[];
  currentStudentScore: number;
  height?: number;
}
const ComparativeBarGraphDisplay = ({cohortScores, currentStudentScore, height = 46}: iComparativeBarGraphDisplay) => {
  // const [cohortScoreMap, setCohortScoreMap] = useState<{[key: number]: number}>({});
  const [currentStudentScoreWidth, setCurrentStudentScoreWidth] = useState<number>(0);
  const [sortedScores, setSortedScores] = useState<number[]>([]);


  useEffect(() => {
    const sortedCohortScores = cohortScores.sort((s1, s2) => Number(s1) > Number(s2) ? 1 : -1);
    const maxDiff = MathHelper.sub(sortedCohortScores.at(-1) || 100, sortedCohortScores[0]);
    setSortedScores(sortedCohortScores);
    // setCohortScoreMap(sortedCohortScores.reduce((map, score, index) => {
    //   return {
    //     ...map,
    //     [score]: index === 0 ? 0 : MathHelper.mul(MathHelper.div(MathHelper.sub(score, sortedCohortScores[index - 1] || 0), maxDiff), 100),
    //   }
    // }, {}));
    const width = MathHelper.mul(MathHelper.div(MathHelper.sub(currentStudentScore, sortedCohortScores[0]), maxDiff), 100);

    setCurrentStudentScoreWidth(width <= 0 ? 0 : width)
  }, [cohortScores, currentStudentScore])


  const getCurrentPointerStyle = () => {
    if (currentStudentScore <= sortedScores[0]) {
      return { left: `-${mathHelper.sub(MathHelper.div(pointerWidth, 2), 1)}px`};
    }
    const lastScore = sortedScores[sortedScores.length - 1] || 100;
    if (currentStudentScore >= lastScore) {
      return { right: `-${mathHelper.sub(MathHelper.div(pointerWidth, 2), 1)}px`};
    }

    return {left: `calc(${currentStudentScoreWidth}% - 8px)`};
  }

  const getOverLineStyle = () => {
    if (sortedScores.length <= 3) {
      return {};
    }
    const leftPercentage = MathHelper.sub(sortedScores[1], sortedScores[0]);
    const rightPercentage =  MathHelper.sub(100,(MathHelper.sub(sortedScores[sortedScores.length - 2], sortedScores[0]) || 0));
    return {
      left: `max(calc(${leftPercentage}% - 20px), ${maxLeft}px)`,
      right: `max(calc(${rightPercentage}% - 20px), ${maxRight}px)`,
    }
  }

  const getScore = (score: number | string) => {
    return Number(score).toFixed(1);
  }

  if (cohortScores.length < 3) {
    return null;
  }

  return (
    <Wrapper className={'comp-graph-display-wrapper'}>
      <div className={'stacked-bars'} style={{height: `${height}px`}}>
        {sortedScores.map((score, index) => {
          if (index === 0) {
            return <div className={'start bar'} key={index}>
              <div className={'txt'}>{getScore(score)}</div>
            </div>;
          }

          if (index === (sortedScores.length - 1)) {
            return <div className={'end bar'} key={index}>
              <div className={'txt'}>{getScore(score)}</div>
            </div>;
          }

          return (
            // @ts-ignore
            <div className={'bar'} key={index} style={{ left: `${MathHelper.sub(score, sortedScores[0])}%`}}>
              <div className={'txt'}>{getScore(score)}</div>
            </div>
          );

        })}
      </div>
      <div className={'over-line'} style={getOverLineStyle()}>
        <div className={'start'} />
        <div className={'pointer'} style={getCurrentPointerStyle()} title={`${currentStudentScore}`}>
          <Icons.TriangleFill />
        </div>
        <div className={'end'}/>
      </div>
    </Wrapper>
  )
}

export default ComparativeBarGraphDisplay;
