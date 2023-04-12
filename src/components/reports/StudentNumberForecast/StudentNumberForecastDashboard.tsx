import styled from 'styled-components';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import PanelTitle from '../../PanelTitle';
import SynCampusSelector from '../../student/SynCampusSelector';
import React, {useEffect, useState} from 'react';
import Panel from '../../common/Panel';
import {Col, Row, Table} from 'react-bootstrap';
import MathHelper from '../../../helper/MathHelper';
import Toaster from '../../../services/Toaster';
import PageLoadingSpinner from '../../common/PageLoadingSpinner';
import SynVStudentService from '../../../services/Synergetic/SynVStudentService';
import moment from 'moment-timezone';
import FunnelService from '../../../services/Funnel/FunnelService';
import iFunnelLead, {
  FUNNEL_STAGE_NAME_CLOSED_WON,
  FUNNEL_STAGE_NAME_OFFER_ACCEPTED,
  FUNNEL_STAGE_NAME_STUDENT_LEARNING_PROFILE,
  FUNNEL_STAGE_NAME_INTERVIEW,
  FUNNEL_STAGE_NAME_OFFER_SENT,
  FUNNEL_STAGE_NAME_ENQUIRY,
  FUNNEL_STAGE_NAME_SCHOOL_VISIT,
  FUNNEL_STAGE_NAME_APPLICATION_RECEIVED,
} from '../../../types/Funnel/iFunnelLead';
import SynLuYearLevelService from '../../../services/Synergetic/SynLuYearLevelService';
import iLuYearLevel from '../../../types/Synergetic/iLuYearLevel';
import {mainBlue} from '../../../AppWrapper';
import ExplanationPanel from '../../ExplanationPanel';
import * as _ from 'lodash';

const Wrapper = styled.div`
  .title-row {
    display: flex;
    gap: 1rem;
    align-items: center;
    
    .title {
      font-size: 18px;
    }
    
    .campus-selector {
      color: black;
      display: inline-block;
      min-width: 220px;
    }
  }
  
  .sum-div-wrapper {
    div[class^='col-sm-'] {
      margin-bottom: 0.5rem;
      padding-left: 0px;
    }
  }
  
  .sum-div {
    .panel-title {
      font-size: 18px;
      text-align: center;
      padding: 0.4rem 0px;
    }
    .panel-body {
      font-size: 36px;
      text-align: center;
    }
  }
  
  .lead-table {
    thead {
      background: ${mainBlue};
      th {
        color: white !important;
      }
    }
    tbody {
      tr.subtotal {
        background: #e9e9e9;
        td {
          font-weight: bold;
          :first-child {
            text-align: right;
          }
        }
      }
    }
    tfoot {
      font-weight: bold;
    }
  }
`;

const leadStatuses = [
  FUNNEL_STAGE_NAME_CLOSED_WON,
  FUNNEL_STAGE_NAME_OFFER_ACCEPTED,
  FUNNEL_STAGE_NAME_STUDENT_LEARNING_PROFILE,
  FUNNEL_STAGE_NAME_INTERVIEW,
  FUNNEL_STAGE_NAME_OFFER_SENT,
  FUNNEL_STAGE_NAME_ENQUIRY,
  FUNNEL_STAGE_NAME_SCHOOL_VISIT,
  FUNNEL_STAGE_NAME_APPLICATION_RECEIVED,
];

type iMap = {[key: string]: number};
type iLeadMap = {
  confirmed: iMap;
  inProgress: iMap;
  leadsAndTours: iMap;
};
const initLeadMap: iLeadMap = {
  confirmed: {},
  inProgress: {},
  leadsAndTours: {},
}
const StudentNumberForecastDashboard = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [selectedCampusCodes, setSelectedCampusCodes] = useState<string[]>(['E', 'S', 'J']);
  const [currentStudentMap, setCurrentStudentMap] = useState<iMap>({});
  const [nextYearFunnelLeadMap, setNextYearFunnelLeadMap] = useState(initLeadMap);
  const [yearLevelMap, setYearLevelMap] = useState<{ [key: string]: iLuYearLevel }>({});
  const [yearLevelCodes, setYearLevelCodes] = useState<string[]>([]);
  const [futureNextYearMap, setFutureNextYearMap] = useState<iMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const currentFileSemester = user?.SynCurrentFileSemester?.FileSemester || 1;
  const currentFileYear = user?.SynCurrentFileSemester?.FileYear || moment().year();
  const nextFileYear = MathHelper.add(currentFileYear, 1);

  const getStatusFromLead = (lead: iFunnelLead) => {
    switch (lead.pipeline_stage_name) {
      case FUNNEL_STAGE_NAME_CLOSED_WON:
      case FUNNEL_STAGE_NAME_OFFER_ACCEPTED: {
        return 'confirmed';
      }

      case FUNNEL_STAGE_NAME_STUDENT_LEARNING_PROFILE:
      case FUNNEL_STAGE_NAME_INTERVIEW:
      case FUNNEL_STAGE_NAME_OFFER_SENT: {
        return 'inProgress';
      }

      case FUNNEL_STAGE_NAME_ENQUIRY:
      case FUNNEL_STAGE_NAME_SCHOOL_VISIT:
      case FUNNEL_STAGE_NAME_APPLICATION_RECEIVED: {
        return 'leadsAndTours';
      }

      default: {
        return '';
      }
    }
  }

  const getYearLevelFromLead = (lead: iFunnelLead) => {
    return `${lead.student_starting_year_level || ''}`.replace('Year ', '').replace('ELC - Pre Prep', '40').replace('ELC kinder', '30').replace('Prep', '0')
  }

  const getYearLevelForLead = (campusCodes: string[]) => {
    return campusCodes.reduce((array: string[], campusCode) => {
      let codes: string[] = [];
      switch (campusCode.trim().toUpperCase()) {
        case 'E': {
          codes = ['ELC - Pre Prep', 'ELC kinder'];
          break;
        }
        case 'J': {
          codes = [...[1, 2, 3, 4, 5, 6].map(yearLevel => `Year ${yearLevel}`), 'Prep'];
          break;
        }
        case 'S': {
          codes = [7, 8, 9, 10, 11, 12].map(yearLevel => `Year ${yearLevel}`);
          break;
        }
        default: {
          break;
        }
      }
      return [
        ...array,
        ...codes
      ]
    }, [])
  }

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    const yearLevelForLeads = getYearLevelForLead(selectedCampusCodes);
    Promise.all([
      SynVStudentService.getCurrentVStudents({
        where: JSON.stringify({
          FileYear: currentFileYear,
          FileSemester: currentFileSemester,
          StudentActiveFlag: true,
          StudentLeavingDate: null,
        })
      }),
      FunnelService.getAll({
        where: JSON.stringify({
          student_starting_year: [currentFileYear, nextFileYear],
          isActive: true,
          pipeline_stage_name: leadStatuses,
          ...(yearLevelForLeads.length > 0 ? {student_starting_year_level: yearLevelForLeads} : {})
        }),
        perPage: 99999999,
      }),
      SynLuYearLevelService.getAllYearLevels({
        where: JSON.stringify({
          Campus: selectedCampusCodes.length > 0 ? selectedCampusCodes : ['E', 'J', 'S'],
        }),
        sort: `YearLevelSort:ASC`
      })
    ]).then(resp => {
      if (isCanceled) return;
      setCurrentStudentMap(resp[0].reduce((map: iMap, student) => {
        const yearLevelCode = student.StudentYearLevel;
        return {
          ...map,
          total: MathHelper.add(map.total || 0, selectedCampusCodes.length === 0 || selectedCampusCodes.indexOf(student.StudentCampus) >= 0 ? 1 : 0),
          [yearLevelCode]: MathHelper.add(map[yearLevelCode] || 0, 1),
        };
      }, {}));
      setYearLevelCodes(resp[2].map(yearLevel => `${yearLevel.Code}`));
      setYearLevelMap(resp[2].reduce((map, yearLevel) => {
        return {
          ...map,
          [`${yearLevel.Code}`]: yearLevel,
        };
      }, {}));
      setNextYearFunnelLeadMap(resp[1].data.reduce((map: iLeadMap, lead) => {
        const status = getStatusFromLead(lead);
        const yearLevelCode = getYearLevelFromLead(lead)
        return {
          ...map,
          [status]: {
            // @ts-ignore
            ...map[status],
            // @ts-ignore
            total: MathHelper.add(map[status].total || 0, 1),
            // @ts-ignore
            [yearLevelCode]: MathHelper.add(map[status][yearLevelCode] || 0, 1),
          }
        }
      }, initLeadMap))
    }).catch(err => {
      if (isCanceled) return;
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) return;
      setIsLoading(false)
    })

    return () => {
      isCanceled = true;
    };
  }, [selectedCampusCodes, currentFileYear, nextFileYear, currentFileSemester]);

  useEffect(() => {
    if (selectedCampusCodes.length <=0) {
      setSelectedCampusCodes(['E', 'J', 'S']);
    }
  }, [selectedCampusCodes]);


  useEffect(() => {
    setFutureNextYearMap(yearLevelCodes.reduce((map, code, currentIndex) => {
      const nextYearConfirmed = code in nextYearFunnelLeadMap.confirmed ? nextYearFunnelLeadMap.confirmed[code] : 0;
      let currentYearStudentLowerLevel = 0;
      if (currentIndex > 0 && code !== '0') {
        const currentYearStudentLowerLevelCode = yearLevelCodes[MathHelper.sub(currentIndex, 1)];
        currentYearStudentLowerLevel = currentYearStudentLowerLevelCode in currentStudentMap ? currentStudentMap[currentYearStudentLowerLevelCode] : 0;
      }
      const futureNextYear = MathHelper.add(currentYearStudentLowerLevel, nextYearConfirmed);
      return {
        ...map,
        // @ts-ignore
        total: MathHelper.add(map.total || 0, futureNextYear),
        // @ts-ignore
        [code]: MathHelper.add(map[code] || 0, futureNextYear),
      }
    }, {}))

  }, [currentStudentMap, yearLevelCodes, nextYearFunnelLeadMap.confirmed])


  const getSubTotal = (campusCodes: string[]) => {
    const campusCodesSelected = _.intersection(selectedCampusCodes, campusCodes);
    const yearLevelCodes = Object.values(yearLevelMap).filter(yearLevel => campusCodesSelected.indexOf(yearLevel.Campus) >= 0).map(yearLevel => `${yearLevel.Code}`);
    if (yearLevelCodes.length <= 0) {
      return null;
    }
    return (
      <tr key={`sub-total-${yearLevelCodes.join('-')}`} className={'subtotal'}>
        <td>Sub Total</td>
        <td>{Object.keys(currentStudentMap).filter(key => yearLevelCodes.indexOf(key) >= 0).reduce((sum, key) => MathHelper.add(sum, currentStudentMap[key] ||  0), 0)}</td>
        <td>{Object.keys(nextYearFunnelLeadMap.confirmed).filter(key => yearLevelCodes.indexOf(key) >= 0).reduce((sum, key) => MathHelper.add(sum, nextYearFunnelLeadMap.confirmed[key] ||  0), 0)}</td>
        <td>{Object.keys(nextYearFunnelLeadMap.inProgress).filter(key => yearLevelCodes.indexOf(key) >= 0).reduce((sum, key) => MathHelper.add(sum, nextYearFunnelLeadMap.inProgress[key] ||  0), 0)}</td>
        <td>{Object.keys(futureNextYearMap).filter(key => yearLevelCodes.indexOf(key) >= 0).reduce((sum, key) => MathHelper.add(sum, futureNextYearMap[key] ||  0), 0)}</td>
        <td>{Object.keys(nextYearFunnelLeadMap.leadsAndTours).filter(key => yearLevelCodes.indexOf(key) >= 0).reduce((sum, key) => MathHelper.add(sum, nextYearFunnelLeadMap.leadsAndTours[key] ||  0), 0)}</td>
      </tr>
    )
  }

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />;
    }

    return (
      <>
        <Row className={'section-row sum-div-wrapper'}>
          <Col sm={2}>
            <Panel title={'Current Students'} className={'sum-div'}>
              {currentStudentMap.total || 0}
            </Panel>
          </Col>
          <Col sm={2}>
            <Panel title={'Confirmed'} className={'sum-div'}>
              {nextYearFunnelLeadMap.confirmed.total || 0}
            </Panel>
          </Col>
          <Col sm={3}>
            <Panel title={'In Progress'} className={'sum-div'}>
              {nextYearFunnelLeadMap.inProgress.total || 0}
            </Panel>
          </Col>
          <Col sm={3}>
            <Panel title={`Future ${nextFileYear}`} className={'sum-div'}>
              {
                futureNextYearMap.total || 0
              }
            </Panel>
          </Col>
          <Col sm={2}>
            <Panel title={`Leads & Tours`} className={'sum-div'}>
              {nextYearFunnelLeadMap.leadsAndTours.total || 0}
            </Panel>
          </Col>
        </Row>

        <Table hover className={'lead-table'}>
          <thead>
            <tr>
              <th>Year Level</th>
              <th>Current Students</th>
              <th>Confirmed</th>
              <th>In Progress</th>
              <th>Future {nextFileYear}</th>
              <th>Leads & Tours</th>
            </tr>
          </thead>
          <tbody>
          {
            yearLevelCodes
              .map(yearLevelCode => {
                const yearLevel = yearLevelMap[yearLevelCode];
                if (!yearLevel) {
                  return null;
                }
                return (
                  <>
                    {yearLevelCode === '0' ? getSubTotal(['E']) : null}
                    <tr key={yearLevelCode} className={`code-${yearLevelCode}`}>
                      <td>{Number(yearLevelCode) > 0 ? `Year ${yearLevel.Description}`: yearLevel.Description}</td>
                      <td>{yearLevelCode in currentStudentMap ? currentStudentMap[yearLevelCode] : 0}</td>
                      <td>{yearLevelCode in nextYearFunnelLeadMap.confirmed ? nextYearFunnelLeadMap.confirmed[yearLevelCode] : 0}</td>
                      <td>{yearLevelCode in nextYearFunnelLeadMap.inProgress ? nextYearFunnelLeadMap.inProgress[yearLevelCode] : 0}</td>
                      <td>{yearLevelCode in futureNextYearMap ? futureNextYearMap[yearLevelCode] : 0}</td>
                      <td>{yearLevelCode in nextYearFunnelLeadMap.leadsAndTours ? nextYearFunnelLeadMap.leadsAndTours[yearLevelCode] : 0}</td>
                    </tr>
                  </>
                )
              })
          }
          {getSubTotal(['J', 'S'])}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>{currentStudentMap.total || 0}</td>
              <td>{nextYearFunnelLeadMap.confirmed.total || 0}</td>
              <td>{nextYearFunnelLeadMap.inProgress.total || 0}</td>
              <td>{futureNextYearMap.total || 0}</td>
              <td>{nextYearFunnelLeadMap.leadsAndTours.total || 0}</td>
            </tr>
          </tfoot>
        </Table>
      </>
    )
  }

  return (
    <Wrapper>
      <ExplanationPanel
        text={
          <>
            All number below are excluding Leavers and <b>Proposed Entry Year in : {[currentFileYear, nextFileYear].join(' & ')}</b>
            <ul>
              <li><b>Current Student</b>: the number of student currently</li>
              <li><b>Confirmed</b>: the number of leads from Funnel with status: {FUNNEL_STAGE_NAME_CLOSED_WON} & {FUNNEL_STAGE_NAME_APPLICATION_RECEIVED}</li>
              <li><b>In Progress</b>: the number of leads from Funnel with status: {FUNNEL_STAGE_NAME_STUDENT_LEARNING_PROFILE}, {FUNNEL_STAGE_NAME_INTERVIEW} & {FUNNEL_STAGE_NAME_OFFER_SENT}</li>
              <li><b>Future {nextFileYear}</b>: = Current Student on Lower Year Level + Confirmed.</li>
              <li><b>Leads & Tours</b>: the number of leads from Funnel with status: {FUNNEL_STAGE_NAME_ENQUIRY}, {FUNNEL_STAGE_NAME_SCHOOL_VISIT} & {FUNNEL_STAGE_NAME_APPLICATION_RECEIVED}</li>
            </ul>
          </>
        }
      />
      <PanelTitle className={'title-row section-row'}>
        <div className={'title'}>{nextFileYear} Semester {currentFileSemester} Student Numbers</div>
        <SynCampusSelector
          className={'campus-selector'}
          allowClear={false}
          isMulti
          values={selectedCampusCodes}
          onSelect={(values) => {
            const codes = (values === null ? [] : Array.isArray(values) ? values : [values]).map(value => `${value.value}`.trim()).filter(code => code !== '');
            setSelectedCampusCodes(codes)
          }}
        />
      </PanelTitle>
      {getContent()}
    </Wrapper>
  )
}

export default StudentNumberForecastDashboard;
