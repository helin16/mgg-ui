import IFunnelLead, {
  FUNNEL_LEAD_STATUS_SYNCD_WITH_SYNERGETIC
} from "../../../../types/Funnel/iFunnelLead";
import {
  Accordion,
  Alert,
  Badge,
  Button,
  ButtonProps,
  Spinner
} from "react-bootstrap";
import PopupModal from "../../../../components/common/PopupModal";
import { useState } from "react";
import Table, { iTableColumn } from "../../../../components/common/Table";
import UtilsService from "../../../../services/UtilsService";
import ExplanationPanel from "../../../../components/ExplanationPanel";
import FunnelService, {
  FUNNEL_ADMIN_URL
} from "../../../../services/Funnel/FunnelService";
import * as Icons from "react-bootstrap-icons";
import LoadingBtn from "../../../../components/common/LoadingBtn";
import SynergeticIDCheckPanel from "../../../../components/Community/SynergeticIDCheckPanel";
import iSynCommunity from "../../../../types/Synergetic/iSynCommunity";
import { FlexContainer } from "../../../../styles";
import MathHelper from "../../../../helper/MathHelper";
import UploadFilePanel from "../../../../components/Asset/UploadFilePanel";
import LocalFilesTable from "../../../../components/Asset/LocalFilesTable";
import SectionDiv from "../../../../components/common/SectionDiv";
import SynVDocumentService from "../../../../services/Synergetic/SynVDocumentService";
import Toaster, {TOAST_TYPE_SUCCESS} from "../../../../services/Toaster";
import { DOCUMENT_CLASSIFICATION_CODE_ADMISSION_CONFIDENTIAL } from "../../../../types/Synergetic/iSynVDocument";

type iFunnelLeadsFileDownloadPopupBtn = ButtonProps & {
  lead: IFunnelLead;
  onUpdated: (updated: IFunnelLead) => void;
};

type iFileInfo = {
  download_url: string;
  id: string;
  name: string;
  type: string;
  size: number;
};

type iFileInfoMap = { [key: string]: iFileInfo };

const getFileInfo = (info: any): iFileInfo | null => {
  if (`${info?.download_url || ""}`.trim() !== "") {
    return info;
  }

  return null;
};

export const getFunnelLeadFiles = (files: any) => {
  if (!files) {
    return [];
  }
  let filePaths: (iFileInfo | null)[] = [];
  Object.values(files).forEach(file => {
    if (Array.isArray(file)) {
      file.forEach(f => {
        filePaths.push(getFileInfo(f));
      });
    }

    filePaths.push(getFileInfo(file));
  });

  return filePaths.filter(filePath => filePath !== null);
};

type iStatusMap = {
  [key: number]: {
    processed: boolean;
  };
};
const defaultStepStatusMap: iStatusMap = [1, 2].reduce((map, step) => {
  return {
    ...map,
    [step]: { processed: false }
  };
}, {});

const FunnelLeadsFileDownloadPopupBtn = ({
  lead,
  onUpdated,
  ...props
}: iFunnelLeadsFileDownloadPopupBtn) => {
  const [isShowingPopup, setIsShowingPopup] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<iFileInfoMap>({});
  const [synCommunity, setSynCommunity] = useState<iSynCommunity | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepStatusMap, setStepStatusMap] = useState(defaultStepStatusMap);

  const handleClose = () => {
    if (isProcessing === true) {
      return null;
    }
    setUploadingFiles([]);
    setSelectedFiles({});
    setSynCommunity(null);
    setIsShowingPopup(false);
    setIsProcessing(false);
    setCurrentStep(1);
    setStepStatusMap(defaultStepStatusMap);
  };

  const isFilesSelected = (sFiles: iFileInfo[]) => {
    const sFileIds = sFiles
      .map(f => `${f.id || ""}`.trim())
      .filter(id => `${id || ""}`.trim() !== "");
    return (
      Object.keys(selectedFiles).filter(fileId => sFileIds.indexOf(fileId) >= 0)
        .length > 0
    );
  };

  const handleSelectedFiles = (sFiles: iFileInfo[]) => {
    const sFileIds = sFiles
      .map(f => `${f.id || ""}`.trim())
      .filter(id => `${id || ""}`.trim() !== "");
    if (isFilesSelected(sFiles) === true) {
      setSelectedFiles(
        Object.values(selectedFiles)
          .filter(file => sFileIds.indexOf(`${file.id || ""}`.trim()) < 0)
          .reduce(
            (map, file) => ({
              ...map,
              [file.id]: file
            }),
            {}
          )
      );
      return;
    }
    setSelectedFiles({
      ...selectedFiles,
      ...sFiles.reduce(
        (map, file) => ({
          ...map,
          [file.id]: file
        }),
        {}
      )
    });
  };

  const canBeProcessed = () => {
    return (
      uploadingFiles.length > 0 && `${synCommunity?.ID || ""}`.trim() !== ""
    );
  };

  const getAccordion = (eventKey: number, title: any, body: any) => {
    return (
      <Accordion.Item eventKey={`${eventKey}`}>
        <Accordion.Header>{title}</Accordion.Header>
        <Accordion.Body>{body}</Accordion.Body>
      </Accordion.Item>
    );
  };

  const updatedLead = async () => {
    if (!synCommunity) {
      return;
    }
    try {
      setIsProcessing(true);
      await Promise.all(
        uploadingFiles.map(uploadingFile => {
          const formData = new FormData();
          formData.append("fileName", uploadingFile.name);
          formData.append("description", 'Imported from Funnel');
          formData.append(
            "classificationCode",
            DOCUMENT_CLASSIFICATION_CODE_ADMISSION_CONFIDENTIAL
          );
          formData.append(
            "documentType",
            SynVDocumentService.getFileExtensionFromFileName(uploadingFile.name)
          );
          formData.append("file", uploadingFile);
          return SynVDocumentService.createVDocument(
            synCommunity?.ID,
            formData
          );
        })
      );

      const updatedLead = await FunnelService.update(lead.id, {
        status: FUNNEL_LEAD_STATUS_SYNCD_WITH_SYNERGETIC,
        synergeticId: synCommunity.ID,
      });
      setIsProcessing(false);
      Toaster.showToast(`File(s) saved to DocMan Successfully.`, TOAST_TYPE_SUCCESS);
      handleClose();
      onUpdated(updatedLead);
    } catch (err) {
      Toaster.showApiError(err);
    }
  };

  const getProcessedBadge = (eventKey: number, processed: any) => {
    return eventKey in stepStatusMap &&
      stepStatusMap[eventKey].processed === true ? (
      <Badge bg={"success"}>{processed}</Badge>
    ) : null;
  };

  const nextStep = () => {
    setCurrentStep(MathHelper.add(currentStep, 1));
    setStepStatusMap({
      ...stepStatusMap,
      [currentStep]: { processed: true }
    });
  };

  const getPopup = () => {
    if (isShowingPopup === false) {
      return null;
    }

    // @ts-ignore
    const files: iFileInfo[] = getFunnelLeadFiles(
      JSON.parse(lead.externalObj?.custom_properties_json || null)
    ).filter(f => f !== null);
    return (
      <PopupModal
        show={true}
        size={"lg"}
        handleClose={handleClose}
        title={"Download to DocMan:"}
        footer={
          <>
            <LoadingBtn
              variant={"link"}
              onClick={() => handleClose()}
              isLoading={isProcessing === true}
            >
              <Icons.XLg /> Cancel
            </LoadingBtn>
            <LoadingBtn
              isLoading={isProcessing === true}
              variant={"primary"}
              onClick={() => updatedLead()}
              disabled={canBeProcessed() !== true}
            >
              <Icons.Send /> Save {uploadingFiles.length} file(s) to DocMan for{" "}
              {synCommunity?.Given1} {synCommunity?.Surname} [{synCommunity?.ID}{" "}
              ]
            </LoadingBtn>
          </>
        }
      >
        <ExplanationPanel
          dismissible
          text={
            <>
              <b>
                PLEASE LOGIN TO{" "}
                <a href={FUNNEL_ADMIN_URL} target={"__BLANK"}>
                  FUNNEL
                </a>{" "}
                FIRST
              </b>
              <div className={"text-danger"}>
                This feature will only download ({selectedFiles.length}) file(s)
                to DocMan, it will <b>NOT</b> check whether it has been
                downloaded before. Please check DocMan in Synegetic before you
                download.
              </div>
            </>
          }
        />
        {isProcessing !== true ? null : (
          <Alert variant={"danger"}>
            <h6 style={{ margin: "0px" }}>
              <Spinner size={"sm"} /> Process started. DO NOT CLOSE THIS WINDOW
              UNTIL IT'S FINISHED.
            </h6>
          </Alert>
        )}
        <Accordion
          activeKey={`${currentStep}`}
          onSelect={key => setCurrentStep(Number(key))}
          flush
        >
          {getAccordion(
            1,
            <FlexContainer className={"justify-content-start gap-1"}>
              <b>Step 1: Download a file/ files</b>
              {getProcessedBadge(1, "Downloaded")}
            </FlexContainer>,
            <>
              <Table
                hover
                striped
                responsive
                columns={[
                  {
                    key: "selected",
                    header: (col: iTableColumn<iFileInfo>) => {
                      return (
                        <th key={col.key}>
                          <span
                            onClick={() => handleSelectedFiles(files)}
                            className={"cursor-pointer"}
                          >
                            {isFilesSelected(files) === true ? (
                              <Icons.CheckSquareFill
                                className={"text-success"}
                              />
                            ) : (
                              <Icons.Square />
                            )}
                          </span>
                        </th>
                      );
                    },
                    cell: (col: iTableColumn<iFileInfo>, data: iFileInfo) => {
                      return (
                        <td key={col.key}>
                          <span
                            onClick={() => handleSelectedFiles([data])}
                            className={"cursor-pointer"}
                          >
                            {isFilesSelected([data]) === true ? (
                              <Icons.CheckSquareFill
                                className={"text-success"}
                              />
                            ) : (
                              <Icons.Square />
                            )}
                          </span>
                        </td>
                      );
                    }
                  },
                  {
                    key: "name",
                    header: "File Name",
                    cell: (col: iTableColumn<iFileInfo>, data: iFileInfo) => {
                      return (
                        <td key={col.key} className={"ellipsis"}>
                          <a
                            href={`${data.download_url || ""}`}
                            target={"__BLANK"}
                          >
                            {data.name}
                          </a>
                        </td>
                      );
                    }
                  },
                  {
                    key: "type",
                    header: "File Type",
                    cell: (col: iTableColumn<iFileInfo>, data: iFileInfo) => {
                      return (
                        <td key={col.key} className={"ellipsis"}>
                          {data.type}
                        </td>
                      );
                    }
                  },
                  {
                    key: "size",
                    header: "File Size",
                    cell: (col: iTableColumn<iFileInfo>, data: iFileInfo) => {
                      return (
                        <td key={col.key} className={"ellipsis"}>
                          {UtilsService.formatBytesToHuman(data.size || 0)}
                        </td>
                      );
                    }
                  }
                ]}
                rows={files}
              />
              <FlexContainer className={"justify-content-end"}>
                <Button
                  onClick={() => {
                    Object.values(selectedFiles).forEach(selectedFile => {
                      window.open(selectedFile.download_url);
                    });
                    nextStep();
                  }}
                  variant={
                    Object.values(selectedFiles).length <= 0
                      ? "light"
                      : "success"
                  }
                  disabled={Object.values(selectedFiles).length <= 0}
                >
                  Download ({Object.values(selectedFiles).length}) file(s)
                </Button>
              </FlexContainer>
            </>
          )}
          {getAccordion(
            2,
            <FlexContainer className={"justify-content-start gap-1"}>
              <b>Step 2: Provide a valid Synergetic ID</b>
              {getProcessedBadge(
                2,
                `[${synCommunity?.ID}] ${synCommunity?.Given1} ${synCommunity?.Surname}`
              )}
            </FlexContainer>,
            <SynergeticIDCheckPanel
              defaultValue={`${lead.synergeticId || ''}`.trim()}
              onValid={profile => {
                setSynCommunity(profile);
                nextStep();
              }}
              onClear={() => setSynCommunity(null)}
              onInvalid={() => setSynCommunity(null)}
            />
          )}

          {getAccordion(
            3,
            <FlexContainer className={"justify-content-start gap-1"}>
              <b>Step 3: Drag and drop the downloaded file to here</b>
            </FlexContainer>,
            <>
              <UploadFilePanel
                uploadFn={files =>
                  setUploadingFiles([...uploadingFiles, ...files])
                }
                className={"uploader-list-wrapper"}
                allowMultiple
              />
              <SectionDiv>
                <LocalFilesTable
                  files={uploadingFiles}
                  onClear={() => setUploadingFiles([])}
                  onDelete={(file: File) =>
                    setUploadingFiles(
                      uploadingFiles.filter(
                        f => f.name !== file.name && f.size !== file.size
                      )
                    )
                  }
                />
              </SectionDiv>
            </>
          )}
        </Accordion>
      </PopupModal>
    );
  };

  return (
    <>
      <Button {...props} onClick={() => setIsShowingPopup(true)} />
      {getPopup()}
    </>
  );
};

export default FunnelLeadsFileDownloadPopupBtn;
