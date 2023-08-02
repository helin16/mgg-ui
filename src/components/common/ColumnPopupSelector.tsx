import { iTableColumn } from "./Table";
import { Button, ButtonProps, Form } from "react-bootstrap";
import styled from "styled-components";
import * as Icons from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import PopupModal, { iPopupModal } from "./PopupModal";
import { FlexContainer } from "../../styles";

type iColumnPopupSelector = ButtonProps & {
  columns: iTableColumn[];
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

  .group-div {
    .col-group-options {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 5px;
      max-height: calc(100vh - 20rem);
    }
  }
`;
type iGroupedColumns = { [key: string]: iTableColumn[] };
const ColumnPopupSelector = ({
  columns,
  selectedColumns,
  popupModalProp,
  onColumnSelected,
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
    setSelectedColumnKeys(
      (selectedColumns || columns.filter(col => col.isDefault === true)).map(
        col => col.key
      )
    );
  }, [columns, selectedColumns]);

  const handleConfirm = () => {
    setShowingPopup(false);
    if (selectedColumnKeys.length <= 0) {
      onColumnSelected([]);
    }
    const selectedColKeys = selectedColumnKeys
      .map(key => `${key || ""}`.trim())
      .filter(key => key !== "");
    onColumnSelected(
      columns.filter(col => selectedColKeys.indexOf(`${col.key}`.trim()) >= 0)
    );
  };

  const getContent = () => {
    return (
      <PopupModal
        show={showingPopup}
        dialogClassName={popupModalProp?.dialogClassName || "modal-80w"}
        handleClose={() => setShowingPopup(false)}
        header={<b>Select columns to display</b>}
        footer={
          <FlexContainer className={"justify-content-between"}>
            <div />
            <div>
              <Button
                size={"sm"}
                variant={"link"}
                onClick={() => setShowingPopup(false)}
              >
                <Icons.X /> Cancel
              </Button>{" "}
              <Button
                size={"sm"}
                variant={"primary"}
                onClick={() => handleConfirm()}
              >
                <Icons.CheckLg /> Confirm
              </Button>
            </div>
          </FlexContainer>
        }
        {...popupModalProp}
      >
        <PopupWrapper>
          <FlexContainer className={"with-gap lg-gap flex-wrap wrap"}>
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
                          onChange={event => {
                            if (event.target.checked) {
                              setSelectedColumnKeys([
                                ...selectedColumnKeys,
                                column.key
                              ]);
                              return;
                            }
                            setSelectedColumnKeys(
                              selectedColumnKeys.filter(
                                key =>
                                  `${key}`.trim() !== `${column.key}`.trim()
                              )
                            );
                          }}
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
          </FlexContainer>
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
