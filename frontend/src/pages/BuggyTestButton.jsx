import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function BuggyTestButton() {
  const { t } = useTranslation();
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Rollbar test error from BuggyTestButton');
  }

  const handleClick = () => {
    setShouldThrow(true);
  };

  return (
    <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleClick}>
      {t('errors.triggerTestError') || 'Trigger test error'}
    </button>
  );
}

export default BuggyTestButton;

