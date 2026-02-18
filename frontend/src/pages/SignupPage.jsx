import { useMemo, useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import {
  Alert,
  Button,
  Card,
  Form as RBForm,
  InputGroup,
} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import {
  ROUTES,
  DEFAULT_LANG,
  buildPathWithLang,
} from '../routes/routes'
import { getSignupSchema } from '../schemas/signupSchema'
import { createSignupSubmit } from '../utils/authFormHandlers'

function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const lang = searchParams.get('lang') || DEFAULT_LANG

  const validationSchema = useMemo(() => getSignupSchema(t), [t])
  const handleSubmit = useMemo(
    () => createSignupSubmit(signup, navigate, t),
    [signup, navigate, t],
  )

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ width: '100%', maxWidth: '520px' }}>
        <Card.Body>
          <Card.Title className="mb-3">{t('auth.signup')}</Card.Title>
          <Formik
            initialValues={{ username: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              status,
              errors,
              touched,
              isSubmitting,
            }) => (
              <Form>
                {status && (
                  <Alert variant="danger" className="py-2 mb-3">
                    {status}
                  </Alert>
                )}
                <RBForm.Group className="mb-3" controlId="signupUsername">
                  <RBForm.Label>{t('auth.username')}</RBForm.Label>
                  <Field
                    name="username"
                    as={RBForm.Control}
                    type="text"
                    autoComplete="off"
                    autoFocus
                  />
                  {errors.username && touched.username && (
                    <div className="text-danger small mt-1">{errors.username}</div>
                  )}
                </RBForm.Group>
                <RBForm.Group className="mb-3" controlId="signupPassword">
                  <RBForm.Label>{t('auth.password')}</RBForm.Label>
                  <InputGroup>
                    <Field
                      name="password"
                      as={RBForm.Control}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="off"
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                    >
                      {showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                    </Button>
                  </InputGroup>
                  {!errors.password && (
                    <div className="form-text text-muted mt-1">
                      {t('auth.passwordHint')}
                    </div>
                  )}
                  {errors.password && touched.password && (
                    <div className="text-danger small mt-1">{errors.password}</div>
                  )}
                </RBForm.Group>
                <RBForm.Group className="mb-4" controlId="signupConfirmPassword">
                  <RBForm.Label>{t('auth.confirmPassword')}</RBForm.Label>
                  <Field
                    name="confirmPassword"
                    as={RBForm.Control}
                    type="password"
                    autoComplete="off"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="text-danger small mt-1">{errors.confirmPassword}</div>
                  )}
                </RBForm.Group>
                <div className="d-flex justify-content-between align-items-center">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {t('auth.signupButton')}
                  </Button>
                  <Link to={buildPathWithLang(ROUTES.login, lang)}>
                    {t('auth.haveAccount')}
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  )
}

export default SignupPage
