import styled from 'styled-components';
import SchoolLogo from '../../components/SchoolLogo';
import {FlexContainer} from '../../styles';
import {mainRed} from '../../AppWrapper';
import {Alert, Button, Col, Container, Form, Row} from 'react-bootstrap';
import {useState} from 'react';
import FormLabel from '../../components/form/FormLabel';
import iAlumniRequest from '../../types/Alumni/iAlumniRequest';
import LoadingBtn from '../../components/common/LoadingBtn';
import * as Icons from 'react-bootstrap-icons';
import AlumniRequestService from '../../services/Alumni/AlumniRequestService';
import Toaster, {TOAST_TYPE_ERROR} from '../../services/Toaster';
import FormErrorDisplay from '../../components/form/FormErrorDisplay';
import UtilsService from '../../services/UtilsService';
import AlumniRelationshipSelector from '../../components/alumni/AlumniRelationshipSelector';
import FileYearSelector from '../../components/student/FileYearSelector';
import moment from 'moment-timezone';
import YearLevelSelector from '../../components/student/YearLevelSelector';
import {CAMPUS_CODE_SENIOR} from '../../types/Synergetic/iLuCampus';

const Wrapper = styled.div`
  padding-bottom: 3rem;
  background: #f9faf9 !important;
  .header {
    padding: 0 1rem;
    background: ${mainRed};
    color: white;
    
    .logo-wrapper {
      width: 16.67%;
      background: #f9faf9;
      padding: 1.5rem;
      img {
        width: 100%;
        height: auto;
      }
    }
  }

  div[class^='col-'] {
    margin-top: 1rem;
  }
  
  .submit-btn {
    width: 100%;
  }

  .form-control.is-invalid {
    border-color: #dc3545;
  }
`;

type iFormValues = Pick<iAlumniRequest, Exclude<keyof iAlumniRequest, 'id' | 'created' | 'approved_by_id' | 'approved' | 'approved_at' | 'isActive' | 'updatedAt' | 'updatedById'>>;

const initFormValues: iFormValues = {
  title: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  maiden_name: null,
  leaving_year: null,
  leaving_year_level: null,

  old_address: null,
  current_address: '',
  email: '',
  contact_number:  null,
  relationship_to_school:  null,
}

const titles = [
  'Doctor',
  'Professor',
  'Miss',
  'Mr',
  'Mrs',
  'Ms',
]
const AlumniRegistrationPage = () => {
  const [formValues, setFormValues] = useState<iFormValues>(initFormValues);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedRequest, setSavedRequest] = useState<iAlumniRequest | null>(null);

  const preCheck = () => {
    console.log('formValues', formValues);
    return [
      'title',
      'first_name',
      'last_name',
      'email',
      'contact_number',
      'current_address',
      'date_of_birth',
      'relationship_to_school',
      ...(`${formValues.relationship_to_school || ''}`.trim().toLowerCase() !== 'past student' ? [] : ['leaving_year', 'leaving_year_level'])
    ].reduce((map, fieldName) => {
      // @ts-ignore
      const value = `${formValues[fieldName] || ''}`.trim();
      if (value !== '') {
        if (fieldName.toLowerCase() === 'email' && !UtilsService.validateEmail(value)) {
          return {
            ...map,
            [fieldName]: `please provide an valid email address.`,
          }
        }
        const yearRegex = /^\d{4}$/;
        if (fieldName.toLowerCase() === 'leaving_year' && !yearRegex.test(value)) {
          return {
            ...map,
            [fieldName]: `Please provide a valid year: YYYY`,
          }
        }

        const dobRegex = /^(0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[012])[/]\d{4}$/
        if (fieldName.toLowerCase() === 'date_of_birth' && !dobRegex.test(value)) {
          return {
            ...map,
            [fieldName]: `please provide valid date: DD/MM/YYYY.`,
          }
        }
        return map;
      }

      return {
        ...map,
        [fieldName]: `is required.`,
      };
    }, {});
  }

  const submit = () => {
    const errorMap = preCheck();
    setErrors(errorMap);
    if (Object.keys(errorMap).length > 0) {
      Toaster.showToast('Invalid values provided, refer to form for details', TOAST_TYPE_ERROR);
      return;
    }
    setIsSaving(true);
    const data = {
      ...formValues,
      date_of_birth: `${formValues.date_of_birth || ''}`.split('/').reverse().join('-')
    };
    AlumniRequestService.create(data)
      .then(resp => {
        setSavedRequest(resp);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsSaving(false);
      })
  }

  const onChangeField = (fieldName: string, value: string | null) => {
    setFormValues({
      ...formValues,
      [fieldName]: value,
    })
  }

  const getLeavingYearAndLevel = () => {
    if (`${formValues.relationship_to_school || ''}`.trim().toLowerCase() !== 'past student') {
      return null;
    }
    return (
      <>
        <Form.Group as={Col} sm="6" md={3}>
          <FormLabel label={'Leaving Year: '} isRequired/>
          <FileYearSelector
            className={`form-control ${'leaving_year' in errors ? 'is-invalid' : ''}`}
            value={`${formValues.leaving_year || ''}`.trim() === '' ? null : Number(`${formValues.leaving_year || ''}`)}
            onSelect={(newYear) => onChangeField('leaving_year', newYear === null ? null : `${newYear}`) }
            min={moment().subtract(200, 'year').year()}
            max={moment().year()}
            allowClear
          />
          <FormErrorDisplay errorsMap={errors} fieldName={'leaving_year'} />
        </Form.Group>
        <Form.Group as={Col} sm="6" md={3}>
          <FormLabel label={'Leaving Year Level: '} isRequired/>
          <YearLevelSelector
            classname={`form-control ${'leaving_year_level' in errors ? 'is-invalid' : ''}`}
            allowClear
            values={formValues.leaving_year_level ? [`${formValues.leaving_year_level}`] : []}
            onSelect={(option) => {
              onChangeField('leaving_year_level', option === null ? null : `${Array.isArray(option) ? option[0].value : option?.value}`)
            }}
          />
          <FormErrorDisplay errorsMap={errors} fieldName={'leaving_year_level'} />
        </Form.Group>
      </>
    )
  }

  const getForm = () => {
    return (
      <>
        <div className={'text-center'}>
          <h5>Please complete the fields below to register for full access to the Digital Archives Collection.</h5>
          <div className={'text-right'}><small>Fields marked with <span className={'text-danger'}>*</span> are compulsory.</small></div>
        </div>
        <Form noValidate>
          <Row>
            <Form.Group as={Col} sm={6} md={3}>
              <FormLabel label={'Title: '} isRequired />
              <Form.Select
                value={formValues.title  || ''}
                isInvalid={`${errors.title  || ''}`.trim() !== ''}
                onChange={(event) => onChangeField('title', event.target.value)}
              >
                <option>Please select a title</option>
                {titles.map(title => {
                  return (
                    <option value={title} key={title}>{title}</option>
                  )
                })}
              </Form.Select>
              <FormErrorDisplay errorsMap={errors} fieldName={'title'} />
            </Form.Group>
            <Form.Group as={Col} sm={6} md={3}>
              <FormLabel label={'First Name: '} isRequired />
              <Form.Control
                value={formValues.first_name}
                isInvalid={`${errors.first_name  || ''}`.trim() !== ''}
                onChange={(event) => onChangeField('first_name', event.target.value)}
                placeholder={'First Name'}
              />
              <FormErrorDisplay errorsMap={errors} fieldName={'first_name'} />
            </Form.Group>
            <Form.Group as={Col} sm={6} md={3}>
              <FormLabel label={'Last Name: '} isRequired />
              <Form.Control
                value={formValues.last_name}
                isInvalid={`${errors.last_name  || ''}`.trim() !== ''}
                onChange={(event) => onChangeField('last_name', event.target.value)}
                placeholder={'Last Name / Surname'}
              />
              <FormErrorDisplay errorsMap={errors} fieldName={'last_name'} />
            </Form.Group>
            <Form.Group as={Col} sm={6} md={3}>
              <FormLabel label={'Maiden Name: '} />
              <Form.Control
                value={formValues.maiden_name || ''}
                isInvalid={`${errors.maiden_name  || ''}`.trim() !== ''}
                onChange={(event) => onChangeField('maiden_name', event.target.value)}
                placeholder={'Maiden Name'}
              />
              <FormErrorDisplay errorsMap={errors} fieldName={'maiden_name'} />
            </Form.Group>
            <Form.Group as={Col} sm="6" md={3}>
              <FormLabel label={'Date of Birth: '} isRequired/>
              <Form.Control
                value={formValues.date_of_birth}
                placeholder={'DD/MM/YYYY'}
                isInvalid={`${errors.date_of_birth  || ''}`.trim() !== ''}
                onChange={(event) => onChangeField('date_of_birth', event.target.value)}
              />
              <FormErrorDisplay errorsMap={errors} fieldName={'date_of_birth'} />
            </Form.Group>
            <Form.Group as={Col} sm="6" md={3}>
              <FormLabel label={'Relationship To School:'} isRequired/>
              <AlumniRelationshipSelector
                classname={`form-control ${'relationship_to_school' in errors ? 'is-invalid' : ''}`}
                values={`${formValues.relationship_to_school || ''}`.trim() === '' ? [] : [`${formValues.relationship_to_school}`]}
                onSelect={(option) => onChangeField('relationship_to_school', option === null ? null : `${Array.isArray(option) ? option[0].value : option?.value}`)}
                allowClear
                />
              <FormErrorDisplay errorsMap={errors} fieldName={'relationship_to_school'} />
            </Form.Group>
            {getLeavingYearAndLevel()}
          </Row>
          <Row>
            <Form.Group as={Col} sm="6" md={6}>
              <FormLabel label={'Old Address:'} />
              <Form.Control
                value={formValues.old_address || ''}
                isInvalid={`${errors.old_address  || ''}`.trim() !== ''}
                onChange={(event) => onChangeField('old_address', event.target.value)}
                placeholder={'Old Address (if applicable)'}
              />
              <FormErrorDisplay errorsMap={errors} fieldName={'old_address'} />
            </Form.Group>
            <Form.Group as={Col} sm="6" md={6}>
              <FormLabel label={'Current Address:'} isRequired />
              <Form.Control
                value={formValues.current_address}
                isInvalid={`${errors.current_address  || ''}`.trim() !== ''}
                onChange={(event) => onChangeField('current_address', event.target.value)}
                placeholder={'Current full address'}
              />
              <FormErrorDisplay errorsMap={errors} fieldName={'current_address'} />
            </Form.Group>
            <Form.Group as={Col} sm="6" md={6}>
              <FormLabel label={'Email:'} isRequired />
              <Form.Control
                value={formValues.email}
                isInvalid={`${errors.email  || ''}`.trim() !== ''}
                onChange={(event) => onChangeField('email', event.target.value)}
                placeholder={'Your current email address'}
              />
              <FormErrorDisplay errorsMap={errors} fieldName={'email'} />
            </Form.Group>
            <Form.Group as={Col} sm="6" md={6}>
              <FormLabel label={'Contact Number:'} isRequired />
              <Form.Control
                value={formValues.contact_number || ''}
                placeholder={'ed: +61 3 9822 0000 or + 61 432 909 000'}
                isInvalid={`${errors.contact_number  || ''}`.trim() !== ''}
                onChange={(event) => onChangeField('contact_number', event.target.value)}
              />
              <FormErrorDisplay errorsMap={errors} fieldName={'contact_number'} />
            </Form.Group>
          </Row>
          <Row className={'text-right'}>
            <Col sm={{span: 6, offset: 3}}>
              <LoadingBtn isLoading={isSaving} className={'submit-btn'} onClick={() => submit()}>
                <Icons.Send /> {' '}
                Submit
              </LoadingBtn>
            </Col>
          </Row>
        </Form>
      </>
    )
  }

  const getSavedSuccessPanel = () => {
    if (savedRequest === null) {
      return null;
    }
    return (
      <>
        <Alert variant={'success'}>
          <h5>Thanks for registering, we have received your request.</h5>
          <p>
            Once we've processed the request, we will let you know by email (<b>{savedRequest.email}</b>) or phone (<b>{savedRequest.contact_number}</b>)
          </p>
        </Alert>
        <Button variant={'primary'} onClick={() => {window.location.reload()}}>Make another request</Button>
      </>
    );
  }

  return (
    <Wrapper>
      <div className={'header section-row'}>
        <Container>
          <FlexContainer className={'justify-content space-between align-items end'}>
            <div  className={'logo-wrapper'}>
              <SchoolLogo />
            </div>
            <h2>Digital Archives Registration</h2>
          </FlexContainer>
        </Container>
      </div>

      <Container>
        {savedRequest === null ? getForm() : getSavedSuccessPanel()}
      </Container>
    </Wrapper>
  )
}

export default AlumniRegistrationPage;
