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

const SynergeticUserPermissionsPanel = () => {
  const [classifications, setClassifications] = useState<iSynLuDocumentClassification[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [excludedUserIds, setExcludedUserIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    MggsModuleService.getModule(MGGS_MODULE_ID_SYNERGETIC_USER_PERMISSIONS)
      .then(module => {
        const codes: string[] = module.settings?.documentClassificationCodes || [];
        setExcludedUserIds(module.settings?.excludedUserIds || []);
        if (codes.length <= 0) return [];

        return SynLuDocumentClassificationService.getAll({
          where: JSON.stringify({Code: codes}),
          perPage: 1000,
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

    if (classifications.length <= 0) {
      return <p className={'mb-0'}>No document classifications have been configured.</p>;
    }

    return (
      <Tabs defaultActiveKey={'docMan'} unmountOnExit>
        <Tab eventKey={'docMan'} title={'DocMan'}>
          <Alert variant={'info'} className={'mt-3 mb-0'} dismissible>
            This view supports the review of user permissions for DocMan access across the
            document classifications listed below. Administrators can add or remove the
            classifications shown here through <strong>Admin → Settings</strong> for this module.
          </Alert>
          <Tabs
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
          </Tabs>
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
