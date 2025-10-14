import iSynCommunicationTemplate from "../../../types/Synergetic/iSynCommunicationTemplate";
import styled from "styled-components";
import FormLabel from "../../../components/form/FormLabel";
import SectionDiv from "../../../components/common/SectionDiv";
import { useCallback, useEffect, useState } from "react";
import {Alert, Button, Dropdown, DropdownButton, FormControl} from "react-bootstrap";
import * as Icons from "react-bootstrap-icons";
import UtilsService from "../../../services/UtilsService";
import Toaster, {TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS} from "../../../services/Toaster";
import * as _ from "lodash";
import { FlexContainer } from "../../../styles";
import { mainBlue } from "../../../AppWrapper";
import LoadingBtn from "../../../components/common/LoadingBtn";
import InputGroup from "react-bootstrap/InputGroup";
import MailGunService from '../../../services/MailGun/MailGunService';
import EmailService from '../../../services/Email/EmailService';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/makeReduxStore';
import SynTagService from '../../../services/Synergetic/SynTagService';
import SynCommunityService from '../../../services/Synergetic/Community/SynCommunityService';
import SynPVCommunityService from '../../../services/Synergetic/Community/SynPVCommunityService';
import {HEADER_NAME_SELECTING_FIELDS} from '../../../services/AppService';
import iSynPVCommunity from '../../../types/Synergetic/Community/iSynPVCommunity';

export type iSynEmailRecipient = {
  email: string;
  name?: string;
};

type iSynEmailSendPanel = {
  template: iSynCommunicationTemplate;
  onSelect?: (recipients: iSynEmailRecipient[]) => void;
  onSentSuccess?: (recipients: iSynEmailRecipient[]) => void;
};

const Wrapper = styled.div`
  .preview-wrapper {
    padding: 1rem;
    max-height: calc(100vh - 20rem) !important;
    border: 1px #ccc solid;
    overflow: auto;
  }

  .recipients-wrapper {
    min-height: 6rem;
    .receipt-div {
      padding-top: 0.2rem;
      padding-bottom: 0.2rem;
      padding-right: 2rem;
      padding-left: 0.5rem;

      .btn-close {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        font-size: 12px;

        &:hover {
          background-color: ${mainBlue};
        }
      }
    }
  }
`;
const SynEmailSendPanel = ({ template, onSelect, onSentSuccess }: iSynEmailSendPanel) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipients, setRecipients] = useState<iSynEmailRecipient[]>([]);
  const [myTaggedCommunityProfiles, setMyTaggedCommunityProfiles] = useState<iSynPVCommunity[]>([]);
  const {user: currentUser} = useSelector((state: RootState) => state.auth);
  const [
    inputtingEmail,
    setInputtingEmail
  ] = useState<iSynEmailRecipient | null>(null);

  const handleSelect = useCallback(() => {
    onSelect && onSelect(recipients);
  }, [recipients, onSelect]);

  useEffect(() => {
    handleSelect();
  }, [recipients, handleSelect]);

  useEffect(() => {
    const networkLogin = `${currentUser?.SynCommunity?.NetworkLogin || ''}`.trim();
    if (networkLogin === '') {
      return;
    }

    const getData = async () => {
      const tags = await SynTagService.getAll({
        where: JSON.stringify({
          LoginName: `MGG\\${networkLogin}`,
        }),
        perPage: 9999999,
      });
      const synIds = (tags.data || []).map(i => i.ID);
      if (synIds.length <= 0) {
        return;
      }
      return SynPVCommunityService.getAll({
        where: JSON.stringify({
          ID: synIds,
        }),
        perPage: 9999999,
      }, {
        headers: {
          [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify(['ID', 'DefaultEmail', 'PreferredFormal'])
        },
      })
    }
    let isCanceled = false;
    setIsLoading(true);
    getData().then(resp => {
      if (isCanceled) { return }
      setMyTaggedCommunityProfiles(resp?.data || []);
    }).catch(err => {
      if (isCanceled) { return }
      Toaster.showApiError(err);
    }).finally(() => {
      if (isCanceled) { return }
      setIsLoading(false);
    })
    return () => {
      isCanceled = true;
    }
  }, [currentUser]);

  const getPreview = () => {
    if (showPreview !== true) {
      return null;
    }

    return (
      <SectionDiv className={"preview-wrapper"}>
        <div dangerouslySetInnerHTML={{ __html: template.MessageBody }}></div>
      </SectionDiv>
    );
  };

  const getRecipientDivs = () => {
    if (recipients.length === 0) {
      return (
        <SectionDiv className={"text-center recipients-wrapper"}>
          <small>Use above input boxes to add at least on recipient</small>
        </SectionDiv>
      );
    }

    return (
      <SectionDiv className="recipients-wrapper">
        <div>
          <small>{recipients.length} recipient(s) selected</small>
        </div>
        <FlexContainer className="gap-2">
          {recipients.map(recipient => {
            return (
              <Alert
                key={recipient.email}
                className={"receipt-div"}
                variant="primary"
                dismissible
                onClose={() =>
                  setRecipients(
                    recipients.filter(rec => recipient.email !== rec.email)
                  )
                }
              >
                {`${recipient.name || ""}`.trim() === ""
                  ? recipient.email || ""
                  : `${recipient.name} <${recipient.email}>`}
              </Alert>
            );
          })}
        </FlexContainer>
      </SectionDiv>
    );
  };

  const sendEmails = (func: (data: any) => Promise<{success: boolean}>) => {
    const data = {
      CommunicationTemplatesSeq: template.CommunicationTemplatesSeq,
      recipients: recipients.filter(recipient => `${recipient.email || ''}`.trim() !== ''),
    }
    setIsSending(true);
    func(data)
      .then(res => {
        if (res.success !== true) {
          return;
        }
        setIsSending(false);
        Toaster.showToast(`${data.recipients.length} email(s) has been successfully queued.`, TOAST_TYPE_SUCCESS);
        onSentSuccess && onSentSuccess(data.recipients);
      })
      .catch(err => {
        setIsSending(false);
        Toaster.showToast(err)
      })
  }

  const getBtnsDiv = () => {
    return (
      <FlexContainer className="justify-content-between gap-2 align-items-end space-above">
        <div>
          <Button
            variant={"link"}
            size={"sm"}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview === true ? (
              <>
                <Icons.CaretUpFill /> Hide Preview
              </>
            ) : (
              <>
                <Icons.CaretDownFill /> Show Preview
              </>
            )}
          </Button>
        </div>
        <div>
          {recipients.length > 0 && (
            <>
              <Button variant={"link"} onClick={() => setRecipients([])}>
                <Icons.XLg /> Clear
              </Button>
              <ButtonGroup>
                <LoadingBtn variant={"primary"} isLoading={isLoading || isSending} onClick={() => sendEmails(EmailService.sendHtml)}>
                  <Icons.Send /> Send to {recipients.length} recipient(s)
                </LoadingBtn>
                <DropdownButton as={ButtonGroup} title={''}>
                  <Dropdown.Item eventKey="1">
                    <LoadingBtn variant={"danger"} isLoading={isLoading || isSending} onClick={() => sendEmails(MailGunService.sendHtml)}>
                      <Icons.Send /> Using MailGun to send to {recipients.length} recipient(s)
                    </LoadingBtn>
                  </Dropdown.Item>
                </DropdownButton>
              </ButtonGroup>
            </>
          )}
        </div>
      </FlexContainer>
    );
  };

  const addingRecipients = (recipients: iSynEmailRecipient[]) => {
    const recipientsWithEmail = recipients.filter(recipient => `${recipient.email || ""}`.trim() !== "");
    if (recipientsWithEmail.length <= 0) {
      return;
    }
    const recipientsWithEmailWithValidEmail = [];
    for (const recipient of recipientsWithEmail) {
      if (!UtilsService.validateEmail(recipient.email)) {
        Toaster.showToast(`Invalid email ${recipient.email}`, TOAST_TYPE_ERROR);
        continue;
      }
      recipientsWithEmailWithValidEmail.push(recipient);
    }
    const uniqueReceipts = _.uniqBy(
      [...recipientsWithEmailWithValidEmail, ...recipients].filter(
        recipient => `${recipient?.email || ""}`.trim() !== ""
      ),
      recipient => recipient?.email || ""
    );
    setRecipients(uniqueReceipts);
    setInputtingEmail(null);
    return;
  };

  const getLoadTagListBtn = () => {
    if (myTaggedCommunityProfiles.length <= 0) {
      return null;
    }
    return (
      <SectionDiv>
        <LoadingBtn
          isLoading={isLoading || isSending}
          variant={"primary"}
          onClick={() => {
            addingRecipients(myTaggedCommunityProfiles.map(myTaggedCommunityProfile => ({
                  email: myTaggedCommunityProfile.DefaultEmail,
                  name: `${myTaggedCommunityProfile.PreferredFormal || ''}`.trim(),
                }) ))
          }}
        >
          <FlexContainer className={'gap-1 align-items-center justify-content-center'}>
            <Icons.Download /><span>Load from my Synergetic tag list</span>
          </FlexContainer>
        </LoadingBtn>
      </SectionDiv>
    )
  }

  return (
    <Wrapper>
      <div>
        <FormLabel label={"Recipients"} isRequired />
        <FlexContainer className={'gap-1 align-items-center justify-content-start'}>
          <FormControl
            placeholder={"email address: test@test.com"}
            value={inputtingEmail?.email || ""}
            onChange={event =>
              setInputtingEmail({
                ...(inputtingEmail || {}),
                email: event.target.value || ""
              })
            }
            onKeyDown={event => {
              if (event.key !== "Enter" || !inputtingEmail) {
                return;
              }
              addingRecipients([inputtingEmail]);
            }}
          />
          <FormControl
            placeholder={"Name"}
            value={inputtingEmail?.name || ""}
            onKeyDown={event => {
              if (event.key !== "Enter" || !inputtingEmail) {
                return;
              }
              addingRecipients([inputtingEmail]);
            }}
            onChange={event =>
              setInputtingEmail({
                email: inputtingEmail?.email || "",
                ...(inputtingEmail || {}),
                name: event.target.value || ""
              })
            }
          />
          <LoadingBtn
            isLoading={isLoading || isSending}
            variant={"secondary"}
            onClick={() => {
              inputtingEmail && addingRecipients([inputtingEmail]);
            }}
          >
            <FlexContainer className={'gap-1 align-items-center justify-content-center'}>
              <Icons.Plus /><span>Add</span>
            </FlexContainer>
          </LoadingBtn>
        </FlexContainer>
        {getLoadTagListBtn()}
        {getRecipientDivs()}
        {getBtnsDiv()}
      </div>
      {getPreview()}
    </Wrapper>
  );
};

export default SynEmailSendPanel;
