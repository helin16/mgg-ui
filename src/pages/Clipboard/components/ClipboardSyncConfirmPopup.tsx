import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import ClipboardMusicSyncService from "../../../services/Clipboard/ClipboardMusicSyncService";
import Toaster from "../../../services/Toaster";

interface ClipboardSyncConfirmPopupProps {
  show: boolean;
  teamName: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ClipboardSyncConfirmPopup: React.FC<ClipboardSyncConfirmPopupProps> = ({
  show,
  teamName,
  onConfirm,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // Call the sync service
      const result = await ClipboardMusicSyncService.triggerSync();
      
      // Show success message
      if (result.status === 'NEW' || result.status === 'PROCESSING') {
        Toaster.success(`Music sync triggered for ${teamName}`);
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
          Are you sure you want to trigger a music sync for <strong>{teamName}</strong>?
        </p>
        <p className="text-muted small mb-0">
          This will synchronize student roster data. The operation may take a few moments.
        </p>
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
