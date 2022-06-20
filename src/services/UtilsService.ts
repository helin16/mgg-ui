const isNumeric = (str: string) => {
  return !isNaN(parseFloat(str)) && isFinite(Number(str));
}

const UtilsService = {
  isNumeric,
}

export default UtilsService;
