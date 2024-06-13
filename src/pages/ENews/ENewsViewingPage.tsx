import styled from "styled-components";
import {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import EmailTemplateService from "../../services/Email/EmailTemplateService";
import Toaster from "../../services/Toaster";
import PageNotFound from "../../components/PageNotFound";
import PageLoadingSpinner from "../../components/common/PageLoadingSpinner";
import iSynCommunicationTemplate from '../../types/Synergetic/iSynCommunicationTemplate';
import SynCommunicationTemplateService from '../../services/Synergetic/SynCommunicationTemplateService';
import {HEADER_NAME_SELECTING_FIELDS} from '../../services/AppService';

const Wrapper = styled.div``;
const NewsViewingPage = () => {
  const { id } = useParams();
  const [emailTemplate, setEmailTemplate] = useState<iSynCommunicationTemplate | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const templates = await EmailTemplateService.getAll({
        where: JSON.stringify({ id: `${id || ""}`.trim() }),
        perPage: 1
      }, {
        headers: {
          [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify(['CommunicationTemplatesSeq']),
        }
      })
      const data = templates.data || [];
      if (data.length <= 0) {
        return null
      }

      return SynCommunicationTemplateService.getById(data[0].CommunicationTemplatesSeq, undefined, {
        headers: {
          [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify(['MessageBody']),
        }
      })
    }


    let isCanceled = false;


    setIsLoading(true);
    setIsNotFound(false);

    getData()
      .then(resp => {
        if (isCanceled) {
          return;
        }
        setEmailTemplate(resp);
      })
      .catch(err => {
        if (isCanceled) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      isCanceled = true;
    };
  }, [id]);

  const getContent = () => {
    if (isLoading === true) {
      return (
        <PageLoadingSpinner text={"Loading contents..."} className={"m-5"} />
      );
    }

    if (isNotFound === true || emailTemplate === null) {
      return <PageNotFound />;
    }

    return (
      <div dangerouslySetInnerHTML={{__html: emailTemplate.MessageBody }} />
    );
  };

  return <Wrapper>{getContent()}</Wrapper>;
};

export default NewsViewingPage;
