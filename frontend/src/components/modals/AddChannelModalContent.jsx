import { useEffect, useRef } from 'react'
import { Formik, Form, Field } from 'formik'
import { Button, Form as RBForm, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { createChannel } from '../../store/slices/chatSlice'
import { cleanText } from '../../utils/profanity'
import { getChannelNameSchema } from '../../schemas/channelSchema'

export function AddChannelModalContent({
  onClose,
  existingNames,
  creating,
  error,
  token,
  dispatch,
}) {
  const { t } = useTranslation()
  const schema = getChannelNameSchema(t, existingNames)
  const inputRef = useRef(null)

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(id)
  }, [])

  return (
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
        }
        finally {
          setSubmitting(false)
        }
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <Modal.Body>
            <RBForm.Group className="mb-3" controlId="newChannelName">
              <RBForm.Label>{t('chat.channelName')}</RBForm.Label>
              <Field name="name">
                {({ field }) => (
                  <RBForm.Control
                    {...field}
                    ref={inputRef}
                    autoComplete="off"
                    placeholder={t('chat.newChannelPlaceholder')}
                  />
                )}
              </Field>
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
              disabled={isSubmitting || creating}
            >
              {creating ? t('chat.creating') : t('chat.create')}
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Formik>
  )
}
