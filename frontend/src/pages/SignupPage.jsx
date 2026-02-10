import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Button,
  Card,
  Form as RBForm,
  InputGroup,
} from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const SignupSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
    .required('Обязательное поле'),
});

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ width: '100%', maxWidth: '520px' }}>
        <Card.Body>
          <Card.Title className="mb-3">Регистрация</Card.Title>
          <Formik
            initialValues={{ username: '', password: '', confirmPassword: '' }}
            validationSchema={SignupSchema}
            onSubmit={async (values, { setStatus, setSubmitting }) => {
              setStatus(null);
              try {
                await signup(values.username.trim(), values.password);
                navigate('/', { replace: true });
              } catch (err) {
                if (err.response?.status === 409) {
                  setStatus('Пользователь с таким именем уже существует');
                } else {
                  const message = err.response?.data?.message ?? err.message ?? 'Ошибка регистрации';
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
                  <RBForm.Label>Имя пользователя</RBForm.Label>
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
                  <RBForm.Label>Пароль</RBForm.Label>
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
                      {showPassword ? 'Скрыть' : 'Показать'}
                    </Button>
                  </InputGroup>
                  <div className="form-text text-muted mt-1">
                    Не менее 6 символов
                  </div>
                  {errors.password && touched.password && (
                    <div className="modal-error">{errors.password}</div>
                  )}
                </RBForm.Group>
                <RBForm.Group className="mb-4" controlId="signupConfirmPassword">
                  <RBForm.Label>Подтверждение пароля</RBForm.Label>
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
                    Зарегистрироваться
                  </Button>
                  <Link to="/login">У меня уже есть аккаунт</Link>
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

