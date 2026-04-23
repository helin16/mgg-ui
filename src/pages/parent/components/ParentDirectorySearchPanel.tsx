import {useEffect, useState} from 'react';
import iSynLuForm from '../../../types/Synergetic/Lookup/iSynLuForm';
import ISynLuYearLevel from '../../../types/Synergetic/Lookup/iSynLuYearLevel';
import {Col, Form, Row} from 'react-bootstrap';
import styled from 'styled-components';
import FormLabel from '../../../components/form/FormLabel';
import YearLevelSelector from '../../../components/student/YearLevelSelector';
import SynFormSelector from '../../../components/student/SynFormSelector';
import LoadingBtn from '../../../components/common/LoadingBtn';
import * as Icons from 'react-bootstrap-icons';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import {OP_OR} from '../../../helper/ServiceHelper';
import {HEADER_NAME_SELECTING_FIELDS} from '../../../services/AppService';
import * as _ from 'lodash';
import Toaster from '../../../services/Toaster';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';
import {submitBtnBg, submitBtnHoverBg, submitBtnTextColor} from '../../../AppWrapper';
import StudentContactService from '../../../services/Synergetic/Student/StudentContactService';
import iStudentContact, {
  STUDENT_CONTACT_TYPE_SC1,
  STUDENT_CONTACT_TYPE_SC2,
  STUDENT_CONTACT_TYPE_SC3
} from '../../../types/Synergetic/Student/iStudentContact';
import SynVStudentService from '../../../services/Synergetic/Student/SynVStudentService';

const Wrapper = styled.div`
  .search-btn {
    margin-top: 1rem;
    width: 100%;
    background-color: ${submitBtnBg};
    color: ${submitBtnTextColor};
    :hover {
      background-color: ${submitBtnHoverBg};
    }
  }
`;

export type iParentDirectorySearchCriteria = {
  form?: iSynLuForm;
  yearLevel?: ISynLuYearLevel;
  searchText?: string;
}
type iParentDirectorySearchPanel = {
  className?: string;
  isSearching?: boolean;
  onChanged: (searchCriteria: iParentDirectorySearchCriteria) => void;
}
const ParentDirectorySearchPanel = ({onChanged, className, isSearching = false}: iParentDirectorySearchPanel) => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState<iSynLuForm | null>(null)
  const [yearLevel, setYearLevel] = useState<ISynLuYearLevel | null>(null);
  const [searchText, setSearchText] = useState('');
  const [limitFormCodes, setLimitFormCodes] = useState<string[]>([]);
  const [limitYearLevelCodes, setYearLevelCodes] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.isParent !== true) { return }

    let isCanceled = false;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const parents = await SynCommunityService.getCommunityProfiles({
          where: JSON.stringify({ [OP_OR]: [ {SpouseID: user?.synergyId}, {ID: user?.synergyId} ] })
        }, {
          headers: {[HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
              'ID', 'SpouseID'
            ])}
        });
        const parentIds: number[] = [];
        parents.data.map(community => { // @ts-ignore
          parentIds.push(Number(community.ID)); parentIds.push(Number(community.SpouseID));
          return null;
        });

        if (parentIds.length <= 0) {
          return;
        }
        if (isCanceled) return;

        const studentIds = ((await StudentContactService.getStudentContacts({
          where: JSON.stringify({
            LinkedID: parentIds,
            ContactType: [STUDENT_CONTACT_TYPE_SC1, STUDENT_CONTACT_TYPE_SC2, STUDENT_CONTACT_TYPE_SC3],
          }),
        }, {
          headers: {[HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
              'ID',
            ])}
        })).data || []).map((contact: iStudentContact) => contact.ID);

        if (studentIds.length <= 0) {
          return;
        }
        if (isCanceled) return;

        const currentStudents = await SynVStudentService.getCurrentVStudents({
          where: JSON.stringify({
            ID: studentIds,
          })
        }, {
          headers: {[HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
              'StudentForm', 'StudentYearLevel'
            ])}
        })
        if (currentStudents.length <= 0) {
          return;
        }
        if (isCanceled) return;
        setIsLoading(false);

        setLimitFormCodes(_.uniq(currentStudents.map(vStudent => `${vStudent.StudentForm || ''}`)))
        setYearLevelCodes(_.uniq(currentStudents.map(vStudent => `${vStudent.StudentYearLevel || ''}`)))
      } catch (err) {
        if (isCanceled) return;
        setIsLoading(false);
        Toaster.showApiError(err);
      }
    }

    fetchData();

    return () => {
      isCanceled = true;
    };
  }, [user?.synergyId, user?.isParent]);

  const handleChanged = () => {
    onChanged({
      ...(form === null ? {} : {form}),
      ...(yearLevel === null ? {} : {yearLevel}),
      ...(`${searchText || ''}`.trim() === '' ? {} : {searchText: `${searchText || ''}`.trim()}),
    })
  }

  if (isLoading === true) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper className={className}>
      <Row>
        <Col md={12}>
          <h6>Search Filter Options</h6>
        </Col>
        <Col md={6}>
          <FormLabel label={'Name'} />
          <Form.Control value={searchText} onChange={(event) => {
            setSearchText(event.target.value || '');
          }}/>
        </Col>
        <Col md={3} sm={8}>
          <FormLabel label={'Form'} />
          <SynFormSelector
            classname={'form-selector'}
            values={form ? [`${form?.Code}`] : []}
            limitCodes={limitFormCodes}
            onSelect={(options) => {
              // @ts-ignore
              setForm(options?.data || null);
            }}
          />
        </Col>
        <Col md={3} sm={4}>
          <FormLabel label={'Year Level'} />
          <YearLevelSelector
            classname={'yearLevel-selector'}
            limitCodes={limitYearLevelCodes || []}
            values={yearLevel ? [`${yearLevel?.Code}`] : []}
            onSelect={(options) => {
              // @ts-ignore
              setYearLevel(options?.data || null)
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <LoadingBtn variant={'info'} className={'search-btn'} isLoading={isSearching === true} onClick={() => handleChanged()}>
            <Icons.Search /> Search
          </LoadingBtn>
        </Col>
      </Row>
    </Wrapper>
  )
}

export default ParentDirectorySearchPanel;
