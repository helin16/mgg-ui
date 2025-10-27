import React, {useState} from "react";
import styled from "styled-components";
import iModule from '../../types/modules/iModule';
import SectionDiv from '../common/SectionDiv';
import ExplanationPanel from '../ExplanationPanel';
import ModuleEditPanel from '../module/ModuleEditPanel';
import {MGGS_MODULE_ID_MY_CLASS_LIST} from '../../types/modules/iModuleUser';
import {ROLE_ID_ADMIN} from '../../types/modules/iRole';
import SchoolBoxHelper from '../../helper/SchoolBoxHelper';
import SchoolBoxUrls from '../../layouts/SchoolBox/SchoolBoxUrls';
import RichTextEditor from '../common/RichTextEditor/RichTextEditor';
import {Badge, Button, FormControl, Tab, Tabs} from 'react-bootstrap';
import {FlexContainer} from '../../styles';
import InputGroup from 'react-bootstrap/InputGroup';
import * as Icons from 'react-bootstrap-icons';
import * as _ from 'lodash';

enum TabKeys {
  excludingNames = 'excludingNames',
  preList = 'preList',
  postList = 'postList',
}
const Wrapper = styled.div``;
type iEditPanel = {
  settings: any;
  activeTabKey: TabKeys;
  onTabSelected: (key: TabKeys) => void;
  onUpdate: (data: any) => void;
};
const EditPanel = ({ settings: studentBookListConfig, onUpdate, activeTabKey, onTabSelected }: iEditPanel) => {
  type iAddHidingState = {isAdding: boolean; newName?: string};
  const defaultAddHidingState: iAddHidingState = {isAdding: false};
  const [addingNewHidingName, setAddingNewHidingName] = useState<iAddHidingState>(defaultAddHidingState);

  const handleUpdate = (newData = {}) => {
    setAddingNewHidingName(defaultAddHidingState);
    onUpdate({
      ...studentBookListConfig,
      ...newData,
    });
  };

  const { relative } = SchoolBoxHelper.getModuleUrl(SchoolBoxUrls.StudentBookList)
  return (
    <Wrapper>
      <SectionDiv>
        <h5>Student Subject / Book List</h5>
        <ExplanationPanel
          text={<>
            <i>This module is design to get the latest subject names for a student. so that she can start buy books for next year.</i>
            <div>It will read from the published .tfx file from the TimeTable Config, <b>without</b> importing the whole timetable file.</div>
            Settings for managing the Student Subject/Book List: {relative}?synId=<b>[profileExternalId]</b>
          </>}
        />
      </SectionDiv>
      <Tabs activeKey={activeTabKey} onSelect={(key) => onTabSelected(key as TabKeys || TabKeys.excludingNames)}>
        <Tab title={'Hiding Names'} eventKey={TabKeys.excludingNames}>
          <SectionDiv>the Subject / Book list will <b>HIDE</b> all subjects with name containing any of the words: </SectionDiv>
          <FlexContainer className={'align-items-start justify-content-start gap-1 space-below'}>
            {
              (studentBookListConfig.hideNames || []).map((item: string, index: number) => (
                <h4>
                  <Badge key={index} bg="secondary">
                    <FlexContainer className={'align-items-center justify-content-start gap-1'}>
                      <span>{item}</span>
                      <Icons.X className={'cursor-pointer'} onClick={() => {
                        handleUpdate({
                          hideNames: (studentBookListConfig.hideNames || []).filter((str: string) => `${str || ''}`.trim() !== `${item || ''}`.trim())
                        })
                      }}/>
                    </FlexContainer>
                  </Badge>
                </h4>
              ))
            }
            {
              addingNewHidingName.isAdding === true ? (
                <InputGroup size="sm">
                  <FormControl
                    placeholder={'new word to hide the subject'}
                    value={addingNewHidingName.newName || ''}
                    onChange={(e) => setAddingNewHidingName(prev => ({...prev, newName: e.target.value}))}
                  />
                  <Button
                    variant={'secondary'}
                    onClick={() => {
                      handleUpdate({
                        hideNames: _.uniq([...studentBookListConfig.hideNames || [], addingNewHidingName.newName].filter(str => `${str || ''}`.trim() !== ''))
                      })
                    }}
                  >
                    Add
                  </Button>
                  <Button variant={'outline-secondary'} onClick={() => setAddingNewHidingName(defaultAddHidingState)}>Cancel</Button>
                </InputGroup>
              ): (
                <Button
                  size="sm"
                  variant="outline-secondary" onClick={() => setAddingNewHidingName({...defaultAddHidingState, isAdding: true})}
                >
                  <Icons.Plus />
                </Button>
              )
            }
          </FlexContainer>
        </Tab>
        <Tab title={'Pre-list explanations'} eventKey={TabKeys.preList}>
          <SectionDiv>Below wording will be displayed <b>ABOVE</b> the Subject / Book list</SectionDiv>
          <RichTextEditor
            key={'pre-list'}
            value={studentBookListConfig.preListText || ''}
            onChange={(newValue) => {
              handleUpdate({ preListText: newValue });
            }}
          />
        </Tab>
        <Tab title={'Post-list explanations'} eventKey={TabKeys.postList}>
          <SectionDiv>Below wording will be displayed <b>BELOW</b> the Subject / Book list</SectionDiv>
          <RichTextEditor
            key={'post-list'}
            value={studentBookListConfig.postListText || ''}
            onChange={(newValue) => {
              handleUpdate({ postListText: newValue });
            }}
          />
        </Tab>
      </Tabs>
    </Wrapper>
  );
};
const StudentSubjectListModuleSettings = () => {
  const [settings, setSettings] = useState(undefined);
  const [selectedTab, setSelectedTab] = useState<TabKeys>(TabKeys.excludingNames);

  const getContent = (module: iModule) => {
    const { studentBookList } = module?.settings || {};
    return (
      <EditPanel
        activeTabKey={selectedTab}
        onTabSelected={setSelectedTab}
        settings={settings || studentBookList}
        onUpdate={(newSettings: any) => setSettings(newSettings)}
      />
    );
  };

  return (
    <ModuleEditPanel
      moduleId={MGGS_MODULE_ID_MY_CLASS_LIST}
      roleId={ROLE_ID_ADMIN}
      getChildren={getContent}
      getSubmitData={() => ({studentBookList: settings})}
    />
  );
};

export default StudentSubjectListModuleSettings;
