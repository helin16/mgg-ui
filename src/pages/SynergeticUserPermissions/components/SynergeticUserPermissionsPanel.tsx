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
import DocumentClassificationSearchPanel from './DocumentClassificationSearchPanel';
import SynUsersTable from './SynUsersTable';
import SynReportsPermissionTable from './SynReportsPermissionTable';
import SynReportsSearchPanel from './SynReportsSearchPanel';
import SynUserGroupsTable from './SynUserGroupsTable';

const SynergeticUserPermissionsPanel = () => {
  const [classifications, setClassifications] = useState<iSynLuDocumentClassification[]>([]);
  const [allClassifications, setAllClassifications] = useState<iSynLuDocumentClassification[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('Search');
  const [excludedUserIds, setExcludedUserIds] = useState<number[]>([]);
  const [reportCodes, setReportCodes] = useState<string[]>([]);
  const [selectedReportTab, setSelectedReportTab] = useState<string>('Search');
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
        setSelectedReportTab(configuredReportCodes[0] || 'Search');
        setSelectedTab(codes[0] || 'Search');
        setExcludedUserIds(module.settings?.excludedUserIds || []);

        // Fetch all classifications for the dropdown
        const configuredPromise = codes.length > 0 
          ? SynLuDocumentClassificationService.getAll({
              where: JSON.stringify({Code: codes}),
              perPage: 999999,
            })
          : Promise.resolve({
              currentPage: 1,
              perPage: 999999,
              from: 0,
              to: 0,
              total: 0,
              pages: 0,
              data: [] as iSynLuDocumentClassification[],
            });

        return Promise.all([
          SynLuDocumentClassificationService.getAll({
            perPage: 999999,
          }),
          configuredPromise,
        ]).then(([allResp, configuredResp]) => {
          const configurationMap = (configuredResp.data || []).reduce<{
            [key: string]: iSynLuDocumentClassification;
          }>((map: {[key: string]: iSynLuDocumentClassification}, classification: iSynLuDocumentClassification) => ({
            ...map,
            [classification.Code]: classification,
          }), {});

          return {
            allClassifications: allResp.data || [],
            configuredCodes: codes,
            configuredClassifications: configurationMap,
          };
        });
      })
      .then(result => {
        if (isCancelled) return;
        
        // Set all classifications for dropdown
        setAllClassifications(result.allClassifications);
        
        // Set only configured classifications for individual tabs
        const configuredClassifications = result.configuredCodes
          .map(code => result.configuredClassifications[code])
          .filter((classification): classification is iSynLuDocumentClassification => !!classification);
        
        setClassifications(configuredClassifications);
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
            classifications shown here, and exclude specific users, through <strong>Admin → Settings</strong> for this module.
          </Alert>
          {classifications.length <= 0 ? (
            <p className={'mt-3 mb-0'}>No document classifications have been configured.</p>
          ) : <Tabs
            activeKey={selectedTab}
            onSelect={key => setSelectedTab(key || 'Search')}
            variant={'pills'}
            className={'mt-3'}
            style={{marginLeft: 0}}
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
            <Tab eventKey={'Search'} title={'Search'}>
              <DocumentClassificationSearchPanel
                classifications={allClassifications}
                excludedUserIds={excludedUserIds}
              />
            </Tab>
          </Tabs>}
        </Tab>
        <Tab eventKey={'reports'} title={'Crystal Reports'}>
          <Alert
            variant={'info'}
            className={'mt-3 mb-0'}
            show={showReportsAlert}
            onClose={() => setShowReportsAlert(false)}
            dismissible
          >
            This view supports the review of user access to the Synergetic reports configured
            below. Administrators can add or remove report codes, and exclude specific users, through <strong>Admin → Settings</strong>.
          </Alert>
          {reportCodes.length <= 0 ? (
            <p className={'mt-3 mb-0'}>No reports have been configured.</p>
          ) : (
            <Tabs
              activeKey={selectedReportTab}
              onSelect={key => setSelectedReportTab(key || 'Search')}
              variant={'pills'}
              className={'mt-3'}
              style={{marginLeft: 0}}
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
              <Tab eventKey={'Search'} title={'Search'}>
                <SynReportsSearchPanel excludedUserIds={excludedUserIds} />
              </Tab>
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
            This view lists all Synergetic users (excluding those configured in <strong>Admin → Settings</strong>), their active staff status, and assigned user
            groups. Review these accounts regularly to confirm that access remains appropriate.
          </Alert>
          <SynUsersTable excludedUserIds={excludedUserIds} />
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
