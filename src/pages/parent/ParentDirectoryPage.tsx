import styled from 'styled-components';
import {useEffect, useState} from 'react';
import PageLoadingSpinner from '../../components/common/PageLoadingSpinner';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import moment from 'moment-timezone';
import Toaster from '../../services/Toaster';
import SynVStudentContactAllAddressService from '../../services/Synergetic/SynVStudentContactAllAddressService';
import iSynVStudentContactAllAddress from '../../types/Synergetic/iSynVStudentContactAllAddress';
import {STUDENT_CONTACT_TYPE_SC1, STUDENT_CONTACT_TYPE_SC2} from '../../types/Synergetic/iStudentContact';
import ParentDirectoryRow from './components/ParentDirectoryRow';
import {HEADER_NAME_SELECTING_FIELDS} from '../../services/AppService';

const Wrapper = styled.div``;
const ParentDirectoryPage = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [contactMap, setContactMap] = useState<{ [key: string]: iSynVStudentContactAllAddress[] }>({});


  useEffect(() => {
    let isCanceled = false;

    setIsLoading(true);
    SynVStudentContactAllAddressService.getAll({
      where: JSON.stringify({
        StudentContactType: [STUDENT_CONTACT_TYPE_SC1, STUDENT_CONTACT_TYPE_SC2],
        FileYear: user?.SynCurrentFileSemester?.FileYear || moment().year(),
        FileSemester: user?.SynCurrentFileSemester?.FileSemester || 1,
      }),
      perPage: 999,
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
  }, [user?.SynCurrentFileSemester])

  const getContent = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />
    }

    return (
      <>
        <div className={'row'}>
          <div className={'small-12 column'}>
            <div className={'actions-small-1'}>
              <div className={'list-item'}>
                <h1>Parent Directory</h1>
              </div>
            </div>
          </div>
        </div>
        {
          Object.keys(contactMap).map(studentId => {
            return <ParentDirectoryRow contact={contactMap[studentId][0]} key={studentId}/>
          })
        }
      </>
    )
  }

  return (
    <Wrapper id={'container'}>
      {getContent()};
    </Wrapper>
  )
}

export default ParentDirectoryPage;
