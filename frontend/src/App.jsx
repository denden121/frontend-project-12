import {
  Routes,
  Route,
  Outlet,
  Link,
  useNavigate,
  Navigate,
} from 'react-router-dom'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from 'react-i18next'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import SignupPage from './pages/SignupPage'
import BuggyTestButton from './pages/BuggyTestButton'
import './App.css'
import {
  ROUTES,
  ROUTE_SEGMENTS,
  SUPPORTED_LANGS,
  DEFAULT_LANG,
} from './routes'

function Layout() {
  const { isAuthenticated, username, logout } = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const lang = i18n.language || DEFAULT_LANG

  const handleLanguageChange = (nextLang) => {
    if (nextLang === lang) return
    i18n.changeLanguage(nextLang)
  }

  const handleLogout = () => {
    logout()
    navigate(ROUTES.login)
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="sm">
        <Container>
          <Navbar.Brand
            as={Link}
            to={ROUTES.home}
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
                    to={ROUTES.login}
                    className="navbar-auth-link"
                  >
                    {t('auth.login')}
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to={ROUTES.signup}
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
          <BuggyTestButton />
        </div>
      </Container>
    </>
  )
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
          element={<Navigate to={ROUTES.home} replace />}
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="dark" />
    </AuthProvider>
  )
}

export default App
