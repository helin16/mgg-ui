import { useRef, useState } from "react";
import { Button, ButtonProps, ProgressBar, Spinner } from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import PopupModal from "../common/PopupModal";
import SectionDiv from "../common/SectionDiv";
import Toaster from "../../services/Toaster";
import MathHelper from "../../helper/MathHelper";

type iCSVExportBtn = ButtonProps & {
  fetchingFnc: (pageNo: number) => Promise<any>;
  downloadFnc: (data: any[]) => void;
  btnTxt?: string;
};
const CSVExportBtn = ({
  fetchingFnc,
  downloadFnc,
  btnTxt = "Export",
  ...props
}: iCSVExportBtn) => {
  const [showingPopup, setShowingPopup] = useState(false);
  const loadingStats = useRef({ isLoading: false, isCanceled: false });
  const [pageStats, setPageStats] = useState({ current: 0, total: 1 });
  const data = useRef<any[]>([]);

  const loadData = (pageNo = 1): Promise<void> => {
    return fetchingFnc(pageNo)
      .then(resp => {
        const currentPage = resp?.currentPage || 1;
        const totalPages = resp?.pages || 1;
        setPageStats({ current: currentPage, total: totalPages });
        data.current = [...data.current, ...(resp?.data || resp || [])];
        if (currentPage >= totalPages) {
          loadingStats.current.isLoading = false;
          return;
        }
        if (loadingStats.current.isLoading !== true) {
          return;
        }
        return loadData(MathHelper.add(currentPage, 1));
      })
      .catch(err => {
        Toaster.showApiError(err);
        loadingStats.current = { isLoading: false, isCanceled: true };
      });
  };

  const start = () => {
    setShowingPopup(true);
    loadingStats.current = { isLoading: true, isCanceled: false };
    loadData().finally(() => {
      const collectedData = [...data.current];
      data.current = [];
      setPageStats({ current: 0, total: 1 });
      if (loadingStats.current.isCanceled !== true) {
        setShowingPopup(false);
        loadingStats.current.isLoading = false;
        setPageStats({ current: 0, total: 1 })
        downloadFnc(collectedData);
      }
    });
  };

  const getPercentage = () => {
    return MathHelper.mul(
      MathHelper.div(pageStats.current, pageStats.total),
      100
    );
  }

  const cancel = () => {
    loadingStats.current = { isLoading: false, isCanceled: true };
    setShowingPopup(false);
  };

  const getContent = () => {
    return (
      <PopupModal
        header={<b>Exporting...</b>}
        handleClose={() => cancel()}
        show={showingPopup}
        size={"lg"}
      >
        <SectionDiv className={"margin-bottom"}>
          <Spinner animation={"border"} /> exporting...
        </SectionDiv>
        <SectionDiv className={"margin-bottom"}>
          <ProgressBar
            now={getPercentage()}
            label={`${getPercentage().toFixed(2)} %`}
          />
        </SectionDiv>
      </PopupModal>
    );
  };

  return (
    <>
      <Button {...props} onClick={() => start()}>
        <Icons.Download /> {btnTxt}
      </Button>
      {getContent()}
    </>
  );
};

export default CSVExportBtn;
