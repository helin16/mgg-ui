import React, {useState} from "react";
import ModuleEditPanel from "../../../components/module/ModuleEditPanel";
import {MGGS_MODULE_ID_MGG_APP_DEVICES} from "../../../types/modules/iModuleUser";
import {ROLE_ID_ADMIN} from "../../../types/modules/iRole";
import iModule from "../../../types/modules/iModule";
import SectionDiv from "../../../components/common/SectionDiv";
import ExplanationPanel from "../../../components/ExplanationPanel";
import {FormControl} from "react-bootstrap";

export const getHostsFromValue = (value: string) => {
  const hosts = `${value || ''}`
    .split('\n')
    .map(host => `${host || ''}`.trim().toLowerCase())
    .filter(host => host !== '');
  return [...new Set(hosts)];
};

const MggDevicesBypassHostsSettings = () => {
  const [bypassHosts, setBypassHosts] = useState<string[] | null>(null);

  const getChildren = (module: iModule) => {
    const currentHosts = bypassHosts || module.settings?.bypassHosts || [];
    const hostsValue = currentHosts.join('\n');

    return (
      <SectionDiv>
        <h5>Bypass Hosts</h5>
        <ExplanationPanel
          variant={'info'}
          text={(
            <>
              <div>Enter one hostname per line.</div>
              <div>When a SchoolBox remote URL decodes to one of these hosts, the loader will keep the default SchoolBox iframe behaviour instead of booting the React app.</div>
            </>
          )}
        />
        <FormControl
          as={'textarea'}
          rows={8}
          value={hostsValue}
          onChange={(event) => setBypassHosts(getHostsFromValue(event.target.value))}
          placeholder={'www.mcbschools.com'}
        />
      </SectionDiv>
    );
  };

  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_MGG_APP_DEVICES}
      roleId={ROLE_ID_ADMIN}
      getChildren={getChildren}
      getSubmitData={() => ({bypassHosts: bypassHosts || []})}
    />
  );
};

export default MggDevicesBypassHostsSettings;
