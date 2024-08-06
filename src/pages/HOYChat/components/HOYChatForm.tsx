import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import FormLabel from "../../../components/form/FormLabel";
import { useEffect, useState } from "react";
import MggsModuleService from "../../../services/Module/MggsModuleService";
import { MGGS_MODULE_ID_HOY_CHAT_EMAIL } from "../../../types/modules/iModuleUser";
import Toaster from "../../../services/Toaster";
import SelectBox from "../../../components/common/SelectBox";
import { Alert, Button, Col, FormControl, Row, Spinner } from "react-bootstrap";
import SynVStudentService from "../../../services/Synergetic/Student/SynVStudentService";
import SchoolManagementTeamService from "../../../services/Synergetic/SchoolManagementTeamService";
import moment from "moment-timezone";
import iSchoolManagementTeam, {
  SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR
} from "../../../types/Synergetic/iSchoolManagementTeam";
import SectionDiv from "../../../components/common/SectionDiv";
import iVStudent from "../../../types/Synergetic/Student/iVStudent";
import { CAMPUS_CODE_SENIOR } from "../../../types/Synergetic/Lookup/iSynLuCampus";
import UploadFilePanel, {MAX_FILE_SIZE} from "../../../components/Asset/UploadFilePanel";
import iAsset from "../../../types/asset/iAsset";
import AssetService from "../../../services/Asset/AssetService";
import * as _ from "lodash";
import Table, { iTableColumn } from "../../../components/common/Table";
import UtilsService from "../../../services/UtilsService";
import * as Icons from "react-bootstrap-icons";
import Page401 from "../../../components/Page401";
import PageLoadingSpinner from "../../../components/common/PageLoadingSpinner";
import FormErrorDisplay, {
  iErrorMap
} from "../../../components/form/FormErrorDisplay";
import LoadingBtn from "../../../components/common/LoadingBtn";
import HOYChatService from "../../../services/HOYChat/HOYChatService";
import {FlexContainer} from '../../../styles';
import MathHelper from '../../../helper/MathHelper';

const Wrapper = styled.div``;

type iSubmittingData = {
  contactReason: string;
  comments: string;
};

type iUpLoadingAsset = {
  file: File;
  id: string;
};

type iHoyMap = { [key: string]: iSchoolManagementTeam };

const MAX_CHARS_FOR_COMMENTS = 300;

const HOYChatForm = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [contactReasons, setContactReasons] = useState<string[]>([]);
  const [currentStudent, setCurrentStudent] = useState<iVStudent | null>(null);
  const [hoyMap, setHoyMap] = useState<iHoyMap>({});
  const [uploadingAssets, setUploadingAssets] = useState<iUpLoadingAsset[]>([]);
  const [assetList, setAssetList] = useState<iAsset[]>([]);
  const [errorMap, setErrorMap] = useState<iErrorMap>({});
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState<
    boolean | null
  >(null);

  const [submittingData, setSubmittingData] = useState<iSubmittingData | null>(
    null
  );

  const currentYear = user?.SynCurrentFileSemester?.FileYear || moment().year();
  const currentFileSemester = user?.SynCurrentFileSemester?.FileSemester || 1;

  useEffect(() => {
    let isCanceled = false;

    const currentSynId = `${user?.synergyId || ""}`.trim();
    Promise.all([
      MggsModuleService.getModule(MGGS_MODULE_ID_HOY_CHAT_EMAIL),
      SchoolManagementTeamService.getSchoolManagementTeams({
        where: JSON.stringify({
          FileYear: currentYear,
          FileSemester: currentFileSemester,
          SchoolRoleCode: SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR
        }),
        include: "SynSSTStaff"
      }),
      ...(user?.isStudent === true && currentSynId !== ""
        ? [
            SynVStudentService.getVStudentAll({
              where: JSON.stringify({
                ID: currentSynId,
                StudentCampus: CAMPUS_CODE_SENIOR,
                FileYear: currentYear,
                FileSemester: currentFileSemester
              }),
              sort: "FileYear:DESC,FileSemester:DESC",
              perPage: 1
            })
          ]
        : [])
    ])
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const settings = resp[0].settings || {};
        setContactReasons(
          "contactReasons" in settings ? settings.contactReasons : {}
        );
        setHoyMap(
          (resp[1] || []).reduce((map, smt) => {
            return {
              ...map,
              [`${smt.YearLevelCode || ""}`.trim()]: smt
            };
          }, {})
        );

        if (user?.isStudent === true && currentSynId !== "") {
          const vStudents = resp[2].data || [];
          setCurrentStudent(vStudents.length > 0 ? vStudents[0] : null);
        }
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      isCanceled = true;
    };
  }, [user?.isStudent, user?.synergyId, currentYear, currentFileSemester]);

  const getYearLevelCoordinator = () => {
    const currentStudentYearLevelCode = `${currentStudent?.StudentYearLevel ||
      ""}`.trim();
    if (currentStudentYearLevelCode === "") {
      return null;
    }
    if (!(currentStudentYearLevelCode in hoyMap)) {
      return null;
    }

    return hoyMap[currentStudentYearLevelCode];
  };

  const getYearLevelCoordinatorName = () => {
    const hoy = getYearLevelCoordinator();
    return [
      `${hoy?.SynSSTStaff?.Title || ""}`.trim(),
      `${hoy?.SynSSTStaff?.Surname || ""}`.trim()
    ]
      .filter(name => name !== "")
      .join(" ");
  };

  const getFileId = (file: File) => {
    return `uploading_${file.lastModified}_${file.name}`;
  };

  const uploadFile = (file: File): Promise<iAsset | null> => {
    const formData = new FormData();
    formData.append("file", file);

    return AssetService.upload(formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
      .then(resp => {
        setAssetList([resp, ...(assetList || [])]);
        setUploadingAssets(
          uploadingAssets.filter(
            uploadingAsset =>
              uploadingAsset.id !== getFileId(uploadingAsset.file)
          )
        );
        return resp;
      })
      .catch(err => {
        setUploadingAssets(
          uploadingAssets.filter(
            uploadingAsset =>
              uploadingAsset.id !== getFileId(uploadingAsset.file)
          )
        );
        Toaster.showApiError(err);
        return null;
      });
  };

  const uploadFiles = (files: File[]) => {
    const ulAssets: iUpLoadingAsset[] = files.reverse().map(file => {
      return {
        id: getFileId(file),
        file
      };
    });
    setUploadingAssets(
      _.uniqBy([...ulAssets, ...uploadingAssets], asset => asset.id)
    );

    Promise.all(files.map(file => uploadFile(file))).then(resp => {
      const uploadingAssetIds = files.map(file => getFileId(file));
      setUploadingAssets(
        uploadingAssets.filter(
          uploadingAsset => uploadingAssetIds.indexOf(uploadingAsset.id) <= 0
        )
      );

      setAssetList(
        // @ts-ignore
        [...(resp || []), ...(assetList || [])]
          .filter(asset => asset !== null)
          .sort((asset1, asset2) =>
            `${asset1?.createdAt || ""}` < `${asset2?.createdAt || ""}` ? 1 : -1
          )
      );
    });
  };

  const getAssetTable = () => {
    type iRow = {
      isLoading: boolean;
      fileName: string;
      fileSize: number;
      url?: string;
      id: string;
    };
    const rows: iRow[] = [
      ...(uploadingAssets || []).map(i => ({
        isLoading: true,
        fileName: i.file.name,
        fileSize: i.file.size,
        id: i.id
      })),
      ...(assetList || []).map(i => ({
        isLoading: false,
        fileName: i.fileName,
        fileSize: i.fileSize || 0,
        url: i.downloadUrl,
        id: i.id
      }))
    ];
    if (rows.length <= 0) {
      return null;
    }
    return (
      <Table
        rows={rows}
        columns={[
          {
            key: "Name",
            header: "File",
            cell: (col: iTableColumn<iRow>, data: iRow) => {
              return (
                <td key={col.key}>
                  <Button variant={"link"} size={"sm"} href={data.url || ""}>
                    {data.fileName}
                  </Button>{" "}
                </td>
              );
            }
          },
          {
            key: "Size",
            header: "Size",
            cell: (col: iTableColumn<iRow>, data: iRow) => {
              return (
                <td key={col.key}>
                  {UtilsService.formatBytesToHuman(data.fileSize)}
                </td>
              );
            }
          },
          {
            key: "btns",
            header: "",
            cell: (col: iTableColumn<iRow>, data: iRow) => {
              return (
                <td key={col.key}>
                  {data.isLoading === true ? (
                    <Spinner />
                  ) : (
                    <Button
                      variant={"outline-danger"}
                      size={"sm"}
                      onClick={() =>
                        setAssetList(prevState =>
                          prevState.filter(asset => asset.id !== data.id)
                        )
                      }
                    >
                      <Icons.Trash />
                    </Button>
                  )}
                </td>
              );
            }
          }
        ]}
        hover
        striped
        responsive
      />
    );
  };

  const handleFieldChange = (fieldName: string, newValue: string) => {
    // @ts-ignore
    setSubmittingData({
      ...(submittingData || {}),
      [fieldName]: newValue
    });
  };

  const preCheck = () => {
    const errors: iErrorMap = {};

    if (`${submittingData?.contactReason || ""}`.trim() === "") {
      errors.contactReason = "Contact Reason is required.";
    }

    if (`${submittingData?.comments || ""}`.trim() === "") {
      errors.comments = "Comments are required.";
    }

    setErrorMap(errors);
    return Object.keys(errors).length === 0;
  };

  const doSubmit = () => {
    if (!preCheck()) {
      return;
    }

    const data = {
      contactReason: submittingData?.contactReason || "",
      comments: submittingData?.comments || "",
      attachments: assetList.map(i => i.id)
    };

    setIsSaving(true);
    HOYChatService.submitForm(data)
      .then(() => {
        setIsSavedSuccessfully(true);
      })
      .catch(err => {
        Toaster.showApiError(err);
        setIsSavedSuccessfully(false);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const getCharsLeft = () => {
    return MathHelper.sub(MAX_CHARS_FOR_COMMENTS, `${submittingData?.comments || ''}`.length);
  }

  const getContent = () => {
    if (isSavedSuccessfully === true) {
      return (
        <Alert className={"bg-primary text-white"}>
          Thank you for your submission,{" "}
          {user?.SynCommunity?.Preferred || user?.firstName}. Your comment has
          been sent to {getYearLevelCoordinatorName()}.
        </Alert>
      );
    }

    return (
      <>
        <Row>
          <Col xs={12} md={6}>
            <FormLabel isRequired label={"I would like to share my HOY:"} />
            <SelectBox
              className="mconnect_selectbox"
              isInvalid={"contactReason" in errorMap}
              onChange={option =>
                handleFieldChange("contactReason", option.value || "")
              }
              options={contactReasons.map(option => ({
                value: option,
                label: option
              }))}
            />
            <FormErrorDisplay
              errorsMap={errorMap}
              fieldName={"contactReason"}
            />
          </Col>
        </Row>

        <SectionDiv>
          <Row>
            <Col xs={12}>
              <FormLabel
                isRequired
                label={
                  <>
                    Write what you would like to share with{" "}
                    <b>{getYearLevelCoordinatorName()}</b>
                  </>
                }
              />
              <FormControl
                className={"mconnect_textarea no-margin"}
                isInvalid={"comments" in errorMap}
                as={"textarea"}
                rows={6}
                value={submittingData?.comments || ''}
                placeholder={`Write what you would like to share with ${getYearLevelCoordinatorName()}. Max ${MAX_CHARS_FOR_COMMENTS} characters.`}
                onChange={event => {
                  handleFieldChange("comments", `${event.target.value || ""}`.substring(0, MAX_CHARS_FOR_COMMENTS))
                }}
              />
              <FlexContainer className={'justify-content-between'}>
                <div><FormErrorDisplay errorsMap={errorMap} fieldName={"comments"} /></div>
                <div className={getCharsLeft() <= 0 ? 'text-danger' : 'text-muted'}>You can still type {MathHelper.sub(MAX_CHARS_FOR_COMMENTS, `${submittingData?.comments || ''}`.length)} characters.</div>
              </FlexContainer>
            </Col>
          </Row>
        </SectionDiv>

        <SectionDiv>
          <Row>
            <Col xs={12}>
              <FormLabel label={<>Attachments (screenshots or files)</>} />
              <UploadFilePanel
                className={"uploader-btn"}
                uploadFn={uploadFiles}
                description={
                  <>
                    <div>
                      Click here to upload files or drag file(s) to below area
                    </div>
                    <div>Max File Size: {UtilsService.formatBytesToHuman(MAX_FILE_SIZE)}</div>
                  </>
                }
                allowMultiple
              />
              {getAssetTable()}
            </Col>
          </Row>
        </SectionDiv>

        <SectionDiv>
          <Row>
            <Col xs={12}>
              {isSavedSuccessfully === false ? (
                <Alert className={"bg-warning text-muted"}>
                  We ran into a problem sending your message. Try refreshing
                  this page and try again. If this problem keeps happening,
                  contact IT for assistance.
                </Alert>
              ) : null}
              <LoadingBtn
                className={"mconnect_submit_button"}
                onClick={() => doSubmit()}
                isLoading={isSaving === true || uploadingAssets.length > 0}
              >
                <Icons.Send /> Send to my HOY
              </LoadingBtn>
            </Col>
          </Row>
        </SectionDiv>
      </>
    );
  };

  if (isLoading === true) {
    return <PageLoadingSpinner />;
  }

  if (currentStudent === null) {
    return (
      <Page401
        description={
          <Alert variant={"danger"}>
            The HOY Chat form is <b>ONLY</b> available to <b>secondary</b>{" "}
            students.
            <br /> Please speak to a HOY directly if you’d like to raise a
            message of concern.
          </Alert>
        }
      />
    );
  }

  return (
    <Wrapper>
      <h5 className={"mconnect-heading"}>HOY Chat</h5>
      {getContent()}
    </Wrapper>
  );
};

export default HOYChatForm;
