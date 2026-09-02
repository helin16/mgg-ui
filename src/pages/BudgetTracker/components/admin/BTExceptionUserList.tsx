import React, {useEffect, useState} from 'react';
import {Alert, Button, Spinner} from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import {useSelector} from 'react-redux';
import moment from 'moment';
import styled from 'styled-components';

import {RootState} from '../../../../redux/makeReduxStore';
import UserService from '../../../../services/UserService';
import iModuleUser from '../../../../types/modules/iModuleUser';
import {MGGS_MODULE_ID_BUDGET_TRACKER} from '../../../../types/modules/iModuleUser';
import {ROLE_ID_NORMAL} from '../../../../types/modules/iRole';
import Toaster, {TOAST_TYPE_SUCCESS} from '../../../../services/Toaster';
import Table, {iTableColumn} from '../../../../components/common/Table';
import PopupModal from '../../../../components/common/PopupModal';
import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import DateTimePicker from '../../../../components/common/DateTimePicker';
import DeleteConfirmPopupBtn from '../../../../components/common/DeleteConfirm/DeleteConfirmPopupBtn';
import StaffSelector from '../../../../components/staff/StaffSelector';
import {iAutoCompleteSingle} from '../../../../components/common/AutoComplete';
import FormLabel from '../../../../components/form/FormLabel';

const DATE_FORMAT = 'YYYY-MM-DD';

// Store the picker value as a bare YYYY-MM-DD calendar date (no time / zone) - the API
// nightly job is the sole authority for the day-boundary decision (spec 021 FR / contracts).
const toExpiryDate = (value: any): string => moment(value).format(DATE_FORMAT);

const Wrapper = styled.div`
  .expiry-cell {
    min-width: 170px;
  }
  .no-expiry {
    color: #b00;
    font-style: italic;
  }
`;

const BTExceptionUserList = () => {
  const {user: currentUser} = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [userMap, setUserMap] = useState<{[key: number]: iModuleUser}>({});
  const [reloadCount, setReloadCount] = useState(0);

  const [showingAddPanel, setShowingAddPanel] = useState(false);
  const [addStaff, setAddStaff] = useState<iAutoCompleteSingle | null>(null);
  const [addExpiryDate, setAddExpiryDate] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [savingSynId, setSavingSynId] = useState<number | null>(null);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    UserService.getUsers({
      where: JSON.stringify({
        Active: 1,
        ModuleID: MGGS_MODULE_ID_BUDGET_TRACKER,
        RoleID: ROLE_ID_NORMAL,
      }),
      include: 'SynCommunity',
    })
      .then(resp => {
        if (isCancelled) return;
        setUserMap(
          resp.reduce((map, user) => ({...map, [user.SynergeticID]: user}), {})
        );
      })
      .catch(err => {
        if (isCancelled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCancelled) return;
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [reloadCount]);

  const reload = () => setReloadCount(count => count + 1);

  const onAdd = () => {
    if (!addStaff || `${addExpiryDate || ''}`.trim() === '') {
      return;
    }
    setIsSaving(true);
    UserService.createUser(
      MGGS_MODULE_ID_BUDGET_TRACKER,
      ROLE_ID_NORMAL,
      addStaff.value,
      {settings: {expiryDate: addExpiryDate}}
    )
      .then(resp => {
        Toaster.showToast('Exception user added.', TOAST_TYPE_SUCCESS);
        setUserMap(map => ({...map, [resp.SynergeticID]: resp}));
        setShowingAddPanel(false);
        setAddStaff(null);
        setAddExpiryDate('');
      })
      .catch(err => Toaster.showApiError(err))
      .finally(() => setIsSaving(false));
  };

  const onChangeExpiry = (user: iModuleUser, value: any) => {
    const expiryDate = toExpiryDate(value);
    setSavingSynId(user.SynergeticID);
    UserService.updateUser(
      user.ModuleID,
      user.RoleID,
      user.SynergeticID,
      {settings: {...(user.settings || {}), expiryDate}}
    )
      .then(resp => {
        Toaster.showToast('Expiry date updated.', TOAST_TYPE_SUCCESS);
        setUserMap(map => ({...map, [resp.SynergeticID]: resp}));
      })
      .catch(err => Toaster.showApiError(err))
      .finally(() => setSavingSynId(null));
  };

  const onDelete = (user: iModuleUser) =>
    UserService.deleteUser(user.ModuleID, user.RoleID, user.SynergeticID);

  const columns: iTableColumn<iModuleUser>[] = [
    {
      key: 'SynergeticID',
      header: 'ID',
      cell: (column, user) => <td key={column.key}>{user.SynergeticID}</td>,
    },
    {
      key: 'Name',
      header: 'Name',
      cell: (column, user) => (
        <td key={column.key}>
          {user.SynCommunity?.Given1} {user.SynCommunity?.Surname}
        </td>
      ),
    },
    {
      key: 'Email',
      header: 'Email',
      cell: (column, user) => {
        const email = `${user.SynCommunity?.OccupEmail || ''}`.trim();
        return (
          <td key={column.key}>
            {email === '' ? null : <a href={`mailto:${email}`}>{email}</a>}
          </td>
        );
      },
    },
    {
      key: 'Expiry',
      header: 'Expiry',
      cell: (column, user) => {
        const expiryDate = `${user.settings?.expiryDate || ''}`.trim();
        return (
          <td key={column.key} className={'expiry-cell'}>
            {savingSynId === user.SynergeticID ? (
              <Spinner animation={'border'} size={'sm'} />
            ) : (
              <>
                {expiryDate === '' ? (
                  <div className={'no-expiry'}>No expiry - set a date</div>
                ) : null}
                <DateTimePicker
                  value={expiryDate || undefined}
                  timeFormat={false}
                  dateFormat={DATE_FORMAT}
                  placeholder={'Set expiry date'}
                  onChange={selected => {
                    if (typeof selected === 'object' && selected !== null) {
                      onChangeExpiry(user, selected);
                    }
                  }}
                />
              </>
            )}
          </td>
        );
      },
    },
    {
      key: 'DeleteBtn',
      header: (column: iTableColumn<iModuleUser>) => (
        <th key={column.key} className={'text-right'}>
          <Button
            variant={'success'}
            size={'sm'}
            title={'Add an exception user'}
            onClick={() => setShowingAddPanel(true)}
          >
            <Icons.Plus />
          </Button>
        </th>
      ),
      cell: (column, user) => (
        <td className={'text-right'} key={column.key}>
          {currentUser?.synergyId === user.SynergeticID ? null : (
            <DeleteConfirmPopupBtn
              variant={'danger'}
              size={'sm'}
              deletingFn={() => onDelete(user)}
              deletedCallbackFn={reload}
              confirmString={`${user.SynergeticID}`}
              description={
                <>
                  You are about to remove Budget Tracker exception access from{' '}
                  <b>
                    {user.SynCommunity?.Given1} {user.SynCommunity?.Surname}
                  </b>
                </>
              }
            >
              <Icons.Trash />
            </DeleteConfirmPopupBtn>
          )}
        </td>
      ),
    },
  ];

  const getRows = () =>
    Object.values(userMap).sort((a, b) =>
      `${a.SynCommunity?.Surname || ''}${a.SynCommunity?.Given1 || ''}` >
      `${b.SynCommunity?.Surname || ''}${b.SynCommunity?.Given1 || ''}`
        ? 1
        : -1
    );

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <Wrapper className={'bt-exception-user-list'}>
      <Table striped hover columns={columns} rows={getRows()} />
      {showingAddPanel ? (
        <PopupModal
          show
          handleClose={() => {
            if (!isSaving) {
              setShowingAddPanel(false);
            }
          }}
          title={'Add an exception user'}
        >
          <p>
            Exception users can add budget items even when the budget year is
            locked down. An expiry date is required - the access is removed
            automatically once it passes.
          </p>
          <FormLabel label={'Staff member'} isRequired />
          <StaffSelector
            onSelect={option =>
              setAddStaff(Array.isArray(option) ? option[0] : option)
            }
          />
          <p />
          <FormLabel label={'Expiry date'} isRequired />
          <DateTimePicker
            value={addExpiryDate || undefined}
            timeFormat={false}
            dateFormat={DATE_FORMAT}
            placeholder={'Pick an expiry date'}
            onChange={selected => {
              if (typeof selected === 'object' && selected !== null) {
                setAddExpiryDate(toExpiryDate(selected));
              }
            }}
          />
          {addExpiryDate !== '' &&
          moment(addExpiryDate, DATE_FORMAT).endOf('day').isBefore(moment()) ? (
            <Alert variant={'warning'} className={'mt-2'}>
              This date is in the past - the nightly check will deactivate this
              user on its next run.
            </Alert>
          ) : null}
          <p />
          <Alert variant={'warning'}>You can NOT add yourself.</Alert>
          <div className={'text-right'}>
            <Button
              variant={'link'}
              disabled={isSaving}
              onClick={() => setShowingAddPanel(false)}
            >
              Cancel
            </Button>
            <Button
              variant={'primary'}
              disabled={isSaving || !addStaff || addExpiryDate === ''}
              onClick={() => onAdd()}
            >
              {isSaving ? <Spinner animation={'border'} size={'sm'} /> : 'Add'}
            </Button>
          </div>
        </PopupModal>
      ) : null}
    </Wrapper>
  );
};

export default BTExceptionUserList;
