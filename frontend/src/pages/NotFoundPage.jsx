import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '../routes'

function NotFoundPage() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <div>
      <h1>404</h1>
      <p>{t('errors.pageNotFound')}</p>
      <p>
        <Link to={{ pathname: ROUTES.home, search: location.search }}>
          {t('errors.goHome')}
        </Link>
      </p>
    </div>
  )
}

export default NotFoundPage
