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
import SynVStudentService from "../../../services/Synergetic/SynVStudentService";
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
import iVStudent from "../../../types/Synergetic/iVStudent";
import StudentNumberForecastTable from "./components/StudentNumberForecastTable";
import StudentNumberDetailsPopupBtn from "./components/StudentNumberDetailsPopupBtn";
import SynVDebtorFeeService from "../../../services/Synergetic/Finance/SynVDebtorFeeService";
import iSynVDebtorFee, {
  AUTO_TUITION_VARIATION_TYPE_FULL_FEE
} from "../../../types/Synergetic/Finance/iSynVDebtorFee";
import ToggleBtn from "../../common/ToggleBtn";
import {
  OP_BETWEEN,
  OP_GT,
  OP_GTE,
  OP_LTE,
  OP_OR
} from "../../../helper/ServiceHelper";
import SynVFutureStudentService from "../../../services/Synergetic/SynVFutureStudent";
import { FUTURE_STUDENT_STATUS_FINALISED } from "../../../types/Synergetic/iSynVFutureStudent";
import SynVFutureStudent from "../../../services/Synergetic/SynVFutureStudent";
import { FlexContainer } from "../../../styles";
import UtilsService from "../../../services/UtilsService";
import SynDebtorStudentConcessionService from "../../../services/Synergetic/Finance/SynDebtorStudentConcessionService";
import {
  AUTO_TUITION_CODE_CONSOLIDATED_CHARGES,
  AUTO_TUITION_CODE_TUITION,
  AUTO_TUITION_CODE_TUITION_CONCESSION
} from "../../../types/Synergetic/Finance/iSynLuDebtorAutoTuition";
import iSynDebtorStudentConcession from "../../../types/Synergetic/Finance/iSynDebtorStudentConcession";

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

type iStudentMap = { [key: string]: iVStudent[] };
type iMap = { [key: string]: iFunnelLead[] };
type iTuitionFeeMap = { [key: string]: iSynVDebtorFee[] };
type iStudentConcessionMap = { [key: string]: iSynDebtorStudentConcession[] };
type iSiblingDiscountFee = iSynVDebtorFee & { discountAmount?: number };
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
  const [increasingPercentage, setIncreasingPercentage] = useState(0);
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
    siblingDisFees: iSynVDebtorFee[]
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
            tuitFee.AutoTuitionCode === AUTO_TUITION_CODE_CONSOLIDATED_CHARGES
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
            (moment(concession.EffectiveFromDate).year() <= currentFileYear ||
              concession.EffectiveFromDate === null) &&
            (moment(concession.EffectiveToDate).year() >= currentFileYear ||
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
            (moment(concession.EffectiveFromDate).year() <= currentFileYear ||
              concession.EffectiveFromDate === null) &&
            (moment(concession.EffectiveToDate).year() > currentFileYear ||
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
    if (
      "StudentFamilyPosition" in record &&
      record.StudentFamilyPosition > 0 &&
      "TuitionNoSibFlag" in record &&
      record.TuitionNoSibFlag !== true
    ) {
      siblingDisFees
        .filter(fee => fee.FamilyPosition === record.StudentFamilyPosition)
        .forEach(fee => {
          currentSiblingDiscounts.push({
            ...fee,
            discountAmount: MathHelper.mul(
              yearLevelTuitionFees,
              MathHelper.div(fee.DiscountPercentage, 100)
            )
          });
          nextYearSiblingDiscounts.push({
            ...fee,
            discountAmount: MathHelper.mul(
              getNextFeeWithIncreasingPercentage(yearLevelTuitionFees),
              MathHelper.div(fee.DiscountPercentage, 100)
            )
          });
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
      nextYearSiblingDiscountFees,
    };
  };

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    const yearLevelForLeads = getYearLevelForLead(selectedCampusCodes);

    Promise.all([
      SynVStudentService.getCurrentVStudents({
        where: JSON.stringify({
          FileYear: currentFileYear,
          FileSemester: currentFileSemester,
          StudentActiveFlag: true
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
      SynDebtorStudentConcessionService.getAll({
        where: JSON.stringify({
          AutoTuitionCode: [
            AUTO_TUITION_CODE_TUITION_CONCESSION,
            AUTO_TUITION_CODE_TUITION
          ],
          OverridePercentage: { [OP_GT]: 0 },
          [OP_OR]: [
            {
              EffectiveFromDate: {
                [OP_BETWEEN]: [
                  `${currentFileYear}-01-01T00:00:00Z`,
                  `${nextFileYear}-12-31T23:59:59Z`
                ]
              }
            },
            {
              EffectiveToDate: {
                [OP_BETWEEN]: [
                  `${currentFileYear}-01-01T00:00:00Z`,
                  `${nextFileYear}-12-31T23:59:59Z`
                ]
              }
            },
            {
              EffectiveFromDate: {
                [OP_LTE]: `${currentFileYear}-01-01T00:00:00Z`
              },
              EffectiveToDate: { [OP_GTE]: `${nextFileYear}-12-31T23:59:59Z` }
            }
          ]
        }),
        perPage: 99999999
      }),
      SynVDebtorFeeService.getAll({
        perPage: 99999999
      }),
      SynVFutureStudentService.getAll({
        where: JSON.stringify({
          FutureStatus: FUTURE_STUDENT_STATUS_FINALISED,
          FutureEnrolYear: { [OP_LTE]: nextFileYear }
        }),
        perPage: 99999999
      })
    ])
      .then(resp => {
        if (isCanceled) return;
        let currentStudMap: iStudentMap = {};
        let currentLeaverStudMap: iStudentMap = {};
        const yLevelMap = resp[2].reduce((map, yearLevel) => {
          return {
            ...map,
            [`${yearLevel.Code}`]: yearLevel
          };
        }, {});
        const fees = resp[4].data || [];
        const tuitFeeMap = fees
          .filter(
            tuitFee =>
              tuitFee.ActiveFlag === true &&
              [
                AUTO_TUITION_CODE_TUITION,
                AUTO_TUITION_CODE_CONSOLIDATED_CHARGES
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
          fees.reduce(
            (map, tuitFee) => ({
              ...map,
              [tuitFee.FeeCode]: tuitFee.Description
            }),
            {}
          )
        );
        const sibDisFees = fees.filter(
          fee =>
            fee.ActiveFlag === true &&
            fee.FamilyPosition > 0 &&
            fee.DiscountPercentage > 0
        );
        const concessMap = (resp[3].data || []).reduce(
          (map: iStudentConcessionMap, concession) => {
            const sId = `${concession.ID}`;
            return {
              ...map,
              [sId]: [...(sId in map ? map[sId] : []), concession]
            };
          },
          {}
        );

        const currentStudentIds: number[] = [];
        resp[0].forEach(student => {
          currentStudentIds.push(student.StudentID);
          const yearLevelCode = student.StudentYearLevel;
          const studentWithFees = getFeeInfoForStudent(
            `${yearLevelCode}`,
            student,
            tuitFeeMap,
            concessMap,
            sibDisFees
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
        const confirmedStudMap = (resp[5].data || [])
          .filter(
            futureStudent =>
              currentStudentIds.indexOf(futureStudent.FutureID) < 0
          )
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
              siblingDiscountFees
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
        setCurrentStudentMap(currentStudMap);
        setCurrentStudentLeaverMap(currentLeaverStudMap);
        setYearLevelCodes(resp[2].map(yearLevel => `${yearLevel.Code}`));
        setYearLevelMap(yLevelMap);
        setTuitionFeeMap(tuitFeeMap);
        setConcessionMap(concessMap);
        setConfirmedFutureStudentMap(confirmedStudMap);
        setSiblingDiscountFees(sibDisFees);
        setNextYearFunnelLeadMap(
          (resp[1].data || []).reduce((map: iLeadMap, lead) => {
            const status = getStatusFromLead(lead);
            const yearLevelCode = getYearLevelFromLead(lead);
            const leadWithFeeInfo = getFeeInfoForStudent(
              `${yearLevelCode}`,
              lead,
              tuitFeeMap,
              concessMap,
              sibDisFees
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
      })
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
        if (currentIndex > 0) {
          const currentYearStudentLowerLevelCode =
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
          ...currentYearStudentLowerLevel
            .filter(
              student => `${student.StudentLeavingDate || ""}`.trim() === ""
            )
            .map(student =>
              getFeeInfoForStudent(
                code,
                student,
                tuitionFeeMap,
                concessionMap,
                siblingDiscountFees
              )
            ),
          ...nextYearConfirmed
        ];
        return {
          ...map,
          // @ts-ignore
          total: [...(map.total || []), ...futureNextYear],
          // @ts-ignore
          [code]: [...(map[code] || []), ...futureNextYear]
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
    siblingDiscountFees
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
                {/*<b>Confirmed</b>: the number of leads from Funnel with status:{" "}*/}
                {/*{FUNNEL_STAGE_NAME_EXPORTED} &{" "}*/}
                {/*{FUNNEL_STAGE_NAME_OFFER_ACCEPTED}*/}
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
