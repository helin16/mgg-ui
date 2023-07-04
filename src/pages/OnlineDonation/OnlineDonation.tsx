import styled from "styled-components";
import FormLabel from "../../components/form/FormLabel";
import {Alert, Col, Form, FormControl, FormGroup, Row} from "react-bootstrap";
import React, { useState } from "react";
import {FlexContainer} from '../../styles';
import WestpacCreditCardInputPanel from '../../components/Payments/Westpac/WestpacCreditCardInputPanel';
import LoadingBtn from '../../components/common/LoadingBtn';
import FormErrorDisplay from '../../components/form/FormErrorDisplay';
import Toaster, {TOAST_TYPE_ERROR} from '../../services/Toaster';
import PaymentService from '../../services/Payments/PaymentService';

const MAIN_WEBSITE_URL = 'https://mentonegirls.vic.edu.au';
const Wrapper = styled.div`
  font-size: 1rem;
  .notice {
    padding: 0.6rem 1rem;
  }
  label.label-wrapper {
    font-size: 1rem;
    font-weight: normal;
    padding-bottom: 0.4rem;
  }
  .input-div {
    margin-bottom: 1rem;
  }
  .form-control{
    &.is-invalid {
      border-color: #dc3545;
    }
  }
  .check-box {
    input {
      width: 16px !important;
      height: 16px !important;
      display: inline-block !important;
      opacity: 1 !important;
    }
  }
  
  .success-msg {
    margin-top: 1rem;
  }
`;
const OnlineDonation = () => {
  const [formValues, setFormValues] = useState<{ [key: string]: string | boolean }>({});
  const [creditCardIsValid, setCreditCardIsValid] = useState(false);
  const [errorMap, setErrorMap] = useState<{[key: string]: string}>({});
  const [frameObj, setFrameObj] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // const resetForm = () => {
  //   setCreditCardIsValid(false);
  //   setFormValues({});
  //   setErrorMap({});
  //   setFrameObj(null);
  //   setIsSaving(false);
  //   setSuccessMsg(null);
  // }

  const getInputDiv = (
    fieldName: string,
    label: string | null,
    value: string,
    placeholder: string,
    onChange: (newValue: string) => void,
    isRequired = false
  ) => {
    return (
      <FormGroup className={'input-div form-group'}>
        {label === null ? null : <FormLabel label={label} isRequired={isRequired} />}
        <FormControl value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} isInvalid={fieldName in errorMap} />
        <FormErrorDisplay errorsMap={errorMap} fieldName={fieldName} />
      </FormGroup>
    );
  };

  const preSubmit = () => {
    const errors: {[key: string]: string} = {};

    ['first_name', 'last_name', 'email', 'phone', 'amount', 'donation_direction'].forEach((field) => {
      const value = `${field in formValues ? formValues[field] : ''}`.trim();
      if (value === '') {
        errors[field] = `${field} is required.`;
      }
    });
    if (!frameObj) {
      errors.frameObj = 'Error when init payment gateway...';
    }

    setErrorMap(errors);
    return Object.keys(errors).length === 0;
  }

  const onSubmit = async () => {
    if (!(preSubmit())) {
      return;
    }
    setIsSaving(true);
    frameObj.getToken((err: any, data: any) => {
      if (err) {
        const errMsg = 'Error occurred when connecting payment gateway, please check your credit card details and try again.';
        Toaster.showToast(errMsg, TOAST_TYPE_ERROR);
        return;
      }
      PaymentService.makeADonation({
        ...formValues,
        cc: data
      }).then(resp => {
        if(resp.success === true) {
          setSuccessMsg(resp.message || '');
          return;
        }
        Toaster.showApiError(resp.message || 'A unknown error occurred, please refresh page and try again.');
      }).catch(err => {
        Toaster.showApiError(err);
      }).finally(() => {
        setIsSaving(false);
      });
    })
  }

  if (successMsg !== null) {
    if (`${successMsg || ''}`.trim() === '') {
      return (
        <Alert variant={'success'} className={'success-msg'}>
          <h3>Thank you!</h3>
          <p>A sincere thank you for your donation.  A receipt for tax purposes will be forwarded to you in the next 2-3 business days..</p>
          <p>For any queries regarding your donation, please get in contact with us via our website: <a href={MAIN_WEBSITE_URL}>{MAIN_WEBSITE_URL}</a> </p>
        </Alert>
      )
    }
    return <div dangerouslySetInnerHTML={{__html: `${successMsg || ''}`.trim()}} className={'success-msg'}/>
  }

  return (
    <Wrapper>
      <Row>
        <Col md={6}>
          {getInputDiv(
            "first_name",
            "First Name",
            `${formValues.first_name || ""}`,
            "First Name",
            newValue => {
              setFormValues({
                ...formValues,
                first_name: newValue
              });
            },
            true
          )}
        </Col>
        <Col md={6}>
          {getInputDiv(
            "last_name",
            "Last Name",
            `${formValues.last_name || ""}`,
            "Last Name",
            newValue => {
              setFormValues({
                ...formValues,
                last_name: newValue
              });
            },
            true
          )}
        </Col>
        <Col md={6}>
          {getInputDiv(
            "email",
            "Email",
            `${formValues.email || ""}`,
            "ex: myname@example.com",
            newValue => {
              setFormValues({
                ...formValues,
                email: newValue
              });
            },
            true
          )}
        </Col>
        <Col md={6}>
          {getInputDiv(
            "phone",
            "Phone Number",
            `${formValues.phone || ""}`,
            "ex: +61 3 1234 4567 or 0432 343 123",
            newValue => {
              setFormValues({
                ...formValues,
                phone: newValue
              });
            },
            true
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <FormLabel label={"Address"} />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {getInputDiv(
            "address_street",
            null,
            `${formValues.address_street || ""}`,
            "Street Address, ex: 123 some street",
            newValue => {
              setFormValues({
                ...formValues,
                address_street: newValue
              });
            }
          )}
        </Col>
        <Col md={4}>
          {getInputDiv(
            "address_city",
            null,
            `${formValues.address_city || ""}`,
            "City / Suburb",
            newValue => {
              setFormValues({
                ...formValues,
                address_city: newValue
              });
            }
          )}
        </Col>
        <Col md={4}>
          {getInputDiv(
            "address_state",
            null,
            `${formValues.address_state || ""}`,
            "State / Province",
            newValue => {
              setFormValues({
                ...formValues,
                address_state: newValue
              });
            }
          )}
        </Col>
        <Col md={4}>
          {getInputDiv(
            "address_postcode",
            null,
            `${formValues.address_postcode || ""}`,
            "Postcode / ZipCode",
            newValue => {
              setFormValues({
                ...formValues,
                address_postcode: newValue
              });
            }
          )}
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          {getInputDiv(
            "amount",
            "Donation Amount",
            `${formValues.amount || ""}`,
            "The amount of your donation, eg: $100",
            newValue => {
              setFormValues({
                ...formValues,
                amount: newValue
              });
            },
            true
          )}
          <div className={"text-muted notice"}>
            Please note: All donations greater than $2 are tax deductible.
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <FormGroup className={"form-group input-div"}>
            <FormLabel label={"Please direct my donation to"} isRequired />
            <Form.Select
              isInvalid={'donation_direction' in errorMap}
              value={`${formValues.donation_direction || ""}`}
              onChange={event =>
                setFormValues({
                  ...formValues,
                  donation_direction: event.target.value
                })
              }
            >
              <option value={""} disabled>
                Please Select ...
              </option>
              <option value={"Scholarship Fund"}>Scholarship Fund</option>
              <option value={"Building Fund"}>Building Fund</option>
              <option value={"Library"}>Library</option>
              <option value={"Presentation Night Sponsorship"}>Presentation Night Sponsorship</option>
              <option value={"General"}>General</option>
            </Form.Select>
            <FormErrorDisplay errorsMap={errorMap} fieldName={'donation_direction'} />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <FormGroup
            className={"form-group input-div"}
            onClick={event =>
              setFormValues({
                ...formValues,
                is_anonymous: formValues.is_anonymous === true ? false : true
              })
            }
          >
            <FlexContainer className={"with-gap lg-gap"}>
              <FormLabel label={"I wish for my donation to remain anonymous"} />
              <Form.Check
                checked={formValues.is_anonymous === true || false}
                onChange={() => null}
                className={"check-box"}
              />
            </FlexContainer>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <FormGroup className={"form-group input-div"}>
            <WestpacCreditCardInputPanel
              onCardValid={() => setCreditCardIsValid(true)}
              onCardInValid={() => setCreditCardIsValid(false)}
              getFrameObj={(frame) => setFrameObj(frame)}
            />
            <FormErrorDisplay errorsMap={errorMap} fieldName={'frameObj'} />
            <FormErrorDisplay errorsMap={errorMap} fieldName={'cc'} />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <FormGroup className={"form-group input-div"}>
            <LoadingBtn
              disabled={creditCardIsValid !== true}
              variant={"primary"}
              isLoading={isSaving}
              onClick={() => onSubmit()}
            >
              {creditCardIsValid !== true
                ? "This button will be enabled after correct credit card details provided."
                : "Submit"}
            </LoadingBtn>
          </FormGroup>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default OnlineDonation;
