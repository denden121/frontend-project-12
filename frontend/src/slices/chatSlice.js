import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (token, { rejectWithValue }) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [channelsResponse, messagesResponse] = await Promise.all([
        axios.get('/api/v1/channels', { headers }),
        axios.get('/api/v1/messages', { headers }),
      ]);

      return {
        channels: channelsResponse.data,
        messages: messagesResponse.data,
      };
    } catch (error) {
      const message = error.response?.data?.message ?? error.message ?? 'Ошибка загрузки данных чата';
      return rejectWithValue(message);
    }
  },
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ body, channelId, username, token }, { rejectWithValue }) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.post(
        '/api/v1/messages',
        { body, channelId, username },
        { headers },
      );
      return data;
    } catch (error) {
      const message = error.response?.data?.message ?? error.message ?? 'Ошибка отправки сообщения';
      return rejectWithValue(message);
    }
  },
);

export const createChannel = createAsyncThunk(
  'chat/createChannel',
  async ({ name, token }, { rejectWithValue }) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.post(
        '/api/v1/channels',
        { name },
        { headers },
      );
      return data;
    } catch (error) {
      const message = error.response?.data?.message ?? error.message ?? 'Ошибка создания канала';
      return rejectWithValue(message);
    }
  },
);

export const renameChannel = createAsyncThunk(
  'chat/renameChannel',
  async ({ id, name, token }, { rejectWithValue }) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.patch(
        `/api/v1/channels/${id}`,
        { name },
        { headers },
      );
      return data;
    } catch (error) {
      const message = error.response?.data?.message ?? error.message ?? 'Ошибка переименования канала';
      return rejectWithValue(message);
    }
  },
);

export const removeChannel = createAsyncThunk(
  'chat/removeChannel',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.delete(
        `/api/v1/channels/${id}`,
        { headers },
      );
      return data;
    } catch (error) {
      const message = error.response?.data?.message ?? error.message ?? 'Ошибка удаления канала';
      return rejectWithValue(message);
    }
  },
);

const normalizeChannel = (channel) => ({
  id: String(channel.id),
  name: channel.name,
  removable: Boolean(channel.removable),
});

const normalizeMessage = (msg) => ({
  id: String(msg.id),
  body: msg.body,
  channelId: String(msg.channelId),
  username: msg.username,
});

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
  status: 'idle',
  error: null,
  sendStatus: 'idle',
  sendError: null,
  socketConnected: false,
  creatingChannel: false,
  renamingChannelId: null,
  removingChannelId: null,
  channelsError: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChannelId(state, action) {
      state.currentChannelId = action.payload;
    },
    addMessage(state, action) {
      const normalized = normalizeMessage(action.payload);
      if (!state.messages.some((m) => m.id === normalized.id)) {
        state.messages.push(normalized);
      }
    },
    setSocketConnected(state, action) {
      state.socketConnected = action.payload;
    },
    channelAdded(state, action) {
      const normalized = normalizeChannel(action.payload);
      const existing = state.channels.find((c) => c.id === normalized.id);
      if (existing) {
        existing.name = normalized.name;
        existing.removable = normalized.removable;
      } else {
        state.channels.push(normalized);
      }
    },
    channelRenamed(state, action) {
      const normalized = normalizeChannel(action.payload);
      const existing = state.channels.find((c) => c.id === normalized.id);
      if (existing) {
        existing.name = normalized.name;
      }
    },
    channelRemoved(state, action) {
      const removedId = String(action.payload.id);
      state.channels = state.channels.filter((c) => c.id !== removedId);
      state.messages = state.messages.filter((m) => m.channelId !== removedId);
      if (state.currentChannelId === removedId) {
        const general = state.channels.find((c) => c.name && c.name.toLowerCase() === 'general');
        state.currentChannelId = general ? general.id : (state.channels[0]?.id ?? null);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.channels = action.payload.channels.map(normalizeChannel);
        state.messages = action.payload.messages.map(normalizeMessage);
        if (!state.currentChannelId && state.channels.length > 0) {
          const general = state.channels.find((c) => c.name && c.name.toLowerCase() === 'general');
          state.currentChannelId = general ? general.id : state.channels[0].id;
        }
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Не удалось загрузить данные чата';
      })
      .addCase(sendMessage.pending, (state) => {
        state.sendStatus = 'loading';
        state.sendError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendStatus = 'idle';
        state.sendError = null;
        const normalized = normalizeMessage(action.payload);
        if (!state.messages.some((m) => m.id === normalized.id)) {
          state.messages.push(normalized);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendStatus = 'failed';
        state.sendError = action.payload ?? 'Ошибка отправки';
      })
      .addCase(createChannel.pending, (state) => {
        state.creatingChannel = true;
        state.channelsError = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.creatingChannel = false;
        const normalized = normalizeChannel(action.payload);
        const existing = state.channels.find((c) => c.id === normalized.id);
        if (!existing) {
          state.channels.push(normalized);
        }
        state.currentChannelId = normalized.id;
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.creatingChannel = false;
        state.channelsError = action.payload ?? 'Не удалось создать канал';
      })
      .addCase(renameChannel.pending, (state, action) => {
        state.renamingChannelId = action.meta.arg.id;
        state.channelsError = null;
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        state.renamingChannelId = null;
        const normalized = normalizeChannel(action.payload);
        const existing = state.channels.find((c) => c.id === normalized.id);
        if (existing) {
          existing.name = normalized.name;
        }
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.channelsError = action.payload ?? 'Не удалось переименовать канал';
        state.renamingChannelId = null;
      })
      .addCase(removeChannel.pending, (state, action) => {
        state.removingChannelId = action.meta.arg.id;
        state.channelsError = null;
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        state.removingChannelId = null;
        const removedId = String(action.payload.id);
        state.channels = state.channels.filter((c) => c.id !== removedId);
        state.messages = state.messages.filter((m) => m.channelId !== removedId);
        if (state.currentChannelId === removedId) {
          const general = state.channels.find((c) => c.name && c.name.toLowerCase() === 'general');
          state.currentChannelId = general ? general.id : (state.channels[0]?.id ?? null);
        }
      })
      .addCase(removeChannel.rejected, (state, action) => {
        state.channelsError = action.payload ?? 'Не удалось удалить канал';
        state.removingChannelId = null;
      });
  },
});

export const {
  setCurrentChannelId,
  addMessage,
  setSocketConnected,
  channelAdded,
  channelRenamed,
  channelRemoved,
} = chatSlice.actions;

export default chatSlice.reducer;

