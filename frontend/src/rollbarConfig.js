import Rollbar from 'rollbar'

const enabled = import.meta.env.PROD && Boolean(import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN)

export const rollbarInstance = enabled
  ? new Rollbar({
    accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: import.meta.env.VITE_ROLLBAR_ENV || 'production',
    payload: {
      client: {
        javascript: {
          source_map_enabled: true,
          guess_uncaught_frames: true,
        },
      },
    },
  })
  : null

export const isRollbarEnabled = enabled

export default rollbarInstance
