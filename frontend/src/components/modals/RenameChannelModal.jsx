import { useTranslation } from 'react-i18next'
import Modal from '../Modal'
import { RenameChannelModalContent } from './RenameChannelModalContent'

export function RenameChannelModal({
  channel,
  onClose,
  existingNames,
  renamingChannelId,
  error,
  token,
  dispatch,
}) {
  const { t } = useTranslation()
  if (!channel) return null

  return (
    <Modal show onHide={onClose} title={t('chat.renameChannel')}>
      <RenameChannelModalContent
        channel={channel}
        onClose={onClose}
        existingNames={existingNames}
        renamingChannelId={renamingChannelId}
        error={error}
        token={token}
        dispatch={dispatch}
      />
    </Modal>
  )
}
