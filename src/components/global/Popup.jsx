import '../../assets/styles/global/popup.css';

const PopupModal = ({ isOpen, title, message, onCancel, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          {title}
        </div>

        {/* Body */}
        <div className="modal-body">
          <p className="modal-message">{message}</p>

          {/* Buttons */}
          <div className="modal-buttons">
            <button
              onClick={onCancel}
              className="cancel-button"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="confirm-button"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
