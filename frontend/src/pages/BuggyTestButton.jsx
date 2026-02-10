import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';

function BuggyTestButton() {
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const handleClick = () => {
    rollbar.error('Rollbar test error from BuggyTestButton');
    toast.info(t('errors.rollbarTestCaptured'));
  };

  return (
    <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleClick}>
      {t('errors.triggerTestError')}
    </button>
  );
}

export default BuggyTestButton;
