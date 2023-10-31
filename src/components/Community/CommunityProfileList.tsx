import { useEffect, useState } from "react";
import iSynCommunity from "../../types/Synergetic/iSynCommunity";
import styled from "styled-components";
import SynCommunityService from "../../services/Synergetic/Community/SynCommunityService";
import Toaster from "../../services/Toaster";
import {Button, Spinner} from "react-bootstrap";
import Table, {iTableColumn} from "../common/Table";
import { FlexContainer } from "../../styles";
import CommunityAutoComplete from "./CommunityAutoComplete";
import * as Icons from "react-bootstrap-icons";

type iPowerBIListItemUserList = {
  userIds: (string | number)[];
  onCreate?: (newId: string | number) => void;
  onDelete?: (userId: string | number) => void;
  showCreatingPanel?: boolean;
  showDeletingBtn?: boolean;
  className?: string;
};

const Wrapper = styled.div``;
const CommunityProfileList = ({
  userIds,
  onCreate,
  showCreatingPanel,
  showDeletingBtn,
  onDelete,
  className
}: iPowerBIListItemUserList) => {
  const [communityProfiles, setCommunityProfiles] = useState<iSynCommunity[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userIds.length <= 0) {
      setCommunityProfiles([]);
      return;
    }

    let isCanceled = false;
    setIsLoading(true);

    SynCommunityService.getCommunityProfiles({
      where: JSON.stringify({
        ID: userIds
      }),
      perPage: 999999
    })
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setCommunityProfiles(resp.data || []);
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
  }, [userIds]);

  const getCreatingPanel = () => {
    if (showCreatingPanel !== true) {
      return null;
    }

    return (
      <FlexContainer className={"with-gap lg-gap align-items-center"}>
        <b>Adding</b>
        <div style={{ width: "70%" }}>
          <CommunityAutoComplete
            onSelect={option =>
              onCreate && onCreate(option?.value ? Number(option?.value) : "")
            }
          />
        </div>
      </FlexContainer>
    );
  };

  if (isLoading === true) {
    return <Spinner animation={"border"} />;
  }

  return (
    <Wrapper className={className}>
      <Table
        responsive
        hover
        columns={[
          {
            key: "SynergeticID",
            header: "ID",
            cell: (column, data) => {
              return <td key={column.key}>{data.ID}</td>;
            }
          },
          {
            key: "Name",
            header: "Name",
            cell: (column, user) => {
              return (
                <td key={column.key}>
                  {user.Given1} {user.Surname}
                  {`${user.Preferred || ""}`.trim() === ""
                    ? ""
                    : ` (${user.Preferred})`}
                </td>
              );
            }
          },
          {
            key: "Email",
            header: "Email",
            cell: (column, user) => {
              const emailAddress = `${user.OccupEmail || ""}`.trim();
              if (emailAddress === "") {
                return <td key={column.key}></td>;
              }

              return (
                <td key={column.key}>
                  <a href={`mailto:${user.OccupEmail || ""}`}>
                    {user.OccupEmail || ""}
                  </a>
                </td>
              );
            }
          },
          ...(showDeletingBtn === true ? [{
            key: "Operations",
            header: "",
            cell: (column: iTableColumn, user: iSynCommunity) => {
              return (
                <td key={column.key} className={'text-right'}>
                  <Button variant={'danger'} size={'sm'} onClick={() => onDelete && onDelete(user.ID)}>
                    <Icons.Trash />
                  </Button>
                </td>
              );
            }
          }] : []),
        ]}
        rows={communityProfiles}
      />
      {getCreatingPanel()}
    </Wrapper>
  );
};

export default CommunityProfileList;
