import { useTranslation } from 'react-i18next'
import Modal from '../Modal'
import { AddChannelModalContent } from './AddChannelModalContent'

export function AddChannelModal({
  isOpen,
  onClose,
  existingNames,
  creating,
  error,
  token,
  dispatch,
}) {
  const { t } = useTranslation()
  if (!isOpen) return null

  return (
    <Modal show={isOpen} onHide={onClose} title={t('chat.addChannel')}>
      <AddChannelModalContent
        onClose={onClose}
        existingNames={existingNames}
        creating={creating}
        error={error}
        token={token}
        dispatch={dispatch}
      />
    </Modal>
  )
}
