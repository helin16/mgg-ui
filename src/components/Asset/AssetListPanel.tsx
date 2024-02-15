import styled from "styled-components";
import {useEffect, useRef, useState} from "react";
import iPaginatedResult from "../../types/iPaginatedResult";
import iAsset from "../../types/asset/iAsset";
import AssetService, {HEADER_NAME_ASSET_TYPE} from "../../services/Asset/AssetService";
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
        border-color: blue;
      }
    }

    .load-more {
      width: 12rem;
      height: 8rem;
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
`;

type iAssetListPanel = {
  assetType?: string;
  allowCreation?: boolean;
  allowDeletion?: boolean;
  forceReload?: number;
  selectedAssetIds?: string[];
  excludeAssetIds?: string[];
  onSelect?: (selectedIds: string[]) => void;
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
  onSelect
}: iAssetListPanel) => {
  const [count] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadingAssets, setUploadingAssets] = useState<iUpLoadingAsset[]>([]);
  const excludeAssetIdsRef = useRef(excludeAssetIds);
  const [assetsList, setAssetList] = useState<iPaginatedResult<iAsset> | null>(
    null
  );

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    AssetService.getAll({
      where: JSON.stringify({
        isActive: true,
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
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }

        setAssetList(prev => ({
          ...resp,
          data: _.uniqBy(
            [...(prev?.data || []), ...(resp.data || [])],
            asset => asset.id
          )
        }));
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
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
  }, [currentPage, assetType, count, forceReload]);

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
      <Button
        variant={"secondary load-more"}
        onClick={() => setCurrentPage(MathHelper.add(currentPage, 1))}
      >
        <div style={{ fontSize: "24px" }}>
          <Icons.ArrowDown />
        </div>
        <h6>Load more</h6>
      </Button>
    );
  };

  const getContent = () => {
    return (
      <div className={"list-wrapper"}>
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

  const getSelectedAssetsTitle = () => {
    if ((selectedAssetIds || []).length < 0) {
      return null;
    }

    return (
      <>
        {onSelect ? (
          <>
            <Icons.X
              className={"cursor-pointer"}
              onClick={() => onSelect([])}
            />{" "}
            Clear
          </>
        ) : null}{" "}
        {(selectedAssetIds || []).length} selected {' '}
        {allowDeletion === true ? (
          <DeleteConfirmPopupBtn
            size={"sm"}
            className={'delete-btn'}
            variant={(selectedAssetIds || []).length <= 0 ? 'secondary' : "danger"}
            disabled={(selectedAssetIds || []).length <= 0}
            deletingFn={() =>
              Promise.all(
                selectedAssetIds.map(assetId =>
                  AssetService.deactivate(assetId)
                )
              )
            }
            deletedCallbackFn={() => {
              const assetIds = (selectedAssetIds || []);
              const currentAssets = (assetsList?.data || []).filter(asset => assetIds.indexOf(asset.id) < 0);
              if(currentAssets.length <= 0) {
                setAssetList(null);
                onSelect && onSelect([]);
                return;
              }
              // @ts-ignore
              setAssetList({
                ...(assetsList || {}),
                data: currentAssets,
              });
              onSelect && onSelect([]);
            }}
          >
            <Icons.Trash /> Delete {(selectedAssetIds || []).length <= 0 ? '' : `${(selectedAssetIds || []).length} Asset(s)`}
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

    return AssetService.upload(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(asType !== "" ? {[HEADER_NAME_ASSET_TYPE]: asType} : {}),
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
      <UploadFilePanel
        className={"uploader-btn"}
        uploadFn={uploadFiles}
        description={"Click here to upload files or drag file(s) to below area"}
        allowMultiple
      />
    );
  };

  return (
    <Wrapper>
      <FlexContainer
        className={
          "title-row justify-content-between align-items-center space-below space-sm flex-wrap"
        }
      >
        <b>Total {assetsList?.total} Asset(s)</b>
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
