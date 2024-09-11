import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import iPaginatedResult from "../../types/iPaginatedResult";
import iAsset from "../../types/asset/iAsset";
import AssetService, {
  HEADER_NAME_ASSET_FOLDER_ID,
  HEADER_NAME_ASSET_TYPE
} from "../../services/Asset/AssetService";
import Toaster from "../../services/Toaster";
import * as Icons from "react-bootstrap-icons";
import { Button, Spinner } from "react-bootstrap";
import { FlexContainer } from "../../styles";
import MathHelper from "../../helper/MathHelper";
import * as _ from "lodash";
import { OP_NOT } from "../../helper/ServiceHelper";
import UploadFilePanel from "./UploadFilePanel";
import AssetThumbnail from "./AssetThumbnail";
import DeleteConfirmPopupBtn from "../common/DeleteConfirm/DeleteConfirmPopupBtn";
import AssetUrlEditPopupBtn from "./AssetUrlEditPopupBtn";
import AssetFolderService from "../../services/Asset/AssetFolderService";
import iAssetFolder from "../../types/asset/iAssetFolder";
import AssetFolderPopupBtn from "./AssetFolderPopupBtn";
import ButtonGroup from "react-bootstrap/ButtonGroup";

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .delete-btn {
    margin: 0px;
    padding: 2px 6px;
  }

  .list-wrapper {
    display: flex;
    align-items: flex-start;
    align-content: flex-start;
    background-color: #efefef;
    flex-wrap: wrap;
    padding: 0.6rem;
    overflow-y: auto;
    height: 100%;
    min-height: 300px;

    .item-wrapper {
      width: 12rem;
      height: 8rem;
      margin-right: 0.6rem;
      margin-bottom: 0.6rem;

      &.selected {
        border-color: rgb(13, 110, 253);
      }
    }

    .load-more {
      width: 12rem;
      height: 8rem;
      .btn {
        width: 100%;
        height: 100%;
        color: white;
      }
    }

    .folder-list {
      width: 100%;
      flex-wrap: wrap;
      display: flex;
      justify-content: start;
      .folder-div {
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 10px;
        width: 12rem;
        margin-right: 0.6rem;
        margin-bottom: 0.6rem;
        background-color: rgba(255, 255, 255, 0.75);
        padding: 0.5rem;
        border: 2px solid rgba(255, 255, 255, 0.75);
        cursor: pointer;

        &:hover {
          background-color: rgba(13, 110, 253, 0.25);
          border-color: rgba(13, 110, 253, 0.25);
        }

        &.selected {
          border-color: rgb(13, 110, 253);
        }

        .bi {
          font-weight: bold;
          font-size: 20px;
        }
      }
    }
  }

  .loading-mask {
    position: absolute;
    left: 0;
    top: 0;
    right: 0px;
    bottom: 0px;
    width: 100%;
    height: 100%;
    z-index: 9999999;
    background-color: rgba(40, 40, 40, 0.7);
    color: white;
  }

  .uploader-btn {
    padding: 3px 20px;
    font-size: 10px;
    max-width: 100%;
    border-radius: 4px;
  }
  .uploader-list-wrapper {
    padding: 0px;
    cursor: default;
    height: 100%;
    min-height: 300px;
  }

  .extra-btns {
    .btn {
      padding: 2px 12px;
      font-size: 11px;
    }
  }
`;

type iAssetListPanel = {
  assetType?: string;
  allowCreation?: boolean;
  allowDeletion?: boolean;
  forceReload?: number;
  selectedAssetIds?: string[];
  excludeAssetIds?: string[];
  onSelect?: (selectedIds: string[]) => void;
  onFolderSelected?: (folderIds: string[]) => void;
  onListingFolder?: (folderId: string | null) => void;
  listingFolderId?: string | null;
  selectedFolderIds?: string[];
};

type iUpLoadingAsset = {
  uploadProgress?: number;
  file: File;
  id: string;
};

const AssetListPanel = ({
  assetType,
  allowDeletion = false,
  allowCreation = false,
  forceReload = 0,
  selectedAssetIds = [],
  excludeAssetIds = [],
  onSelect,
  listingFolderId,
  onFolderSelected,
  onListingFolder,
  selectedFolderIds
}: iAssetListPanel) => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadingAssets, setUploadingAssets] = useState<iUpLoadingAsset[]>([]);
  const excludeAssetIdsRef = useRef(excludeAssetIds);
  const [assetsList, setAssetList] = useState<iPaginatedResult<iAsset> | null>(
    null
  );
  const [assetFolderList, setAssetFolderList] = useState<iPaginatedResult<
    iAssetFolder
  > | null>(null);
  const [listingFolder, setListingFolder] = useState<iAssetFolder | null>(null);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    const listingFolderIdStr = `${listingFolderId || ""}`.trim();
    Promise.all([
      AssetService.getAll({
        where: JSON.stringify({
          isActive: true,
          folderId: listingFolderId === "" ? null : listingFolderId,
          ...(excludeAssetIdsRef.current.length <= 0
            ? {}
            : { id: { [OP_NOT]: excludeAssetIdsRef.current } }),
          ...(`${assetType || ""}`.trim() === ""
            ? {}
            : { type: `${assetType || ""}`.trim() })
        }),
        sort: "createdAt:DESC",
        perPage: 18,
        currentPage
      }),
      AssetFolderService.getAll({
        where: JSON.stringify({
          isActive: true,
          parentId: listingFolderId === "" ? null : listingFolderId,
          ...(`${assetType || ""}`.trim() === ""
            ? {}
            : { type: `${assetType || ""}`.trim() })
        }),
        perPage: 99999,
        sort: "createdAt:DESC"
        // include: "Parent"
      }),
      ...(listingFolderIdStr !== ""
        ? [
            AssetFolderService.getAll({
              where: JSON.stringify({
                id: listingFolderIdStr
              }),
              perPage: 1
            })
          ]
        : [])
    ])
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setAssetList(prev => ({
          ...resp[0],
          ...(currentPage <= 1
            ? {}
            : {
                data: _.uniqBy(
                  [...(prev?.data || []), ...(resp[0].data || [])],
                  asset => asset.id
                )
              })
        }));
        setAssetFolderList(resp[1]);
        if (listingFolderIdStr === "") {
          setListingFolder(null);
        } else {
          const listingFolders = resp[2].data || [];
          setListingFolder(
            listingFolders.length > 0 ? listingFolders[0] : null
          );
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
  }, [currentPage, assetType, count, forceReload, listingFolderId]);

  useEffect(() => {
    // Update the ref when excludeAssetIds changes
    excludeAssetIdsRef.current = excludeAssetIds;
  }, [excludeAssetIds]);

  const getMoreBtn = () => {
    if (
      (assetsList?.currentPage || 0) >= (assetsList?.pages || 0) ||
      isLoading === true
    ) {
      return null;
    }
    return (
      <div className={"load-more"}>
        <Button
          variant={"secondary"}
          onClick={() => setCurrentPage(MathHelper.add(currentPage, 1))}
        >
          <div style={{ fontSize: "24px" }}>
            <Icons.ArrowDown />
          </div>
          <h6>Load more</h6>
        </Button>
      </div>
    );
  };

  const getFolderList = () => {
    const folders = assetFolderList?.data || [];
    if (folders.length <= 0) {
      return null;
    }
    return (
      <div className={"folder-list"}>
        {(assetFolderList?.data || []).map(folder => {
          return (
            <div
              className={`folder-div ${
                (selectedFolderIds || []).indexOf(folder.id) >= 0
                  ? "selected"
                  : ""
              }`}
              key={folder.id}
              onDoubleClick={() => {
                setCurrentPage(1);
                onFolderSelected && onFolderSelected([]);
                onListingFolder && onListingFolder(folder.id);
              }}
              onClick={() => {
                if (!onFolderSelected) {
                  return;
                }
                const ids = _.uniq(selectedFolderIds || []);
                if (ids.indexOf(folder.id) >= 0) {
                  onFolderSelected(ids.filter(id => id !== folder.id));
                } else {
                  onFolderSelected([...ids, folder.id]);
                }
              }}
            >
              <Icons.Folder />
              <span>{folder.name}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const getContent = () => {
    return (
      <div className={"list-wrapper"}>
        {getFolderList()}

        {uploadingAssets.map(asset => {
          return (
            <FlexContainer
              className={
                "item-wrapper flex-column justify-content-center align-items-center"
              }
              key={asset.id}
            >
              <Spinner animation={"border"} />
              <div
                className={"ellipsis"}
                style={{ width: `calc(100% - 1.4rem)` }}
              >
                {asset.file.name}
              </div>
            </FlexContainer>
          );
        })}

        {(assetsList?.data || []).map(asset => {
          return (
            <AssetThumbnail
              asset={asset}
              className={`${onSelect ? "cursor-pointer" : ""} item-wrapper ${
                (selectedAssetIds || []).indexOf(asset.id) >= 0
                  ? "selected"
                  : ""
              }`}
              key={asset.id}
              onClick={() => {
                if (!onSelect) {
                  return;
                }
                const ids = _.uniq(selectedAssetIds || []);
                if (ids.indexOf(asset.id) >= 0) {
                  onSelect(ids.filter(id => id !== asset.id));
                } else {
                  onSelect([...ids, asset.id]);
                }
              }}
            />
          );
        })}
        {getMoreBtn()}
      </div>
    );
  };

  const getLoadingMask = () => {
    if (isLoading !== true) {
      return null;
    }
    return (
      <FlexContainer
        className={
          "loading-mask justify-content-center align-items-center align-content-center flex-column"
        }
      >
        <div style={{ fontSize: "24px" }}>
          <Spinner animation="border" />
        </div>
        <h4>Load more</h4>
      </FlexContainer>
    );
  };

  const getClearSelectedBtn = (totalSelected: number) => {
    if (!onSelect && !onFolderSelected) {
      return null;
    }

    return (
      <span
        className={"cursor-pointer"}
        onClick={() => {
          onSelect && onSelect([]);
          onFolderSelected && onFolderSelected([]);
        }}
      >
        <Icons.X /> Clear {totalSelected} selected{" "}
      </span>
    );
  };

  const getSelectedAssetsTitle = () => {
    const totalSelected = MathHelper.add(
      (selectedAssetIds || []).length,
      (selectedFolderIds || []).length
    );

    return (
      <>
        {getClearSelectedBtn(totalSelected)}
        {allowDeletion === true ? (
          <DeleteConfirmPopupBtn
            size={"sm"}
            className={"delete-btn"}
            variant={totalSelected <= 0 ? "secondary" : "danger"}
            disabled={totalSelected <= 0}
            deletingFn={() =>
              Promise.all([
                ...selectedAssetIds.map(assetId =>
                  AssetService.deactivate(assetId)
                ),
                ...(selectedFolderIds || []).map(folderId =>
                  AssetFolderService.deactivate(folderId)
                )
              ])
            }
            deletedCallbackFn={() => {
              const assetIds = selectedAssetIds || [];
              const folderIds = selectedFolderIds || [];
              const currentAssets = (assetsList?.data || []).filter(
                asset => assetIds.indexOf(asset.id) < 0
              );
              const currentFolders = (assetFolderList?.data || []).filter(
                folder => folderIds.indexOf(folder.id) < 0
              );
              // @ts-ignore
              setAssetList(currentAssets.length <= 0 ? null : {
                ...(assetsList || {}),
                data: currentAssets
              });
              // @ts-ignore
              setAssetFolderList(currentFolders.length <= 0 ? null : {
                ...(assetFolderList || {}),
                data: currentFolders
              });
              onSelect && onSelect([]);
              onFolderSelected && onFolderSelected([]);
            }}
          >
            <Icons.Trash /> Delete{" "}
            {totalSelected <= 0
              ? ""
              : `${totalSelected}`}
          </DeleteConfirmPopupBtn>
        ) : null}
      </>
    );
  };

  const getFileId = (file: File) => {
    return `uploading_${file.lastModified}_${file.name}`;
  };

  const uploadFile = (file: File): Promise<iAsset | null> => {
    const formData = new FormData();
    formData.append("file", file);
    const asType = `${assetType || ""}`.trim();
    const listingFolderIdStr = `${listingFolderId || ""}`.trim();

    return AssetService.upload(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(asType !== "" ? { [HEADER_NAME_ASSET_TYPE]: asType } : {}),
        ...(listingFolderIdStr !== ""
          ? { [HEADER_NAME_ASSET_FOLDER_ID]: listingFolderIdStr }
          : {})
      }
    })
      .then(resp => {
        // @ts-ignore
        setAssetList({
          ...(assetsList || {}),
          data: [resp, ...(assetsList?.data || [])]
        });
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
        uploadProgress: 0,
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

      // @ts-ignore
      setAssetList({
        ...(assetsList || {}),
        // @ts-ignore
        data: [
          ...(resp || []).filter(asset => asset !== null),
          ...(assetsList?.data || [])
        ].sort((asset1, asset2) =>
          `${asset1?.createdAt || ""}` < `${asset2?.createdAt || ""}` ? 1 : -1
        )
      });
    });
  };

  const getCreationDiv = () => {
    if (allowCreation !== true) {
      return null;
    }
    return (
      <>
        <UploadFilePanel
          className={"uploader-btn"}
          uploadFn={uploadFiles}
          description={
            "Click here to upload files or drag file(s) to below area"
          }
          allowMultiple
        />
        <ButtonGroup className={"extra-btns"}>
          <AssetUrlEditPopupBtn
            size={"sm"}
            assetType={assetType}
            variant={"outline-primary"}
            mimeType={"video/youtube"}
            className={"create-from-url-btn"}
            onSaved={() => setCount(MathHelper.add(count, 1))}
          >
            Create from YouTube Link
          </AssetUrlEditPopupBtn>
          <AssetFolderPopupBtn
            parentId={listingFolder?.id}
            onSaved={() => setCount(MathHelper.add(count, 1))}
            size={"sm"}
            variant={"outline-success"}
            folderType={assetType}
          >
            Create Folder
          </AssetFolderPopupBtn>
        </ButtonGroup>
      </>
    );
  };

  const getFolderName = () => {
    if (!listingFolder) {
      return null;
    }

    return (
      <b>
        <FlexContainer className={"gap-2 align-items-end"}>
          <div>
            under <u>{listingFolder.name}</u>
          </div>
          <div
            className={"cursor-pointer"}
            onClick={() => {
              setCurrentPage(1);
              onListingFolder &&
                onListingFolder(
                  listingFolder?.parentId ? listingFolder?.parentId : null
                );
            }}
          >
            <Icons.Reply />
          </div>
        </FlexContainer>
      </b>
    );
  };

  return (
    <Wrapper>
      <FlexContainer
        className={
          "title-row justify-content-between align-items-center space-below space-sm flex-wrap"
        }
      >
        <FlexContainer className={"align-items-end gap-1"}>
          <b>Total {assetsList?.total} Asset(s)</b>
          {getFolderName()}
        </FlexContainer>
        {getCreationDiv()}
        <div>{getSelectedAssetsTitle()}</div>
      </FlexContainer>
      {allowCreation !== true ? (
        getContent()
      ) : (
        <UploadFilePanel
          uploadFn={uploadFiles}
          className={"uploader-list-wrapper"}
          allowMultiple
        >
          {getContent()}
        </UploadFilePanel>
      )}
      {getLoadingMask()}
    </Wrapper>
  );
};

export default AssetListPanel;
