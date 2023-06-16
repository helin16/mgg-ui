import {useRef, useState} from 'react';
import {Button, ButtonProps, ProgressBar, Spinner} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import PopupModal from '../common/PopupModal';
import SectionDiv from '../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/SectionDiv';
import Toaster from '../../services/Toaster';
import MathHelper from '../../helper/MathHelper';


type iSchoolManagementEditPopupBtn = ButtonProps & {
  fetchingFnc: (pageNo: number) => Promise<any>;
  downloadFnc: (data: any[]) => void;
  btnTxt?: string
}
const CSVExportBtn = ({fetchingFnc, downloadFnc, btnTxt = 'Export', ...props}: iSchoolManagementEditPopupBtn) => {
  const [isLoading, setIsLoading] = useState(false);
  const currentP = useRef(1);
  const totalP = useRef(1);
  const data = useRef<any[]>([]);

  const loadData = (pageNo = 1): Promise<any> => {
    return fetchingFnc(pageNo)
      .then(resp => {
        const currentPage = resp.currentPage || 1;
        const totalPages = resp.pages || 1;
        currentP.current = currentPage;
        totalP.current = totalPages;
        data.current = [...data.current, ...(resp.data || resp)];
        if (currentPage >= totalPages) {
          return resp;
        }
        return loadData(MathHelper.add(currentPage, 1))
      })
      .catch(err => {
        Toaster.showApiError(err);
        setIsLoading(false);
      })
  }

  const start = () => {
    setIsLoading(true);
    loadData().finally(() => {
      const collectedData = [...data.current];
      data.current = [];
      currentP.current = 1;
      totalP.current = 1;
      setIsLoading(false);
      downloadFnc(collectedData);
    });
  }

  const cancel = () => {
    setIsLoading(false);
  }

  const getContent = () => {
    return (
      <PopupModal
        header={<b>Exporting...</b>}
        handleClose={() => cancel()}
        show={isLoading}
        size={'lg'}
      >
        <SectionDiv className={'margin-bottom'}>
          <Spinner animation={'border'} /> exporting...
        </SectionDiv>
        <SectionDiv className={'margin-bottom'}>
          <ProgressBar now={MathHelper.mul(MathHelper.div(currentP.current, totalP.current), 100)} />
        </SectionDiv>
      </PopupModal>
    )
  }

  return (
    <>
      <Button {...props} onClick={() => start()}>
        <Icons.Download />{' '}
        {btnTxt}
      </Button>
      {getContent()}
    </>
  )
};

export default CSVExportBtn;
