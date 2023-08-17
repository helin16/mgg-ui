import Page from '../../layouts/Page';
import SynergeticEmailTemplateList from './components/SynergeticEmailTemplateList';

const SynergeticEmailTemplateManagerPage = () => {
  return (
    <Page title={<h3>Synergetic Email Template Manager</h3>}>
      <SynergeticEmailTemplateList />
    </Page>
  )
}

export default SynergeticEmailTemplateManagerPage;
