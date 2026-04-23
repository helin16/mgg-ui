import styled from "styled-components";
import React, { useState } from "react";
import JSZip from "jszip";
import { Alert, Spinner } from "react-bootstrap";
import EmptyState from "../../../../components/common/EmptyState";
import Table, { iTableColumn } from "../../../../components/common/Table";
import SynCommunityService from "../../../../services/Synergetic/Community/SynCommunityService";
import iSynCommunity from "../../../../types/Synergetic/iSynCommunity";
import Toaster from "../../../../services/Toaster";
import _ from "lodash";
import { FlexContainer } from "../../../../styles";
import LoadingBtn from "../../../../components/common/LoadingBtn";
import SynVDocumentService from "../../../../services/Synergetic/SynVDocumentService";
import { DOCUMENT_CLASSIFICATION_CODE_ARCHIVED_STUDENT_REPORTS } from "../../../../types/Synergetic/iSynVDocument";
import UploadFilePanel from "../../../../components/Asset/UploadFilePanel";
import UtilsService from "../../../../services/UtilsService";

const Wrapper = styled.div`
  td.checkbox-col {
    width: 40px;
  }
  td.student-id-col {
    width: 100px;
  }
  td.student-col {
    width: 200px;
  }
  td.file-col {
    width: 500px;
  }
`;
const MAX_ZIP_FILE_SIZE = 600 * 1024 * 1024;

type iUploadRecord = {
  studentId: string;
  fileName: string;
  zipFile: JSZip.JSZipObject;
  isUploading: boolean;
  uploadingError?: string;
  uploadingSucc?: string;
  isGettingStudent: boolean;
  isOKToUpload?: boolean;
  student?: iSynCommunity;
  studentError?: string;
};

type iUploadMap = {
  [key: string]: iUploadRecord;
};
const ReportsUploader = () => {
  const [hasError, setHasError] = useState(false);
  const [isUnzipping, setIsUnzipping] = useState(false);
  const [uploadMap, setUploadMap] = useState<iUploadMap | null>(null);
  const [selectedStudentIDs, setSelectedStudentIDs] = useState<string[]>([]);

  const handleFileUpload = async (files: File[]) => {
    if (files.length <= 0) {
      return;
    }
    const file = files[0];

    const zip = new JSZip();
    setIsUnzipping(true);
    try {
      // Read the file as an ArrayBuffer
      const fileData = await file.arrayBuffer();
      // Load the zip content
      const zipContent = await zip.loadAsync(fileData);

      // Filter for folders and update state
      const filesMap: iUploadMap = {};
      zipContent.forEach((relativePath, zFile) => {
        if (zFile.dir) {
          return;
        }

        const [studentId, ...filePaths] = `${zFile.name || ""}`
          .trim()
          .split("/");
        const fileName = filePaths.join("/").trim();
        const studentIdStr = `${studentId || ""}`.trim();
        if (studentIdStr !== "" && fileName !== "" && UtilsService.isNumeric(studentIdStr)) {
          filesMap[studentIdStr] = {
            fileName,
            zipFile: zFile,
            studentId: studentIdStr,
            isUploading: false,
            isGettingStudent: true
          };
        }
      });
      const studentIds = Object.keys(filesMap);
      if (studentIds.length > 0) {
        setUploadMap(filesMap);
        SynCommunityService.getCommunityProfiles({
          where: JSON.stringify({ ID: studentIds }),
          perPage: 999999999
        })
          .then(resp => {
            const profiles = resp.data || [];
            const profilesMap = profiles.reduce((acc, profile) => {
              acc[profile.ID] = profile;
              return acc;
            }, {} as { [key: string]: iSynCommunity });

            setSelectedStudentIDs(Object.keys(profilesMap));
            setUploadMap(prev => {
              const newMap = { ...prev };
              Object.keys(newMap).forEach(studentId => {
                newMap[studentId] = {
                  ...newMap[studentId],
                  isGettingStudent: false,
                  isOKToUpload: studentId in profilesMap,
                  student: profilesMap[studentId] || undefined,
                  studentError:
                    studentId in profilesMap ? undefined : "Student not found"
                };
              });
              return newMap;
            });
          })
          .catch(err => {
            Toaster.showApiError(err);
          });
      }

      setHasError(false);
      setIsUnzipping(false);
    } catch (err) {
      console.error("Error reading zip file:", err);
      setHasError(true);
      setIsUnzipping(false);
    }
  };

  const handleUpload = async () => {
    const OKToUploadMap: iUploadMap = Object.values(uploadMap || {})
      .filter(
        item =>
          item.isOKToUpload === true &&
          selectedStudentIDs.indexOf(item.studentId) >= 0
      )
      .reduce((map, item) => {
        return {
          ...map,
          [item.studentId]: {
            ...item,
            isUploading: true
          }
        };
      }, {});
    setUploadMap(prev => ({ ...prev, ...OKToUploadMap }));
    for (const data of Object.values(OKToUploadMap)) {
      const fileType = SynVDocumentService.getFileExtensionFromFileName(
        data.fileName
      ).trim();
      const fileObject = await data.zipFile.async("blob").then(contentBlob => {
        // Convert the Blob into a File
        return new File([contentBlob], data.fileName, {
          type: fileType === "" ? "application/octet-stream" : fileType
        });
      });
      const typeTypes = data.fileName.split(".");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const typeType = typeTypes.pop();
      const description = typeTypes.join(".");
      const submittingData = new FormData();
      submittingData.append("file", fileObject);
      submittingData.append("fileName", data.fileName);
      submittingData.append("description", description);
      submittingData.append("keepUnique", 'true');
      submittingData.append(
        "classificationCode",
        DOCUMENT_CLASSIFICATION_CODE_ARCHIVED_STUDENT_REPORTS
      );
      submittingData.append("documentType", fileType);
      try {
        await SynVDocumentService.createVDocument(
          data.studentId,
          submittingData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
        setUploadMap(prev => ({
          ...prev,
          [data.studentId]: {
            ...data,
            isUploading: false,
            uploadingSucc: "Uploaded"
          }
        }));
      } catch (err) {
        setUploadMap(prev => ({
          ...prev,
          [data.studentId]: {
            ...data,
            isUploading: false,
            // @ts-ignore
            uploadingError: err.message
          }
        }));
      }
    }
  };

  const getOKToUploadMap = (): iUploadMap => {
    return Object.values(uploadMap || {})
      .filter(item => item.isOKToUpload === true)
      .reduce((map, item) => {
        return {
          ...map,
          [item.studentId]: item
        };
      }, {});
  };

  const displayUploadingPanel = () => {
    const dataMap = uploadMap || {};
    if (Object.keys(dataMap).length === 0) {
      return <EmptyState title={"No data to display"} />;
    }

    return (
      <Table
        rows={Object.values(dataMap)}
        responsive
        hover
        striped
        columns={[
          {
            key: "selected",
            header: (column: iTableColumn<iUploadMap>) => {
              const OKToUploadMap: iUploadMap = getOKToUploadMap();
              const isDisabled = Object.values(OKToUploadMap).some(
                item => item.isUploading === true || item.uploadingSucc
              );
              return (
                <th key={column.key}>
                  <input
                    type={"checkbox"}
                    disabled={isDisabled}
                    checked={
                      _.difference(
                        Object.keys(OKToUploadMap),
                        selectedStudentIDs
                      ).length === 0
                    }
                    onChange={event => {
                      // @ts-ignore
                      const isChecked = event.target.checked === true;
                      if (isChecked) {
                        setSelectedStudentIDs(Object.keys(OKToUploadMap));
                        return;
                      }

                      setSelectedStudentIDs([]);
                    }}
                  />
                </th>
              );
            },
            cell: (column, data) => {
              return (
                <td key={column.key} className={"checkbox-col"}>
                  <input
                    type={"checkbox"}
                    disabled={
                      data.isOKToUpload !== true ||
                      data.isUploading === true ||
                      data.uploadingSucc
                    }
                    checked={selectedStudentIDs.indexOf(data.studentId) >= 0}
                    onChange={event => {
                      // @ts-ignore
                      const isChecked = event.target.checked === true;
                      if (isChecked) {
                        setSelectedStudentIDs(
                          _.uniq([...selectedStudentIDs, data.studentId])
                        );
                        return;
                      }

                      setSelectedStudentIDs(
                        selectedStudentIDs.filter(
                          studentId => studentId !== data.studentId
                        )
                      );
                    }}
                  />
                </td>
              );
            }
          },
          {
            key: "studentId",
            header: "Student ID",
            cell: (column, data) => {
              return (
                <td key={column.key} className={"student-id-col"}>
                  {data.studentId || ""}
                </td>
              );
            }
          },
          {
            key: "student",
            header: "Student",
            cell: (column, data) => {
              const error = `${data.studentError || ""}`.trim();
              if (data.isGettingStudent === true) {
                return (
                  <td key={column.key} className={"student-col"}>
                    <Spinner />
                  </td>
                );
              }
              if (error !== "") {
                return (
                  <td
                    key={column.key}
                    className={"bg-danger text-white student-col"}
                  >
                    {error}
                  </td>
                );
              }
              return (
                <td key={column.key} className={"student-col"}>
                  {data.student?.Given1} {data.student?.Surname}
                </td>
              );
            }
          },
          {
            key: "fileName",
            header: "File",
            cell: (column, data) => {
              return (
                <td key={column.key} className={"file-col"}>
                  {data.fileName || ""}
                </td>
              );
            }
          },
          {
            key: "status",
            header: (column: iTableColumn<iUploadMap>) => {
              const isLoading = Object.values(uploadMap || {}).some(
                item => item.isUploading === true
              );
              const OKToUploadRecords = Object.values(
                getOKToUploadMap()
              ).filter(item => selectedStudentIDs.indexOf(item.studentId) >= 0);
              const allUploaded =
                OKToUploadRecords.filter(
                  item => `${item.uploadingSucc || ""}` !== ""
                ).length === OKToUploadRecords.length;
              return (
                <th key={column.key}>
                  <FlexContainer
                    className={"justify-content-between align-items-end"}
                  >
                    <div>Status</div>
                    <div>
                      {allUploaded !== true && (
                        <LoadingBtn
                          size={"sm"}
                          isLoading={isLoading}
                          onClick={() => handleUpload()}
                          disabled={selectedStudentIDs.length === 0}
                          variant={
                            selectedStudentIDs.length === 0
                              ? "secondary"
                              : "primary"
                          }
                        >
                          Upload reports for {selectedStudentIDs.length}{" "}
                          students.
                        </LoadingBtn>
                      )}{" "}
                      {isLoading !== true && (
                        <LoadingBtn
                          size={"sm"}
                          isLoading={isLoading}
                          onClick={() => {
                            setSelectedStudentIDs([]);
                            setUploadMap(null);
                            setHasError(false);
                          }}
                          variant={"secondary"}
                        >
                          Reset
                        </LoadingBtn>
                      )}
                    </div>
                  </FlexContainer>
                </th>
              );
            },
            cell: (column, data) => {
              if (data.isUploading === true) {
                return (
                  <td key={column.key}>
                    <Spinner /> Uploading...
                  </td>
                );
              }
              const errorMsg = `${data.uploadingError || ""}`.trim();
              if (errorMsg !== "") {
                return (
                  <td key={column.key} className={"bg-danger text-white"}>
                    {errorMsg}
                  </td>
                );
              }

              const successMsg = `${data.uploadingSucc || ""}`.trim();
              if (successMsg !== "") {
                return (
                  <td key={column.key} className={"bg-success text-white"}>
                    {successMsg}
                  </td>
                );
              }
              return <td key={column.key}></td>;
            }
          }
        ]}
      />
    );
  };

  const getContent = () => {
    if (isUnzipping) {
      return <Spinner animation={"border"} />;
    }

    if (uploadMap === null || hasError === true) {
      return (
        <>
          <Alert variant={"info"} dismissible>
            <div>
              - System will upload the provided report to Synergetic DocMan
              (with classification{" "}
              <b>{DOCUMENT_CLASSIFICATION_CODE_ARCHIVED_STUDENT_REPORTS}</b>)
              under associated student.
            </div>
            <div>
              - If the same file name found under the associated student with
              classification{" "}
              <b>{DOCUMENT_CLASSIFICATION_CODE_ARCHIVED_STUDENT_REPORTS}</b>,
              then system will <b className={"text-danger"}>OVERWRITE</b> the
              report in Synergetic.
            </div>
            <div>
              - You can provide a zip file with the agreed folder structure
              within the zip as follows:
              <ul>
                <li>
                  [folder_named_as_student_id]
                  <ul>
                    <li>the_academic_report_file_(name_can_be_anything).pdf</li>
                  </ul>
                </li>
                <li>
                  [folder_named_as_another_student_id]
                  <ul>
                    <li>the_academic_report_file_(name_can_be_anything).pdf</li>
                  </ul>
                </li>
              </ul>
              ...
            </div>
          </Alert>
          <UploadFilePanel
            uploadFn={handleFileUpload}
            className={"uploader-list-wrapper"}
            acceptFileTypes={[".zip"]}
            maxFileSize={MAX_ZIP_FILE_SIZE}
            description={
              <>
                Click here to select your zip file (maximum file size{" "}
                {UtilsService.formatBytesToHuman(MAX_ZIP_FILE_SIZE)})
              </>
            }
          />
        </>
      );
    }

    return displayUploadingPanel();
  };

  return (
    <Wrapper>
      <div>
        <div>
          <b>Bulk uploading student academic reports</b>
        </div>
        This feature is designed to upload student academic reports in bulk.
        {getContent()}
      </div>
    </Wrapper>
  );
};
export default ReportsUploader;
