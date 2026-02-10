import {
  Routes,
  Route,
  Outlet,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  useSearchParams,
} from 'react-router-dom';
import { useEffect } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '@rollbar/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import SignupPage from './pages/SignupPage';
import BuggyTestButton from './pages/BuggyTestButton';
import './App.css';
import {
  ROUTES,
  ROUTE_SEGMENTS,
  SUPPORTED_LANGS,
  DEFAULT_LANG,
  buildPathWithLang,
} from './routes';

function Layout() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, i18n } = useTranslation();

  const rawLang = searchParams.get('lang');
  const lang = SUPPORTED_LANGS.includes(rawLang) ? rawLang : DEFAULT_LANG;

  useEffect(() => {
    if (!rawLang || !SUPPORTED_LANGS.includes(rawLang)) {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set('lang', DEFAULT_LANG);
        return params;
      });
    }

    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [rawLang, lang, i18n, setSearchParams]);

  const handleLanguageChange = (nextLang) => {
    if (nextLang === lang) return;

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('lang', nextLang);
      return params;
    });
  };

  const handleLogout = () => {
    logout();
    navigate(buildPathWithLang(ROUTES.login, lang));
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="sm">
        <Container>
          <Navbar.Brand
            as={Link}
            to={{ pathname: ROUTES.home, search: location.search }}
          >
            {t('app.title')}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar" className="justify-content-end">
            <div className="d-flex align-items-center gap-3">
              <div className="btn-group navbar-lang-switcher" role="group" aria-label="Language switcher">
                <Button
                  variant={lang === 'ru' ? 'outline-light' : 'outline-secondary'}
                  size="sm"
                  type="button"
                  onClick={() => handleLanguageChange('ru')}
                >
                  RU
                </Button>
                <Button
                  variant={lang === 'en' ? 'outline-light' : 'outline-secondary'}
                  size="sm"
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                >
                  EN
                </Button>
              </div>
              {isAuthenticated ? (
                <div className="d-flex align-items-center gap-2">
                  <span>{username}</span>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="navbar-auth-button"
                    onClick={handleLogout}
                  >
                    {t('auth.logout')}
                  </Button>
                </div>
              ) : (
                <Nav>
                  <Nav.Link
                    as={Link}
                    to={{ pathname: ROUTES.login, search: location.search }}
                    className="navbar-auth-link"
                  >
                    {t('auth.login')}
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to={{ pathname: ROUTES.signup, search: location.search }}
                    className="navbar-auth-link"
                  >
                    {t('auth.signup')}
                  </Nav.Link>
                </Nav>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4 app-main">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div className="flex-grow-1">
            <Outlet />
          </div>
          <ErrorBoundary
            fallbackUI={(
              <div className="text-danger small">
                Rollbar test error was captured. Check your Rollbar dashboard.
              </div>
            )}
          >
            <BuggyTestButton />
          </ErrorBoundary>
        </div>
      </Container>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path={ROUTES.home} element={<Layout />}>
          <Route
            index
            element={(
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            )}
          />
          <Route path={ROUTE_SEGMENTS.login} element={<LoginPage />} />
          <Route path={ROUTE_SEGMENTS.signup} element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to={buildPathWithLang(ROUTES.home, DEFAULT_LANG)} replace />}
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="dark" />
    </AuthProvider>
  );
}

export default App;
