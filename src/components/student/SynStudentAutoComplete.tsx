import AutoComplete, {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import Toaster from '../../services/Toaster';
import SynVStudentService from '../../services/Synergetic/Student/SynVStudentService';
import {HEADER_NAME_SELECTING_FIELDS} from '../../services/AppService';
import SynVFutureStudentService from '../../services/Synergetic/SynVFutureStudentService';
import {Spinner} from 'react-bootstrap';
import {OP_LIKE, OP_OR} from '../../helper/ServiceHelper';
import UtilsService from '../../services/UtilsService';

type iSynStudentAutoComplete = {
  id?: string;
  onSelect?: (option: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  values?: number[] | null;
  allowClear?: boolean;
  isDisabled?: boolean;
  isMulti?: boolean;
}

type iStudent = {
  ID: number;
  Given1: string;
  Surname: string;
  Preferred: string | null;
}
type iStudentMap = {[key: number]: iStudent};
const SynStudentAutoComplete = ({values, isDisabled, onSelect, allowClear, isMulti}: iSynStudentAutoComplete) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preSelectedValues, setPreSelectedValues] = useState<iStudent[]>([]);

  const doSearch = async (currentAndPastSearchCriteria = {}, futureSearchCriteria = {}): Promise<iStudentMap> => {
    if (Object.keys(currentAndPastSearchCriteria).length <= 0 || Object.keys(futureSearchCriteria).length <= 0) {
      return {};
    }
   const results = await Promise.all([
      SynVStudentService.getCurrentVStudents({
        where: JSON.stringify(currentAndPastSearchCriteria),
        perPage: 99999,
      }, {
        [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify(["StudentID", 'StudentSurname', 'StudentGiven1', 'StudentPreferred'])
      }),
      SynVFutureStudentService.getAll({
        where: JSON.stringify(futureSearchCriteria), //{FutureID: ids},
        perPage: 99999,
      }, {
        [HEADER_NAME_SELECTING_FIELDS]: JSON.stringify(["FutureID", 'FutureSurname', 'StudentGiven1', 'FuturePreferred'])
      }),
    ])

    const currentAndPasts = results[0] || [];
    // @ts-ignore
    const studentMap = currentAndPasts.reduce((map: iStudentMap, student) => {
      return {
        ...map,
        [student.StudentID]: {
          ID: student.StudentID,
          Given1: student.StudentGiven1,
          Surname: student.StudentSurname,
          Preferred: student.StudentPreferred,
        }
      }
    }, {});
    const futures = results[1].data || [];

    // @ts-ignore
    const futureMap = futures.reduce((map: iStudentMap, student) => {
      return {
        ...map,
        [student.FutureID]: {
          ID: student.FutureID,
          Given1: student.FutureGiven1,
          Surname: student.FutureSurname,
          Preferred: student.FuturePreferred,
        }
      }
    }, {});

    return {
      ...futureMap,
      ...studentMap,
    }
  }

  useEffect(() => {
    const ids = (values || []);
    if (ids.length <= 0) {
      setPreSelectedValues([]);
      return;
    }
    let isCanceled = false;
    setIsLoading(true);
    doSearch({StudentID: ids}, {FutureID: ids})
      .then(resp => {
        if (isCanceled) return;
        // @ts-ignore
        setPreSelectedValues(Object.values(resp));
      })
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      })
  }, [values]);

  const handleSearchFn = (searchText: string) => {
    let currentWhere: any = {
      [OP_OR]: [
        {StudentNameInternal: { [OP_LIKE]: `%${searchText}%` }},
        {StudentNameExternal: { [OP_LIKE]: `%${searchText}%` }},
        {StudentPreferredFormal: { [OP_LIKE]: `%${searchText}%` }},
        {StudentOccupEmail: { [OP_LIKE]: `%${searchText}%` }},
      ]
    };
    let futureWhere: any = {
      [OP_OR]: [
        {FutureNameInternal: { [OP_LIKE]: `%${searchText}%` }},
        {FutureNameExternal: { [OP_LIKE]: `%${searchText}%` }},
        {FuturePreferredFormal: { [OP_LIKE]: `%${searchText}%` }},
        {FutureOccupEmail: { [OP_LIKE]: `%${searchText}%` }},
      ]
    };
    if (UtilsService.isNumeric(searchText)) {
      currentWhere = {StudentID: searchText};
      futureWhere = {FutureID: searchText};
    }
    return doSearch(currentWhere, futureWhere).then(resp => {
      return Object.values(resp);
    })
  }

  const convertToOption = (student: iStudent) => {
    return {
      label: `[${student.ID}] ${student.Given1} ${student.Surname}`,
      data: student,
      value: student.ID,
    }
  }

  const renderOptionItem = (options: iStudent[]) => {
    return options.map(student => convertToOption(student));
  }

  if (isLoading) {
    return <Spinner animation={'border'} />
  }

  return (
    <AutoComplete
      isDisabled={isDisabled}
      isMulti={isMulti}
      onSelected={onSelect}
      allowClear={allowClear}
      value={preSelectedValues ? preSelectedValues.map(preSelectedValue => convertToOption(preSelectedValue)) : undefined}
      placeholder={'Search Student ...'}
      handleSearchFn={handleSearchFn}
      renderOptionItemFn={renderOptionItem}
    />
  )
}

export default SynStudentAutoComplete;
