import { Formik, Form, Field } from 'formik'
import { Button, Form as RBForm, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { renameChannel } from '../../store/slices/chatSlice'
import { cleanText } from '../../utils/profanity'
import { getChannelNameSchema } from '../../schemas/channelSchema'

export function RenameChannelModalContent({
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

  const schema = getChannelNameSchema(t, existingNames)
  const isRenaming = renamingChannelId === channel.id

  return (
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
        }
        finally {
          setSubmitting(false)
        }
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Modal.Body>
            <RBForm.Group className="mb-3" controlId="renameChannelName">
              <RBForm.Label>{t('chat.channelName')}</RBForm.Label>
              <Field
                name="name"
                as={RBForm.Control}
                autoFocus
              />
              {errors.name && touched.name && (
                <div className="text-danger small mt-1">{errors.name}</div>
              )}
            </RBForm.Group>
            {error && <div className="text-danger small mt-1">{error}</div>}
          </Modal.Body>
          <Modal.Footer>
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
  )
}
