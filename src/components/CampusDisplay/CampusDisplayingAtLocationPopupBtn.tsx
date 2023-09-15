import { useEffect, useState } from "react";
import {Alert, Button, ButtonProps, Spinner} from "react-bootstrap";
import iCampusDisplayLocation from "../../types/CampusDisplay/iCampusDisplayLocation";
import CampusDisplayLocationService from "../../services/CampusDisplay/CampusDisplayLocationService";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../services/Toaster";
import { FlexContainer } from "../../styles";
import LoadingBtn from "../common/LoadingBtn";
import * as Icons from "react-bootstrap-icons";
import FormLabel from "../form/FormLabel";
import PopupModal from "../common/PopupModal";
import CampusDisplayLocationSelector from "./CampusDisplayLocationSelector";
import MathHelper from "../../helper/MathHelper";

type iCampusDisplayingAtLocationPopupBtn = ButtonProps & {
  displayId: string;
};

const CampusDisplayingAtLocationPopupBtn = ({
  displayId,
  ...props
}: iCampusDisplayingAtLocationPopupBtn) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showingPopup, setShowingPopup] = useState(false);
  const [location, setLocation] = useState<iCampusDisplayLocation | null>(null);
  const [editingLocation, setEditingLocation] = useState<iCampusDisplayLocation | null>(
    null
  );
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    CampusDisplayLocationService.getAll({
      where: JSON.stringify({ isActive: true, displayId }),
      sort: "createdAt:DESC",
      include: 'CampusDisplay',
      perPage: 1
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        const initLocation = (resp.data || []).length > 0 ? resp.data[0] : null;
        setLocation(initLocation);
        setEditingLocation(initLocation);
        setShowingPopup(false);
        setIsSaving(false);
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
  }, [displayId, count]);

  const handleSubmit = () => {
    if (
      `${location?.id || ""}`.trim() === `${editingLocation?.id || ""}`.trim()
    ) {
      setShowingPopup(false);
      return;
    }

    setIsSaving(true);
    Promise.all([
      ...(`${location?.id || ""}`.trim() !== ""
        ? [
            CampusDisplayLocationService.update(
              `${location?.id || ""}`.trim(),
              {
                displayId: null
              }
            )
          ]
        : []),
      ...(`${editingLocation?.id || ""}`.trim() !== ""
        ? [
            CampusDisplayLocationService.update(
              `${editingLocation?.id || ""}`.trim(),
              {
                displayId
              }
            )
          ]
        : [])
    ])
      .then(() => {
        Toaster.showToast("Displaying Location Updated", TOAST_TYPE_SUCCESS);
        setCount(MathHelper.add(count, 1));
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getAlert = () => {
    if (!editingLocation || `${editingLocation.displayId || ''}`.trim() === '') {
      return null;
    }
    return <Alert variant={'danger'}><h6>This location is showing another display ({editingLocation.CampusDisplay?.name || ''})</h6>Are you sure to replace it?</Alert>
  }

  const getPopup = () => {
    if (!showingPopup) {
      return null;
    }
    return (
      <PopupModal
        show={showingPopup === true}
        handleClose={() => setShowingPopup(false)}
        title={<h6>Choose a location to display</h6>}
        footer={
          <FlexContainer className={"justify-content-between"}>
            <div />
            <div>
              <LoadingBtn
                isLoading={isSaving === true}
                variant={"link"}
                onClick={() => setShowingPopup(false)}
              >
                <Icons.X /> Cancel
              </LoadingBtn>
              <LoadingBtn
                isLoading={isSaving === true}
                variant={"primary"}
                onClick={() => handleSubmit()}
              >
                <Icons.Send /> Save
              </LoadingBtn>
            </div>
          </FlexContainer>
        }
      >
        <div>
          <FormLabel label={"Displaying at location:"} />
          <CampusDisplayLocationSelector
            values={
              `${editingLocation?.id || ""}`.trim() !== ""
                ? [`${editingLocation?.id || ""}`.trim()]
                : undefined
            }
            allowClear
            onSelect={option => {
              setEditingLocation(
                // @ts-ignore
                `${option?.value || ""}`.trim() === ""
                  ? null
                  : // @ts-ignore
                  option.data
              );
            }}
          />
          {getAlert()}
        </div>
      </PopupModal>
    );
  };

  if (isLoading === true) {
    return <Spinner animation={"border"} />;
  }

  return (
    <div className={"campus-display-at-location-popup-btn"}>
      <Button {...props} onClick={() => setShowingPopup(true)}>
        Showing At: {location?.name || "NO WHERE"}
      </Button>
      {getPopup()}
    </div>
  );
};

export default CampusDisplayingAtLocationPopupBtn;
