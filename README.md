### Hexlet tests and linter status:
[![Actions Status](https://github.com/denden121/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/denden121/frontend-project-12/actions)

## Деплой

Задеплоенное приложение: [frontend-project-12](TEMP)

## Локальный запуск

```bash
# Сборка фронтенда
make build

# Запуск сервера (статику из frontend/dist и API на порту 5001)
make start
```

Для разработки: в одном терминале `make start`, в другом `cd frontend && npm run dev`. Запросы к `/api` проксируются на сервер (см. `frontend/vite.config.js`).