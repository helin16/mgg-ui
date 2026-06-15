import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import styled from "styled-components";
import ClipboardMusicSyncService from "../../../services/Clipboard/ClipboardMusicSyncService";
import Toaster, { TOAST_TYPE_SUCCESS } from "../../../services/Toaster";

interface ClipboardSyncConfirmPopupProps {
  show: boolean;
  teamName: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ConfirmString = styled.div`
  background-color: #f5f5f5;
  padding: 0.75rem;
  border-radius: 4px;
  margin: 1rem 0;
  font-family: monospace;
  font-size: 0.9rem;
  word-break: break-all;
  border-left: 3px solid #0d6efd;
`;

const ClipboardSyncConfirmPopup: React.FC<ClipboardSyncConfirmPopupProps> = ({
  show,
  teamName,
  onConfirm,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserSynId, setCurrentUserSynId] = useState<string>("");

  useEffect(() => {
    // Extract synID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const synId = urlParams.get("synId") || urlParams.get("synid") || "";
    setCurrentUserSynId(synId);
  }, []);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // Call the sync service
      const result = await ClipboardMusicSyncService.triggerSync();
      
      // Show success message
      if (result.status === 'NEW' || result.status === 'PROCESSING') {
        Toaster.showToast(`Music sync triggered for ${teamName}`, TOAST_TYPE_SUCCESS);
      }

      // Call parent confirm handler
      if (onConfirm) {
        await onConfirm();
      }
    } catch (error: any) {
      // Error is already handled in ClipboardMusicSyncService via Toaster
      console.error('Sync error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleCancel}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton={!isLoading} className="border-bottom">
        <Modal.Title>Confirm Music Sync</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Are you sure you want to trigger a music sync for <strong>{teamName}</strong> that classCode start with 'X'?
        </p>
        <p className="text-muted small mb-2">
          This will synchronize student roster data. The operation may take a few moments.
        </p>
        {currentUserSynId && (
          <>
            <p className="text-muted small mb-2">Your SynID:</p>
            <ConfirmString>{currentUserSynId}</ConfirmString>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="border-top">
        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={isLoading}
          title="Confirm and trigger the sync operation"
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Syncing...
            </>
          ) : (
            "Confirm"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClipboardSyncConfirmPopup;
