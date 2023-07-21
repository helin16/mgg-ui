import { useParams } from "react-router-dom";
import PageNotFound from "../../components/PageNotFound";
import styled from "styled-components";
import {Alert, Button} from 'react-bootstrap';
import SchoolLogo from '../../components/SchoolLogo';
import React from 'react';
import * as Icons from 'react-bootstrap-icons';

const FUNNEL_THANK_YOU_PAGE_NAME_APPLICATION = "application";
const FUNNEL_THANK_YOU_PAGE_NAME_SCHOLARSHIP_EOI = "scholarshipEOI";
const FUNNEL_THANK_YOU_PAGE_NAME_ELC_INFO = "elcInfo";
const FUNNEL_THANK_YOU_PAGE_NAME_JUNIOR_INFO = "juniorInfo";
const FUNNEL_THANK_YOU_PAGE_NAME_SENIOR_INFO = "seniorInfo";

const Wrapper = styled.div`
  .logo {
    width: 30%;
    min-width: 180px;
    max-width: 270px;
    margin-bottom: 2rem;
  }
  max-width: 700px;
  text-align: center;
  margin: 2rem auto;
  font-size: 16px;
`;

const contactPerson = "Kylie McBride";
const contactEmail = "kmcbride@mentonegirls.vic.edu.au";
const FunnelThankYouPage = () => {
  const { pageName } = useParams();

  const getPage = (content: any) => {
    return (
      <Wrapper>
        <SchoolLogo className={'logo'}/>
        <Alert variant={'success msg-div'}>
          <h4>Thank you</h4>
          {content}
        </Alert>
        <div>
          <Button variant={'link'} href={process.env.REACT_APP_MAIN_WEBSITE_URL || ''}>
            <Icons.HouseDoor />{' '}
            Back to Home
          </Button>
        </div>
      </Wrapper>
    );
  };

  switch (`${pageName || ""}`.trim()) {
    case FUNNEL_THANK_YOU_PAGE_NAME_APPLICATION: {
      return getPage(
        <>
          <div>
            Thank you for completing your application, our enrolments team will be
            in touch soon.
          </div>
          <p>
            If you have any questions in the meantime, please
            contact {contactPerson}{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </>
      );
    }
    case FUNNEL_THANK_YOU_PAGE_NAME_SCHOLARSHIP_EOI: {
      return getPage(
        <>
          <div>
            Thank you for enquiring about our Scholarship Program. Our team will be in touch soon regarding details on the application process and timings.
          </div>
          <p>
            If you have any questions in the meantime, please
            contact {contactPerson}{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </>

      );
    }
    case FUNNEL_THANK_YOU_PAGE_NAME_ELC_INFO:
    case FUNNEL_THANK_YOU_PAGE_NAME_JUNIOR_INFO:
    case FUNNEL_THANK_YOU_PAGE_NAME_SENIOR_INFO: {
      return getPage(
        <>
          <div>
            Thank you for enquiry regarding our Junior School. You will receive more information about our world-class facilities shortly.
          </div>
          <p>
            In the meantime, if  you have any further questions or would like to book a tour, please contact {contactPerson}{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </>
      );
    }
    default: {
      return <PageNotFound />;
    }
  }
};

export default FunnelThankYouPage;
