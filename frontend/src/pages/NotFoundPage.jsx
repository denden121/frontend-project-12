import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div>
      <h1>404</h1>
      <p>Страница не найдена</p>
      <p>
        <Link to="/">На главную</Link>
      </p>
    </div>
  );
}

export default NotFoundPage;
