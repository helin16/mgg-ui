export type iPowerBIReportListItem = {
  id: string;
  reportType: string;
  name: string;
  webUrl: string;
  embedUrl: string;
  isOwnedByMe: boolean;
  datasetId: string;
  datasetWorkspaceId: string;
  users: string[];
  subscriptions: string[];
}

type iPowerBIReportList = {
  "@odata.context": string;
  value: iPowerBIReportListItem[];
};

export default iPowerBIReportList;
