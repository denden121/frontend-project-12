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

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
  status: 'idle',
  error: null,
  sendStatus: 'idle',
  sendError: null,
  socketConnected: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChannelId(state, action) {
      state.currentChannelId = action.payload;
    },
    addMessage(state, action) {
      const msg = action.payload;
      const normalized = {
        id: String(msg.id),
        body: msg.body,
        channelId: String(msg.channelId),
        username: msg.username,
      };
      if (!state.messages.some((m) => m.id === normalized.id)) {
        state.messages.push(normalized);
      }
    },
    setSocketConnected(state, action) {
      state.socketConnected = action.payload;
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
        state.channels = action.payload.channels;
        state.messages = action.payload.messages;
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
        const msg = action.payload;
        const normalized = {
          id: String(msg.id),
          body: msg.body,
          channelId: String(msg.channelId),
          username: msg.username,
        };
        if (!state.messages.some((m) => m.id === normalized.id)) {
          state.messages.push(normalized);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendStatus = 'failed';
        state.sendError = action.payload ?? 'Ошибка отправки';
      });
  },
});

export const { setCurrentChannelId, addMessage, setSocketConnected } = chatSlice.actions;

export default chatSlice.reducer;

