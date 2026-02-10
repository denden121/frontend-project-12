export const SUPPORTED_LANGS = ['ru', 'en'];
export const DEFAULT_LANG = 'ru';

export const ROUTE_SEGMENTS = {
  login: 'login',
  signup: 'signup',
};

export const ROUTES = {
  home: '/',
  login: `/${ROUTE_SEGMENTS.login}`,
  signup: `/${ROUTE_SEGMENTS.signup}`,
};

export const buildPathWithLang = (pathname) => pathname;

