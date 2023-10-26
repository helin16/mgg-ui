import styled from 'styled-components';
import {useEffect, useRef, useState} from 'react';
import PageLoadingSpinner from '../../components/common/PageLoadingSpinner';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import moment from 'moment-timezone';
import Toaster, {TOAST_TYPE_ERROR} from '../../services/Toaster';
import SynVStudentContactAllAddressService from '../../services/Synergetic/Student/SynVStudentContactAllAddressService';
import iSynVStudentContactAllAddress from '../../types/Synergetic/iSynVStudentContactAllAddress';
import {
  STUDENT_CONTACT_TYPE_SC1,
  STUDENT_CONTACT_TYPE_SC2,
} from '../../types/Synergetic/iStudentContact';
import ParentDirectoryRow from './components/ParentDirectoryRow';
import {HEADER_NAME_SELECTING_FIELDS} from '../../services/AppService';
import ParentDirectorySearchPanel, {iParentDirectorySearchCriteria} from './components/ParentDirectorySearchPanel';
import {OP_LIKE} from '../../helper/ServiceHelper';
import {Button, Dropdown} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons'
import * as _ from 'lodash';
import Page401 from '../../components/Page401';

const Wrapper = styled.div`
  .search-panel {
    margin-bottom: 1.75rem;
  }
  .title-row {
    h1 {
      font-size: 1.75rem;
    }
    .actions {
      float: right;
      .dropdown-toggle {
        :after {
          display:none;
        }
      }
    }
  }
  
  h2.subheader {
    font-size: 1.125rem;
  }
  
  .row {
    .columns {
      display: inline-block;
      &.large-6 {
        width: 50%;
        @media only print, screen and (max-width: 40em) {
          width: 100%;
        }
      }
      
      .title-col {
        width: 60px;
      }
    }
  }
`;

const ParentDirectoryPage = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [contactMap, setContactMap] = useState<{ [key: string]: iSynVStudentContactAllAddress[] }>({});
  const [searchCriteria, setSearchCriteria] = useState<iParentDirectorySearchCriteria>({});
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  const recipientEmails = useRef('')

  const canAccessPage = user?.isParent === true || user?.isStaff === true || user?.isCasualStaff === true;

  useEffect(() => {
    if (canAccessPage !== true) { return };
    if (`${searchCriteria.searchText || ''}`.trim() === '' && !searchCriteria.form && !searchCriteria.yearLevel) {
      setShowSearchPanel(true);
      setContactMap({});
      return;
    }

    let isCanceled = false;
    setIsLoading(true);
    recipientEmails.current = '';
    SynVStudentContactAllAddressService.getAll({
      where: JSON.stringify({
        StudentContactType: [STUDENT_CONTACT_TYPE_SC1, STUDENT_CONTACT_TYPE_SC2],
        FileYear: user?.SynCurrentFileSemester?.FileYear || moment().year(),
        FileSemester: user?.SynCurrentFileSemester?.FileSemester || 1,
        ...(`${searchCriteria.searchText || ''}`.trim() === '' ? {} : {StudentName: {[OP_LIKE]: `%${`${searchCriteria.searchText || ''}`.trim()}%`}}),
        ...(!searchCriteria.form ? {} : {StudentForm: searchCriteria.form.Code}),
        ...(!searchCriteria.yearLevel ? {} : {StudentYearLevel: searchCriteria.yearLevel.Code}),
      }),
      perPage: 9999,
      sort: 'StudentSurname:ASC'
    }, {
      headers: {[HEADER_NAME_SELECTING_FIELDS]: JSON.stringify([
        'StudentID',
        'StudentContactID',
        'StudentName',
        'StudentHouseDescription',
        'StudentContactID',
        'StudentContactNameExternal',
        'StudentContactDefaultEmail',
        'StudentContactDefaultMobilePhone',
        'StudentContactSilentPhoneFlag',
        'StudentContactSpouseID',
        'StudentContactSpouseNameExternal',
        'StudentContactSpouseDefaultMobilePhone',
        'StudentContactSpouseDefaultEmail',
        'StudentParentsSeparatedFlag',
      ])}
    }).then(resp => {
      if (isCanceled) return;
      setContactMap(resp.data.reduce((map, contact) => {
        return {
          ...map,
          // @ts-ignore
          [contact.StudentID]: [...(contact.StudentID in map ? map[contact.StudentID] : []), contact],
        }
      }, {}));
    }).catch(error => {
      if (isCanceled) return;
      Toaster.showApiError(error)
    }).finally(() => {
      if (isCanceled) return;
      setIsLoading(false);
    })

    return () => {
      isCanceled = true;
    }
  }, [user?.SynCurrentFileSemester, searchCriteria, canAccessPage]);


  const getSearchPanel = () => {
    if (showSearchPanel !== true) {
      return null;
    }
    return (
      <ParentDirectorySearchPanel
        className={'search-panel'}
        isSearching={isLoading === true}
        onChanged={(newCriteria) => {
          setSearchCriteria(newCriteria);
          setShowSearchPanel(false);
        }
      }/>
    )
  }

  const createEmail = () => {
    const emails = recipientEmails.current.split(',').map(email => `${email}`.trim()).filter(email => email !== '');
    if (emails.length <= 0) {
      Toaster.showToast(`There is no emails in the list, please search and try again.`, TOAST_TYPE_ERROR);
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/mail/create';

    // replyTo
    const replyTo = document.createElement('input');
    replyTo.type = 'hidden';
    replyTo.name = 'replyto';
    replyTo.value = `${user?.SynCommunity?.OccupEmail || ''}`;
    form.appendChild(replyTo);

    // BCCs
    const bccs = document.createElement('input');
    bccs.type = 'hidden';
    bccs.name = 'bcc';
    bccs.value = emails.join(',');
    form.appendChild(bccs);

    document.body.appendChild(form);
    form.submit();
  }

  const getDropdownMenu = () => {
    return (
      <Dropdown autoClose="inside" className={'actions'}>
        <Dropdown.Toggle variant={'light'}>
          <Icons.ThreeDotsVertical />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item>
            <Button variant={'link'} onClick={() => createEmail()} form={'create-email-form'}>
              <Icons.EnvelopeFill /> Email All Parents
            </Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Button variant={'link'} onClick={() => setShowSearchPanel(true)}>
              <Icons.Search /> Search
            </Button>
          </Dropdown.Item>
          <Dropdown.Item>
            <Button variant={'link'} onClick={() => {window.print()}}>
              <Icons.PrinterFill /> Print
            </Button>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />
    }

    return (
      <>
        <div className={'row title-row'}>
          <div className={'small-12 column'}>
            <div className={'actions-small-1'}>
              <div className={'list-item'}>
                <h1>
                  Parent Directory:
                  {getDropdownMenu()}
                </h1>
              </div>
            </div>
          </div>
        </div>
        {getSearchPanel()}
        {
          Object.keys(contactMap).map(studentId => {
            return <ParentDirectoryRow contact={contactMap[studentId][0]} key={studentId} onEmailPopulated={(email) => recipientEmails.current = _.uniq([...recipientEmails.current.split(','), email]).join(',')}/>
          })
        }
      </>
    )
  }

  if (!canAccessPage) {
    return (
      <Page401 />
    )
  }

  return (
    <Wrapper id={'container'}>
      {getContent()}
    </Wrapper>
  )
}

export default ParentDirectoryPage;
