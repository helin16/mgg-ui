import iSchoolCensusStudentData from './iSchoolCensusStudentData';
import ReactTableWithFixedColumns from '../../../../components/common/ReactTableWithFixedColumns';
import * as _ from 'lodash';
import {useEffect, useState} from 'react';
import ISynLuYearLevel from '../../../../types/Synergetic/Lookup/iSynLuYearLevel';
import styled from 'styled-components';
import SchoolCensusDataPopupBtn from './SchoolCensusDataPopupBtn';

type iSchoolCensusTable = {
  luYearLevels: ISynLuYearLevel[];
  records: iSchoolCensusStudentData[];
}

const Wrapper = styled.div`
  .table {
    &.sticky {
      background-color: transparent !important;
    }
    .th,
    .td {
      padding: 0px !important;
      min-height: 24px;
    }
    
    div[class^='col-'] {
      .btn {
        width: 100%;
      }
    }
    
    .col-footer,
    .col-left-fix,
    .col-right-fix {
      text-align: center;
    }
    
    .th .col-data,
    .th .col-right-fix.total,
    .col-left-fix {
      height: 100%;
      padding: 5px !important;
      font-weight: bold;
    }
    
    .col-data,
    .col-right-fix {
      text-align: center;
      &:hover {
        background-color: #cdcdcd;
      }
    }
    
    .total {
      background-color: #ededed;
      .btn {
        background-color: #ededed;
        border-radius: 0px;
        &:hover {
          background-color: #cdcdcd;
        }
      }
    }
    
    .no-data {
      height: 100%;
      padding: 5px !important;
    }
  
  }
`;
const SchoolCensusTable = ({records, luYearLevels}: iSchoolCensusTable) => {
  const [dataMap, setDataMap] = useState<{[key: string]: {[key: string]: iSchoolCensusStudentData[]}}>({});

  useEffect(() => {
    setDataMap(records.reduce((map, record) => {
      return {
        ...map,
        total: [
          // @ts-ignore
          ...('total' in map ? map.total : []),
          record,
        ],
        [`${record.yearLevelCode}`]: {
          // @ts-ignore
          ...(record.yearLevelCode in map ? map[record.yearLevelCode] : {}),
          total: [
            // @ts-ignore
            ...(`total` in (map[record.yearLevelCode] || {}) ? map[record.yearLevelCode].total: []),
            record,
          ],
          [`${record.age}`]: [
            // @ts-ignore
            ...(`${record.age}` in (map[record.yearLevelCode] || {}) ? map[record.yearLevelCode][`${record.age}`]: []),
            record,
          ],
        },
      };
    }, {}));
  }, [records, luYearLevels]);

  const getLeftFix = () => {
    return [{
      Header: () => {
        return <div className={'col-left-fix'}>Year Lvl</div>;
      } ,
      Footer: () => {
        return <div className={'col-left-fix total'}>Total</div>;
      } ,
      accessor: "Code",
      sticky: "left",
      width: 70,
      Cell: (cell: any) => {
        return <div className={'col-left-fix'}>{cell.row.original.Description}</div>;
      }
    }];
  }

  const getRightFix = () => {
    return [{
      Header: () => {
        return <div className={'col-right-fix total'}>Total</div>;
      },
      Footer: () => {
        const totalRecords = 'total' in dataMap ? dataMap.total : [];
        return totalRecords.length === 0 ?
          <div className={'col-right-fix total'}>{totalRecords.length}</div>
          : (
            <div className={'col-right-fix total'}>
              <SchoolCensusDataPopupBtn
                popupTitle={<h4>Total list of {totalRecords.length} student(s)</h4>}
                variant={'link'}
                size={'sm'}
                // @ts-ignore
                records={totalRecords || []}
              >
                {totalRecords.length}
              </SchoolCensusDataPopupBtn>
            </div>

          );
      },
      accessor: "total",
      sticky: 'right',
      width: 70,
      Cell: (cell: any) => {
        const ylCode = `${cell.row.original.Code}`.trim();
        const ylDesc = `${cell.row.original.Description}`.trim();

        let totalRecords: iSchoolCensusStudentData[] = [];
        if ( ylCode in dataMap && 'total' in dataMap[ylCode]) {
          totalRecords = dataMap[ylCode].total;
        }
        return totalRecords.length === 0 ?
          <div className={'col-right-fix total'}>{totalRecords.length}</div>
          : (
            <div className={'col-right-fix total'}>
              <SchoolCensusDataPopupBtn
                popupTitle={<><h4>{totalRecords.length} student{totalRecords.length > 1 ? 's' : ''}</h4><small className={'text-muted text-size-14'}>in Year {ylDesc}</small></>}
                variant={'link'}
                size={'sm'}
                records={totalRecords}
              >
                {totalRecords.length}
              </SchoolCensusDataPopupBtn>
            </div>

          );
      }
    }];
  }

  const getDataColumns = () => {
    return [
      ..._.range(1, 20).map(age => `${age}`),
      '21+',
    ].map(ageStr => {
      return {
        Header: () => {
          return <div className={'col-data'}>{ageStr}</div>;
        },
        Footer: (cell: any) => {
          let sameAgeArr: iSchoolCensusStudentData[] = [];
          for(const yearLvl of Object.keys(dataMap)) {
            if (yearLvl.trim() === 'total') {
              continue;
            }
            for(const age of Object.keys(dataMap[yearLvl])) {
              if (age.trim() === ageStr) {
                sameAgeArr = [...sameAgeArr, ...dataMap[yearLvl][age]];
              }
            }
          }
          if (sameAgeArr.length <= 0) {
            return <div className={'col-data total col-footer no-data'}>0</div>;
          }
          return <div className={'col-data total col-footer'}>
            <SchoolCensusDataPopupBtn
              popupTitle={<><h4>{sameAgeArr.length} student{sameAgeArr.length > 1 ? 's' : ''}</h4><small className={'text-muted text-size-14'}>aged {ageStr}</small></>}
              variant={'link'}
              size={'sm'}
              records={sameAgeArr}
            >
              {sameAgeArr.length}
            </SchoolCensusDataPopupBtn>
          </div>;
        },
        accessor: `${ageStr}`,
        width: 50,
        Cell: (cell: any, index: any) => {
          const ylCode = `${cell.row.original.Code}`.trim();
          const ylDesc = `${cell.row.original.Description}`.trim();
          const age = `${cell.column.id}`.trim();
          let totalRecords: iSchoolCensusStudentData[] = [];
          if ( ylCode in dataMap && age in dataMap[ylCode]) {
            totalRecords = dataMap[ylCode][age];
          }
          return totalRecords.length === 0 ? null : (
            <div className={'col-data'}>
              <SchoolCensusDataPopupBtn
                popupTitle={<><h4>{totalRecords.length} student{totalRecords.length > 1 ? 's' : ''}</h4><small className={'text-muted text-size-14'}>aged {age} in Year {ylDesc}</small></>}
                variant={'link'}
                size={'sm'}
                records={totalRecords}
              >
                {totalRecords.length}
              </SchoolCensusDataPopupBtn>
            </div>
          );
        },
      }
    })
  }
  return (
    <Wrapper>
      <ReactTableWithFixedColumns
        data={luYearLevels}
        columns={[
          ...getLeftFix(),
          ...getDataColumns(),
          ...getRightFix(),
        ]}
      />
    </Wrapper>
  )
}

export default SchoolCensusTable;
