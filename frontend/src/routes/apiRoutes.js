const API_PREFIX = '/api/v1'

export default {
  login: () => `${API_PREFIX}/login`,
  signup: () => `${API_PREFIX}/signup`,
  channels: () => `${API_PREFIX}/channels`,
  channel: id => `${API_PREFIX}/channels/${id}`,
  messages: () => `${API_PREFIX}/messages`,
}
