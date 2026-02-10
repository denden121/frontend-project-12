import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import {
  Alert,
  Button,
  Card,
  Form as RBForm,
} from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ minWidth: '320px', maxWidth: '400px' }}>
        <Card.Body>
          <Card.Title className="mb-3">Вход</Card.Title>
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={async (values, { setStatus }) => {
              setStatus(null);
              try {
                await login(values.username, values.password);
                navigate('/', { replace: true });
              } catch (err) {
                const message = err.response?.data?.message ?? err.message ?? 'Ошибка авторизации';
                setStatus(message);
              }
            }}
          >
            {({ status }) => (
              <Form>
                {status && (
                  <Alert variant="danger" className="py-2">
                    {status}
                  </Alert>
                )}
                <RBForm.Group className="mb-3" controlId="loginUsername">
                  <RBForm.Label>Имя пользователя</RBForm.Label>
                  <Field
                    name="username"
                    as={RBForm.Control}
                    type="text"
                    autoComplete="username"
                    autoFocus
                  />
                </RBForm.Group>
                <RBForm.Group className="mb-3" controlId="loginPassword">
                  <RBForm.Label>Пароль</RBForm.Label>
                  <Field
                    name="password"
                    as={RBForm.Control}
                    type="password"
                    autoComplete="current-password"
                  />
                </RBForm.Group>
                <div className="d-flex justify-content-between align-items-center">
                  <Button variant="primary" type="submit">
                    Войти
                  </Button>
                  <Link to="/signup">Регистрация</Link>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
}

export default LoginPage;
