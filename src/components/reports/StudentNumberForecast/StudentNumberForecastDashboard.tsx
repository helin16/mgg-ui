import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import PanelTitle from "../../PanelTitle";
import SynCampusSelector from "../../student/SynCampusSelector";
import React, { useEffect, useState } from "react";
import Panel from "../../common/Panel";
import { Col, FormControl, Row } from "react-bootstrap";
import MathHelper from "../../../helper/MathHelper";
import Toaster, { TOAST_TYPE_ERROR } from "../../../services/Toaster";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import SynVStudentService from "../../../services/Synergetic/Student/SynVStudentService";
import moment from "moment-timezone";
import FunnelService from "../../../services/Funnel/FunnelService";
import iFunnelLead, {
  FUNNEL_STAGE_NAME_OFFER_ACCEPTED,
  FUNNEL_STAGE_NAME_STUDENT_LEARNING_PROFILE,
  FUNNEL_STAGE_NAME_INTERVIEW,
  FUNNEL_STAGE_NAME_OFFER_SENT,
  FUNNEL_STAGE_NAME_ENQUIRY,
  FUNNEL_STAGE_NAME_SCHOOL_VISIT,
  FUNNEL_STAGE_NAME_APPLICATION_RECEIVED,
  FUNNEL_STAGE_NAME_EXPORTED
} from "../../../types/Funnel/iFunnelLead";
import SynLuYearLevelService from "../../../services/Synergetic/Lookup/SynLuYearLevelService";
import ISynLuYearLevel from "../../../types/Synergetic/Lookup/iSynLuYearLevel";
import ExplanationPanel from "../../ExplanationPanel";
import iVStudent, {SYN_STUDENT_STATUS_ID_REPEATING} from "../../../types/Synergetic/iVStudent";
import StudentNumberForecastTable from "./components/StudentNumberForecastTable";
import StudentNumberDetailsPopupBtn from "./components/StudentNumberDetailsPopupBtn";
import SynVDebtorFeeService from "../../../services/Synergetic/Finance/SynVDebtorFeeService";
import iSynVDebtorFee, {
  AUTO_TUITION_VARIATION_TYPE_FULL_FEE
} from "../../../types/Synergetic/Finance/iSynVDebtorFee";
import ToggleBtn from "../../common/ToggleBtn";
import { OP_GTE, OP_LTE } from "../../../helper/ServiceHelper";
import SynVFutureStudentService from "../../../services/Synergetic/SynVFutureStudent";
import { FUTURE_STUDENT_STATUS_FINALISED } from "../../../types/Synergetic/iSynVFutureStudent";
import SynVFutureStudent from "../../../services/Synergetic/SynVFutureStudent";
import { FlexContainer } from "../../../styles";
import UtilsService from "../../../services/UtilsService";
import SynDebtorStudentConcessionService from "../../../services/Synergetic/Finance/SynDebtorStudentConcessionService";
import {
  AUTO_TUITION_CODE_CONSOLIDATED_CHARGES, AUTO_TUITION_CODE_OTHER_CHARGES,
  AUTO_TUITION_CODE_TUITION,
  AUTO_TUITION_CODE_TUITION_CONCESSION
} from "../../../types/Synergetic/Finance/iSynLuDebtorAutoTuition";
import iSynDebtorStudentConcession from "../../../types/Synergetic/Finance/iSynDebtorStudentConcession";
import * as _ from "lodash";
import SynVStudentContactsCurrentPastFutureCombinedService from "../../../services/Synergetic/Student/SynVStudentContactsCurrentPastFutureCombinedService";
import {
  STUDENT_CONTACT_STUDENT_TYPE_CURRENT,
  STUDENT_CONTACT_STUDENT_TYPE_FUTURE
} from "../../../types/Synergetic/iSynVStudentContactsCurrentPastFutureCombined";
import { STUDENT_CONTACT_TYPE_SC1 } from "../../../types/Synergetic/iStudentContact";

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

    .increasing-percentage {
      width: 80px;
      margin: 0px;
    }
  }

  .sum-div-wrapper {
    div[class^="col-sm-"] {
      margin-bottom: 0.5rem;
      padding-left: 0px;
    }
    .st-no-popup-btn {
      font-size: 32px;
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
`;

const leadStatuses = [
  FUNNEL_STAGE_NAME_EXPORTED,
  FUNNEL_STAGE_NAME_OFFER_ACCEPTED,
  FUNNEL_STAGE_NAME_STUDENT_LEARNING_PROFILE,
  FUNNEL_STAGE_NAME_INTERVIEW,
  FUNNEL_STAGE_NAME_OFFER_SENT,
  FUNNEL_STAGE_NAME_ENQUIRY,
  FUNNEL_STAGE_NAME_SCHOOL_VISIT,
  FUNNEL_STAGE_NAME_APPLICATION_RECEIVED
];

type iCommunityMap = { [key: number]: iVStudent };
type iStudentMap = { [key: string]: iVStudent[] };
type iMap = { [key: string]: iFunnelLead[] };
type iTuitionFeeMap = { [key: string]: iSynVDebtorFee[] };
type iStudentConcessionMap = { [key: string]: iSynDebtorStudentConcession[] };
type iSiblingDiscountFee = iSynVDebtorFee & { discountAmount?: number };
type iSiblingIdsMap = { [key: number]: number[] };
type iLeadMap = {
  confirmed: iMap;
  inProgress: iMap;
  leadsAndTours: iMap;
};
const initLeadMap: iLeadMap = {
  confirmed: {},
  inProgress: {},
  leadsAndTours: {}
};

const defaultCampusCodes = ["E", "J", "S"];

type iStudentNumberForecastDashboard = {
  showExplanationPanel?: boolean;
  showFinanceFigures?: boolean;
  showSumPanels?: boolean;
};
const StudentNumberForecastDashboard = ({
  showExplanationPanel = true,
  showFinanceFigures = false,
  showSumPanels = true
}: iStudentNumberForecastDashboard) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showingFinanceFigures, setShowingFinanceFigures] = useState(
    showFinanceFigures
  );
  const [selectedCampusCodes, setSelectedCampusCodes] = useState<string[]>(
    defaultCampusCodes
  );
  const [currentStudentMap, setCurrentStudentMap] = useState<iStudentMap>({});
  const [currentStudentLeaverMap, setCurrentStudentLeaverMap] = useState<
    iStudentMap
  >({});
  const [nextYearFunnelLeadMap, setNextYearFunnelLeadMap] = useState(
    initLeadMap
  );
  const [yearLevelMap, setYearLevelMap] = useState<{
    [key: string]: ISynLuYearLevel;
  }>({});
  const [yearLevelCodes, setYearLevelCodes] = useState<string[]>([]);
  const [futureNextYearMap, setFutureNextYearMap] = useState<iMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const currentFileSemester = user?.SynCurrentFileSemester?.FileSemester || 1;
  const currentFileYear =
    user?.SynCurrentFileSemester?.FileYear || moment().year();
  const nextFileYear = MathHelper.add(currentFileYear, 1);
  const [tuitionFeeMap, setTuitionFeeMap] = useState<iTuitionFeeMap>({});
  const [siblingDiscountFees, setSiblingDiscountFees] = useState<
    iSiblingDiscountFee[]
  >([]);
  const [concessionMap, setConcessionMap] = useState<iStudentConcessionMap>({});
  const [confirmedFutureStudentMap, setConfirmedFutureStudentMap] = useState<
    iStudentMap
  >({});
  const [siblingIdsMap, setSiblingIdsMap] = useState<iSiblingIdsMap>({});
  const [increasingPercentage, setIncreasingPercentage] = useState(0);
  const [communityMap, setCommunityMap] = useState<iCommunityMap>({});
  const [tuitFeeCodeMap, setTuitFeeCodeMap] = useState<{
    [key: string]: string;
  }>({});

  const getStatusFromLead = (lead: iFunnelLead) => {
    switch (lead.pipeline_stage_name) {
      case FUNNEL_STAGE_NAME_OFFER_ACCEPTED:
      case FUNNEL_STAGE_NAME_EXPORTED: {
        return "confirmed";
      }

      case FUNNEL_STAGE_NAME_STUDENT_LEARNING_PROFILE:
      case FUNNEL_STAGE_NAME_INTERVIEW:
      case FUNNEL_STAGE_NAME_OFFER_SENT: {
        return "inProgress";
      }

      case FUNNEL_STAGE_NAME_ENQUIRY:
      case FUNNEL_STAGE_NAME_SCHOOL_VISIT:
      case FUNNEL_STAGE_NAME_APPLICATION_RECEIVED: {
        return "leadsAndTours";
      }

      default: {
        return "";
      }
    }
  };

  const getYearLevelFromLead = (lead: iFunnelLead) => {
    return Number(
      `${lead.student_starting_year_level || ""}`
        .replace("Year ", "")
        .replace("ELC - Pre Prep", "40")
        .replace("ELC kinder", "30")
        .replace("Prep", "0")
    );
  };

  const getYearLevelForLead = (campusCodes: string[]) => {
    return campusCodes.reduce((array: string[], campusCode) => {
      let codes: string[] = [];
      switch (campusCode.trim().toUpperCase()) {
        case "E": {
          codes = ["ELC - Pre Prep", "ELC kinder"];
          break;
        }
        case "J": {
          codes = [
            ...[1, 2, 3, 4, 5, 6].map(yearLevel => `Year ${yearLevel}`),
            "Prep"
          ];
          break;
        }
        case "S": {
          codes = [7, 8, 9, 10, 11, 12].map(yearLevel => `Year ${yearLevel}`);
          break;
        }
        default: {
          break;
        }
      }
      return [...array, ...codes];
    }, []);
  };

  const getNextFeeWithIncreasingPercentage = (currentYearFee: number) => {
    return MathHelper.mul(
      currentYearFee,
      MathHelper.div(MathHelper.add(100, increasingPercentage), 100)
    );
  };

  const getFeeInfoForStudent = (
    yearLevelCode: string,
    record: iVStudent | iFunnelLead,
    tuitFeeMap: iTuitionFeeMap,
    concessMap: iStudentConcessionMap,
    siblingDisFees: iSynVDebtorFee[],
    siblingIdsM: iSiblingIdsMap,
    comMap: iCommunityMap
  ) => {
    let yearLevelTuitionFees = 0;
    let yearLevelConsolidateFees = 0;
    let currentConcessions: iSynDebtorStudentConcession[] = [];
    let nextYearConcessions: iSynDebtorStudentConcession[] = [];
    let currentSiblingDiscounts: iSiblingDiscountFee[] = [];
    let nextYearSiblingDiscounts: iSiblingDiscountFee[] = [];
    if (yearLevelCode in tuitFeeMap) {
      // @ts-ignore
      tuitFeeMap[yearLevelCode]
        .filter(tuitFee => {
          // @ts-ignore
          // this for ecl
          if (Number(yearLevelCode) > 12) {
            // @ts-ignore
            if (`${record.StudentTuitionVariationType || ""}`.trim() !== "") {
              return (
                `${tuitFee.TuitionVariationType}`.trim() ===
                // @ts-ignore
                `${record.StudentTuitionVariationType}`.trim()
              );
            }
            return `${tuitFee.TuitionVariationType}`.trim() === "3";
          }
          // @ts-ignore
          if (record.FullFeeFlag === true) {
            return (
              tuitFee.TuitionVariationType ===
              AUTO_TUITION_VARIATION_TYPE_FULL_FEE
            );
          }
          return (
            tuitFee.TuitionVariationType !==
            AUTO_TUITION_VARIATION_TYPE_FULL_FEE
          );
        })
        .forEach((tuitFee: iSynVDebtorFee) => {
          if (tuitFee.AutoTuitionCode === AUTO_TUITION_CODE_TUITION) {
            yearLevelTuitionFees = MathHelper.add(
              yearLevelTuitionFees,
              SynVDebtorFeeService.getAnnualFeeAmount(tuitFee)
            );
          }

          if (
            tuitFee.AutoTuitionCode === AUTO_TUITION_CODE_CONSOLIDATED_CHARGES ||
            tuitFee.AutoTuitionCode === AUTO_TUITION_CODE_OTHER_CHARGES
          ) {
            yearLevelConsolidateFees = MathHelper.add(
              yearLevelConsolidateFees,
              SynVDebtorFeeService.getAnnualFeeAmount(tuitFee)
            );
          }
        });
    }
    const totalTuitionFeePerYearLevel = MathHelper.add(
      yearLevelTuitionFees,
      yearLevelConsolidateFees
    );
    if ("StudentID" in record && record.StudentID in concessMap) {
      const sID = `${record.StudentID}`;
      // @ts-ignore
      currentConcessions = concessMap[sID]
        .filter(concession => {
          return (
            (`${concession.EffectiveFromDate || ''}`.trim() <= `${currentFileYear}-12-31T00:00:00.000Z` ||
              concession.EffectiveFromDate === null) &&
            (`${concession.EffectiveToDate || ''}`.trim() >= `${currentFileYear}-12-31T00:00:00.000Z` ||
              concession.EffectiveToDate === null)
          );
        })
        .map((concession: iSynDebtorStudentConcession) => ({
          ...concession,
          concessionAmount: MathHelper.mul(
            yearLevelTuitionFees,
            MathHelper.div(concession.OverridePercentage, 100)
          )
        }));
      // @ts-ignore
      nextYearConcessions = concessMap[sID]
        .filter(concession => {
          return (
            (`${concession.EffectiveFromDate || ''}`.trim() <= `${nextFileYear}-12-31T00:00:00.000Z` ||
              concession.EffectiveFromDate === null) &&
            (`${concession.EffectiveToDate || ''}`.trim() > `${currentFileYear}-12-31T00:00:00.000Z` ||
              concession.EffectiveToDate === null)
          );
        })
        .map((concession: iSynDebtorStudentConcession) => ({
          ...concession,
          concessionAmount: MathHelper.mul(
            getNextFeeWithIncreasingPercentage(yearLevelTuitionFees),
            MathHelper.div(concession.OverridePercentage, 100)
          )
        }));
    }

    // sibling discounts
    if ("TuitionNoSibFlag" in record && record.TuitionNoSibFlag !== true) {
      siblingDisFees.forEach(fee => {
        if (fee.FamilyPosition === record.StudentFamilyPosition) {
          currentSiblingDiscounts.push({
            ...fee,
            discountAmount: MathHelper.mul(
              yearLevelTuitionFees,
              MathHelper.div(fee.DiscountPercentage, 100)
            )
          });
        }

        if (record.StudentID in siblingIdsM) {
          const familyPosition = MathHelper.add(
            siblingIdsM[record.StudentID].filter(studentId => {
              if (!(studentId in comMap)) {
                return false;
              }
              if (`${comMap[studentId].StudentLeavingDate || ''}`.trim() !== '' && `${comMap[studentId].StudentLeavingDate || ''}`.trim() < `${nextFileYear}-01-01T00:00:00.000Z`) {
                return false;
              }
              if (`${comMap[studentId].StudentYearLevel || ''}`.trim() === '12') {
                return false;
              }
              return true;
            }).indexOf(record.StudentID),
            1
          );
          if (fee.FamilyPosition === familyPosition) {
            nextYearSiblingDiscounts.push({
              ...fee,
              discountAmount: MathHelper.mul(
                getNextFeeWithIncreasingPercentage(yearLevelTuitionFees),
                MathHelper.div(fee.DiscountPercentage, 100)
              )
            });
          }
        }
      });
    }

    const currentConcessionFees = currentConcessions.reduce(
      // @ts-ignore
      (sum, concession) => MathHelper.add(sum, concession.concessionAmount),
      0
    );
    const futureConcessionFees = nextYearConcessions.reduce(
      // @ts-ignore
      (sum, concession) => MathHelper.add(sum, concession.concessionAmount),
      0
    );
    const currentSiblingDiscountFees = currentSiblingDiscounts.reduce(
      // @ts-ignore
      (sum, fee) => MathHelper.add(sum, fee.discountAmount),
      0
    );
    const nextYearSiblingDiscountFees = nextYearSiblingDiscounts.reduce(
      // @ts-ignore
      (sum, fee) => MathHelper.add(sum, fee.discountAmount),
      0
    );

    return {
      ...record,
      currentTotalFeeAmount: MathHelper.sub(
        MathHelper.sub(totalTuitionFeePerYearLevel, currentConcessionFees),
        currentSiblingDiscountFees
      ),
      futureTotalFeeAmount: MathHelper.sub(
        MathHelper.sub(
          getNextFeeWithIncreasingPercentage(totalTuitionFeePerYearLevel),
          futureConcessionFees
        ),
        nextYearSiblingDiscountFees
      ),
      tuitionFees: yearLevelTuitionFees,
      futureTuitionFees: getNextFeeWithIncreasingPercentage(
        yearLevelTuitionFees
      ),
      consolidateFees: yearLevelConsolidateFees,
      futureConsolidateFees: getNextFeeWithIncreasingPercentage(
        yearLevelConsolidateFees
      ),
      currentConcessionFees,
      currentConcessions,
      futureConcessionFees,
      nextYearConcessions,
      currentSiblingDiscounts,
      nextYearSiblingDiscounts,
      currentSiblingDiscountFees,
      nextYearSiblingDiscountFees
    };
  };

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    const yearLevelForLeads = getYearLevelForLead(selectedCampusCodes);

    const getData = async () => {
      if (isCanceled) return;
      let currentStudMap: iStudentMap = {};
      let currentLeaverStudMap: iStudentMap = {};
      const [
        vStudents,
        { data: funnelLeads },
        luYearLevels,
        { data: vDebtorFees },
        { data: confirmedStudents }
      ] = await Promise.all([
        SynVStudentService.getCurrentVStudents({
          where: JSON.stringify({
            FileYear: currentFileYear,
            FileSemester: currentFileSemester,
            // ID: [54941]
          })
        }),
        FunnelService.getAll({
          where: JSON.stringify({
            student_starting_year: [currentFileYear, nextFileYear],
            isActive: true,
            pipeline_stage_name: leadStatuses,
            ...(yearLevelForLeads.length > 0
              ? { student_starting_year_level: yearLevelForLeads }
              : {})
          }),
          perPage: 99999999
        }),
        SynLuYearLevelService.getAllYearLevels({
          where: JSON.stringify({
            Campus:
              selectedCampusCodes.length > 0
                ? selectedCampusCodes
                : defaultCampusCodes
          }),
          sort: `YearLevelSort:ASC`
        }),
        SynVDebtorFeeService.getAll({
          perPage: 99999999
        }),
        SynVFutureStudentService.getAll({
          where: JSON.stringify({
            FutureStatus: FUTURE_STUDENT_STATUS_FINALISED,
            FutureEnrolYear: { [OP_LTE]: nextFileYear },
            // FutureID: [54941]
          }),
          perPage: 99999999
        })
      ]);

      const yLevelMap = luYearLevels.reduce((map, yearLevel) => {
        return {
          ...map,
          [`${yearLevel.Code}`]: yearLevel
        };
      }, {});

      const confirmedSMap = confirmedStudents.reduce(
        (map: iCommunityMap, futureStudent) => {
          const student = SynVFutureStudent.mapFutureStudentToCurrent(
            futureStudent,
            yLevelMap
          );
          return {
            ...map,
            [student.StudentID]: student
          };
        },
        {}
      );

      const currentSMap = vStudents.reduce((map: iCommunityMap, student) => {
        return {
          ...map,
          [student.StudentID]: student
        };
      }, {});

      const commuMap = {
        ...confirmedSMap,
        ...currentSMap
      };

      const communityIds: number[] = Object.keys(commuMap).map(id =>
        Number(id)
      );
      const studentContacts = (
        await Promise.all(
          _.chunk(communityIds, 100).map(ids =>
            SynVStudentContactsCurrentPastFutureCombinedService.getAll({
              where: JSON.stringify({
                StudentType: [
                  STUDENT_CONTACT_STUDENT_TYPE_CURRENT,
                  STUDENT_CONTACT_STUDENT_TYPE_FUTURE
                ],
                ContactType: STUDENT_CONTACT_TYPE_SC1,
                FileYear: { [OP_GTE]: currentFileYear },
                StudentID: ids
              }),
              perPage: 99999999
            })
          )
        )
      )
        .map(result => result.data || [])
        .reduce((arr, result) => {
          return [...arr, ...result];
        }, []);

      const concessions = (
        await Promise.all(
          _.chunk(communityIds, 100).map(ids =>
            SynDebtorStudentConcessionService.getAll({
              where: JSON.stringify({
                AutoTuitionCode: [
                  AUTO_TUITION_CODE_TUITION_CONCESSION,
                  AUTO_TUITION_CODE_TUITION
                ],
                ID: ids
              }),
              perPage: 99999999
            })
          )
        )
      )
        .map(result => result.data || [])
        .reduce((arr, result) => {
          return [...arr, ...result];
        }, [])
        .filter(concession => {
          if (
            moment(concession.EffectiveFromDate).year() > nextFileYear ||
            moment(concession.EffectiveToDate).year() < currentFileYear
          ) {
            return false;
          }
          return true;
        });

      const feesMap = vDebtorFees.reduce((map, fee) => {
        return { ...map, [fee.FeeCode]: fee };
      }, {});

      const tuitFeeMap = vDebtorFees
        .filter(
          tuitFee =>
            tuitFee.ActiveFlag === true &&
            [
              AUTO_TUITION_CODE_TUITION,
              AUTO_TUITION_CODE_CONSOLIDATED_CHARGES,
              AUTO_TUITION_CODE_OTHER_CHARGES,
            ].indexOf(tuitFee.AutoTuitionCode) >= 0
        )
        .reduce((map: iTuitionFeeMap, tuitionFee) => {
          const ylCode = `${tuitionFee.YearLevel}`;
          return {
            ...map,
            [ylCode]: [...(ylCode in map ? map[ylCode] : []), tuitionFee]
          };
        }, {});

      setTuitFeeCodeMap(
        vDebtorFees.reduce(
          (map, tuitFee) => ({
            ...map,
            [tuitFee.FeeCode]: tuitFee.Description
          }),
          {}
        )
      );

      const sibDisFees = vDebtorFees.filter(
        fee =>
          fee.ActiveFlag === true &&
          fee.FamilyPosition > 0 &&
          fee.DiscountPercentage > 0
      );

      const sIdMap: iSiblingIdsMap = {};
      const contactMap: { [key: number]: number[] } = studentContacts
        .sort((contact1, contact2) => {
          if (
            `${contact1.StudentBirthDate || ""}`.trim() >
            `${contact2.StudentBirthDate || ""}`.trim()
          ) {
            return 1;
          } else if (
            `${contact1.StudentBirthDate || ""}`.trim() <
            `${contact2.StudentBirthDate || ""}`.trim()
          ) {
            return -1
          } else {
            return contact1.StudentID > contact2.StudentID ? 1 : -1;
          }
        })
        .filter(contact => {
          return (!(!(contact.StudentID in commuMap)) );
        })
        .reduce((map, contact) => {
          return {
            ...map,
            [contact.ContactID]: _.uniq([
              // @ts-ignore
              ...(map[contact.ContactID] || []),
              contact.StudentID
            ])
          };
        }, {});
      Object.values(contactMap).forEach(studentIds => {
        if (studentIds.length <= 1) {
          return;
        }

        studentIds.forEach(studentId => {
          if (communityIds.indexOf(studentId) < 0) {
            return;
          }
          sIdMap[studentId] = studentIds;
        });
      });

      const concessMap = concessions.reduce(
        (map: iStudentConcessionMap, concession) => {
          const sId = `${concession.ID}`;
          return {
            ...map,
            [sId]: [
              ...(sId in map ? map[sId] : []),
              {
                ...concession,
                OverridePercentage:
                  concession.OverrideAmountFlag === true
                    ? concession.OverridePercentage
                    : concession.FeeCode in feesMap
                    ? // @ts-ignore
                      feesMap[concession.FeeCode].DiscountPercentage
                    : 0
              }
            ]
          };
        },
        {}
      );

      vStudents.forEach(student => {
        const yearLevelCode = student.StudentYearLevel;
        const studentWithFees = getFeeInfoForStudent(
          `${yearLevelCode}`,
          student,
          tuitFeeMap,
          concessMap,
          sibDisFees,
          sIdMap,
          commuMap
        );
        currentStudMap = {
          ...currentStudMap,
          // @ts-ignore
          total: [
            ...(currentStudMap.total || []),
            ...(selectedCampusCodes.length === 0 ||
            selectedCampusCodes.indexOf(student.StudentCampus) >= 0
              ? [studentWithFees]
              : [])
          ],
          [yearLevelCode]: [
            ...(currentStudMap[yearLevelCode] || []),
            studentWithFees
          ]
        };
        if (`${student.StudentLeavingDate || ""}`.trim() !== "") {
          currentLeaverStudMap = {
            ...currentLeaverStudMap,
            // @ts-ignore
            total: [
              ...(currentLeaverStudMap.total || []),
              ...(selectedCampusCodes.length === 0 ||
              selectedCampusCodes.indexOf(student.StudentCampus) >= 0
                ? [studentWithFees]
                : [])
            ],
            [yearLevelCode]: [
              ...(currentLeaverStudMap[yearLevelCode] || []),
              studentWithFees
            ]
          };
        }
      });

      const confirmedStudMap = confirmedStudents
        .filter(futureStudent => !(futureStudent.FutureID in currentSMap))
        .reduce((map, futureStudent) => {
          const ylCode = `${futureStudent.FutureYearLevel}`;
          const stud = SynVFutureStudent.mapFutureStudentToCurrent(
            futureStudent,
            yLevelMap
          );
          const studentWithFees = getFeeInfoForStudent(
            `${ylCode}`,
            stud,
            tuitFeeMap,
            concessMap,
            sibDisFees,
            sIdMap,
            commuMap
          );

          return {
            ...map,
            total: [
              // @ts-ignore
              ...(map.total || []),
              ...(selectedCampusCodes.length === 0 ||
              selectedCampusCodes.indexOf(stud.StudentCampus) >= 0
                ? [studentWithFees]
                : [])
            ],
            [ylCode]: [
              // @ts-ignore
              ...(map[ylCode] || []),
              studentWithFees
            ]
          };
        }, {});

      const yLevelCodes = luYearLevels.map(yearLevel => `${yearLevel.Code}`);
      setCommunityMap(commuMap);
      setCurrentStudentMap(currentStudMap);
      setCurrentStudentLeaverMap(currentLeaverStudMap);
      setYearLevelCodes(yLevelCodes);
      setYearLevelMap(yLevelMap);
      setTuitionFeeMap(tuitFeeMap);
      setConcessionMap(concessMap);
      setConfirmedFutureStudentMap(confirmedStudMap);
      setSiblingDiscountFees(sibDisFees);
      setSiblingIdsMap(sIdMap);
      setNextYearFunnelLeadMap(
        funnelLeads.reduce((map: iLeadMap, lead) => {
          const status = getStatusFromLead(lead);
          const yearLevelCode = getYearLevelFromLead(lead);
          const leadWithFeeInfo = getFeeInfoForStudent(
            `${yearLevelCode}`,
            lead,
            tuitFeeMap,
            concessMap,
            sibDisFees,
            sIdMap,
            commuMap
          );
          return {
            ...map,
            [status]: {
              // @ts-ignore
              ...map[status],
              total: [
                // @ts-ignore
                ...(map[status].total || []),
                leadWithFeeInfo
              ],
              [yearLevelCode]: [
                // @ts-ignore
                ...(map[status][yearLevelCode] || []),
                leadWithFeeInfo
              ]
            }
          };
        }, initLeadMap)
      );
    };

    getData()
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      });

    return () => {
      isCanceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    selectedCampusCodes,
    currentFileYear,
    nextFileYear,
    currentFileSemester,
    increasingPercentage
  ]);

  useEffect(() => {
    if (selectedCampusCodes.length <= 0) {
      setSelectedCampusCodes(["E", "J", "S"]);
    }
  }, [selectedCampusCodes]);

  useEffect(() => {
    setFutureNextYearMap(
      yearLevelCodes.reduce((map, code, currentIndex) => {
        const nextYearConfirmed =
          code in confirmedFutureStudentMap
            ? confirmedFutureStudentMap[code]
            : [];
        let currentYearStudentLowerLevel: iVStudent[] = [];
        let currentYearStudentLowerLevelCode;
        if (currentIndex > 0) {
          currentYearStudentLowerLevelCode =
            yearLevelCodes[MathHelper.sub(currentIndex, 1)];
          currentYearStudentLowerLevel =
            currentYearStudentLowerLevelCode in currentStudentMap
              ? currentStudentMap[currentYearStudentLowerLevelCode]
              : [];
          // if (code === "0") {
          //   currentYearStudentLowerLevel = currentYearStudentLowerLevel.filter(student => student.StudentLeavingDate === null);
          // }
        }
        const futureNextYear = [
          ...(currentYearStudentLowerLevel
            .filter(
              student => `${student.StudentLeavingDate || ""}`.trim() === ""
            )
            .map(student =>
              getFeeInfoForStudent(
                code,
                student,
                tuitionFeeMap,
                concessionMap,
                siblingDiscountFees,
                siblingIdsMap,
                communityMap
              )
            )),

        ];
        return {
          ...map,
          // @ts-ignore
          total: [...(map.total || []), ...nextYearConfirmed, ...futureNextYear],
          // @ts-ignore
          [code]: [...(map[code] || []), ...nextYearConfirmed, ...futureNextYear.filter(
            // @ts-ignore
            student => `${student.StudentLeavingDate || ""}`.trim() === "" && `${student.StudentStatus || ''}`.trim() !== SYN_STUDENT_STATUS_ID_REPEATING
          )],
          ...(`${currentYearStudentLowerLevelCode || ''}`.trim() === '' ? {} : {
            // @ts-ignore
            [currentYearStudentLowerLevelCode]: [...(map[currentYearStudentLowerLevelCode] || []), ...futureNextYear
              .filter(
                // @ts-ignore
                student => `${student.StudentLeavingDate || ""}`.trim() === "" && `${student.StudentStatus || ''}`.trim() === SYN_STUDENT_STATUS_ID_REPEATING
              )]
          })
        };
      }, {})
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentStudentMap,
    yearLevelCodes,
    confirmedFutureStudentMap,
    tuitionFeeMap,
    concessionMap,
    siblingDiscountFees,
    siblingIdsMap,
    communityMap,
  ]);

  const getSumPanel = (title: string, sumArr?: any) => {
    return (
      <Col sm={2}>
        <Panel title={title} className={"sum-div"}>
          <StudentNumberDetailsPopupBtn
            records={sumArr || []}
            size={"sm"}
            variant={"link"}
          >
            {sumArr?.length || 0}
          </StudentNumberDetailsPopupBtn>
        </Panel>
      </Col>
    );
  };

  const getSumPanels = () => {
    if (showSumPanels !== true) {
      return null;
    }

    return (
      <Row className={"section-row sum-div-wrapper"}>
        {getSumPanel("Current Students", currentStudentMap.total)}
        {getSumPanel("Current Leavers", currentStudentLeaverMap.total)}
        {getSumPanel("Confirmed", nextYearFunnelLeadMap.confirmed.total)}
        {getSumPanel("In Progress", nextYearFunnelLeadMap.inProgress.total)}
        {getSumPanel(`Future ${nextFileYear}`, futureNextYearMap.total)}
        {getSumPanel(
          "Leads & Tours",
          nextYearFunnelLeadMap.leadsAndTours.total
        )}
      </Row>
    );
  };

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />;
    }

    return (
      <>
        {getSumPanels()}
        <StudentNumberForecastTable
          nextFileYear={nextFileYear}
          showingFinanceFigures={showingFinanceFigures}
          yearLevelMap={yearLevelMap}
          selectedCampusCodes={selectedCampusCodes}
          currentStudentMap={currentStudentMap}
          currentStudentLeaverMap={currentStudentLeaverMap}
          nextYearFunnelLeadMap={nextYearFunnelLeadMap}
          futureNextYearMap={futureNextYearMap}
          confirmedFutureStudentMap={confirmedFutureStudentMap}
          feeNameMap={tuitFeeCodeMap}
        />
      </>
    );
  };

  const getExplanationPanel = () => {
    if (showExplanationPanel !== true) {
      return null;
    }
    return (
      <ExplanationPanel
        text={
          <>
            All number below are excluding Leavers and{" "}
            <b>
              Proposed Entry Year in :{" "}
              {[currentFileYear, nextFileYear].join(" & ")}
            </b>
            <ul>
              <li>
                <b>Current Student</b>: the number of student currently
              </li>
              <li>
                <b>Current Leavers</b>: current students who has a leaving date
                set
              </li>
              <li>
                <b>Confirmed</b>: All future students in Synergetic starting in{" "}
                {nextFileYear} with status "Application Finalised"
              </li>
              <li>
                <b>In Progress</b>: the number of leads from Funnel with status:{" "}
                {FUNNEL_STAGE_NAME_STUDENT_LEARNING_PROFILE},{" "}
                {FUNNEL_STAGE_NAME_INTERVIEW} & {FUNNEL_STAGE_NAME_OFFER_SENT}
              </li>
              <li>
                <b>Future {nextFileYear}</b>: = Current Student on Lower Year
                Level + Confirmed - leavers.
              </li>
              <li>
                <b>Leads & Tours</b>: the number of leads from Funnel with
                status: {FUNNEL_STAGE_NAME_ENQUIRY},{" "}
                {FUNNEL_STAGE_NAME_SCHOOL_VISIT} &{" "}
                {FUNNEL_STAGE_NAME_APPLICATION_RECEIVED}
              </li>
            </ul>
          </>
        }
      />
    );
  };

  const setPercentage = (
    event: React.KeyboardEvent<any> | React.FocusEvent<any>
  ) => {
    const value = event.target.value;
    if (
      !UtilsService.isNumeric(value) ||
      Number(value) > 100 ||
      Number(value) < 0
    ) {
      Toaster.showToast(
        `value needs to be a number between 0 and 100`,
        TOAST_TYPE_ERROR
      );
      return;
    }
    setIncreasingPercentage(Number(value));
  };

  const getFinanceFigureSwitch = () => {
    if (showFinanceFigures !== true) {
      return null;
    }
    return (
      <>
        <ToggleBtn
          className={"showing-toggle"}
          on={"AUD $"}
          off={"Count"}
          size={"sm"}
          checked={showingFinanceFigures === true}
          onChange={checked => setShowingFinanceFigures(checked)}
        />
        <FlexContainer className={"with-gap align-items-center"}>
          <div>Increasing for {nextFileYear}: </div>
          <FormControl
            placeholder={"increase percentage"}
            defaultValue={increasingPercentage}
            type={"number"}
            className={"increasing-percentage"}
            onBlur={event => setPercentage(event)}
            onKeyDown={event => {
              if (event.key !== "Enter") {
                return;
              }
              setPercentage(event);
            }}
          />
          <div>%</div>
        </FlexContainer>
      </>
    );
  };

  return (
    <Wrapper>
      {getExplanationPanel()}
      <PanelTitle className={"title-row section-row"}>
        <div className={"title"}>Student Numbers</div>
        <SynCampusSelector
          className={"campus-selector"}
          allowClear={false}
          isMulti
          values={selectedCampusCodes}
          onSelect={values => {
            const codes = (values === null
              ? []
              : Array.isArray(values)
              ? values
              : [values]
            )
              .map(value => `${value.value}`.trim())
              .filter(code => code !== "");
            setSelectedCampusCodes(codes);
          }}
        />
        {getFinanceFigureSwitch()}
      </PanelTitle>
      {getContent()}
    </Wrapper>
  );
};

export default StudentNumberForecastDashboard;
