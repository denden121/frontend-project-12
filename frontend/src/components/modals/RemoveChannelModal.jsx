import { useTranslation } from 'react-i18next'
import Modal from '../Modal'
import { RemoveChannelModalContent } from './RemoveChannelModalContent'

export function RemoveChannelModal({
  channel,
  onClose,
  removingChannelId,
  error,
  token,
  dispatch,
}) {
  const { t } = useTranslation()
  if (!channel) return null

  return (
    <Modal show onHide={onClose} title={t('chat.confirmRemoveTitle')}>
      <RemoveChannelModalContent
        channel={channel}
        onClose={onClose}
        removingChannelId={removingChannelId}
        error={error}
        token={token}
        dispatch={dispatch}
      />
    </Modal>
  )
}
