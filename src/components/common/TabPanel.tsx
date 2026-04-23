import {Tab, Tabs} from 'react-bootstrap';
import {useState} from 'react';

type iTab = {
  title: string;
  key: string;
  content: any;
}

type iTabPanel = {
  tabs: iTab[];
  defaultKey?: string;
  className?: string;
}
const TabPanel = ({className, tabs, defaultKey}: iTabPanel) => {
  const defaultTab = defaultKey || (tabs.length <= 0 ? undefined : (tabs[0]).key);
  const [selectedTab, setSelectedTab] = useState(defaultTab);

  return (
    <Tabs
      className={className}
      activeKey={selectedTab}
      onSelect={k => setSelectedTab(k || defaultTab)}
      unmountOnExit
    >
      {
        tabs.map(tab => {
          return (
            <Tab title={tab.title} eventKey={tab.key} key={tab.key}>
              {tab.content}
            </Tab>
          )
        })
      }
    </Tabs>
  )
}

export default TabPanel;
