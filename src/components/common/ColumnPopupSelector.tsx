import { iTableColumn } from "./Table";
import { Button, ButtonProps, Form } from "react-bootstrap";
import styled from "styled-components";
import * as Icons from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import PopupModal, { iPopupModal } from "./PopupModal";
import { FlexContainer } from "../../styles";
import LocalStorageService from '../../services/LocalStorageService';

type iColumnPopupSelector = ButtonProps & {
  columns: iTableColumn[];
  localStorageKey?: string;
  selectedColumns?: iTableColumn[];
  popupModalProp?: iPopupModal;
  onColumnSelected: (selectedColumns: iTableColumn[]) => void;
};

const Wrapper = styled.div``;
const PopupWrapper = styled.div`
  .col-group-title {
    font-weight: bold;
    padding-bottom: 0.2rem;
    border-bottom: 1px #aaa solid;
  }
  .selector-div {
    :hover {
      text-decoration: underline;
    }
  }

  .group-div-wrapper {
    display: table-row;
    .group-div {
      padding: 0 0.5rem 0.5rem 0.5rem;
      display: table-cell;
      .col-group-options {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
      }
    }
  }
`;
type iGroupedColumns = { [key: string]: iTableColumn[] };

export const getSelectedColumnsFromLocalStorage = (localStorageKey: string, columns: iTableColumn[]) => {
  const selectedKeys = LocalStorageService.getItem(localStorageKey);
  if (!Array.isArray(selectedKeys) || selectedKeys.length <= 0) {
    return [];
  }
  return columns.filter(col => selectedKeys.indexOf(col.key) >= 0)
}

const ColumnPopupSelector = ({
  columns,
  selectedColumns,
  popupModalProp,
  onColumnSelected,
  localStorageKey,
  ...props
}: iColumnPopupSelector) => {
  const [showingPopup, setShowingPopup] = useState(false);
  const [groupedColumns, setGroupedColumns] = useState<iGroupedColumns>({});
  const [selectedColumnKeys, setSelectedColumnKeys] = useState<string[]>([]);

  useEffect(() => {
    setGroupedColumns(
      columns.reduce((map: iGroupedColumns, column) => {
        const group = `${column.group || ""}`.trim();
        return {
          ...map,
          [group]: [...(group in map ? map[group] : []), column]
        };
      }, {})
    );
  }, [columns]);

  useEffect(() => {
    setSelectedColumnKeys(
      (selectedColumns || columns.filter(col => col.isDefault === true)).map(
        col => col.key
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColumns]);

  const handleClose = () => {
    setShowingPopup(false);
  }

  const handleSelected = (selected: boolean, column: iTableColumn) => {
    const newSelectedKeys = selected === true ? [
      ...selectedColumnKeys,
      column.key
    ] : selectedColumnKeys.filter(
      key =>
        key !== column.key
    )
    setSelectedColumnKeys(newSelectedKeys);
    const storageKey = `${localStorageKey || ''}`.trim();
    if (storageKey !== '') {
      LocalStorageService.setItem(storageKey, newSelectedKeys);
    }
    onColumnSelected(
      columns.filter(col => newSelectedKeys.indexOf(col.key) >= 0)
    );
  };

  const getContent = () => {
    return (
      <PopupModal
        show={showingPopup}
        dialogClassName={popupModalProp?.dialogClassName || "modal-80w"}
        handleClose={() => handleClose()}
        header={<b>Select columns to display</b>}
        footer={
          <FlexContainer className={"justify-content-between"}>
            <div />
            <div>
              <Button
                size={"sm"}
                variant={"primary"}
                onClick={() => handleClose()}
              >
                <Icons.CheckLg /> OK
              </Button>
            </div>
          </FlexContainer>
        }
        {...popupModalProp}
      >
        <PopupWrapper>
          <div className={"group-div-wrapper"}>
            {Object.keys(groupedColumns).map(group => {
              return (
                <div key={group} className={"group-div"}>
                  <div className={"col-group-title"}>
                    {`${group}`.trim() === "" ? "Default" : group}
                  </div>
                  <div className={"col-group-options"}>
                    {groupedColumns[group].map(column => {
                      return (
                        <Form.Check
                          key={column.key}
                          type={"checkbox"}
                          id={column.key}
                          disabled={column.isSelectable === false}
                          checked={selectedColumnKeys.indexOf(column.key) >= 0}
                          onChange={event => handleSelected(event.target.checked, column)}
                          label={
                            column.name
                              ? column.name
                              : typeof column.header === "string"
                              ? column.header
                              : column.key
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </PopupWrapper>
      </PopupModal>
    );
  };

  return (
    <Wrapper>
      <Button
        {...props}
        variant={props.variant || "secondary"}
        onClick={() => setShowingPopup(true)}
      >
        <Icons.Gear /> Columns
      </Button>
      {getContent()}
    </Wrapper>
  );
};

export default ColumnPopupSelector;
