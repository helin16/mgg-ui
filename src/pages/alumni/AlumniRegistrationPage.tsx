import styled from 'styled-components';
import SchoolLogo from '../../components/SchoolLogo';
import {FlexContainer} from '../../styles';
import {mainRed} from '../../AppWrapper';
import {Container} from 'react-bootstrap';
import AlumniRegistrationForm from './components/AlumniRegistrationForm';

const Wrapper = styled.div`
  padding-bottom: 3rem;
  background: #f9faf9 !important;
  .header {
    padding: 0 1rem;
    background: ${mainRed};
    color: white;
    
    .logo-wrapper {
      width: 16.67%;
      background: #f9faf9;
      padding: 1.5rem;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
`;


const AlumniRegistrationPage = () => {
  return (
    <Wrapper>
      <div className={'header section-row'}>
        <Container>
          <FlexContainer className={'justify-content space-between align-items end'}>
            <div  className={'logo-wrapper'}>
              <SchoolLogo />
            </div>
            <h2>Digital Archives Registration</h2>
          </FlexContainer>
        </Container>
      </div>

      <Container>
        <AlumniRegistrationForm />
      </Container>
    </Wrapper>
  )
}

export default AlumniRegistrationPage;
