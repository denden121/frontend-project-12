import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Button,
  Card,
  Form as RBForm,
  InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import {
  ROUTES,
  DEFAULT_LANG,
  buildPathWithLang,
} from '../routes';
import './SignupPage.css';

const SignupSchema = (t) => Yup.object({
  username: Yup.string()
    .trim()
    .min(3, t('validation.usernameLength'))
    .max(20, t('validation.usernameLength'))
    .required(t('validation.required')),
  password: Yup.string()
    .min(6, t('validation.passwordMin'))
    .required(t('validation.required')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], t('validation.passwordsMustMatch'))
    .required(t('validation.required')),
});

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang') || DEFAULT_LANG;

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ width: '100%', maxWidth: '520px' }}>
        <Card.Body>
          <Card.Title className="mb-3">{t('auth.signup')}</Card.Title>
          <Formik
            initialValues={{ username: '', password: '', confirmPassword: '' }}
            validationSchema={SignupSchema(t)}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
              setStatus(null);
              try {
                await signup(values.username.trim(), values.password);
                navigate(buildPathWithLang(ROUTES.home, lang), { replace: true });
              } catch (err) {
                if (err.response?.status === 409) {
                  setStatus(t('auth.userExists'));
                } else {
                  const message = err.response?.data?.message ?? err.message ?? t('auth.signupErrorFallback');
                  setStatus(message);
                }
              } finally {
                setSubmitting(false);
              }
            }}
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
                    autoComplete="username"
                    autoFocus
                  />
                  {errors.username && touched.username && (
                    <div className="modal-error">{errors.username}</div>
                  )}
                </RBForm.Group>
                <RBForm.Group className="mb-3" controlId="signupPassword">
                  <RBForm.Label>{t('auth.password')}</RBForm.Label>
                  <InputGroup>
                    <Field
                      name="password"
                      as={RBForm.Control}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                    </Button>
                  </InputGroup>
                  <div className="form-text text-muted mt-1">
                    {t('auth.passwordHint')}
                  </div>
                  {errors.password && touched.password && (
                    <div className="modal-error">{errors.password}</div>
                  )}
                </RBForm.Group>
                <RBForm.Group className="mb-4" controlId="signupConfirmPassword">
                  <RBForm.Label>{t('auth.confirmPassword')}</RBForm.Label>
                  <Field
                    name="confirmPassword"
                    as={RBForm.Control}
                    type="password"
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="modal-error">{errors.confirmPassword}</div>
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
  );
}

export default SignupPage;

