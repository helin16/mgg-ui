import moment from 'moment-timezone';
import * as XLSX from 'sheetjs-style';
import * as Icons from 'react-bootstrap-icons';
import iBTItem from '../../../types/BudgetTacker/iBTItem';
import LoadingBtn from '../../../components/common/LoadingBtn';
import MathHelper from '../../../helper/MathHelper';
import BTItemService from '../../../services/BudgetTracker/BTItemService';
import iSynGeneralLedger from '../../../types/Synergetic/Finance/iSynGeneralLedager';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';

type iBTItemExportBtn = {
  items: iBTItem[];
  className?: string;
  size?: 'sm' | 'lg';
  isLoading?: boolean;
  year: number,
  gl: iSynGeneralLedger;
  communityMap?: {[key: number]: iSynCommunity};
}

export const exportBTItemsToExcel = ({year, items, glMap, communityMap}: {
  year: number,
  items: iBTItem[],
  glMap: {[key: string]: iSynGeneralLedger},
  communityMap: {[key: string]: iSynCommunity},
}) => {
  const now = moment();
  const titleRows: any = [
    [`Budget Items for ${year}`],
    [`Generated at ${now.format('DD / MMM / YYYY')}`],
    [``],
    [
      'GL Code',
      'GL Description',
      'Category',
      'Item name',
      'Reason for Purchase',
      'Unit Cost',
      'Qty',
      'Total Cost',
      'Requester',
      'Requested At',
      'Status',
      'Approved Amount',
      `Approvers' Comments`,
    ]
  ];
  const dataStartRowNo = 5;
  let currencyCellStyles: {[key: string]: any} = {};
  const rows = items.map((item, index) => {
    currencyCellStyles[`F${MathHelper.add(dataStartRowNo, index)}`] = {numFmt: '$#,##0.00_);($#,##0.00)'};
    currencyCellStyles[`H${MathHelper.add(dataStartRowNo, index)}`] = {numFmt: '$#,##0.00_);($#,##0.00)'};
    currencyCellStyles[`L${MathHelper.add(dataStartRowNo, index)}`] = {numFmt: '$#,##0.00_);($#,##0.00)'};
    const glCode = `${item.gl_code || ''}`;
    return [
      glCode in glMap ? glMap[glCode].GLCode : '',
      glCode in glMap ? glMap[glCode].GLDescription : '',
      item.BTItemCategory?.name,
      item.name,
      item.description,
      item.item_cost,
      item.item_quantity,
      MathHelper.mul(item.item_cost || 0, item.item_quantity || 0),
      (item.creator_id || 0) in communityMap ? `${communityMap[item.creator_id || 0]?.Given1 || ''} ${communityMap[item.creator_id || 0]?.Surname || ''}` : '',
      moment(item.created_at).format('DD/MMM/YYYY HH:mm'),
      BTItemService.getBTItemStatusNameFromItem(item).toUpperCase(),
      item.approved_amount,
      item.approver_comments,
    ]
  });
  const ws = XLSX.utils.aoa_to_sheet([...titleRows, ...rows]);
  ws[`A1`].s = {
    font: { bold: true, sz: 18 }
  };
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'].forEach(colRef => {
    ws[`${colRef}4`].s = {
      font: { bold: true }
    }
  });

  Object.keys(currencyCellStyles).map(colRef => {
    if (ws[colRef]) {
      ws[colRef].s = currencyCellStyles[colRef];
    }
    return null;
  })

  ws["!merges"] = [0, 1, 2].map(rowNo => ({s: {r: rowNo, c: 0}, e: {r: rowNo, c: 11}}))
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${moment().format('DD-MMM-YYYY_HH_mm_ss')}`);
  XLSX.writeFile(wb, `budget_items_${moment().format('YYYY_MM_DD_HH_mm_ss')}.xlsx`);
}
const BTItemExportBtn = ({items, className, size, year, gl, communityMap = {}, isLoading = false}: iBTItemExportBtn) => {

  return (
    <LoadingBtn
      isLoading={isLoading}
      variant={'primary'}
      className={className}
      size={size}
      onClick={() => exportBTItemsToExcel({
        year,
        communityMap,
        items,
        glMap: {[gl.GLCode]: gl},
      })}
    >
      <Icons.Download /> Export
    </LoadingBtn>
  )
}

export default BTItemExportBtn;
