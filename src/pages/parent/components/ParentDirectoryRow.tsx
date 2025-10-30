import iSynVStudentContactAllAddress from '../../../types/Synergetic/Student/iSynVStudentContactAllAddress';
import {useEffect, useState} from 'react';
import iSynCommunity from '../../../types/Synergetic/iSynCommunity';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import PageLoadingSpinner from '../../../components/common/PageLoadingSpinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {Tooltip} from 'react-bootstrap';

type iParentDirectoryRow = {
  studentId: number | string;
  contacts: iSynVStudentContactAllAddress[];
  onEmailPopulated: (email: string) => void;
}
const ParentDirectoryRow = ({studentId, contacts, onEmailPopulated}: iParentDirectoryRow) => {
  const [isLoading, setIsLoading] = useState(false);
  const filteredContacts = contacts
    .filter(contact => `${contact.StudentID || ''}`.trim() === `${studentId || ''}`.trim())
    .sort((a, b) => `${a.StudentContactType || ''}`.trim() > `${b.StudentContactType || ''}`.trim() ? 1 : -1);
  const contactIds = filteredContacts
    .reduce(
      (arr: number[], contact) => [...arr, ...([contact.StudentContactID, ...(`${contact.StudentContactSpouseID || ''}`.trim() === '' ? [] : [contact.StudentContactSpouseID])])],
      []
    )
    .filter(id => `${id || ''}`.trim() !== '')
  const [communityMap, setCommunityMap] = useState<{[key: number]: iSynCommunity}>({});

  useEffect(() => {
    if (contactIds.length <= 0) {
      setCommunityMap({});
      return;
    }
    let isCanceled = false;
    setIsLoading(true);
    SynCommunityService.getCommunityProfiles({
      where: JSON.stringify({
        ID: contactIds
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCanBeShownContacts = () => {
    const contactsThatCanBeShown = [];
    for (const contact of filteredContacts) {
      if (!(contact.StudentContactID in communityMap) || communityMap[contact.StudentContactID].DirectoryIncludeFlag !== true) {
        continue;
      }
      contactsThatCanBeShown.push(contact)
    }
    return contactsThatCanBeShown;
  }

  const getWhetherShowParents = () => {
    return getCanBeShownContacts().length > 0;
  }

  const getParentDiv = (
    show: boolean,
    name: string,
    mobilePhone: string,
    email: string,
    hideMobile: boolean = false
  ) => {
    if (show !== true) {
      return null;
    }
    const nameStr = `${name || ''}`.trim();
    const mobilePhoneStr = hideMobile === true ? '' : `${mobilePhone || ''}`.trim();
    const emailStr = `${email || ''}`.trim();
    if (nameStr === '') {
      return null;
    }
    if (emailStr !== '') {
      onEmailPopulated(emailStr);
    }
    return (
      <div className={'large-6 columns end'}>
        <table>
          <tbody>
          <tr>
            <td className={'title-col'}>Name</td>
            <td>{nameStr}</td>
          </tr>
          <tr>
            <td className={'title-col'}>Mobile</td>
            <td>
              {mobilePhoneStr}
            </td>
          </tr>
          <tr>
            <td className={'title-col'}>Email</td>
            <td>{emailStr}</td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }

  const getSecondParent = (shownContact: iSynVStudentContactAllAddress) => {
    const canBeShownContacts = getCanBeShownContacts();
    if (canBeShownContacts.length <= 0) {
      return null;
    }
    // have to show the spouse
    if (`${shownContact.StudentContactSpouseID || ''}`.trim() !== '') {
      return getParentDiv(
        (shownContact.StudentContactSpouseID in communityMap) && communityMap[shownContact.StudentContactSpouseID].DirectoryIncludeFlag === true,
        shownContact.StudentContactSpouseNameExternal,
        shownContact.StudentContactSpouseDefaultMobilePhone,
        shownContact.StudentContactSpouseDefaultEmail,
        shownContact.StudentContactSpouseID in communityMap && communityMap[shownContact.StudentContactSpouseID].SilentMobilePhoneFlag === false
      );
    }
    const moreToShow = canBeShownContacts.filter(cont => cont.StudentContactID !== shownContact.StudentContactID);
    if (moreToShow.length <= 0) {
      return null;
    }
    const nextContact = moreToShow[0];
    return getParentDiv(
      (nextContact.StudentContactID in communityMap) && communityMap[nextContact.StudentContactID].DirectoryIncludeFlag === true,
      nextContact.StudentContactNameExternal,
      nextContact.StudentContactDefaultMobilePhone,
      nextContact.StudentContactDefaultEmail,
      nextContact.StudentContactID in communityMap && communityMap[nextContact.StudentContactID].SilentMobilePhoneFlag === false
    );
  }

  const getParentRow = () => {
    if (isLoading === true) {
      return <PageLoadingSpinner />
    }

    const canBeShownContacts = getCanBeShownContacts();
    if (canBeShownContacts.length <= 0 || !getWhetherShowParents()) {
      return null;
    }

    const contact = canBeShownContacts[0];
    return (
      <>
        {
          getParentDiv(
            (contact.StudentContactID in communityMap) && communityMap[contact.StudentContactID].DirectoryIncludeFlag === true,
          contact.StudentContactNameExternal,
          contact.StudentContactDefaultMobilePhone,
          contact.StudentContactDefaultEmail,
contact.StudentContactID in communityMap && communityMap[contact.StudentContactID].SilentMobilePhoneFlag === false
        )}
        {getSecondParent(contact)}
      </>
    )
  }

  if (filteredContacts.length <= 0) {
    return null;
  }

  return (
    <div className={'row parent-directory-row'}>
      <div className={'small-12 columns'}>
          <h2 className={'subheader'}>
            {filteredContacts[0].StudentName} ({filteredContacts[0].StudentHouseDescription}) {' '}
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
