import styled from 'styled-components';
import ExplanationPanel from '../../../../components/ExplanationPanel';
import {Col, Container, Row} from 'react-bootstrap';
import FileYearSelector from '../../../../components/student/FileYearSelector';
import LoadingBtn from '../../../../components/common/LoadingBtn';
import * as Icons from 'react-bootstrap-icons';
import FormLabel from '../../../../components/form/FormLabel';
import moment from 'moment-timezone';
import {useState} from 'react';
import SynGLSelector from '../SynGLSelector';
import {FlexContainer} from '../../../../styles';
import iSynGeneralLedger from '../../../../types/Synergetic/Finance/iSynGeneralLedager';
import BTItemService from '../../../../services/BudgetTracker/BTItemService';
import Toaster from '../../../../services/Toaster';
import {exportBTItemsToExcel} from '../BTItemExportBtn';
import MathHelper from '../../../../helper/MathHelper';
import SynGeneralLedgerService from '../../../../services/Synergetic/Finance/SynGeneralLedgerService';
import SynCommunityService from '../../../../services/Synergetic/Community/SynCommunityService';

const Wrapper = styled.div``;
const BTItemsDownloadPanel = () => {
  const initialYear = MathHelper.add(moment().year(), 1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [year, setYear] = useState(initialYear);
  const [gls, setGls] = useState<iSynGeneralLedger[]>([]);

  const download = async () => {
    try {
      setIsDownloading(true);
      const glCodes = gls.map(gl => gl.GLCode);
      const btItems = (await BTItemService.getAll({
        where: JSON.stringify({
          year: year,
          gl_code: gls.map(gl => gl.GLCode),
        }),
        include: 'BTItemCategory',
        perPage: '999999'
      })).data;

      let comIds: number[] = [];
      btItems.forEach(item => {
        if (`${item.creator_id || ''}`.trim() !== '') {
          comIds.push(item.creator_id || 0);
        }
        if (`${item.author_id || ''}`.trim() !== '') {
          comIds.push(item.author_id || 0);
        }
      });

      const resp = await Promise.all([
        SynGeneralLedgerService.getAll({ where: JSON.stringify({ActiveFlag: true, GLYear: MathHelper.sub(year, 1), GLCode: glCodes}), perPage: '99999'}),
        SynCommunityService.getCommunityProfiles({ where: JSON.stringify({ID: comIds}), perPage: '99999'}),
      ]);

      exportBTItemsToExcel({
        year,
        items: btItems,
        glMap: resp[0].data.reduce((map, gl) => ({...map, [gl.GLCode]: gl}), {}),
        communityMap: resp[1].data.reduce((map, com) => ({...map, [com.ID]: com}), {}),
      })
      setIsDownloading(false);
    } catch (err) {
      Toaster.showApiError(err);
      setIsDownloading(false);
    }

  }

  return (
    <Wrapper>
      <div className={'panel-wrapper space-below'}>
        <ExplanationPanel text={'Please select a year to start download'} variant={'info'}/>
        <Container>
          <Row>
            <Col sm={3}>
              <FormLabel label={'Budget Item requested for year:'} isRequired />
              <FileYearSelector
                max={moment().add(1, 'year').year()}
                min={moment().subtract(5, 'year').year()}
                value={year}
                onSelect={(newYear) => setYear(newYear || initialYear)}
              />
            </Col>
            <Col sm={9}>
              <FormLabel label={'GL codes:'} isRequired />
              <SynGLSelector
                onSelect={(options) => {
                  // @ts-ignore
                  setGls(options === null ? [] : options.map(option => option.data))
                }}
                year={MathHelper.sub(year, 1)}
                values={gls.map(gl => gl.GLCode)}
                selectAllBeDefault={(glArr) => setGls(glArr)}
                isMulti
              />
            </Col>
          </Row>
          <Row>
            <Col className={'text-right'}>
              <FlexContainer className={'space-below'} />
              <LoadingBtn
                variant={'primary'}
                isLoading={isDownloading}
                onClick={() => download()}
                disabled={gls.length <= 0}
              >
                <Icons.Download /> Download
              </LoadingBtn>
            </Col>
          </Row>
        </Container>
      </div>
    </Wrapper>
  )
}

export default BTItemsDownloadPanel;
