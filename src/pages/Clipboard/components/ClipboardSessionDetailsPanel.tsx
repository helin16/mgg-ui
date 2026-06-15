import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import ClipboardSessionService from "../../../services/Clipboard/ClipboardSessionService";
import iClipboardSession from "../../../types/Clipboard/iClipboardSession";
import moment from 'moment-timezone';
import Toaster from "../../../components/notifications/Toaster";

interface ClipboardSessionDetailsPanelProps {
  teamId: string | number;
}

const ClipboardSessionDetailsPanel: React.FC<ClipboardSessionDetailsPanelProps> = ({
  teamId,
}) => {
  const [session, setSession] = useState<iClipboardSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch session details for this team
   */
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Try to fetch session for the team
        const result = await ClipboardSessionService.get(teamId);
        setSession(result);
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || 
                            err?.message || 
                            'Failed to load session details';
        setError(errorMessage);
        // Don't show toast here as this is a detail panel, not a critical operation
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      fetchSession();
    }
  }, [teamId]);

  if (isLoading) {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" size="sm" role="status">
          <span className="visually-hidden">Loading session details...</span>
        </Spinner>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="alert alert-warning mb-0" role="alert">
        <small>{error || "No session details available"}</small>
      </div>
    );
  }

  const formatDateTime = (isoDate: string) => {
    if (!isoDate) return "N/A";
    try {
      return moment(isoDate).tz('Australia/Melbourne').format('DD/MM/YYYY HH:mm');
    } catch {
      return "Invalid date";
    }
  };

  const staffNames = session.assignedStaff?.map((s: any) => s.name || s.firstName).join(", ") || "N/A";
  const activityName = session.activity?.name || "N/A";
  const departmentName = session.activity?.department?.name || "N/A";

  return (
    <div className="session-details">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label text-muted mb-1">
              <small><strong>Session Title</strong></small>
            </label>
            <p className="mb-0">{session.title || "N/A"}</p>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted mb-1">
              <small><strong>Activity</strong></small>
            </label>
            <p className="mb-0">{activityName}</p>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted mb-1">
              <small><strong>Department</strong></small>
            </label>
            <p className="mb-0">{departmentName}</p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label text-muted mb-1">
              <small><strong>Start Time</strong></small>
            </label>
            <p className="mb-0">{formatDateTime(session.startDateTime)}</p>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted mb-1">
              <small><strong>End Time</strong></small>
            </label>
            <p className="mb-0">{formatDateTime(session.endDateTime)}</p>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted mb-1">
              <small><strong>Status</strong></small>
            </label>
            <p className="mb-0">
              {session.cancelled ? (
                <span className="badge bg-danger">Cancelled</span>
              ) : (
                <span className="badge bg-success">Active</span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="mb-3">
            <label className="form-label text-muted mb-1">
              <small><strong>Assigned Staff</strong></small>
            </label>
            <p className="mb-0">
              <small>{staffNames}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClipboardSessionDetailsPanel;
