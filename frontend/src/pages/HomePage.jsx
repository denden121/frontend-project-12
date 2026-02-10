import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Button,
  Dropdown,
  Modal,
  Form as RBForm,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  fetchChatData,
  setCurrentChannelId,
  sendMessage,
  createChannel,
  renameChannel,
  removeChannel,
} from '../slices/chatSlice';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../hooks/useSocket';

function HomePage() {
  const dispatch = useDispatch();
  const { token, username } = useAuth();
  const [inputBody, setInputBody] = useState('');
  const [menuChannelId, setMenuChannelId] = useState(null);
  const [modal, setModal] = useState({ type: null, channelId: null });

  const {
    channels,
    messages,
    currentChannelId,
    status,
    error,
    sendStatus,
    sendError,
    socketConnected,
    creatingChannel,
    renamingChannelId,
    removingChannelId,
    channelsError,
  } = useSelector((state) => state.chat);
  const { t } = useTranslation();

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

  const openAddModal = () => {
    setModal({ type: 'add', channelId: null });
  };

  const openRenameModal = (channelId) => {
    setModal({ type: 'rename', channelId });
  };

  const openRemoveModal = (channelId) => {
    setModal({ type: 'remove', channelId });
  };

  const closeModal = () => {
    setModal({ type: null, channelId: null });
  };

  const currentChannel = channels.find((channel) => channel.id === currentChannelId) ?? null;
  const currentChannelMessages = messages.filter(
    (message) => message.channelId === currentChannelId,
  );
  const isSending = sendStatus === 'loading';
  const activeModalChannel = channels.find((c) => c.id === modal.channelId) ?? null;

  const existingNames = channels.map((c) => c.name.toLowerCase());

  return (
    <div className="chat-page">
      {status === 'loading' && <p>{t('chat.loading')}</p>}
      {status === 'failed' && <p>{error || t('chat.loadError')}</p>}

      {status === 'succeeded' && (
        <>
          {!socketConnected && (
            <p className="chat-status chat-status--offline">
              {t('chat.offlineNotice')}
            </p>
          )}
          <div className="chat-layout">
            <aside className="chat-layout__sidebar">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ margin: 0 }}>{t('chat.channels')}</h2>
                <Button
                  type="button"
                  size="sm"
                  variant="outline-primary"
                  onClick={openAddModal}
                >
                  +
                </Button>
              </div>
              <ul className="channels-list">
                {channels.map((channel) => (
                  <li key={channel.id}>
                    <div className="channels-list__item-wrapper">
                      <button
                        type="button"
                        onClick={() => handleSelectChannel(channel.id)}
                        className={`channels-list__item${
                          channel.id === currentChannelId ? ' channels-list__item--active' : ''
                        }`}
                      >
                        <span className="channels-list__name">
                          #
                          {' '}
                          {channel.name}
                        </span>
                      </button>
                      {channel.removable && (
                        <Dropdown
                          className="channels-list__menu"
                          show={menuChannelId === channel.id}
                          onToggle={(isOpen) => setMenuChannelId(isOpen ? channel.id : null)}
                        >
                          <Dropdown.Toggle
                            size="sm"
                            variant="outline-secondary"
                            className="channels-list__menu-button"
                          >
                            ⋯
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end">
                            <Dropdown.Item
                              onClick={() => openRenameModal(channel.id)}
                            >
                              Переименовать
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => openRemoveModal(channel.id)}
                            >
                              Удалить
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </aside>

            <main className="chat-layout__main">
              <h2>{currentChannel ? `# ${currentChannel.name}` : 'Выберите канал'}</h2>
              <div className="chat-messages">
                {currentChannelMessages.map((message) => (
                  <div key={message.id} className="chat-message">
                    <span className="chat-message__author">
                      {message.username}
                      :
                    </span>
                    <span>{message.body}</span>
                  </div>
                ))}
                {currentChannelMessages.length === 0 && <p>{t('chat.noMessages')}</p>}
              </div>

              <form className="chat-form" onSubmit={handleSubmit}>
                {sendError && (
                  <Alert variant="danger" className="chat-form__error" role="alert">
                    {sendError}
                  </Alert>
                )}
                <div className="chat-form__row">
                  <input
                    className="chat-form__input"
                    value={inputBody}
                    onChange={(e) => setInputBody(e.target.value)}
                    placeholder={t('chat.messageInputPlaceholder')}
                    disabled={isSending}
                    aria-label={t('chat.messageInputAriaLabel')}
                  />
                  <button
                    type="submit"
                    className="chat-form__submit"
                    disabled={isSending || !inputBody.trim()}
                  >
                    {isSending ? t('chat.sending') : t('chat.send')}
                  </button>
                </div>
              </form>
            </main>
          </div>

          <AddChannelModal
            isOpen={modal.type === 'add'}
            onClose={closeModal}
            existingNames={existingNames}
            creating={creatingChannel}
            error={channelsError}
            token={token}
            dispatch={dispatch}
          />
          {activeModalChannel && modal.type === 'rename' && (
            <RenameChannelModal
              channel={activeModalChannel}
              onClose={closeModal}
              existingNames={existingNames.filter(
                (name) => name !== activeModalChannel.name.toLowerCase(),
              )}
              renamingChannelId={renamingChannelId}
              error={channelsError}
              token={token}
              dispatch={dispatch}
            />
          )}
          {activeModalChannel && modal.type === 'remove' && (
            <RemoveChannelModal
              channel={activeModalChannel}
              onClose={closeModal}
              removingChannelId={removingChannelId}
              error={channelsError}
              token={token}
              dispatch={dispatch}
            />
          )}
        </>
      )}
    </div>
  );
}

function AddChannelModal({
  isOpen,
  onClose,
  existingNames,
  creating,
  error,
  token,
  dispatch,
}) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const schema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, t('validation.channelNameLength'))
      .max(20, t('validation.channelNameLength'))
      .notOneOf(existingNames, t('validation.mustBeUnique'))
      .required(t('validation.required')),
  });

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.addChannel')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await dispatch(createChannel({
              name: values.name.trim(),
              token,
            })).unwrap();
            onClose();
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Modal.Body>
              <RBForm.Group className="modal-field" controlId="newChannelName">
                <RBForm.Label>{t('chat.channelName')}</RBForm.Label>
                <Field
                  name="name"
                  as={RBForm.Control}
                  autoFocus
                  placeholder={t('chat.newChannelPlaceholder')}
                />
                {errors.name && touched.name && (
                  <div className="modal-error">{errors.name}</div>
                )}
              </RBForm.Group>
              {error && <div className="modal-error">{error}</div>}
            </Modal.Body>
            <Modal.Footer className="modal-actions">
              <Button variant="secondary" type="button" onClick={onClose}>
                {t('chat.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || creating}
              >
                {creating ? t('chat.creating') : t('chat.create')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

function RenameChannelModal({
  channel,
  onClose,
  existingNames,
  renamingChannelId,
  error,
  token,
  dispatch,
}) {
  const { t } = useTranslation();
  if (!channel) return null;

  const schema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, t('validation.channelNameLength'))
      .max(20, t('validation.channelNameLength'))
      .notOneOf(existingNames, t('validation.mustBeUnique'))
      .required(t('validation.required')),
  });

  const isRenaming = renamingChannelId === channel.id;

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: channel.name }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await dispatch(renameChannel({
              id: channel.id,
              name: values.name.trim(),
              token,
            })).unwrap();
            onClose();
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Modal.Body>
              <RBForm.Group className="modal-field" controlId="renameChannelName">
                <RBForm.Label>{t('chat.channelName')}</RBForm.Label>
                <Field
                  name="name"
                  as={RBForm.Control}
                  autoFocus
                />
                {errors.name && touched.name && (
                  <div className="modal-error">{errors.name}</div>
                )}
              </RBForm.Group>
              {error && <div className="modal-error">{error}</div>}
            </Modal.Body>
            <Modal.Footer className="modal-actions">
              <Button variant="secondary" type="button" onClick={onClose}>
                {t('chat.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting || isRenaming}
              >
                {isRenaming ? t('chat.saving') : t('chat.save')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

function RemoveChannelModal({
  channel,
  onClose,
  removingChannelId,
  error,
  token,
  dispatch,
}) {
  const { t } = useTranslation();
  if (!channel) return null;

  const isRemoving = removingChannelId === channel.id;

  const handleRemove = async () => {
    await dispatch(removeChannel({ id: channel.id, token })).unwrap();
    onClose();
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('chat.confirmRemoveTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('chat.confirmRemoveText', { name: channel.name })}</p>
        {error && <div className="modal-error">{error}</div>}
      </Modal.Body>
      <Modal.Footer className="modal-actions">
        <Button variant="secondary" type="button" onClick={onClose}>
          {t('chat.cancel')}
        </Button>
        <Button
          variant="danger"
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
        >
          {isRemoving ? t('chat.removing') : t('chat.removeChannel')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default HomePage;
