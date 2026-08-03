import {useEffect, useState} from 'react';
import {Alert, Spinner, Tab, Tabs} from 'react-bootstrap';
import SectionDiv from '../../../components/common/SectionDiv';
import MggsModuleService from '../../../services/Module/MggsModuleService';
import SynLuDocumentClassificationService
  from '../../../services/Synergetic/Lookup/SynLuDocumentClassificationService';
import Toaster from '../../../services/Toaster';
import iSynLuDocumentClassification
  from '../../../types/Synergetic/Lookup/iSynLuDocumentClassification';
import {MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS} from '../../../types/modules/iModuleUser';
import DocumentClassificationPermissionsTable from './DocumentClassificationPermissionsTable';
import SynUsersTable from './SynUsersTable';
import SynReportsPermissionTable from './SynReportsPermissionTable';
import SynUserGroupsTable from './SynUserGroupsTable';

const SynergeticUserPermissionsPanel = () => {
  const [classifications, setClassifications] = useState<iSynLuDocumentClassification[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [excludedUserIds, setExcludedUserIds] = useState<number[]>([]);
  const [reportCodes, setReportCodes] = useState<string[]>([]);
  const [selectedReportTab, setSelectedReportTab] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDocManAlert, setShowDocManAlert] = useState(true);
  const [showEmptyGroupsAlert, setShowEmptyGroupsAlert] = useState(true);
  const [showUsersAlert, setShowUsersAlert] = useState(true);
  const [showReportsAlert, setShowReportsAlert] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    MggsModuleService.getModule(MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS)
      .then(module => {
        const codes: string[] = module.settings?.documentClassificationCodes || [];
        const configuredReportCodes: string[] = module.settings?.reportCodes || [];
        setReportCodes(configuredReportCodes);
        setSelectedReportTab(configuredReportCodes[0] || '');
        setExcludedUserIds(module.settings?.excludedUserIds || []);
        if (codes.length <= 0) return [];

        return SynLuDocumentClassificationService.getAll({
          where: JSON.stringify({Code: codes}),
          perPage: 999999,
        }).then(resp => {
          const classificationMap = (resp.data || []).reduce<{
            [key: string]: iSynLuDocumentClassification;
          }>((map, classification) => ({
            ...map,
            [classification.Code]: classification,
          }), {});

          return codes
            .map(code => classificationMap[code])
            .filter((classification): classification is iSynLuDocumentClassification => !!classification);
        });
      })
      .then(configuredClassifications => {
        if (isCancelled) return;
        setClassifications(configuredClassifications);
        setSelectedTab(configuredClassifications[0]?.Code || '');
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
  }, []);

  const getContent = () => {
    if (isLoading) {
      return <Spinner animation={'border'} size={'sm'} />;
    }

    return (
      <Tabs defaultActiveKey={'docMan'} unmountOnExit>
        <Tab eventKey={'docMan'} title={'DocMan - Documents'}>
          <Alert
            variant={'info'}
            className={'mt-3 mb-0'}
            show={showDocManAlert}
            onClose={() => setShowDocManAlert(false)}
            dismissible
          >
            This view supports the review of user permissions for DocMan access across the
            document classifications listed below. Administrators can add or remove the
            classifications shown here through <strong>Admin → Settings</strong> for this module.
          </Alert>
          {classifications.length <= 0 ? (
            <p className={'mt-3 mb-0'}>No document classifications have been configured.</p>
          ) : <Tabs
            activeKey={selectedTab}
            onSelect={key => setSelectedTab(key || classifications[0].Code)}
            variant={'pills'}
            className={'mt-3'}
            unmountOnExit
          >
            {classifications.map(classification => (
              <Tab
                key={classification.Code}
                eventKey={classification.Code}
                title={`${classification.Code} - ${classification.Description}`}
              >
                <DocumentClassificationPermissionsTable
                  classificationCode={classification.Code}
                  excludedUserIds={excludedUserIds}
                />
              </Tab>
            ))}
          </Tabs>}
        </Tab>
        <Tab eventKey={'reports'} title={'Reports'}>
          <Alert
            variant={'info'}
            className={'mt-3 mb-0'}
            show={showReportsAlert}
            onClose={() => setShowReportsAlert(false)}
            dismissible
          >
            This view supports the review of user access to the Synergetic reports configured
            below. Administrators can add or remove report codes through <strong>Admin → Settings</strong>.
          </Alert>
          {reportCodes.length <= 0 ? (
            <p className={'mt-3 mb-0'}>No reports have been configured.</p>
          ) : (
            <Tabs
              activeKey={selectedReportTab}
              onSelect={key => setSelectedReportTab(key || reportCodes[0])}
              variant={'pills'}
              className={'mt-3'}
              unmountOnExit
            >
              {reportCodes.map(reportCode => (
                <Tab key={reportCode} eventKey={reportCode} title={reportCode}>
                  <SynReportsPermissionTable
                    reportCode={reportCode}
                    excludedUserIds={excludedUserIds}
                  />
                </Tab>
              ))}
            </Tabs>
          )}
        </Tab>
        <Tab eventKey={'userGroups'} title={'User Groups'}>
          <Alert
            variant={'info'}
            className={'mt-3'}
            show={showEmptyGroupsAlert}
            onClose={() => setShowEmptyGroupsAlert(false)}
            dismissible
          >
            This view lists all Synergetic user groups and their assigned users. Groups with no
            assigned users are retained in the list to support a complete permissions review.
          </Alert>
          <SynUserGroupsTable />
        </Tab>
        <Tab eventKey={'users'} title={'Users'}>
          <Alert
            variant={'info'}
            className={'mt-3'}
            show={showUsersAlert}
            onClose={() => setShowUsersAlert(false)}
            dismissible
          >
            This view lists all Synergetic users, their active staff status, and assigned user
            groups. Review these accounts regularly to confirm that access remains appropriate.
          </Alert>
          <SynUsersTable />
        </Tab>
      </Tabs>
    );
  };

  return (
    <SectionDiv>
      {getContent()}
    </SectionDiv>
  );
};

export default SynergeticUserPermissionsPanel;
