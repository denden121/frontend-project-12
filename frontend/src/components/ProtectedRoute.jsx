import { Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ROUTES, DEFAULT_LANG, buildPathWithLang } from '../routes/routes'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const lang = searchParams.get('lang') || DEFAULT_LANG

  if (!isAuthenticated) {
    return (
      <Navigate
        to={buildPathWithLang(ROUTES.login, lang)}
        state={{ from: location }}
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute
