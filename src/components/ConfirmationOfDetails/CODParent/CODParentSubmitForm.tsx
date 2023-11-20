import { useSelector } from "react-redux";
import { RootState } from "../../../redux/makeReduxStore";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import iConfirmationOfDetailsResponse from "../../../types/ConfirmationOfDetails/iConfirmationOfDetailsResponse";
import ConfirmationOfDetailsResponseService from "../../../services/ConfirmationOfDetails/ConfirmationOfDetailsResponseService";
import Toaster from "../../../services/Toaster";
import PageLoadingSpinner from "../../common/PageLoadingSpinner";
import SynCommunityService from "../../../services/Synergetic/Community/SynCommunityService";
import LoadingBtn from "../../common/LoadingBtn";
import PageNotFound from "../../PageNotFound";
import { Button } from "react-bootstrap";
import DeleteConfirmPopupBtn from "../../common/DeleteConfirm/DeleteConfirmPopupBtn";
import CODParentSubmitFormDetails from './CODParentSubmitFormDetails';

const Wrapper = styled.div``;

type iCODParentSubmitForm = {
  studentId: number;
};
const CODParentSubmitForm = ({ studentId }: iCODParentSubmitForm) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [
    codResponse,
    setCodResponse
  ] = useState<iConfirmationOfDetailsResponse | null>(null);
  const [
    editingCod,
    setEditingCod
  ] = useState<iConfirmationOfDetailsResponse | null>(null);

  const createNewCOD = () => {
    return ConfirmationOfDetailsResponseService.create({
      StudentID: studentId
    });
  };

  useEffect(() => {
    let isCanceled = false;
    const getData = async () => {
      const resp = await ConfirmationOfDetailsResponseService.getAll({
        where: JSON.stringify({
          StudentID: studentId,
          isCurrent: true,
          submittedAt: null,
          canceledAt: null
        }),
        sort: "updatedAt:DESC",
        perPage: 1
      });
      const data = resp.data || [];
      const response = data.length > 0 ? data[0] : null;
      if (response === null) {
        if (isCanceled) {
          return;
        }
        const cod = await createNewCOD();
        setCodResponse(cod);
        setEditingCod(cod);
        return;
      }

      const synIds = [
        studentId,
        response.createdById || "",
        response.updatedById || ""
      ].filter(id => `${id || ""}`.trim() !== "");
      const communityResp = await SynCommunityService.getCommunityProfiles({
        where: JSON.stringify({ ID: synIds })
      });
      const profileMap = (communityResp.data || []).reduce(
        (map: any, profile) => {
          return {
            ...map,
            [profile.ID]: profile
          };
        },
        {}
      );

      if (isCanceled) {
        return;
      }
      setCodResponse({
        ...response,
        Student: studentId in profileMap ? profileMap[studentId] : null,
        CreatedBy:
          (response.createdById || "") in profileMap
            ? profileMap[response.createdById || ""]
            : null,
        UpdatedBy:
          (response.updatedById || "") in profileMap
            ? profileMap[response.updatedById || ""]
            : null
      });
      setEditingCod(null);
    };

    setIsLoading(true);
    getData()
      .then(resp => {
        if (isCanceled) {
          return;
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
      isCanceled = false;
    };
  }, [studentId]);

  const handleCreateNewCOD = () => {
    setIsCreating(true);
    return createNewCOD()
      .then(resp => {
        setEditingCod(resp);
        setCodResponse(resp);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  const getContent = () => {
    if (isLoading) {
      return <PageLoadingSpinner />;
    }

    if (editingCod !== null) {
      return <CODParentSubmitFormDetails response={editingCod} />;
    }

    if (codResponse !== null) {
      return (
        <PageNotFound
          title={"Continue completing previous form"}
          description={
            <>
              System found that your form has NOT been completed, you can
              either:
              <div>
                <ul style={{ listStyle: "none" }}>
                  <li>
                    <strong>Start New</strong> - Existing response will be
                    ignored, and a new one will start
                  </li>
                  <li>
                    <strong>Continue</strong> - Continue with existing response
                  </li>
                </ul>
              </div>
            </>
          }
          primaryBtn={
            <DeleteConfirmPopupBtn
              variant={'link'}
              deletingFn={createNewCOD}
              deletedCallbackFn={resp => {
                setCodResponse(resp);
                setEditingCod(resp);
              }}
              confirmString={`${currentUser?.synergyId || 'start new'}`}
              description={'Are you sure to cancel the previous saved form and start new?'}
              confirmBtnString={'Confirm'}
            >
              Start New
            </DeleteConfirmPopupBtn>
          }
          secondaryBtn={
            <Button
              variant={"primary"}
              onClick={() => setEditingCod(codResponse)}
            >
              Continue
            </Button>
          }
        />
      );
    }

    return (
      <div className={"text-center"}>
        <LoadingBtn
          isLoading={isCreating === true}
          variant={"primary"}
          onClick={() => handleCreateNewCOD()}
        >
          Start
        </LoadingBtn>
      </div>
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default CODParentSubmitForm;
