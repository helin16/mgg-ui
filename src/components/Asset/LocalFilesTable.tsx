import styled from "styled-components";
import Table, { iTableColumn } from "../common/Table";
import UtilsService from "../../services/UtilsService";
import { Button } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";

const Wrapper = styled.div``;

type iLocalFilesTable = {
  files: File[];
  hideWhenEmpty?: boolean;
  onDelete?: (file: File) => void;
  onClear?: () => void;
};

const LocalFilesTable = ({
  files,
  hideWhenEmpty = true,
  onDelete,
  onClear
}: iLocalFilesTable) => {
  const getContent = () => {
    if (files.length <= 0 && hideWhenEmpty === true) {
      return null;
    }
    return (
      <Table
        columns={[
          {
            key: "fileName",
            header: "Name",
            cell: (col: iTableColumn, data: File) => {
              return (
                <td key={col.key} className={"ellipsis"}>
                  {data.name}
                </td>
              );
            }
          },
          {
            key: "FileType",
            header: "File Type",
            cell: (col: iTableColumn, data: File) => {
              return (
                <td key={col.key} className={"ellipsis"}>
                  {data.type}
                </td>
              );
            }
          },
          {
            key: "FileSize",
            header: "File Size",
            cell: (col: iTableColumn, data: File) => {
              return (
                <td key={col.key} className={"ellipsis"}>
                  {UtilsService.formatBytesToHuman(data.size || 0)}
                </td>
              );
            }
          },
          ...(onClear || onDelete
            ? [
                {
                  key: "Options",
                  header: (col: iTableColumn) => {
                    return (
                      <th key={col.key} className={'text-right'}>
                        {onClear ? (
                          <Button
                            variant={"link"}
                            size={"sm"}
                            className={'no-padding'}
                            onClick={() => onClear && onClear()}
                          >
                            <Icons.XLg /> Clear
                          </Button>
                        ) : null}
                      </th>
                    );
                  },
                  cell: (col: iTableColumn, data: File) => {
                    return (
                      <td key={col.key} className={"ellipsis text-right"} >
                        <Button
                          variant={"link"}
                          size={"sm"}
                          onClick={() => onDelete && onDelete(data)}
                        >
                          <Icons.Trash />
                        </Button>
                      </td>
                    );
                  }
                }
              ]
            : [])
        ]}
        hover
        striped
        responsive
        rows={files}
      />
    );
  };
  return <Wrapper>{getContent()}</Wrapper>;
};

export default LocalFilesTable;
