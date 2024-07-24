import { Alert, Button, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import iModuleUser from "../../types/modules/iModuleUser";
import * as Icons from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/makeReduxStore";
import DeleteConfirmPopupBtn from "../common/DeleteConfirm/DeleteConfirmPopupBtn";
import styled from "styled-components";
import { iAutoCompleteSingle } from "../common/AutoComplete";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../services/Toaster";
import Table, { iTableColumn } from "../common/Table";
import PopupModal from "../common/PopupModal";
import PageLoadingSpinner from '../common/PageLoadingSpinner';
import StaffSelector from '../staff/StaffSelector';

const Wrapper = styled.div``;
type iModuleUserList = {
  moduleId: number;
  roleId: number;
  showCreatingPanel?: boolean;
  showDeletingBtn?: boolean;
  extraColumns?: iTableColumn<iModuleUser>[];
  forceReload?: number;
};

const ModuleUserList = ({
  moduleId,
  roleId,
  showCreatingPanel,
  showDeletingBtn,
  extraColumns = [],
  forceReload = 0
}: iModuleUserList) => {
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [userMap, setUserMap] = useState<{ [key: number]: iModuleUser }>({});
  const [showingCreatingPanel, setShowingCreatingPanel] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    UserService.getUsers({
      where: JSON.stringify({
        Active: 1,
        ModuleID: moduleId,
        ...(roleId ? { RoleID: roleId } : {})
      }),
      include: "SynCommunity"
    })
      .then(resp => {
        if (isCancelled === true) {
          return;
        }
        setUserMap(
          resp.reduce(
            (map, user) => ({ ...map, [user.SynergeticID]: user }),
            {}
          )
        );
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [moduleId, roleId, forceReload]);

  const getDeletingFn = (user: iModuleUser) => {
    return UserService.deleteUser(
      user.ModuleID,
      user.RoleID,
      user.SynergeticID
    );
  };

  const handleDeletedFn = (user: iModuleUser) => (resp: {
    deleted: boolean;
  }) => {
    if (resp.deleted === true) {
      delete userMap[user.SynergeticID];
      setUserMap({ ...userMap });
    }
  };

  const onCreate = (selected: iAutoCompleteSingle | null) => {
    if (selected === null) {
      return;
    }
    setIsCreating(true);
    return UserService.createUser(moduleId, roleId, selected.value)
      .then(resp => {
        Toaster.showToast(`Successfully added.`, TOAST_TYPE_SUCCESS);
        setUserMap({ ...userMap, [resp.SynergeticID]: resp });
        setShowingCreatingPanel(false);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  const getColumns = <T extends {}>(): iTableColumn<T>[] => [
    {
      key: "SynergeticID",
      header: "ID",
      cell: (column, data) => {
        return <td key={column.key}>{data.SynergeticID}</td>;
      }
    },
    {
      key: "Name",
      header: "Name",
      cell: (column, user) => {
        return (
          <td key={column.key}>
            {user.SynCommunity?.Given1} {user.SynCommunity?.Surname}
          </td>
        );
      }
    },
    {
      key: "Email",
      header: "Email",
      cell: (column, user) => {
        const emailAddress = `${user.SynCommunity?.OccupEmail || ""}`.trim();
        if (emailAddress === "") {
          return <td key={column.key}></td>;
        }

        return (
          <td key={column.key}>
            <a href={`mailto:${user.SynCommunity?.OccupEmail || ""}`}>
              {user.SynCommunity?.OccupEmail || ""}
            </a>
          </td>
        );
      }
    },
    ...extraColumns,
    {
      key: "DeleteBtn",
      header: (column: iTableColumn<T>) => {
        return (
          <th key={column.key} className={"text-right"}>
            {showCreatingPanel !== true ? null : (
              <Button
                variant={"success"}
                size={"sm"}
                onClick={() => setShowingCreatingPanel(true)}
              >
                <Icons.Plus />
              </Button>
            )}
          </th>
        );
      },
      cell: (column, user) => {
        return (
          <td className={"text-right"} key={column.key}>
            {currentUser?.synergyId === user.SynergeticID ||
            showDeletingBtn !== true ? null : (
              <DeleteConfirmPopupBtn
                variant={"danger"}
                deletingFn={() => getDeletingFn(user)}
                deletedCallbackFn={handleDeletedFn(user)}
                size={"sm"}
                description={
                  <>
                    You are about to remove admin rights from{" "}
                    <b>
                      {user.SynCommunity?.Given1} {user.SynCommunity?.Surname}
                    </b>
                  </>
                }
                confirmString={`${user.SynergeticID}`}
              >
                <Icons.Trash />
              </DeleteConfirmPopupBtn>
            )}
          </td>
        );
      }
    }
  ];

  const getRows = () => {
    const users = Object.values(userMap);
    if (users.length <= 0) {
      return [];
    }

    return users.sort((user1, user2) => {
      return `${user1.SynCommunity?.Given1}` >
        `${user2.SynCommunity?.Given1}` &&
        `${user1.SynCommunity?.Surname}` > `${user2.SynCommunity?.Surname}`
        ? 1
        : -1;
    });
  };

  if (isLoading === true) {
    return <PageLoadingSpinner />;
  }

  const getCreatingPanel = () => {
    if (showingCreatingPanel !== true) {
      return null;
    }
    return (
      <PopupModal
        show={showCreatingPanel}
        handleClose={() => setShowingCreatingPanel(false)}
        title={"Adding a user..."}
      >
        <p>You are about to add a new user to the list</p>
        {isCreating === true ? (
          <Spinner animation={"border"} size={"sm"} />
        ) : (
          <div style={{ width: "100%" }}>
            <StaffSelector onSelect={(option) => onCreate(Array.isArray(option)  ? option[0] : option)} />
          </div>
        )}
        <p></p>
        <Alert variant={"warning"}>You can NOT add yourself.</Alert>
      </PopupModal>
    );
  };

  return (
    <Wrapper
      className={`module-user-list moduleId-${moduleId} roleId-${roleId}`}
    >
      <Table
        striped
        hover
        className={"list-table"}
        columns={getColumns<iModuleUser>()}
        rows={getRows()}
      />
      {getCreatingPanel()}
    </Wrapper>
  );
};

export default ModuleUserList;
