import IFunnelLead from "../../../../types/Funnel/iFunnelLead";
import {Alert, Button, ButtonProps, Spinner} from "react-bootstrap";
import PopupModal from "../../../../components/common/PopupModal";
import { useState } from "react";
import Table, { iTableColumn } from "../../../../components/common/Table";
import UtilsService from "../../../../services/UtilsService";
import ExplanationPanel from "../../../../components/ExplanationPanel";
import { FUNNEL_ADMIN_URL } from "../../../../services/Funnel/FunnelService";
import * as Icons from "react-bootstrap-icons";
import LoadingBtn from "../../../../components/common/LoadingBtn";
import SynergeticIDCheckPanel from "../../../../components/Community/SynergeticIDCheckPanel";
import SectionDiv from "../../../../components/common/SectionDiv";
import iSynCommunity from "../../../../types/Synergetic/iSynCommunity";
import { FlexContainer } from "../../../../styles";
import AssetService from '../../../../services/Asset/AssetService';

type iFunnelLeadsFileDownloadPopupBtn = ButtonProps & {
  lead: IFunnelLead;
};

type iFileInfo = {
  download_url: string;
  id: string;
  name: string;
  type: string;
  size: number;
  processing?: string;
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

const FunnelLeadsFileDownloadPopupBtn = ({
  lead,
  ...props
}: iFunnelLeadsFileDownloadPopupBtn) => {
  const [isShowingPopup, setIsShowingPopup] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<iFileInfoMap>({});
  const [synCommunity, setSynCommunity] = useState<iSynCommunity | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = () => {
    if (isProcessing === true) {
      return null;
    }
    setSelectedFiles({});
    setIsShowingPopup(false);
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

  const getProcessingTd = (data: iFileInfo) => {
    const processingFiles = Object.values(selectedFiles).filter(file => data.id === file.id);
    if (processingFiles.length <= 0) {
      return null;
    }
    const processingFile = processingFiles[0];

    if (`${processingFile.processing || ""}`.trim() === "") {
      return null;
    }

    return (
      <FlexContainer className={"justify-content-start gap-1"}>
        <Spinner size={"sm"} />
        <div>{`${processingFile.processing || ""}`.trim()}</div>
      </FlexContainer>
    );
  };

  const canBeProcessed = () => {
    return (
      Object.keys(selectedFiles).length > 0 && `${synCommunity?.ID || ""}`.trim() !== ""
    );
  };

  const processOne = async (selectedFile: iFileInfo) => {
    setSelectedFiles(prev => ({
      ...prev,
      [selectedFile.id]: {
        ...selectedFile,
        processing: 'downloading from funnel...',
      }
    }))
    const result = await AssetService.downloadFromUrl(selectedFile.download_url);
    console.log('result', result);
  };

  const process = () => {
    if (canBeProcessed() !== true) {
      return null;
    }

    setIsProcessing(true);
    Promise.all(Object.values(selectedFiles).map(selectedFile => processOne(selectedFile)))
      .finally(() => {
        setIsProcessing(false);
      })
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
        title={"Choose a file / files to download to DocMan:"}
        footer={
          <>
            <LoadingBtn variant={"link"} onClick={() => handleClose()} isLoading={isProcessing === true}>
              <Icons.XLg /> Cancel
            </LoadingBtn>
            <LoadingBtn
              isLoading={isProcessing === true}
              variant={"primary"}
              onClick={() => process()}
              disabled={canBeProcessed() !== true}
            >
              <Icons.Send /> Download {selectedFiles.length} file(s) to DocMan
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
          <Alert
            variant={'danger'}
          >
            <h6 style={{margin: '0px'}}>
              <Spinner size={'sm'}/> Process started. DO NOT CLOSE THIS WINDOW UNTIL IT'S FINISHED.
            </h6>
          </Alert>
        )}
        <SectionDiv>
          <h6>Step 1: Choose a file/ files</h6>
          <Table
            hover
            striped
            responsive
            columns={[
              {
                key: "selected",
                header: (col: iTableColumn) => {
                  return (
                    <th key={col.key}>
                      <span
                        onClick={() => handleSelectedFiles(files)}
                        className={"cursor-pointer"}
                      >
                        {isFilesSelected(files) === true ? (
                          <Icons.CheckSquareFill className={"text-success"} />
                        ) : (
                          <Icons.Square />
                        )}
                      </span>
                    </th>
                  );
                },
                cell: (col: iTableColumn, data: iFileInfo) => {
                  return (
                    <td key={col.key}>
                      <span
                        onClick={() => handleSelectedFiles([data])}
                        className={"cursor-pointer"}
                      >
                        {isFilesSelected([data]) === true ? (
                          <Icons.CheckSquareFill className={"text-success"} />
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
                cell: (col: iTableColumn, data: iFileInfo) => {
                  return (
                    <td key={col.key} className={"ellipsis"}>
                      <a href={`${data.download_url || ""}`} target={"__BLANK"}>
                        {data.name}
                      </a>
                    </td>
                  );
                }
              },
              {
                key: "type",
                header: "File Type",
                cell: (col: iTableColumn, data: iFileInfo) => {
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
                cell: (col: iTableColumn, data: iFileInfo) => {
                  return (
                    <td key={col.key} className={"ellipsis"}>
                      {UtilsService.formatBytesToHuman(data.size || 0)}
                    </td>
                  );
                }
              },
              ...(isProcessing !== true
                ? []
                : [
                    {
                      key: "isProcessing",
                      header: "",
                      cell: (col: iTableColumn, data: iFileInfo) => {
                        return <td key={col.key}>{getProcessingTd(data)}</td>;
                      }
                    }
                  ])
            ]}
            rows={files}
          />
        </SectionDiv>
        <SectionDiv>
          <h6>Step2: Provide a valid Synergetic ID</h6>
          <SynergeticIDCheckPanel
            onValid={profile => setSynCommunity(profile)}
            onClear={() => setSynCommunity(null)}
            onInvalid={() => setSynCommunity(null)}
          />
        </SectionDiv>
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
