import React, {useEffect, useState} from 'react';
import SynSubjectClassesResultLockService from '../../../../services/Synergetic/SynSubjectClassesResultLockService';
import iSynSubjectClassesResultLock from '../../../../types/Synergetic/iSynSubjectClassesResultLock';
import {Spinner, Table} from 'react-bootstrap';
import styled from 'styled-components';
import moment from 'moment-timezone';
import DeleteConfirmPopupBtn from '../../../../components/common/DeleteConfirmPopupBtn';

const Wrapper = styled.div``

const AdminEditingLockList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [locks, setLocks] = useState<iSynSubjectClassesResultLock[]>([]);

  useEffect(() => {
    setIsLoading(true);
    SynSubjectClassesResultLockService.getAll({include: `SynVStaff`})
      .then(resp => {
        setLocks(resp);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, []);

  if (isLoading === true) {
    return <Spinner animation={'border'} />
  }

  const handleLockDeleted = (editingLock: iSynSubjectClassesResultLock) => {
    setLocks(locks.filter(lock => lock.SubjectClassesResultLockSeq !== editingLock.SubjectClassesResultLockSeq));
  }

  const getTBody = () => {
    if (locks.length <= 0) {
      return null;
    }
    return (
      <tbody>
        {locks.map(lock => {
          return (
            <tr key={lock.SubjectClassesResultLockSeq}>
              <td>{lock.SynVStaff?.StaffID}</td>
              <td>{lock.SynVStaff?.StaffNameExternal}</td>
              <td><a href={`mailto:${lock.SynVStaff?.StaffOccupEmail}`}>{lock.SynVStaff?.StaffOccupEmail}</a></td>
              <td>{lock.AppName}</td>
              <td>{moment(lock.DateTimeExpire).format('lll')}</td>
              <td>
                <DeleteConfirmPopupBtn
                  size={'sm'}
                  variant={'danger'}
                  deletingFn={() => SynSubjectClassesResultLockService.deleteLock(lock.SubjectClassesResultLockSeq)}
                  confirmString={`${lock.StaffID}`}
                  description={<p>Are you sure releasing this editing lock for <b>{lock.SynVStaff?.StaffNameExternal}</b></p>}
                  confirmBtnString={'Confirm Release'}
                  deletedCallbackFn={() => handleLockDeleted(lock)}
                >
                  Unlock
                </DeleteConfirmPopupBtn>
              </td>
            </tr>
          )
        })}
      </tbody>
    )
  }

  return (
    <Wrapper className={`module-editing-lock-list`}>
      <Table striped hover className={'list-table'}>
        <thead>
          <tr>
            <th>Synergetic ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>App</th>
            <th>Lock Expiry</th>
            <th></th>
          </tr>
        </thead>
        {getTBody()}
      </Table>
    </Wrapper>
  )
}

export default AdminEditingLockList;
