import iFinanceDebitorLinkedStudent from './iFinanceDebitorLinkedStudent';
import iSynVDebtor from "./iSynVDebtor";

type iFinanceDebitorListRow = iSynVDebtor & {
    DebitorSpouseEmail: string;
    DebitorSpouseMobilePhone: string;
    DebitorSpouseOccupPhone: string;
    DebitorSpouseOccupMobilePhone: string;
    DebitorSpouseOccupEmail: string;
    students: iFinanceDebitorLinkedStudent[];
};

export default iFinanceDebitorListRow;
