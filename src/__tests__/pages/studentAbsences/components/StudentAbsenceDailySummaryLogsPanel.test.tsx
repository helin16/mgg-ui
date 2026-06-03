import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import StudentAbsenceDailySummaryLogsPanel from "../../../../pages/studentAbsences/components/StudentAbsenceDailySummaryLogsPanel";
import StudentAbsenceDailySummaryService from "../../../../services/StudentAbsences/StudentAbsenceDailySummaryService";
import Toaster from "../../../../services/Toaster";

jest.mock("react-select");
jest.mock(
  "../../../../services/StudentAbsences/StudentAbsenceDailySummaryService"
);
jest.mock("../../../../services/Toaster");

const mockedSummaryService =
  StudentAbsenceDailySummaryService as jest.Mocked<
    typeof StudentAbsenceDailySummaryService
  >;
const mockedToaster = Toaster as jest.Mocked<typeof Toaster>;

const buildLog = (id: string, title: string) => ({
  id,
  type: "STUDENT_ABSENCE_AUTO",
  status: "SUCCESS",
  dateFrom: "2026-06-02",
  dateTo: "2026-06-02",
  recipientEmail: "staff@example.com",
  scopeType: "yearLevel",
  scopeValue: "12",
  yearLevelCode: "12",
  formCode: null,
  headingTitle: title,
  subject: null,
  absoluteReportUrl: null,
  recipientSource: null,
  campus: null,
  createdAt: "2026-06-03T00:22:00.000Z",
  updatedAt: "2026-06-03T00:22:00.000Z",
  error: null,
  response: null,
});

describe("StudentAbsenceDailySummaryLogsPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads the first page and fetches a new page when pagination is clicked", async () => {
    mockedSummaryService.getLogs
      .mockResolvedValueOnce({
        data: [buildLog("1", "Page 1 title")],
        total: 40,
        page: 1,
        pageSize: 20,
      })
      .mockResolvedValueOnce({
        data: [buildLog("2", "Page 2 title")],
        total: 40,
        page: 2,
        pageSize: 20,
      });

    render(<StudentAbsenceDailySummaryLogsPanel />);

    await waitFor(() => {
      expect(mockedSummaryService.getLogs).toHaveBeenCalledWith({
        page: 1,
        pageSize: 20,
      });
    });

    expect(await screen.findByText("Page 1 title")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "2" }));

    await waitFor(() => {
      expect(mockedSummaryService.getLogs).toHaveBeenLastCalledWith({
        page: 2,
        pageSize: 20,
      });
    });

    expect(await screen.findByText("Page 2 title")).toBeInTheDocument();
  });

  test("shows api errors from the logs request", async () => {
    const error = new Error("request failed");
    mockedSummaryService.getLogs.mockRejectedValueOnce(error);

    render(<StudentAbsenceDailySummaryLogsPanel />);

    await waitFor(() => {
      expect(mockedToaster.showApiError).toHaveBeenCalledWith(error);
    });
  });
});
