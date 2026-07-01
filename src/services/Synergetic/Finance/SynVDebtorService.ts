import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynVDebtor from '../../../types/Synergetic/Finance/iSynVDebtor';
import iFinanceDebitorSearchCriteria from '../../../types/Synergetic/Finance/iFinanceDebitorSearchCriteria';
import iFinanceDebitorLinkedStudent from '../../../types/Synergetic/Finance/iFinanceDebitorLinkedStudent';
import SynVStudentService from '../Student/SynVStudentService';
import iSynVStudentContactAllAddress from '../../../types/Synergetic/Student/iSynVStudentContactAllAddress';
import SynVStudentContactAllAddressService from '../Student/SynVStudentContactAllAddressService';
import {iVPastAndCurrentStudent} from '../../../types/Synergetic/Student/iVStudent';
import {OP_AND, OP_LIKE, OP_OR} from '../../../helper/ServiceHelper';
import * as _ from 'lodash';
import iFinanceDebitorListRow from "../../../types/Synergetic/Finance/iFinanceDebitorListRow";


const endPoint = '/syn/vDebtor'
const getAll =  (params: iConfigParams = {}): Promise<iPaginatedResult<iSynVDebtor>> => {
  return AppService.get(endPoint, params).then(resp => resp.data);
};

const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 99999;

const getSearchText = (criteria: Partial<iFinanceDebitorSearchCriteria>) => {
  return `${criteria.searchText || ''}`.trim();
};

const getStringList = (values: Array<string | null | undefined>) => {
  return _.uniq(
    values
      .map(value => `${value || ''}`.trim())
      .filter(value => value !== '')
  );
};

const getStudentSummariesMap = (students: iVPastAndCurrentStudent[]) => {
  return students.reduce<{[key: string]: iFinanceDebitorLinkedStudent[]}>((map, student) => {
    const debtorId = `${student.DebtorID || ''}`.trim();
    if (debtorId === '') {
      return map;
    }

    const nextStudent: iVPastAndCurrentStudent = student;
    const current = map[debtorId] || [];
    const hasExisting = current.some((item: iVPastAndCurrentStudent) => item.StudentID === nextStudent.StudentID);
    return {
      ...map,
      [debtorId]: hasExisting ? current : [...current, nextStudent],
    };
  }, {});
};

const getContactRowsMap = (
  contactRows: iSynVStudentContactAllAddress[],
  students: iVPastAndCurrentStudent[]
) => {
  const studentMap = students.reduce<{[key: string]: iVPastAndCurrentStudent}>((map, student) => ({
    ...map,
    [`${student.StudentID}`]: student,
  }), {});

  return contactRows.reduce<{[key: string]: iSynVStudentContactAllAddress[]}>((map, row) => {
    const student = studentMap[`${row.StudentID}`];
    const debtorId = `${student?.DebtorID || ''}`.trim();
    if (debtorId === '') {
      return map;
    }

    const current = map[debtorId] || [];
    return {
      ...map,
      [debtorId]: [...current, row],
    };
  }, {});
};

const getDebtorIdsFromSpouseEmail = async (searchText: string) => {
  if (`${searchText}`.trim() === '') {
    return [];
  }

  const likeText = `%${searchText}%`;
  const contactResp = await SynVStudentContactAllAddressService.getAll({
    where: JSON.stringify({
      [OP_OR]: [
        {StudentContactSpouseEmail: {[OP_LIKE]: likeText}},
        {StudentContactSpouseDefaultEmail: {[OP_LIKE]: likeText}},
        {StudentContactSpouseOccupEmail: {[OP_LIKE]: likeText}},
      ],
    }),
    perPage: MAX_PER_PAGE,
  });

  const studentIds = _.uniq((contactResp.data || []).map(row => row.StudentID).filter(Boolean));
  if (studentIds.length <= 0) {
    return [];
  }

  const studentsResp = await SynVStudentService.getVPastAndCurrentStudentAll({
    where: JSON.stringify({
      StudentID: studentIds,
    }),
    perPage: MAX_PER_PAGE,
  });

  return _.uniq(
    (studentsResp.data || [])
      .map(student => student.DebtorID)
      .filter(id => `${id || ''}`.trim() !== '')
  );
};

const getWhere = async (criteria: Partial<iFinanceDebitorSearchCriteria>) => {
  const filters: any[] = [];
  const searchText = getSearchText(criteria);

  if (`${criteria.selectedStudentDebtorId || ''}`.trim() !== '') {
    filters.push({DebtorID: criteria.selectedStudentDebtorId});
  }

  if (searchText !== '') {
    const likeText = `%${searchText}%`;
    const debtorIdsBySpouseEmail = await getDebtorIdsFromSpouseEmail(searchText);
    const searchClauses: any[] = [
      {DebtorSurname: {[OP_LIKE]: likeText}},
      {DebtorGiven1: {[OP_LIKE]: likeText}},
      {DebtorPreferred: {[OP_LIKE]: likeText}},
      {DebtorHomeEmail: {[OP_LIKE]: likeText}},
      {DebtorOccupEmail: {[OP_LIKE]: likeText}},
      {DebtorHomePhone: {[OP_LIKE]: likeText}},
      {DebtorMobilePhone: {[OP_LIKE]: likeText}},
      {DebtorOccupPhone: {[OP_LIKE]: likeText}},
      {DebtorOccupMobilePhone: {[OP_LIKE]: likeText}},
      {DebtorSpouseSurname: {[OP_LIKE]: likeText}},
      {DebtorSpouseGiven1: {[OP_LIKE]: likeText}},
      {DebtorSpousePreferred: {[OP_LIKE]: likeText}},
      {DebtorSpouseMobilePhone: {[OP_LIKE]: likeText}},
      {DebtorSpouseOccupPhone: {[OP_LIKE]: likeText}},
      {DebtorSpouseOccupMobilePhone: {[OP_LIKE]: likeText}},
    ];

    if (debtorIdsBySpouseEmail.length > 0) {
      searchClauses.push({DebtorID: debtorIdsBySpouseEmail});
    }

    filters.push({
      [OP_OR]: searchClauses,
    });
  }

  if (filters.length <= 0) {
    return {};
  }
  if (filters.length === 1) {
    return filters[0];
  }

  return {
    [OP_AND]: filters,
  };
};

const getFinanceDebitors = async (
  criteria: Partial<iFinanceDebitorSearchCriteria> = {}
): Promise<iPaginatedResult<iFinanceDebitorListRow>> => {
  const where = await getWhere(criteria);
  const debtorsResp = await getAll({
    currentPage: criteria.currentPage || 1,
    perPage: criteria.perPage || DEFAULT_PER_PAGE,
    sort: 'DebtorNameExternal:ASC',
    ...(Object.keys(where).length > 0 ? {where: JSON.stringify(where)} : {}),
  });

  const debtors = debtorsResp.data || [];
  const debtorIds = _.uniq(debtors.map(row => row.DebtorID).filter(Boolean));

  if (debtorIds.length <= 0) {
    return {
      ...debtorsResp,
      data: [],
    };
  }

  const studentsResp = await SynVStudentService.getVPastAndCurrentStudentAll({
    where: JSON.stringify({
      DebtorID: debtorIds,
    }),
    perPage: MAX_PER_PAGE,
    sort: 'StudentSurname:ASC,StudentGiven1:ASC',
  });
  const students = studentsResp.data || [];
  const studentIds = _.uniq(students.map(student => student.StudentID).filter(Boolean));
  const contactResp = studentIds.length <= 0
    ? {data: [] as iSynVStudentContactAllAddress[]}
    : await SynVStudentContactAllAddressService.getAll({
      where: JSON.stringify({
        StudentID: studentIds,
      }),
      perPage: MAX_PER_PAGE,
    });

  const studentMap = getStudentSummariesMap(students);
  const contactMap = getContactRowsMap(contactResp.data || [], students);

  return {
    ...debtorsResp,
    data: debtors.map(debtor => {
      const contacts = contactMap[`${debtor.DebtorID}`] || [];

      return {
        ...debtor,
        DebitorSpouseMobilePhone: getStringList([
          debtor.DebtorSpouseMobilePhone,
          ...contacts.map(row => row.StudentContactSpouseMobilePhone),
        ]).join(', '),
        DebitorSpouseEmail: getStringList(contacts.map(row => row.StudentContactSpouseEmail)).join(', '),
        DebitorSpouseOccupPhone: getStringList([
          debtor.DebtorSpouseOccupPhone,
          ...contacts.map(row => row.StudentContactSpouseOccupPhone),
        ]).join(', '),
        DebitorSpouseOccupMobilePhone: getStringList([
          debtor.DebtorSpouseOccupMobilePhone,
          ...contacts.map(row => row.StudentContactSpouseOccupMobilePhone),
        ]).join(', '),
        DebitorSpouseOccupEmail: getStringList(contacts.map(row => row.StudentContactSpouseOccupEmail)).join(', '),
        students: studentMap[`${debtor.DebtorID}`] || [],
      };
    }),
  };
};

const SynVDebtorService = {
  getAll,
  getFinanceDebitors,
};

export default SynVDebtorService;
