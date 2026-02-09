import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  const { username, logout } = useAuth();

  return (
    <div>
      <h1>Чат</h1>
      <p>
        {username}
        {' · '}
        <button type="button" onClick={logout}>
          Выйти
        </button>
      </p>
    </div>
  );
}

export default HomePage;
