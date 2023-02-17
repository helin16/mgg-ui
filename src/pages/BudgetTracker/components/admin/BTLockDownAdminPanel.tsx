import styled from 'styled-components';
import {useEffect, useState} from 'react';
import PageLoadingSpinner from '../../../../components/common/PageLoadingSpinner';
import {Alert, Table} from 'react-bootstrap';
import Toaster from '../../../../services/Toaster';
import * as _ from 'lodash';
import BTLockDownService from '../../../../services/BudgetTracker/BTLockDownService';
import iBTLockDown from '../../../../types/BudgetTacker/iBTLockDown';
import moment from 'moment-timezone';
import {BT_ADMIN_OPTION_USERS, iBTAdminOptions} from './BTAdminOptionsPanel';
import CommunityService from '../../../../services/Synergetic/CommunityService';
import iSynCommunity from '../../../../types/Synergetic/iSynCommunity';
import BTLockDownCreatePopup from './BTLockDownCreatePopup';
import MathHelper from '../../../../helper/MathHelper';

const Wrapper = styled.div``;

type iBTLockDownAdminPanel = {
  onSelectAdminModule: (showingAdminPageModule: iBTAdminOptions | null) => void;
}
const BTLockDownAdminPanel = ({onSelectAdminModule}: iBTLockDownAdminPanel) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lockDowns, setLockDowns] = useState<iBTLockDown[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isCanceled = false;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const btLockdowns = await BTLockDownService.getAll();
        if (isCanceled) return;
        const ids: number[] = [];
        btLockdowns.forEach((biLockDown) => {
          ids.push(biLockDown.created_by_id);
          ids.push(biLockDown.updated_by_id);
        })

        const communityProfiles = await CommunityService.getCommunityProfiles({
          where: JSON.stringify({
            ID: _.uniq(ids),
          })
        });
        if (isCanceled) return;
        const comMap = communityProfiles.data.reduce((map: {[key: number]: iSynCommunity}, com) => {
          return {
            ...map,
            [com.ID]: com,
          }
        }, {});
        setLockDowns(btLockdowns.map(lockDown => {
          return {
            ...lockDown,
            CreatedBy: comMap[Number(`${lockDown.created_by_id}`.trim())],
            UpdatedBy: comMap[Number(`${lockDown.updated_by_id}`.trim())],
          }
        }))
        setIsLoading(false);
      } catch (err)  {
        Toaster.showApiError(err)
        setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      isCanceled = true;
    };
  }, [count]);

  const getContent = () => {
    if (isLoading) {
      return <PageLoadingSpinner/>
    }
    return (
      <Table size={'sm'} hover striped>
        <thead>
        <tr>
          <th>Budget Year</th>
          <th>Lockdown time</th>
          <th>Created</th>
          <th>Updated</th>
        </tr>
        </thead>
        <tbody>
        {
          _.orderBy(lockDowns, ['year'], ['desc'])
            .map(lockDown => {
              return (
                <tr key={lockDown.year}>
                  <td>{lockDown.year}</td>
                  <td>{moment(lockDown.lockdown).format('DD / MMM / YYYY h:mm a')}</td>
                  <td>
                    <small>
                      <div>By: {lockDown.CreatedBy?.Given1} {lockDown.CreatedBy?.Surname}</div>
                      <div>@: {moment(lockDown.created_at).format('DD / MMM / YYYY h:mm a')}</div>
                    </small>
                  </td>
                  <td>
                    <small>
                      <div>By: {lockDown.UpdatedBy?.Given1} {lockDown.UpdatedBy?.Surname}</div>
                      <div>@: {moment(lockDown.updated_at).format('DD / MMM / YYYY h:mm a')}</div>
                    </small>
                  </td>
                </tr>
              )
            })
        }
        </tbody>
      </Table>
    )
  }

  const getCurrentLockDown = () => {
    const currentLockdowns = lockDowns.filter((lockDown) => Number(lockDown.year) === MathHelper.add(moment().year(), 1));
    if (currentLockdowns.length <= 0) {
      return undefined;
    }
    return currentLockdowns[0]
  }

  return (
    <Wrapper>
      <Alert variant={'warning'}>
        <div>
          <div>After the lock down:</div>
          <ul>
            <ol>
               - Users can NOT add new budget item - except {' '}
              {/* eslint-disable-next-line */}
              <a href={'#'} onClick={() => onSelectAdminModule(BT_ADMIN_OPTION_USERS)}>these nominated users or admin users.</a>
            </ol>
            <ol>- Users can NOT edit their Budget Item any more - except  {' '}
              {/* eslint-disable-next-line */}
              <a href={'#'} onClick={() => onSelectAdminModule(BT_ADMIN_OPTION_USERS)}>these nominated users or admin users.</a>.
            </ol>
            <ol>- You can NOT unlock for it without IT team's help.</ol>
          </ul>
          <BTLockDownCreatePopup
            onSaved={() => setCount(MathHelper.add(count, 1))}
            currentLockDown={getCurrentLockDown()}
          />
        </div>
      </Alert>
      {getContent()}
    </Wrapper>
  )
}

export default BTLockDownAdminPanel;
