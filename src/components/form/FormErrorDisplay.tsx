
export type iErrorMap = any;
type iFormErrorDisplay = {
  errorsMap: iErrorMap,
  fieldName: string;
  errorMsg?: string;
}
const FormErrorDisplay = ({fieldName, errorsMap, errorMsg}: iFormErrorDisplay) => {
  if (!(fieldName in errorsMap)) {
    return null;
  }

  const getErrorString = () => {
    if (Array.isArray(errorsMap[fieldName])) {
      // @ts-ignore
      return errorsMap[fieldName].join(', ');
    }
    const msg = `${errorMsg || ''}`.trim();
    if (msg !== '') {
      return msg;
    }
    return errorsMap[fieldName];
  }
  return <div><small className={'text-danger'}><b>{getErrorString()}</b></small></div>
}

export default FormErrorDisplay;
