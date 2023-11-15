import { iCODResponseAsset } from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import Table, { iTableColumn } from "../../common/Table";
import { Button } from "react-bootstrap";
import DeleteConfirmPopupBtn from "../../common/DeleteConfirm/DeleteConfirmPopupBtn";
import * as Icons from "react-bootstrap-icons";
import React from "react";
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import Toaster, {TOAST_TYPE_ERROR} from '../../../services/Toaster';

type iCODFileListTable = {
  isDisabled?: boolean;
  files: iCODResponseAsset[];
  deletingFn?: (file: iCODResponseAsset) => Promise<any>;
  title?: string;
};
const CODFileListTable = ({ isDisabled, files, deletingFn, title }: iCODFileListTable) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);


  const getNewWindowContent = (file: iCODResponseAsset) => {
    const url = `${file.url || ''}`.trim();
    if (url.startsWith('http')) {
      return url;
    }
    if (url.startsWith('data')) {
      const prefix = `data:${file.mimeType};base64,`;
      // console.log('prefix', prefix);
      const content = file.url.replace(prefix, '').trim();
      // console.log('content', content);
      const decodedData = atob(content);

      // Create an array buffer from the decoded data
      const arrayBuffer = new ArrayBuffer(decodedData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < decodedData.length; i++) {
        uint8Array[i] = decodedData.charCodeAt(i);
      }

      // Create a Blob from the array buffer
      // Create a new Blob from the base64 string
      const blob = new Blob([arrayBuffer], { type: file.mimeType });
      // Create a data URL from the Blob
      return URL.createObjectURL(blob);
    }
    return null;
  }

  const openInNewTab = (file: iCODResponseAsset) => {
    const url = `${file.url || ''}`.trim();
    const type = `${file.mimeType || ''}`.trim().toLowerCase();
    if (url === '') {
      Toaster.showToast(`Empty url`, TOAST_TYPE_ERROR);
      return;
    }

    const openingUrl = getNewWindowContent(file);
    if (openingUrl === null || `${openingUrl || ''}`.trim() === '') {
      Toaster.showToast(`Unknown type(=${type}) to display.`, TOAST_TYPE_ERROR);
      return;
    }
    // Open the data URL in a new tab
    const newTab = window.open(openingUrl, '_blank');
    if (!newTab) {
      Toaster.showToast('Pop-up blocked. Please allow pop-ups for this website.', TOAST_TYPE_ERROR);
      return;
    }
  };


  if (files.length <= 0) {
    return null;
  }

  return (
    <Table
      className={"file-list"}
      hover
      striped
      responsive
      columns={[
        {
          key: "file",
          header: title || "Documents",
          cell: (col: iTableColumn, asset: iCODResponseAsset) => {
            return (
              <td key={col.key}>
                <Button
                  variant={"link"}
                  size={"sm"}
                  className={"file-list-item"}
                  onClick={() => openInNewTab(asset)}
                >
                  {asset.name}
                </Button>
              </td>
            );
          }
        },
        ...(isDisabled === true
          ? []
          : [
              {
                key: "operations",
                header: "",
                cell: (col: iTableColumn, asset: iCODResponseAsset) => {
                  return (
                    <td key={col.key} className={"text-right"}>
                      <DeleteConfirmPopupBtn
                        variant={"danger"}
                        size={"sm"}
                        confirmString={`${currentUser?.synergyId || "na"}`}
                        // @ts-ignore
                        deletingFn={() => {
                          return deletingFn && deletingFn(asset)
                        }}
                      >
                        <Icons.Trash />
                      </DeleteConfirmPopupBtn>
                    </td>
                  );
                }
              }
            ])
      ]}
      rows={files}
    />
  );
};

export default CODFileListTable;
