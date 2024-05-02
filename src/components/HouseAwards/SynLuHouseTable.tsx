import Table, {iTableColumn} from '../common/Table';
import {useEffect, useState} from 'react';
import iSynLuHouse from '../../types/Synergetic/Lookup/iSynLuHouse';
import SynLuHouseService from '../../services/Synergetic/Lookup/SynLuHouseService';
import Toaster from '../../services/Toaster';
import PageLoadingSpinner from '../common/PageLoadingSpinner';
import {OP_GT} from '../../helper/ServiceHelper';


type iSynLuHouseTable = {
  className?: string;
}
const SynLuHouseTable = ({className}: iSynLuHouseTable) => {
  const [houses, setHouses] = useState<iSynLuHouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    SynLuHouseService.getLuHouses({
      where: JSON.stringify({
        ActiveFlag: true,
        HeadOfHouseID: {[OP_GT]: 0},
      }),
      sort: 'SortOrder:ASC',
    }).then((resp) => {
      if (isCanceled) { return }
      setHouses(resp);
    }).catch(err => {
      if (isCanceled) { return }
      Toaster.showToast(err);
    }).finally(() => {
      if (isCanceled) { return }
      setIsLoading(false);
    })

    return () => {
      isCanceled = true;
    }
  }, [])


  if (isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <Table columns={[{
      key: 'Campus',
      header: 'Campus',
      cell: (col: iTableColumn, data: iSynLuHouse) => {
        return <td key={col.key}>{data.Campus}</td>;
      }
    }, {
      key: 'code',
      header: 'Code',
      cell: (col: iTableColumn, data: iSynLuHouse) => {
        return <td key={col.key}>{data.Code}</td>;
      }
    }, {
      key: 'description',
      header: 'Description',
      cell: (col: iTableColumn, data: iSynLuHouse) => {
        return <td key={col.key}>{data.Description}</td>;
      }
    }, {
      key: 'headOfHouse',
      header: 'Head of House',
      cell: (col: iTableColumn, data: iSynLuHouse) => {
        return <td key={col.key}>{data.HeadOfHouse}</td>;
      }
    }, {
      key: 'headOfHouseId',
      header: 'Head of House ID',
      cell: (col: iTableColumn, data: iSynLuHouse) => {
        return <td key={col.key}>{data.HeadOfHouseID}</td>;
      }
    }]} rows={houses} responsive hover striped className={className} />
  )
}

export default SynLuHouseTable;
