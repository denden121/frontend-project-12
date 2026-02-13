import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {
  Button,
  Modal,
  Form as RBForm,
} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
  createChannel,
  renameChannel,
  removeChannel,
} from '../slices/chatSlice'
import { cleanText } from '../utils/profanity'

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

  const schema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, t('validation.channelNameLength'))
      .max(20, t('validation.channelNameLength'))
      .notOneOf(existingNames, t('validation.mustBeUnique'))
      .required(t('validation.required')),
  })

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.addChannel')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await dispatch(createChannel({
              name: cleanText(values.name.trim()),
              token,
            })).unwrap()
            toast.success(t('chat.addChannelSuccess'))
            onClose()
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Modal.Body>
              <RBForm.Group className="modal-field" controlId="newChannelName">
                <RBForm.Label>{t('chat.channelName')}</RBForm.Label>
                <Field
                  name="name"
                  as={RBForm.Control}
                  autoFocus
                  placeholder={t('chat.newChannelPlaceholder')}
                />
                {errors.name && touched.name && (
                  <div className="modal-error">{errors.name}</div>
                )}
              </RBForm.Group>
              {error && <div className="modal-error">{error}</div>}
            </Modal.Body>
            <Modal.Footer className="modal-actions">
              <Button variant="secondary" type="button" onClick={onClose}>
                {t('chat.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || creating}
              >
                {creating ? t('chat.creating') : t('chat.create')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

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

  const schema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, t('validation.channelNameLength'))
      .max(20, t('validation.channelNameLength'))
      .notOneOf(existingNames, t('validation.mustBeUnique'))
      .required(t('validation.required')),
  })

  const isRenaming = renamingChannelId === channel.id

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: channel.name }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await dispatch(renameChannel({
              id: channel.id,
              name: cleanText(values.name.trim()),
              token,
            })).unwrap()
            toast.success(t('chat.renameChannelSuccess'))
            onClose()
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Modal.Body>
              <RBForm.Group className="modal-field" controlId="renameChannelName">
                <RBForm.Label>{t('chat.channelName')}</RBForm.Label>
                <Field
                  name="name"
                  as={RBForm.Control}
                  autoFocus
                />
                {errors.name && touched.name && (
                  <div className="modal-error">{errors.name}</div>
                )}
              </RBForm.Group>
              {error && <div className="modal-error">{error}</div>}
            </Modal.Body>
            <Modal.Footer className="modal-actions">
              <Button variant="secondary" type="button" onClick={onClose}>
                {t('chat.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || isRenaming}
              >
                {isRenaming ? t('chat.saving') : t('chat.save')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

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

  const isRemoving = removingChannelId === channel.id

  const handleRemove = async () => {
    await dispatch(removeChannel({ id: channel.id, token })).unwrap()
    toast.success(t('chat.removeChannelSuccess'))
    onClose()
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.confirmRemoveTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('chat.confirmRemoveText', { name: channel.name })}</p>
        {error && <div className="modal-error">{error}</div>}
      </Modal.Body>
      <Modal.Footer className="modal-actions">
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
    </Modal>
  )
}
