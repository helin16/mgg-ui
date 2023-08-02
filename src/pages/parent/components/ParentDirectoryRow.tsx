import iSynVStudentContactAllAddress from '../../../types/Synergetic/iSynVStudentContactAllAddress';
import {useEffect, useState} from 'react';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {Tooltip} from 'react-bootstrap';

type iParentDirectoryRow = {
  contact: iSynVStudentContactAllAddress;
  onEmailPopulated: (email: string) => void;
}
const ParentDirectoryRow = ({contact, onEmailPopulated}: iParentDirectoryRow) => {
  const [isLoading, setIsLoading] = useState(false);
  const [communityMap, setCommunityMap] = useState<{[key: number]: iSynCommunity}>({});

  useEffect(() => {
    let isCanceled = false;
    setIsLoading(true);
    SynCommunityService.getCommunityProfiles({
      where: JSON.stringify({
        ID: [contact.StudentContactID, ...(`${contact.StudentContactSpouseID || ''}`.trim() === '' ? [] : [contact.StudentContactSpouseID])]
      })
    }).then(resp => {
      if(isCanceled) return;
      setCommunityMap((resp.data || []).reduce((map, community) => {
        return {
          ...map,
          [community.ID]: community,
        }
      }, {}))
    }).catch(err => {
      if(isCanceled) return;
      console.error(err);
    }).finally(() => {
      if(isCanceled) return;
      setIsLoading(false);
    });

    return () => {
      isCanceled = true;
    }
  }, [contact]);

  const getSecondParent = () => {
    if (`${contact.StudentContactSpouseNameExternal || ''}`.trim() === '') {
      return null;
    }

    if (!(contact.StudentContactSpouseID in communityMap) || communityMap[contact.StudentContactSpouseID].DirectoryIncludeFlag === false) {
      return null;
    }

    onEmailPopulated(contact.StudentContactSpouseDefaultEmail);
    return (
      <div className={'large-6 columns end'}>
        <table>
          <tbody>
          <tr><td className={'title-col'}>Name</td><td>{contact.StudentContactSpouseNameExternal}</td></tr>
          <tr><td className={'title-col'}>Mobile</td>
            <td>
              {(contact.StudentContactSpouseID in communityMap && communityMap[contact.StudentContactSpouseID].SilentMobilePhoneFlag === false)
                ? contact.StudentContactSpouseDefaultMobilePhone : ''}
            </td>
          </tr>
          <tr><td className={'title-col'}>Email</td><td>{contact.StudentContactSpouseDefaultEmail}</td></tr>
          </tbody>
        </table>
      </div>
    )
  }

  const getWhetherShowParents = () => {
    if (!(contact.StudentContactID in communityMap) || communityMap[contact.StudentContactID].DirectoryIncludeFlag === false) {
      return false;
    }
    return true;
  }

  const getParentRow = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />
    }

    if (!getWhetherShowParents()) {
      return null;
    }

    onEmailPopulated(contact.StudentContactDefaultEmail);
    return (
      <>
        <div className={'large-6 columns end'}>
          <table>
            <tbody>
            <tr><td className={'title-col'}>Name</td><td>{contact.StudentContactNameExternal}</td></tr>
            <tr><td className={'title-col'}>Mobile</td>
              <td>
                {(contact.StudentContactID in communityMap && communityMap[contact.StudentContactID].SilentMobilePhoneFlag === false)
                  ? contact.StudentContactDefaultMobilePhone : ''}
              </td>
            </tr>
            <tr><td className={'title-col'}>Email</td><td>{contact.StudentContactDefaultEmail}</td></tr>
            </tbody>
          </table>
        </div>
        {getSecondParent()}
      </>
    )
  }

  return (
    <div className={'row parent-directory-row'}>
      <div className={'small-12 columns'}>
          <h2 className={'subheader'}>
            {contact.StudentName} ({contact.StudentHouseDescription}) {' '}
            {getWhetherShowParents() === true ? null : (
              <OverlayTrigger
                delay={{ show: 250, hide: 400 }}
                overlay={(props: any) => (
                  <Tooltip id="button-tooltip" {...props}>
                    Details have not been made available
                  </Tooltip>
                )}
              >
                <span data-tooltip="demo" className="hint has-tip tip-top" data-width="200" title="">?</span>
              </OverlayTrigger>
            )}
          </h2>
      </div>
      {getParentRow()}
    </div>
  )
}

export default ParentDirectoryRow;
