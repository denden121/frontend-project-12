### Hexlet tests and linter status:
[![Actions Status](https://github.com/denden121/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/denden121/frontend-project-12/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/<INSERT_BADGE_ID>/maintainability)](https://codeclimate.com/github/denden121/frontend-project-12/maintainability)

## Деплой

Задеплоенное приложение: [frontend-project-12](https://frontend-project-12-1wp6.onrender.com/)

## Локальный запуск

```bash
# Сборка фронтенда
make build

# Запуск сервера (статику из frontend/dist и API на порту 5001)
make start
```

Для разработки: в одном терминале `make start`, в другом `cd frontend && npm run dev`. Запросы к `/api` проксируются на сервер (см. `frontend/vite.config.js`).