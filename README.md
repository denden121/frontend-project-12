### Hexlet tests and linter status:

[![Actions Status](https://github.com/denden121/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/denden121/frontend-project-12/actions)

### Qlty (качество кода и покрытие)

[![Maintainability](https://qlty.sh/badges/cd8a179b-108f-4627-beb0-bc560c8e35bb/maintainability.svg)](https://qlty.sh/gh/denden121/projects/frontend-project-12)
[![Code Coverage](https://qlty.sh/badges/cd8a179b-108f-4627-beb0-bc560c8e35bb/coverage.svg)](https://qlty.sh/gh/denden121/projects/frontend-project-12)

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
