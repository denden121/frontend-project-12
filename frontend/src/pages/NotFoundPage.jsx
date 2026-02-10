import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>404</h1>
      <p>{t('errors.pageNotFound')}</p>
      <p>
        <Link to="/">{t('errors.goHome')}</Link>
      </p>
    </div>
  );
}

export default NotFoundPage;
