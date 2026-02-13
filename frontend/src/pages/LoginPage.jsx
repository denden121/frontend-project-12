import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { ROUTES, buildPathWithLang, DEFAULT_LANG } from '../routes'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { t, i18n } = useTranslation()
  const lang = i18n.language || DEFAULT_LANG

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ width: '100%', maxWidth: '520px' }}>
        <Card.Body>
          <Card.Title className="mb-3">{t('auth.login')}</Card.Title>
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={async (values, { setStatus }) => {
              setStatus(null)
              try {
                await login(values.username, values.password)
                navigate(buildPathWithLang(ROUTES.home, lang), { replace: true })
              } catch (err) {
                if (err.response?.status === 401) {
                  setStatus(t('auth.invalidCredentials'))
                } else {
                  const message = err.response?.data?.message ?? err.message ?? t('auth.loginErrorFallback')
                  setStatus(message)
                }
              }
            }}
          >
            {({ status, isSubmitting }) => (
              <Form>
                {status && (
                  <Alert variant="danger" className="py-2 mb-3">
                    {status}
                  </Alert>
                )}
                <RBForm.Group className="mb-3" controlId="loginUsername">
                  <RBForm.Label>{t('auth.nickname')}</RBForm.Label>
                  <Field
                    name="username"
                    as={RBForm.Control}
                    type="text"
                    autoComplete="username"
                    autoFocus
                  />
                </RBForm.Group>
                <RBForm.Group className="mb-4" controlId="loginPassword">
                  <RBForm.Label>{t('auth.password')}</RBForm.Label>
                  <InputGroup>
                    <Field
                      name="password"
                      as={RBForm.Control}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
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
                </RBForm.Group>
                <div className="d-flex justify-content-between align-items-center">
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {t('auth.loginButton')}
                  </Button>
                  <Link to={buildPathWithLang(ROUTES.signup, lang)}>
                    {t('auth.signup')}
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

export default LoginPage
