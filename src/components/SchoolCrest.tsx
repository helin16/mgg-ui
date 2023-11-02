import React from 'react';
import {Image} from 'react-bootstrap';
import UtilsService from '../services/UtilsService';

const SchoolCrest = ({...props}: any) => {
  return <Image src={UtilsService.getFullUrl('images/crest.png')} {...props} />
}

export default SchoolCrest;
