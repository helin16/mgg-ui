import iSynVStudentContactAllAddress from '../../../types/Synergetic/iSynVStudentContactAllAddress';

type iParentDirectoryRow = {
  contact: iSynVStudentContactAllAddress;
}
const ParentDirectoryRow = ({contact}: iParentDirectoryRow) => {
  return (
    <div className={'row parent-directory-row'}>
      <div className={'small-12 columns'}>
          <h2 className={'subheader'}>{contact.StudentName} ({contact.StudentHouseDescription})</h2>
      </div>
      <div className={'large-6 columns end'}>
         <table>
           <tbody>
              <tr><td>Name</td><td>{contact.StudentContactNameExternal}</td></tr>
              <tr><td>Mobile</td><td>{contact.StudentContactDefaultMobilePhone}</td></tr>
              <tr><td>Email</td><td>{contact.StudentContactDefaultEmail}</td></tr>
           </tbody>
         </table>
      </div>
      <div className={'large-6 columns end'}>
        <table>
          <tbody>
          <tr><td>Name</td><td>{contact.StudentContactSpouseNameExternal}</td></tr>
          <tr><td>Mobile</td><td>{contact.StudentContactSpouseDefaultMobilePhone}</td></tr>
          <tr><td>Email</td><td>{contact.StudentContactSpouseDefaultEmail}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ParentDirectoryRow;
