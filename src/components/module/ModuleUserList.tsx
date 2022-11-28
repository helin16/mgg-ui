import {Spinner, Table} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import UserService from '../../services/UserService';
import iModuleUser from '../../types/modules/iModuleUser';
import * as Icons from 'react-bootstrap-icons';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/makeReduxStore';
import DeleteConfirmPopupBtn from '../common/DeleteConfirm/DeleteConfirmPopupBtn';
import styled from 'styled-components';
import StaffAutoComplete from '../staff/StaffAutoComplete';
import {iAutoCompleteSingle} from '../common/AutoComplete';

const Wrapper = styled.div`
  
`

type iModuleUserList = {
  moduleId: number;
  roleId: number;
  showCreatingPanel?: boolean;
  showDeletingBtn?: boolean;
}

const ModuleUserList = ({moduleId, roleId, showCreatingPanel, showDeletingBtn}: iModuleUserList) => {
  const {user: currentUser} = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [userMap, setUserMap] = useState<{[key: number]: iModuleUser}>({});

  useEffect(() => {
    let isCancelled = false;
    UserService.getUsers({
        where: JSON.stringify({
          Active: 1,
          ModuleID: moduleId,
          ...(roleId ? {RoleID: roleId} : {}),
        }),
        include: 'SynCommunity',
      })
      .then(resp => {
        if (isCancelled === true) { return  }
        setUserMap(resp.reduce((map, user) => ({...map, [user.SynergeticID]: user}), {}));
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    }
  }, [moduleId, roleId]);

  const getDeletingFn = (user: iModuleUser) => {
    return UserService.deleteUser(user.ModuleID, user.RoleID, user.SynergeticID)
  }

  const handleDeletedFn = (user: iModuleUser) => (resp: {deleted: boolean }) => {
    if (resp.deleted === true) {
      delete userMap[user.SynergeticID];
      setUserMap({...userMap});
    }
  }

  const onCreate = (selected: iAutoCompleteSingle | null) => {
    if(selected === null) {
      return;
    }
    setIsCreating(true);
    return UserService.createUser(moduleId, roleId, selected.value)
      .then(resp => {
        setUserMap({...userMap, [resp.SynergeticID]: resp});
      })
      .finally(() => {
        setIsCreating(false);
      })
  }

  if (isLoading === true) {
    return <Spinner animation={'border'} />;
  }

  const getUserRows = () => {
    const users = Object.values(userMap);
    if (users.length <= 0) {
      return null;
    }
    return (
      <>
        {
          users
            .sort((user1, user2) => {
              return `${user1.SynCommunity?.Given1}` > `${user2.SynCommunity?.Given1}`
              && `${user1.SynCommunity?.Surname}` > `${user2.SynCommunity?.Surname}` ? 1 : -1
            })
            .map(user => {
              return (
                <tr key={user.SynergeticID}>
                  <td>
                    {user.SynergeticID}
                  </td>
                  <td>
                    {user.SynCommunity?.Given1} {user.SynCommunity?.Surname}
                  </td>
                  <td>
                    <a href={`mailto:${user.SynCommunity?.OccupEmail || ''}`}>{user.SynCommunity?.OccupEmail || ''}</a>
                  </td>
                  <td className={'text-right'}>
                    {
                      currentUser?.synergyId === user.SynergeticID || showDeletingBtn !== true ? null :
                      <DeleteConfirmPopupBtn
                        variant={'danger'}
                        deletingFn={() => getDeletingFn(user)}
                        deletedCallbackFn={handleDeletedFn(user)}
                        size={'sm'}
                        description={<>You are about to remove admin rights from <b>{user.SynCommunity?.Given1} {user.SynCommunity?.Surname}</b></>}
                        confirmString={`${user.SynergeticID}`}>
                        <Icons.Trash />
                      </DeleteConfirmPopupBtn>
                    }
                  </td>
                </tr>
              )
            })
        }
      </>
    )
  }

  const getCreatingPanel = () => {
    if (showCreatingPanel !== true) {
      return null;
    }
    return (
      <tfoot>
        <tr>
          <td colSpan={4}>
            <div  style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <b>Creating:</b>
              {
                isCreating === true ?
                <Spinner animation={'border'} size={'sm'}/> :
                <div style={{width: '100%'}}><StaffAutoComplete onSelect={onCreate}/></div>
              }
            </div>
          </td>
        </tr>
      </tfoot>
    )
  }

  return (
    <Wrapper className={`module-user-list moduleId-${moduleId} roleId-${roleId}`}>
      <Table striped hover className={'list-table'}>
        <thead>
          <tr>
            <th>Synergetic ID</th>
            <th>Name</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{getUserRows()}</tbody>
        {getCreatingPanel()}
      </Table>
    </Wrapper>
  )
}

export default ModuleUserList;
