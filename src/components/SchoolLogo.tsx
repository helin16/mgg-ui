import React from 'react';
import {Image, ImageProps} from 'react-bootstrap';
import UtilsService from '../services/UtilsService';

const SchoolLogo = ({...props}: ImageProps) => {
  return <Image src={UtilsService.getFullUrl("images/mentone-logo-text.png")} {...props} />
}

export default SchoolLogo;
