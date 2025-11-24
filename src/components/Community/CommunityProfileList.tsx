import iSynCommunity from "../../types/Synergetic/iSynCommunity";
import styled from "styled-components";
import SynCommunityService from "../../services/Synergetic/Community/SynCommunityService";
import { Button } from "react-bootstrap";
import { iTableColumn } from "../common/Table";
import { FlexContainer } from "../../styles";
import CommunityAutoComplete from "./CommunityAutoComplete";
import * as Icons from "react-bootstrap-icons";
import useListCrudHook from "../hooks/useListCrudHook/useListCrudHook";
import PageLoadingSpinner from "../common/PageLoadingSpinner";
import {useCallback} from 'react';

type iCommunityProfileList = {
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
}: iCommunityProfileList) => {
  const { state, renderDataTable } = useListCrudHook<iSynCommunity>({
    getFn: useCallback(config => {
      const { filter, ...props } = config || {};
      return SynCommunityService.getCommunityProfiles({
        where: JSON.stringify({
          ...filter,
          ID: userIds,
        }),
        ...props
      });
    }, [userIds]),
  });

  const getCreatingPanel = () => {
    if (showCreatingPanel !== true) {
      return null;
    }

    return (
      <FlexContainer className={"with-gap lg-gap align-items-center"}>
        <b>Adding</b>
        <div style={{ width: "70%" }}>
          <CommunityAutoComplete
            onSelect={option => {
              let value: string | number | null | undefined = "";
              if (Array.isArray(option) && option.length > 0) {
                value = option[0].value;
              } else if (option) {
                // @ts-ignore
                value = option?.value;
              }
              onCreate &&
                onCreate(`${value || ""}`.trim() !== "" ? Number(value) : "");
            }}
          />
        </div>
      </FlexContainer>
    );
  };

  const getColumns = <T extends {}>() => {
    return [
      {
        key: "SynergeticID",
        header: "ID",
        cell: (column: iTableColumn<T>, data: iSynCommunity) => {
          return <td key={column.key}>{data.ID}</td>;
        }
      },
      {
        key: "Name",
        header: "Name",
        cell: (column: iTableColumn<T>, user: iSynCommunity) => {
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
        cell: (column: iTableColumn<T>, user: iSynCommunity) => {
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
      ...(showDeletingBtn === true
        ? [
            {
              key: "Operations",
              header: "",
              cell: (column: iTableColumn<T>, user: iSynCommunity) => {
                return (
                  <td key={column.key} className={"text-right"}>
                    <Button
                      variant={"danger"}
                      size={"sm"}
                      onClick={() => onDelete && onDelete(user.ID)}
                    >
                      <Icons.Trash />
                    </Button>
                  </td>
                );
              }
            }
          ]
        : [])
    ];
  };

  if (state.isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper className={className}>
      {renderDataTable({
        responsive: true,
        hover: true,
        columns: getColumns<iSynCommunity>(),
      })}
      {getCreatingPanel()}
    </Wrapper>
  );
};

export default CommunityProfileList;
