import { Modal as BSModal } from 'react-bootstrap'

function Modal({ show, onHide, title, children, centered = true }) {
  return (
    <BSModal show={show} onHide={onHide} centered={centered}>
      {title && (
        <BSModal.Header closeButton>
          <BSModal.Title>{title}</BSModal.Title>
        </BSModal.Header>
      )}
      {children}
    </BSModal>
  )
}

export default Modal
