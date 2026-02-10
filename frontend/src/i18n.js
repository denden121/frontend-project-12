import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const ruTranslations = {
  app: {
    title: 'Hexlet Chat',
  },
  auth: {
    login: 'Вход',
    signup: 'Регистрация',
    logout: 'Выйти',
    username: 'Имя пользователя',
    password: 'Пароль',
    confirmPassword: 'Подтверждение пароля',
    loginButton: 'Войти',
    signupButton: 'Зарегистрироваться',
    haveAccount: 'У меня уже есть аккаунт',
    loginErrorFallback: 'Ошибка авторизации',
    signupErrorFallback: 'Ошибка регистрации',
    userExists: 'Пользователь с таким именем уже существует',
    passwordHint: 'Не менее 6 символов',
    showPassword: 'Показать',
    hidePassword: 'Скрыть',
  },
  validation: {
    required: 'Обязательное поле',
    usernameLength: 'От 3 до 20 символов',
    passwordMin: 'Не менее 6 символов',
    passwordsMustMatch: 'Пароли должны совпадать',
    channelNameLength: 'От 3 до 20 символов',
    mustBeUnique: 'Должно быть уникальным',
  },
  chat: {
    loading: 'Загрузка чата...',
    loadError: 'Ошибка загрузки чата',
    offlineNotice: 'Нет соединения. Сообщения могут приходить с задержкой.',
    channels: 'Каналы',
    selectChannel: 'Выберите канал',
    noMessages: 'Сообщений пока нет',
    messageInputPlaceholder: 'Введите сообщение...',
    messageInputAriaLabel: 'Текст сообщения',
    send: 'Отправить',
    sending: 'Отправка…',
    addChannel: 'Добавить канал',
    renameChannel: 'Переименовать канал',
    removeChannel: 'Удалить канал',
    channelName: 'Имя канала',
    newChannelPlaceholder: 'Имя канала',
    creating: 'Создание…',
    create: 'Создать',
    saving: 'Сохранение…',
    save: 'Сохранить',
    removing: 'Удаление…',
    confirmRemoveTitle: 'Удалить канал',
    confirmRemoveText: 'Уверены, что хотите удалить канал #{{name}}?',
    cancel: 'Отмена',
  },
  errors: {
    pageNotFound: 'Страница не найдена',
    goHome: 'На главную',
  },
};

const enTranslations = {
  app: {
    title: 'Hexlet Chat',
  },
  auth: {
    login: 'Log in',
    signup: 'Sign up',
    logout: 'Log out',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm password',
    loginButton: 'Log in',
    signupButton: 'Sign up',
    haveAccount: 'I already have an account',
    loginErrorFallback: 'Login error',
    signupErrorFallback: 'Signup error',
    userExists: 'User with this name already exists',
    passwordHint: 'At least 6 characters',
    showPassword: 'Show',
    hidePassword: 'Hide',
  },
  validation: {
    required: 'Required field',
    usernameLength: 'From 3 to 20 characters',
    passwordMin: 'At least 6 characters',
    passwordsMustMatch: 'Passwords must match',
    channelNameLength: 'From 3 to 20 characters',
    mustBeUnique: 'Must be unique',
  },
  chat: {
    loading: 'Loading chat…',
    loadError: 'Failed to load chat',
    offlineNotice: 'No connection. Messages may be delayed.',
    channels: 'Channels',
    selectChannel: 'Select a channel',
    noMessages: 'No messages yet',
    messageInputPlaceholder: 'Enter a message…',
    messageInputAriaLabel: 'Message text',
    send: 'Send',
    sending: 'Sending…',
    addChannel: 'Add channel',
    renameChannel: 'Rename channel',
    removeChannel: 'Remove channel',
    channelName: 'Channel name',
    newChannelPlaceholder: 'Channel name',
    creating: 'Creating…',
    create: 'Create',
    saving: 'Saving…',
    save: 'Save',
    removing: 'Removing…',
    confirmRemoveTitle: 'Remove channel',
    confirmRemoveText: 'Are you sure you want to remove channel #{{name}}?',
    cancel: 'Cancel',
  },
  errors: {
    pageNotFound: 'Page not found',
    goHome: 'Go home',
  },
};

const resources = {
  ru: {
    translation: ruTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
