import iBTItem from '../../../types/BudgetTacker/iBTItem';
import {Accordion} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import MathHelper from '../../../helper/MathHelper';
import UtilsService from '../../../services/UtilsService';
import BTItemsTable from './BTItemsTable';
import iSynGeneralLedger from '../../../types/Synergetic/Finance/iSynGeneralLedager';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';

type iBTGLItemsPanel = {
  items: iBTItem[];
  type: string;
  title: string;
  className?: string;
  showSum?: boolean;
  forYear: number;
  gl: iSynGeneralLedger;
  onItemSaved: (newItem: iBTItem) => void;
  communityMap?: {[key: number]: iSynCommunity};
  readOnly?: boolean;
}

const BTItemsPanel = ({type, title, className, items, forYear, gl, onItemSaved, communityMap = {}, showSum = false, readOnly = false}: iBTGLItemsPanel) => {
  const [sum, setSum] = useState(0);

  useEffect(() => {
    let sumNum = 0;
    items.forEach(item => {
      sumNum = MathHelper.add(sumNum, MathHelper.mul(item.item_cost || 0, item.item_quantity || 0));
    });

    setSum(sumNum);
    // eslint-disable-next-line
  }, [showSum, JSON.stringify(items)])


  const getSumDiv = () => {
    if (!showSum) {
      return null;
    }
    return <div className={'sum-div'}>{UtilsService.formatIntoCurrency(sum)}</div>
  }

  return (
    <Accordion.Item eventKey={type} className={`${className} ${showSum ? 'show-sum' : ''}`}>
      <Accordion.Header>{title}{getSumDiv()}</Accordion.Header>
      <Accordion.Body>
        <BTItemsTable
          items={items}
          forYear={forYear}
          gl={gl}
          onItemSaved={onItemSaved}
          communityMap={communityMap}
          readyOnly={readOnly}
        />
      </Accordion.Body>
    </Accordion.Item>
  )
}

export default BTItemsPanel;
