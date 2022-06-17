
export type iErrorMap = {[key: string]: string | string[]};
type iFormErrorDisplay = {
  errorsMap: iErrorMap,
  fieldName: string;
}
const FormErrorDisplay = ({fieldName, errorsMap}: iFormErrorDisplay) => {
  if (!(fieldName in errorsMap)) {
    return null;
  }

  const getErrorString = () => {
    if (Array.isArray(errorsMap[fieldName])) {
      // @ts-ignore
      return errorsMap[fieldName].join(', ');
    }
    return errorsMap[fieldName];
  }
  return <div><small className={'text-danger'}>{getErrorString()}</small></div>
}

export default FormErrorDisplay;
