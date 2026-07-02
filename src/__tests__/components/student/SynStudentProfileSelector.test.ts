import {getStudentOption} from '../../../components/student/SynStudentProfileSelector';

describe('SynStudentProfileSelector', () => {
  test('marks past students in option labels', () => {
    expect(getStudentOption({
      StudentID: 'S101',
      StudentGiven1: 'Ada',
      StudentSurname: 'Lovelace',
      StudentIsPastFlag: true,
    } as any).label).toBe('[Past] [S101] Ada Lovelace');

    expect(getStudentOption({
      StudentID: 'S102',
      StudentGiven1: 'Grace',
      StudentSurname: 'Hopper',
      StudentIsPastFlag: false,
    } as any).label).toBe('[S102] Grace Hopper');
  });
});
