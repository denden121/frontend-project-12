import { toast } from 'react-toastify'
import { ROUTES, buildPathWithLang } from '../routes/routes'

export const createSignupSubmit = (signup, navigate, t) => async (values, { setStatus, setSubmitting }) => {
  setStatus(null)
  try {
    await signup(values.username.trim(), values.password)
    navigate(buildPathWithLang(ROUTES.home), { replace: true })
  }
  catch (err) {
    if (err.response?.status === 409) {
      toast.error(t('auth.userExists'))
      navigate(buildPathWithLang(ROUTES.home), { replace: true })
    }
    else {
      const message = err.response?.data?.message ?? err.message ?? t('auth.signupErrorFallback')
      setStatus(message)
    }
  }
  finally {
    setSubmitting(false)
  }
}

export const createLoginSubmit = (login, navigate, t, lang) => async (values, { setStatus }) => {
  setStatus(null)
  try {
    await login(values.username, values.password)
    navigate(buildPathWithLang(ROUTES.home, lang), { replace: true })
  }
  catch (err) {
    if (err.response?.status === 401) {
      setStatus(t('auth.invalidCredentials'))
    }
    else {
      const message = err.response?.data?.message ?? err.message ?? t('auth.loginErrorFallback')
      setStatus(message)
    }
  }
}
