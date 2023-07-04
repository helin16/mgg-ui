import { useEffect, useState } from "react";
import PaymentService from "../../../services/Payments/PaymentService";
import Toaster from "../../../services/Toaster";
import { Spinner } from "react-bootstrap";
import moment from "moment-timezone";


const WESTPAC_SCRIPT_URL = 'https://api.payway.com.au/rest/v1/payway.js';

type iWestpacCreditCardInputPanel = {
  onCardValid?: () => void;
  onCardInValid?: () => void;
  getFrameObj?: (frame: any) => void;
}
const WestpacCreditCardInputPanel = ({onCardValid, onCardInValid, getFrameObj}: iWestpacCreditCardInputPanel) => {
  const payWayScriptId = "payway-script";

  const [isLoading, setIsLoading] = useState(true);
  const [payWayHtmlId, setPayWayHtmlId] = useState("");
  const [payWayFrame, setPayWayFrame] = useState<any>(null);

  useEffect(() => {
    let isCanceled = false;
    let loadedFrame: any;
    let script: any;

    const containerId = `wp-cp-${moment().format(
      "YYYYMMDDHHmmss"
    )}-${Math.random()}`;
    setPayWayHtmlId(containerId);

    const init = () => {
      setIsLoading(true);
      PaymentService.getWestpacSettings()
        .then(resp => {
          // @ts-ignore
          global.payway.createCreditCardFrame(
            {
              container: containerId,
              publishableApiKey: resp.key || "",
              tokenMode: "callback",
              onValid: () => onCardValid && onCardValid(),
              onInvalid: () => onCardInValid && onCardInValid(),
            },
            (err: any, frame: any) => {
              if (err) {
                Toaster.showApiError(err);
                return;
              }
              loadedFrame = frame;
              setPayWayFrame(frame);
              getFrameObj && getFrameObj(frame);
            }
          );
        })
        .catch(err => {
          if (isCanceled) {
            return;
          }
          Toaster.showApiError(err);
        })
        .finally(() => {
          if (isCanceled) {
            return;
          }
          setIsLoading(false);
        });
    };

    const loadScript = () => {
      if (!document.getElementById(payWayScriptId)) {
        script = document.createElement("script");
        script.id = payWayScriptId;
        script.src = WESTPAC_SCRIPT_URL;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          init();
        };
      } else {
        init()
      }
    }

    loadScript();

    return () => {
      if (script) {
        document.body.removeChild(script);
      }
      isCanceled = true;
      if (loadedFrame) {
        loadedFrame.destroy();
        loadedFrame = undefined;
      }
      if (payWayFrame) {
        payWayFrame.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getContent = () => {
    if (isLoading) {
      return <Spinner animation={"border"} />;
    }
    return <div>
      <small className={'text-muted'}>
        Secure payments powered by <a href={'https://www.payway.com.au/about'} target={'__BLANK'}>PayWay</a>
      </small>
    </div>;
  };

  return (
    <div>
      <div id={payWayHtmlId} />
      {getContent()}
    </div>
  );
};

export default WestpacCreditCardInputPanel;
