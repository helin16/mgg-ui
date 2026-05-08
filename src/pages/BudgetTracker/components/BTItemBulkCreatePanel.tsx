import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Alert, Table } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import * as XLSX from "sheetjs-style";
import UploadFilePanel from "../../../components/Asset/UploadFilePanel";
import LoadingBtn from "../../../components/common/LoadingBtn";
import BTItemCategoryService from "../../../services/BudgetTracker/BTItemCategoryService";
import BTItemService from "../../../services/BudgetTracker/BTItemService";
import Toaster, {
  TOAST_TYPE_ERROR,
  TOAST_TYPE_SUCCESS
} from "../../../services/Toaster";
import UtilsService from "../../../services/UtilsService";
import MathHelper from "../../../helper/MathHelper";
import iSynGeneralLedger from "../../../types/Synergetic/Finance/iSynGeneralLedager";
import iBTItemCategory from "../../../types/BudgetTacker/iBTItemCategory";
import iBTItem from "../../../types/BudgetTacker/iBTItem";

type iBTItemBulkCreatePanel = {
  gl: iSynGeneralLedger;
  forYear: number;
  onCancel: () => void;
  onItemsSaved: (count: number) => void;
};

type iImportedRow = {
  rowNo: number;
  name: string;
  description: string;
  itemQuantity: string;
  itemCost: string;
};

type iPreviewRow = {
  rowNo: number;
  category: iBTItemCategory | null;
  name: string;
  description: string;
  rawItemQuantity: string;
  rawItemCost: string;
  itemQuantity: number | null;
  itemCost: number | null;
  nameErrors: string[];
  quantityErrors: string[];
  costErrors: string[];
  rowErrors: string[];
};

export type iBTItemBulkPreviewRow = iPreviewRow;

const Wrapper = styled.div`
  .space-below {
    margin-bottom: 1rem;
  }

  .upload-panel {
    margin-bottom: 1rem;
  }

  .help-list {
    margin-bottom: 0;
    padding-left: 1rem;
  }

  .preview-table {
    font-size: 13px;
    th,
    td {
      vertical-align: top;
    }

    td.has-error {
      background-color: #fff3cd;
    }
  }

  .table-wrapper {
    max-height: 420px;
    overflow: auto;
    border: 1px solid #dee2e6;
  }
`;

const normalizeHeader = (value: any) => {
  return `${value || ""}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
};

const normalizeLookupValue = (value: any) => {
  return `${value || ""}`.trim().toLowerCase();
};

export const DEFAULT_CATEGORY_NAME = "As per Account";

export const parseNumericValue = (value: any) => {
  const rawValue = `${value || ""}`.trim();
  if (rawValue === "") {
    return null;
  }
  const normalizedValue = rawValue.replace(/\$/g, "").replace(/,/g, "").trim();
  if (/^-?\d+(\.\d+)?$/.test(normalizedValue) !== true) {
    return null;
  }
  return Number(normalizedValue);
};

export const buildBulkCreatePreviewRows = ({
  importedRows,
  categories,
  existingItems
}: {
  importedRows: iImportedRow[];
  categories: iBTItemCategory[];
  existingItems: iBTItem[];
}): iBTItemBulkPreviewRow[] => {
  const categoryMaps = categories.reduce(
    (
      maps: {
        byName: { [key: string]: iBTItemCategory };
      },
      category
    ) => {
      const nameKey = normalizeLookupValue(category.name);
      return {
        byName: {
          ...maps.byName,
          [nameKey]: category
        }
      };
    },
    { byName: {} }
  );

  const defaultCategory =
    categoryMaps.byName[normalizeLookupValue(DEFAULT_CATEGORY_NAME)] || null;
  const existingItemNameMap = existingItems.reduce(
    (map: { [key: string]: boolean }, item) => ({
      ...map,
      [normalizeLookupValue(item.name)]: true
    }),
    {}
  );
  const importedItemNameCountMap = importedRows.reduce(
    (map: { [key: string]: number }, row) => {
      const key = normalizeLookupValue(row.name);
      if (key === "") {
        return map;
      }
      return {
        ...map,
        [key]: (map[key] || 0) + 1
      };
    },
    {}
  );

  return importedRows.map(row => {
    const rowErrors: string[] = [];
    const nameErrors: string[] = [];
    const quantityErrors: string[] = [];
    const costErrors: string[] = [];
    const category = defaultCategory;
    const normalizedName = normalizeLookupValue(row.name);

    if (!category) {
      rowErrors.push(
        `Budget category "${DEFAULT_CATEGORY_NAME}" must exist as an active category.`
      );
    }
    if (`${row.name || ""}`.trim() === "") {
      nameErrors.push("Error");
    } else {
      if ((importedItemNameCountMap[normalizedName] || 0) > 1) {
        nameErrors.push("Duplicated Item Name");
      }
      if (existingItemNameMap[normalizedName] === true) {
        nameErrors.push("Duplicated Item Name");
      }
    }
    if (`${row.description || ""}`.trim() === "") {
      rowErrors.push("Reason is required.");
    }

    const quantityValue = `${row.itemQuantity || ""}`.trim();
    const costValue = `${row.itemCost || ""}`.trim();
    const itemQuantity = parseNumericValue(quantityValue);
    const itemCost = parseNumericValue(costValue);

    if (quantityValue === "") {
      quantityErrors.push("Error");
    } else if (itemQuantity === null) {
      quantityErrors.push("Error");
    }

    if (costValue === "") {
      costErrors.push("Error");
    } else if (itemCost === null) {
      costErrors.push("Error");
    }

    return {
      rowNo: row.rowNo,
      category,
      name: `${row.name || ""}`.trim(),
      description: `${row.description || ""}`.trim(),
      rawItemQuantity: quantityValue,
      rawItemCost: costValue,
      itemQuantity,
      itemCost,
      nameErrors: Array.from(new Set(nameErrors)),
      quantityErrors: Array.from(new Set(quantityErrors)),
      costErrors: Array.from(new Set(costErrors)),
      rowErrors: Array.from(new Set(rowErrors))
    };
  });
};

export const getBulkImportButtonLabel = ({
  errorCount,
  previewRowCount,
  validRowCount,
  validRowsTotalAmt
}: {
  errorCount: number;
  previewRowCount: number;
  validRowCount: number;
  validRowsTotalAmt: number;
}) => {
  if (errorCount > 0 || previewRowCount <= 0) {
    return "Import";
  }
  return `Import ${validRowCount} items with Total Amt: ${UtilsService.formatIntoCurrency(
    validRowsTotalAmt
  )}`;
};

const BTItemBulkCreatePanel = ({
  gl,
  forYear,
  onCancel,
  onItemsSaved
}: iBTItemBulkCreatePanel) => {
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingExistingItems, setIsLoadingExistingItems] = useState(false);
  const [categories, setCategories] = useState<iBTItemCategory[]>([]);
  const [existingItems, setExistingItems] = useState<iBTItem[]>([]);
  const [importedRows, setImportedRows] = useState<iImportedRow[]>([]);
  const [importFileName, setImportFileName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsLoadingCategories(true);
    BTItemCategoryService.getAll({
      where: JSON.stringify({
        active: true
      }),
      sort: "name:ASC"
    })
      .then(resp => {
        setCategories(resp || []);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsLoadingCategories(false);
      });
  }, []);

  useEffect(() => {
    setIsLoadingExistingItems(true);
    BTItemService.getAll({
      where: JSON.stringify({
        year: forYear,
        gl_code: gl.GLCode
      }),
      perPage: 999999
    })
      .then(resp => {
        setExistingItems(resp.data || []);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsLoadingExistingItems(false);
      });
  }, [forYear, gl.GLCode]);

  const previewRows: iPreviewRow[] = useMemo(() => {
    return buildBulkCreatePreviewRows({
      importedRows,
      categories,
      existingItems
    });
  }, [categories, existingItems, importedRows]);

  const validRows = previewRows.filter(
    row =>
      row.nameErrors.length <= 0 &&
      row.quantityErrors.length <= 0 &&
      row.costErrors.length <= 0 &&
      row.rowErrors.length <= 0
  );
  const invalidRows = previewRows.filter(
    row =>
      row.nameErrors.length > 0 ||
      row.quantityErrors.length > 0 ||
      row.costErrors.length > 0 ||
      row.rowErrors.length > 0
  );
  const errorCount = invalidRows.reduce(
    (sum, row) =>
      sum +
      row.nameErrors.length +
      row.quantityErrors.length +
      row.costErrors.length +
      row.rowErrors.length,
    0
  );
  const validRowsTotalAmt = validRows.reduce(
    (sum, row) =>
      row.itemQuantity !== null && row.itemCost !== null
        ? MathHelper.add(sum, MathHelper.mul(row.itemQuantity, row.itemCost))
        : sum,
    0
  );

  const downloadTemplate = () => {
    const rows = [
      ["Item Name", "Reason For Purchase", "Qty to purchase", "Unit Cost"],
      ["", "", "", ""]
    ];
    const csvContent = rows
      .map(row =>
        row
          .map(value => `"${`${value || ""}`.replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `budget_tracker_bulk_create_template_${forYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getHeaderValue = (row: any[], headerMap: { [key: string]: number }, keys: string[]) => {
    const index = keys.find(key => key in headerMap);
    if (!index) {
      return "";
    }
    return `${row[headerMap[index]] || ""}`.trim();
  };

  const parseFile = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(firstSheet, {
      header: 1,
      raw: false,
      defval: ""
    }) as any[][];

    if ((rows || []).length <= 1) {
      throw new Error("The file must include a header row and at least one item row.");
    }

    const headerMap = (rows[0] || []).reduce(
      (map: { [key: string]: number }, headerValue: any, index: number) => ({
        ...map,
        [normalizeHeader(headerValue)]: index
      }),
      {}
    );

    const requiredGroups = [
      ["item name"],
      ["reason for purchase"],
      ["qty to purchase"],
      ["unit cost"]
    ];

    const missingRequiredHeader = requiredGroups.find(group => {
      return group.filter(option => option in headerMap).length <= 0;
    });

    if (missingRequiredHeader) {
      throw new Error(
        `Missing required column. Expected one of: ${missingRequiredHeader.join(", ")}`
      );
    }

    const parsedRows = rows
      .slice(1)
      .map((row, index) => ({
        rowNo: index + 2,
        name: getHeaderValue(row, headerMap, ["item name"]),
        description: getHeaderValue(row, headerMap, ["reason for purchase"]),
        itemQuantity: getHeaderValue(row, headerMap, ["qty to purchase"]),
        itemCost: getHeaderValue(row, headerMap, ["unit cost"])
      }))
      .filter(row => {
        return (
          row.name !== "" ||
          row.description !== "" ||
          row.itemQuantity !== "" ||
          row.itemCost !== ""
        );
      });

    if (parsedRows.length <= 0) {
      throw new Error("No item rows were found after the header row.");
    }

    setImportedRows(parsedRows);
    setImportFileName(file.name);
  };

  const handleUpload = async (files: File[]) => {
    if (files.length <= 0) {
      return;
    }

    try {
      await parseFile(files[0]);
    } catch (err: any) {
      setImportedRows([]);
      setImportFileName("");
      Toaster.showToast(
        err?.message || "Unable to read the selected file.",
        TOAST_TYPE_ERROR
      );
    }
  };

  const bulkCreate = () => {
    if (previewRows.length <= 0) {
      Toaster.showToast("Please upload a file with items to create.", TOAST_TYPE_ERROR);
      return;
    }

    if (invalidRows.length > 0) {
      Toaster.showToast(
        "Please fix the invalid rows in the upload before creating items.",
        TOAST_TYPE_ERROR
      );
      return;
    }

    setIsSaving(true);
    Promise.all(
      validRows.map(row =>
        BTItemService.create({
          budget_item_category_guid: row.category?.guid || null,
          gl_code: gl.GLCode,
          name: row.name,
          description: row.description,
          item_quantity: row.itemQuantity,
          item_cost: row.itemCost,
          year: forYear
        })
      )
    )
      .then(resp => {
        Toaster.showToast(
          `${resp.length} item(s) created successfully.`,
          TOAST_TYPE_SUCCESS
        );
        onItemsSaved(resp.length);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <Wrapper>
      {previewRows.length <= 0 ? (
        <Alert variant={"info"} className={"space-below"}>
          <div>
            Upload a CSV or Excel file with these columns:
            <code> item name </code>,
            <code> reason for purchase </code>,
            <code> qty to purchase </code>,
            <code> unit cost </code>.
          </div>
          <ul className={"help-list"}>
            <li>Use the first sheet only.</li>
            <li>Header names are case-insensitive.</li>
            <li>Every imported row will use the active category <b>{DEFAULT_CATEGORY_NAME}</b>.</li>
            <li>Duplicate item names are blocked within the file and against existing items under this GL.</li>
          </ul>
          <div className={"mt-2"}>
            <LoadingBtn variant={"outline-primary"} size={"sm"} onClick={downloadTemplate}>
              <Icons.Download /> Download CSV Template
            </LoadingBtn>
          </div>
        </Alert>
      ) : null}

      {previewRows.length <= 0 ? (
        <UploadFilePanel
          className={"upload-panel"}
          uploadFn={handleUpload}
          acceptFileTypes={[".csv", ".xlsx", ".xls"]}
          description={
            <>
              <Icons.Upload /> Click here to upload a CSV/XLSX file
            </>
          }
        />
      ) : null}

      {isLoadingCategories || isLoadingExistingItems ? (
        <Alert variant={"secondary"} className={"space-below"}>
          Loading import rules...
        </Alert>
      ) : null}

      {previewRows.length > 0 ? (
        <>
          <div className={"space-below"}>
            <small>{importFileName}</small>
          </div>
          <div className={"table-wrapper space-below"}>
            <Table striped bordered hover size={"sm"} className={"preview-table mb-0"}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Item</th>
                  <th>Reason For Purchase</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total Amt</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map(row => (
                  <tr key={row.rowNo}>
                    <td className={row.rowErrors.filter(error => error.indexOf("Budget category") >= 0).length > 0 ? "has-error" : ""}>
                      <div>{DEFAULT_CATEGORY_NAME}</div>
                      {row.rowErrors
                        .filter(error => error.indexOf("Budget category") >= 0)
                        .map(error => (
                          <div key={error} className={"text-danger"}>
                            {error}
                          </div>
                        ))}
                    </td>
                    <td className={row.nameErrors.length > 0 ? "has-error" : ""}>
                      <div>{row.name}</div>
                      {row.nameErrors.map(error => (
                        <div key={error} className={"text-danger"}>
                          {error}
                        </div>
                      ))}
                    </td>
                    <td className={row.rowErrors.filter(error => error.indexOf("Reason is required.") >= 0).length > 0 ? "has-error" : ""}>
                      <div>{row.description}</div>
                      {row.rowErrors
                        .filter(error => error.indexOf("Reason is required.") >= 0)
                        .map(error => (
                          <div key={error} className={"text-danger"}>
                            {error}
                          </div>
                        ))}
                    </td>
                    <td className={row.quantityErrors.length > 0 ? "has-error" : ""}>
                      <div>
                        {row.itemQuantity === null
                          ? row.rawItemQuantity
                          : row.itemQuantity}
                      </div>
                      {row.quantityErrors.map(error => (
                        <div key={error} className={"text-danger"}>
                          {error}
                        </div>
                      ))}
                    </td>
                    <td className={row.costErrors.length > 0 ? "has-error" : ""}>
                      <div>
                        {row.itemCost === null
                          ? row.rawItemCost
                          : UtilsService.formatIntoCurrency(row.itemCost)}
                      </div>
                      {row.costErrors.map(error => (
                        <div key={error} className={"text-danger"}>
                          {error}
                        </div>
                      ))}
                    </td>
                    <td>
                      {row.itemQuantity !== null && row.itemCost !== null
                        ? UtilsService.formatIntoCurrency(
                            MathHelper.mul(row.itemQuantity, row.itemCost)
                          )
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      ) : null}

      <div className={"d-flex justify-content-between align-items-center"}>
        <div>
          {previewRows.length <= 0
            ? "Upload a file to preview the rows before creating items."
            : errorCount > 0
            ? (
              <span className={"text-danger"}>
                There are {errorCount} error(s), please fix them before import.
              </span>
            )
            : `Ready to create ${validRows.length} item(s) for ${gl.GLCode} in ${forYear}.`}
        </div>
        <div>
          <LoadingBtn variant={"link"} onClick={onCancel} isLoading={isSaving}>
            Cancel
          </LoadingBtn>
          <LoadingBtn
            variant={"primary"}
            onClick={bulkCreate}
            isLoading={isSaving}
            disabled={
              previewRows.length <= 0 ||
              invalidRows.length > 0 ||
              isLoadingCategories ||
              isLoadingExistingItems
            }
          >
            <Icons.Upload />{" "}
            {getBulkImportButtonLabel({
              errorCount,
              previewRowCount: previewRows.length,
              validRowCount: validRows.length,
              validRowsTotalAmt
            })}
          </LoadingBtn>
        </div>
      </div>
    </Wrapper>
  );
};

export default BTItemBulkCreatePanel;
