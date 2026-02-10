import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
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
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      app: {
        title: 'Hexlet Chat',
      },
      nav: {
        login: 'Войти',
        signup: 'Регистрация',
        logout: 'Выйти',
      },
      auth: {
        login: {
          title: 'Вход',
          username: 'Имя пользователя',
          password: 'Пароль',
          submit: 'Войти',
          toSignup: 'Регистрация',
          error: 'Ошибка авторизации',
        },
        signup: {
          title: 'Регистрация',
          username: 'Имя пользователя',
          password: 'Пароль',
          confirmPassword: 'Подтверждение пароля',
          passwordHint: 'Не менее 6 символов',
          submit: 'Зарегистрироваться',
          toLogin: 'У меня уже есть аккаунт',
          userExists: 'Пользователь с таким именем уже существует',
          error: 'Ошибка регистрации',
        },
        errors: {
          required: 'Обязательное поле',
          usernameLength: 'От 3 до 20 символов',
          passwordMin: 'Не менее 6 символов',
          passwordsMustMatch: 'Пароли должны совпадать',
        },
      },
      chat: {
        loading: 'Загрузка чата...',
        loadError: 'Ошибка загрузки чата',
        noConnection: 'Нет соединения. Сообщения могут приходить с задержкой.',
        channels: 'Каналы',
        chooseChannel: 'Выберите канал',
        noMessages: 'Сообщений пока нет',
        inputPlaceholder: 'Введите сообщение...',
        inputAriaLabel: 'Текст сообщения',
        send: 'Отправить',
        sending: 'Отправка…',
        addChannel: 'Добавить канал',
        renameChannel: 'Переименовать канал',
        removeChannel: 'Удалить канал',
        channelName: 'Имя канала',
        channelNamePlaceholder: 'Имя канала',
        cancel: 'Отмена',
        create: 'Создать',
        creating: 'Создание…',
        save: 'Сохранить',
        saving: 'Сохранение…',
        removing: 'Удаление…',
        confirmRemove: 'Уверены, что хотите удалить канал #{{name}}?',
        validations: {
          nameRequired: 'Обязательное поле',
          nameLength: 'От 3 до 20 символов',
          nameUnique: 'Должно быть уникальным',
        },
      },
      errors: {
        notFoundTitle: '404',
        notFoundMessage: 'Страница не найдена',
        toHome: 'На главную',
      },
    },
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

