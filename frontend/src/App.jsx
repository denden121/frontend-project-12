import {
  Routes,
  Route,
  Outlet,
  Link,
  useNavigate,
} from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import SignupPage from './pages/SignupPage';
import './App.css';

function Layout() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="sm">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Hexlet Chat
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar" className="justify-content-end">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <span>{username}</span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Выйти
                </Button>
              </div>
            ) : (
              <Nav>
                <Nav.Link as={Link} to="/login">
                  Войти
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Регистрация
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={(
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            )}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
