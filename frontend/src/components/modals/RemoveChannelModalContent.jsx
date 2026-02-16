import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { removeChannel } from '../../store/slices/chatSlice'

export function RemoveChannelModalContent({
  channel,
  onClose,
  removingChannelId,
  error,
  token,
  dispatch,
}) {
  const { t } = useTranslation()
  if (!channel) return null

  const isRemoving = removingChannelId === channel.id

  const handleRemove = async () => {
    await dispatch(removeChannel({ id: channel.id, token })).unwrap()
    toast.success(t('chat.removeChannelSuccess'))
    onClose()
  }

  return (
    <>
      <Modal.Body>
        <p>{t('chat.confirmRemoveText', { name: channel.name })}</p>
        {error && <div className="text-danger small mt-1">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" type="button" onClick={onClose}>
          {t('chat.cancel')}
        </Button>
        <Button
          variant="danger"
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
        >
          {isRemoving ? t('chat.removing') : t('chat.removeChannel')}
        </Button>
      </Modal.Footer>
    </>
  )
}
