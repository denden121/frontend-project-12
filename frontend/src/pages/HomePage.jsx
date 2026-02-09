import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChatData,
  setCurrentChannelId,
  sendMessage,
} from '../slices/chatSlice';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../hooks/useSocket';

function HomePage() {
  const dispatch = useDispatch();
  const { token, username, logout } = useAuth();
  const [inputBody, setInputBody] = useState('');

  const {
    channels,
    messages,
    currentChannelId,
    status,
    error,
    sendStatus,
    sendError,
    socketConnected,
  } = useSelector((state) => state.chat);

  useSocket(!!token && status === 'succeeded');

  useEffect(() => {
    if (token && status === 'idle') {
      dispatch(fetchChatData(token));
    }
  }, [dispatch, token, status]);

  const handleSelectChannel = (channelId) => {
    dispatch(setCurrentChannelId(channelId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = inputBody.trim();
    if (!body || !currentChannelId || sendStatus === 'loading') return;
    dispatch(
      sendMessage({
        body,
        channelId: currentChannelId,
        username,
        token,
      }),
    ).then((result) => {
      if (sendMessage.fulfilled.match(result)) {
        setInputBody('');
      }
    });
  };

  const currentChannel = channels.find((channel) => channel.id === currentChannelId) ?? null;
  const currentChannelMessages = messages.filter(
    (message) => message.channelId === currentChannelId,
  );
  const isSending = sendStatus === 'loading';

  return (
    <div>
      <header style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <h1>Чат</h1>
        <p>
          {username}
          {' · '}
          <button type="button" onClick={logout}>
            Выйти
          </button>
        </p>
      </header>

      {status === 'loading' && <p>Загрузка чата...</p>}
      {status === 'failed' && <p>{error}</p>}

      {status === 'succeeded' && (
        <>
          {!socketConnected && (
            <p className="chat-status chat-status--offline">Нет соединения. Сообщения могут приходить с задержкой.</p>
          )}
          <div className="chat-layout">
            <aside className="chat-layout__sidebar">
              <h2>Каналы</h2>
              <ul className="channels-list">
                {channels.map((channel) => (
                  <li key={channel.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectChannel(channel.id)}
                      className={`channels-list__item${channel.id === currentChannelId ? ' channels-list__item--active' : ''}`}
                    >
                      {channel.name}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <main className="chat-layout__main">
              <h2>{currentChannel ? currentChannel.name : 'Выберите канал'}</h2>
              <div className="chat-messages">
                {currentChannelMessages.map((message) => (
                  <div key={message.id} className="chat-message">
                    <span className="chat-message__author">{message.username}:</span>
                    <span>{message.body}</span>
                  </div>
                ))}
                {currentChannelMessages.length === 0 && <p>Сообщений пока нет</p>}
              </div>

              <form className="chat-form" onSubmit={handleSubmit}>
                {sendError && (
                  <div className="chat-form__error" role="alert">
                    {sendError}
                  </div>
                )}
                <div className="chat-form__row">
                  <input
                    className="chat-form__input"
                    value={inputBody}
                    onChange={(e) => setInputBody(e.target.value)}
                    placeholder="Введите сообщение..."
                    disabled={isSending}
                    aria-label="Текст сообщения"
                  />
                  <button
                    type="submit"
                    className="chat-form__submit"
                    disabled={isSending || !inputBody.trim()}
                  >
                    {isSending ? 'Отправка…' : 'Отправить'}
                  </button>
                </div>
              </form>
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
