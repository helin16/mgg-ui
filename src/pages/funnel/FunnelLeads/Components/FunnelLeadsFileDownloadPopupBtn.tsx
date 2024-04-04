import IFunnelLead from "../../../../types/Funnel/iFunnelLead";
import {Button, ButtonProps, FormControl} from "react-bootstrap";
import PopupModal from "../../../../components/common/PopupModal";
import { useState } from "react";
import Table, { iTableColumn } from "../../../../components/common/Table";
import UtilsService from "../../../../services/UtilsService";
import ExplanationPanel from "../../../../components/ExplanationPanel";
import { FUNNEL_ADMIN_URL } from "../../../../services/Funnel/FunnelService";
import * as Icons from "react-bootstrap-icons";
import { FlexContainer } from "../../../../styles";
import LoadingBtn from "../../../../components/common/LoadingBtn";

type iFunnelLeadsFileDownloadPopupBtn = ButtonProps & {
  lead: IFunnelLead;
};

type iFileInfo = {
  download_url: string;
  id: string;
  name: string;
  type: string;
  size: number;
};
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
  const [selectedFiles, setSelectedFiles] = useState<iFileInfo[]>([]);
  const [synId, setSynId] = useState<string>('');

  const handleClose = () => {
    setSelectedFiles([]);
    setIsShowingPopup(false);
  };

  const isSynIdValid = () => {
    return `${synId || ''}`.trim().length >= 5;
  }

  const isFilesSelected = (sFiles: iFileInfo[]) => {
    const sFileIds = sFiles
      .map(f => `${f.id || ""}`.trim())
      .filter(id => `${id || ""}`.trim() !== "");
    return (
      selectedFiles.filter(
        file => sFileIds.indexOf(`${file.id || ""}`.trim()) >= 0
      ).length > 0
    );
  };

  const handleSelectedFiles = (sFiles: iFileInfo[]) => {
    const sFileIds = sFiles
      .map(f => `${f.id || ""}`.trim())
      .filter(id => `${id || ""}`.trim() !== "");
    if (isFilesSelected(sFiles) === true) {
      setSelectedFiles(
        selectedFiles.filter(
          file => sFileIds.indexOf(`${file.id || ""}`.trim()) < 0
        )
      );
      return;
    }
    setSelectedFiles([...selectedFiles, ...sFiles]);
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
            }
          ]}
          rows={files}
        />
        <FlexContainer className={"justify-content-between space-above"}>
          <div className={''}>
            <FormControl placeholder={'Synergetic ID'} value={synId} onChange={event => setSynId(event.target.value || '')}/>
          </div>
          <div>
            <LoadingBtn
              variant={"link"}
              onClick={() => handleClose()}
            >
              <Icons.XLg /> Cancel
            </LoadingBtn>
            <LoadingBtn
              variant={"primary"}
              onClick={() => handleClose()}
              disabled={selectedFiles.length <= 0 || isSynIdValid() !== true}
            >
              <Icons.Send /> Download {selectedFiles.length} file(s)
            </LoadingBtn>
          </div>
        </FlexContainer>
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
