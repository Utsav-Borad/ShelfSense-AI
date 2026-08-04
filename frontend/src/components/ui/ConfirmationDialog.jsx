import Modal from './Modal';
import Button from './Button';
export default function ConfirmationDialog({ open, onClose, onConfirm, title = 'Confirm action', message, confirmLabel = 'Confirm' }) { return <Modal open={open} onClose={onClose} title={title}><p>{message}</p><div className="dialog-actions"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button></div></Modal>; }
