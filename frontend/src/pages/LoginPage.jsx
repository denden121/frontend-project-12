import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Вход</h1>
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
          <Form className="login-form">
            {status && (
              <div className="login-form__error" role="alert">
                {status}
              </div>
            )}
            <div className="login-form__field">
              <label htmlFor="username">Имя пользователя</label>
              <Field id="username" name="username" type="text" className="login-form__input" />
            </div>
            <div className="login-form__field">
              <label htmlFor="password">Пароль</label>
              <Field id="password" name="password" type="password" className="login-form__input" />
            </div>
            <button type="submit">Войти</button>
          </Form>
        )}
      </Formik>
      <p>
        <Link to="/">На главную</Link>
      </p>
    </div>
  );
}

export default LoginPage;
