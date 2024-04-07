import styled from "styled-components";
import { FormControl } from "react-bootstrap";
import { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import * as Icons from "react-bootstrap-icons";
import LoadingBtn from "../common/LoadingBtn";
import SynCommunityService from "../../services/Synergetic/Community/SynCommunityService";
import FormErrorDisplay, { iErrorMap } from "../form/FormErrorDisplay";
import Toaster from "../../services/Toaster";
import iSynCommunity from '../../types/Synergetic/iSynCommunity';
import UtilsService from '../../services/UtilsService';

const Wrapper = styled.div``;

type iSynergeticIDCheckPanel = {
  className?: string;
  onValid: (communityProfile: iSynCommunity) => void;
  onInvalid: () => void;
  onClear?: () => void;
};
const SynergeticIDCheckPanel = ({
  className,
  onClear,
  onValid,
                                  onInvalid
}: iSynergeticIDCheckPanel) => {
  const [synId, setSynId] = useState("");
  const [synProfile, setSynProfile] = useState<iSynCommunity | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMap, setErrorMap] = useState<iErrorMap>({});
  const handleOnClear = () => {
    if (!onClear) {
      return;
    }
    setErrorMap({});
    setSynProfile(null);
    setSynId("");
    onClear();
  };

  const getClearBtn = () => {
    if (!onClear || `${synId || ""}`.trim() === "") {
      return;
    }
    return (
      <LoadingBtn
        size={"sm"}
        variant={"outline-secondary"}
        onClick={() => handleOnClear()}
        isLoading={isChecking}
      >
        <Icons.X /> Clear
      </LoadingBtn>
    );
  };

  const preValidate = () => {
    const errors: iErrorMap = {};
    const synStr = `${synId || ""}`.trim();
    if (synStr === "") {
      errors.synId = "Type in a synergetic ID first.";
    } else if (UtilsService.isNumeric(synStr) !== true) {
      errors.synId = "Synergetic ID is a number.";
    }


    setErrorMap(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOnValidate = () => {
    if (preValidate() !== true) {
      return;
    }

    setIsChecking(true);
    SynCommunityService.getCommunityProfiles({
      where: JSON.stringify({
        ID: synId
      }),
      perPage: 1
    })
      .then(resp => {
        const data = resp.data || [];
        setSynProfile(data.length > 0 ? data[0] : null);
        if (data.length <= 0) {
          setErrorMap({
            ...errorMap,
            synId: `Invalid Syn ID: ${synId}`,
          })
          onInvalid();
          return;
        }
        onValid(data[0]);
      })
      .catch(err => {
        Toaster.showApiError(err);
      })
      .finally(() => {
        setIsChecking(false);
      });
  };

  const getProfileInfoPanel = () => {
    if (!synProfile) {
      return null;
    }

    return <div className={'text-success'}>Valid: <small>{synProfile.Given1} {synProfile.Given2} {synProfile.Surname} ({synProfile.Preferred}). DOB: {synProfile.BirthDate?.replace('T00:00:00.000Z', '')}</small></div>
  }

  return (
    <Wrapper className={className}>
      <InputGroup>
        <FormControl
          placeholder={"Synergetic ID"}
          value={synId}
          isInvalid={"synId" in errorMap}
          onChange={event => setSynId(event.target.value || "")}
        />
        {getClearBtn()}
        <LoadingBtn
          size={"sm"}
          isLoading={isChecking}
          onClick={() => handleOnValidate()}
        >
          <Icons.Search /> Validate
        </LoadingBtn>
      </InputGroup>
      <FormErrorDisplay errorsMap={errorMap} fieldName={"synId"} />
      {getProfileInfoPanel()}
    </Wrapper>
  );
};

export default SynergeticIDCheckPanel;
