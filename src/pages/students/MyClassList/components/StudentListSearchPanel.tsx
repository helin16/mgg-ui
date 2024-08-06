import styled from "styled-components";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import FormLabel from "../../../../components/form/FormLabel";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import UtilsService from "../../../../services/UtilsService";
import SynSubjectClassSelector from "../../../../components/student/SynSubjectClassSelector";
import LoadingBtn from "../../../../components/common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/makeReduxStore";
import SynVStudentClassService from "../../../../services/Synergetic/Student/SynVStudentClassService";
import Toaster from "../../../../services/Toaster";
import moment from "moment-timezone";
import * as _ from "lodash";
import { HEADER_NAME_SELECTING_FIELDS } from "../../../../services/AppService";
import AuthService from "../../../../services/AuthService";
import { MGGS_MODULE_ID_MY_CLASS_LIST } from "../../../../types/modules/iModuleUser";
import LuFormSelector from "../../../../components/student/SynFormSelector";
import SynLuFormService from "../../../../services/Synergetic/Lookup/SynLuFormService";
import { FlexContainer } from "../../../../styles";
import YearLevelSelector from "../../../../components/student/YearLevelSelector";

export type iSearchCriteria = {
  searchText: string;
  classCodes: string[];
  yearLevelCodes?: string[];
  form?: string;
};

type iStudentListSearchPanel = {
  preSelectedClassCodes?: string[];
  isLoading: boolean;
  onSearch?: (criteria: iSearchCriteria) => void;
};

type iSearchLimits = {
  classCodes?: string[];
  forms?: string[];
};

const Wrapper = styled.div`
  .btns {
    padding-left: 0px;
    padding-right: 0px;
  }
`;
const StudentListSearchPanel = ({
  isLoading = false,
  preSelectedClassCodes = [],
  onSearch
}: iStudentListSearchPanel) => {
  const initialSearchCriteria: iSearchCriteria = {
    searchText: "",
    classCodes: preSelectedClassCodes
  };
  const [searchLimits, setSearchLimits] = useState<iSearchLimits>(
    initialSearchCriteria
  );
  const [searchCriteria, setSearchCriteria] = useState<iSearchCriteria>(
    initialSearchCriteria
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSearching, setIsSearching] = useState(false);
  const [isModuleUser, setIsModuleUser] = useState(false);
  const [showAdvPanel, setShowAdvPanel] = useState(false);

  useEffect(() => {
    let isCanceled = false;
    setIsSearching(true);

    Promise.all([
      SynVStudentClassService.getAll(
        {
          where: JSON.stringify({
            StaffID: user?.synergyId || 0,
            FileYear: user?.SynCurrentFileSemester?.FileYear || moment().year(),
            FileSemester: user?.SynCurrentFileSemester?.FileSemester || 1
          }),
          perPage: 9999999
        },
        {
          headers: {
            [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify(["ClassCode"])
          }
        }
      ),
      AuthService.canAccessModule(MGGS_MODULE_ID_MY_CLASS_LIST),
      SynLuFormService.getAll({
        where: JSON.stringify({
          ID: user?.synergyId
        })
      })
    ])
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const canAccessRoles = Object.keys(resp[1])
          // @ts-ignore
          .filter((roleId: number) => resp[1][roleId].canAccess === true)
          .reduce((map, roleId) => {
            return {
              ...map,
              // @ts-ignore
              [roleId]: resp[roleId]
            };
          }, {});
        const isModUser = Object.keys(canAccessRoles).length > 0;
        setIsModuleUser(isModUser);
        const userClassCodes = _.uniq(
          (resp[0].data || []).map(studentClass => studentClass.ClassCode)
        );
        setSearchCriteria(searchCriteria => ({
          ...searchCriteria,
          classCodes: userClassCodes
        }));

        if (isModUser !== true) {
          setSearchLimits({
            classCodes: userClassCodes,
            forms: (resp[2] || []).map(luForm => luForm.Code)
          });
        }
      })
      .catch((err: any) => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsSearching(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [
    user?.synergyId,
    user?.SynCurrentFileSemester?.FileYear,
    user?.SynCurrentFileSemester?.FileSemester
  ]);

  const getAdvSearchBtn = () => {
    if (!isModuleUser) {
      return <div />;
    }

    return (
      <Button
        variant={"link"}
        size={"sm"}
        onClick={() => {
          setShowAdvPanel(!showAdvPanel);
        }}
      >
        Adv. {showAdvPanel ? <Icons.ChevronDown /> : <Icons.ChevronUp />}
      </Button>
    );
  };

  const getAdvancedPanel = () => {
    if (!showAdvPanel) {
      return null;
    }

    return (
      <Row>
        <Col>
          <FormLabel label={"Year Level"} />
          <YearLevelSelector
            allowClear
            isMulti
            values={searchCriteria.yearLevelCodes || []}
            onSelect={values => {
              setSearchCriteria({
                ...searchCriteria,
                yearLevelCodes: (values === null
                    ? []
                    : Array.isArray(values)
                      ? values
                      : [values]
                ).map(value => `${value.value}`)
              })
            }}
          />
        </Col>
      </Row>
    );
  };

  if (isSearching === true) {
    return (
      <Wrapper>
        <Spinner animation={"border"} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Row>
        <Col sm={6} md={2}>
          <FormLabel label={"Student"} />
          <Form.Control
            placeholder="Student name or ID e.g. 'Amanda'"
            value={searchCriteria.searchText}
            onChange={event =>
              setSearchCriteria({
                ...searchCriteria,
                searchText: event.target.value
              })
            }
            onKeyUp={event =>
              UtilsService.handleEnterKeyPressed(
                event,
                () => onSearch && onSearch(searchCriteria)
              )
            }
          />
        </Col>
        <Col md={2} sm={6}>
          <FormLabel label={"Form"} />
          <LuFormSelector
            values={
              `${searchCriteria.form || ""}`.trim() === ""
                ? []
                : [`${searchCriteria.form || ""}`.trim()]
            }
            limitCodes={searchLimits.forms || []}
            onSelect={options => {
              setSearchCriteria({
                ...searchCriteria,
                // @ts-ignore
                form: options?.value
              });
            }}
          />
        </Col>
        <Col md={7} sm={12}>
          <FormLabel label={"Classes"} />
          <SynSubjectClassSelector
            pageSize={9999}
            FileYear={user?.SynCurrentFileSemester?.FileYear || moment().year()}
            FileSemester={user?.SynCurrentFileSemester?.FileSemester || 1}
            values={searchCriteria.classCodes}
            limitedClassCodes={searchLimits.classCodes || []}
            isMulti
            allowClear={isModuleUser === true}
            onSelect={values =>
              setSearchCriteria({
                ...searchCriteria,
                classCodes: (values === null
                  ? []
                  : Array.isArray(values)
                  ? values
                  : [values]
                ).map(value => `${value.value}`)
              })
            }
          />
        </Col>
        <Col md={1} sm={12} className={"btns"}>
          <FormLabel label={" "} />
          <FlexContainer
            className={"justify-content-between align-content-end"}
          >
            {getAdvSearchBtn()}
            <LoadingBtn
              isLoading={isLoading || isSearching}
              variant={"primary"}
              icon={<Icons.Search />}
              onClick={() =>
                onSearch &&
                onSearch({
                  ...searchCriteria,
                  classCodes:
                    searchCriteria.classCodes.length <= 0
                      ? searchLimits.classCodes || []
                      : searchCriteria.classCodes
                })
              }
            />
          </FlexContainer>
        </Col>
      </Row>
      {getAdvancedPanel()}
    </Wrapper>
  );
};

export default StudentListSearchPanel;
