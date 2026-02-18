import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  Button,
  Dropdown,
  Form,
  ListGroup,
} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { cleanText } from '../utils/profanity'
import {
  fetchChatData,
  setCurrentChannelId,
  sendMessage,
} from '../store/slices/chatSlice'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../hooks/useSocket'
import {
  AddChannelModal,
  RenameChannelModal,
  RemoveChannelModal,
} from '../components/modals'

function HomePage() {
  const dispatch = useDispatch()
  const { token, username } = useAuth()
  const [inputBody, setInputBody] = useState('')
  const [menuChannelId, setMenuChannelId] = useState(null)
  const [modal, setModal] = useState({ type: null, channelId: null })
  const messageInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const wasSocketConnectedRef = useRef(false)

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
  } = useSelector(state => state.chat)
  const { t } = useTranslation()

  useSocket(!!token && status === 'succeeded')

  useEffect(() => {
    if (token && status === 'idle') {
      dispatch(fetchChatData(token))
    }
  }, [dispatch, token, status])

  useEffect(() => {
    if (status === 'failed') {
      toast.error(error || t('errors.loadChatErrorToast'))
    }
  }, [status, error, t])

  useEffect(() => {
    if (socketConnected) {
      wasSocketConnectedRef.current = true
    }
    if (status === 'succeeded' && !socketConnected && wasSocketConnectedRef.current) {
      toast.warning(t('errors.networkError'))
    }
  }, [socketConnected, status, t])

  useEffect(() => {
    if (status === 'succeeded' && currentChannelId) {
      messageInputRef.current?.focus()
    }
  }, [status, currentChannelId])

  const scrollMessagesToBottom = (behavior = 'auto') => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ block: 'end', behavior })
    })
  }

  const handleSelectChannel = (channelId) => {
    dispatch(setCurrentChannelId(channelId))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const body = inputBody.trim()
    if (!body || !currentChannelId || sendStatus === 'loading') return
    dispatch(
      sendMessage({
        body,
        channelId: currentChannelId,
        username,
        token,
      }),
    ).then((result) => {
      if (sendMessage.fulfilled.match(result)) {
        setInputBody('')
        messageInputRef.current?.focus()
        scrollMessagesToBottom('smooth')
      }
    })
  }

  const openAddModal = () => {
    setModal({ type: 'add', channelId: null })
  }

  const openRenameModal = (channelId) => {
    setModal({ type: 'rename', channelId })
  }

  const openRemoveModal = (channelId) => {
    setModal({ type: 'remove', channelId })
  }

  const closeModal = () => {
    setModal({ type: null, channelId: null })
  }

  const currentChannel = channels.find(channel => channel.id === currentChannelId) ?? null
  const currentChannelMessages = messages.filter(
    message => message.channelId === currentChannelId,
  )
  const lastCurrentChannelMessageId = currentChannelMessages.at(-1)?.id ?? null
  const isSending = sendStatus === 'loading'
  const activeModalChannel = channels.find(c => c.id === modal.channelId) ?? null

  const existingNames = channels.map(c => c.name.toLowerCase())

  useEffect(() => {
    if (status !== 'succeeded' || !currentChannelId) return
    scrollMessagesToBottom('auto')
  }, [status, currentChannelId, lastCurrentChannelMessageId])

  const rootClassName = status === 'succeeded'
    ? 'flex-grow-1 min-h-0 overflow-hidden d-grid gap-3'
    : 'd-flex flex-column flex-grow-1 min-h-0 overflow-hidden'
  const rootStyle = status === 'succeeded'
    ? {
        gridTemplateColumns: '260px 1fr',
        gridTemplateRows: !socketConnected ? 'auto 1fr' : '1fr',
      }
    : undefined

  return (
    <div className={rootClassName} style={rootStyle}>
      {status === 'loading' && <p>{t('chat.loading')}</p>}
      {status === 'failed' && <p>{error || t('chat.loadError')}</p>}

      {status === 'succeeded' && (
        <>
          {!socketConnected && (
            <p className="text-warning small mb-2" style={{ gridColumn: '1 / -1' }}>{t('chat.offlineNotice')}</p>
          )}
          <aside className="d-flex flex-column border rounded p-3 min-h-0 overflow-hidden">
            <div className="d-flex justify-content-between align-items-center mb-2 flex-shrink-0">
              <h2 className="h5 mb-0">{t('chat.channels')}</h2>
              <Button
                type="button"
                size="sm"
                variant="outline-primary"
                onClick={openAddModal}
              >
                +
              </Button>
            </div>
            <div className="overflow-auto flex-grow-1 min-h-0">
              <ListGroup variant="flush">
                {channels.map(channel => (
                  <ListGroup.Item
                    key={channel.id}
                    as="li"
                    className="d-flex justify-content-between align-items-center px-2 py-1"
                    variant={channel.id === currentChannelId ? 'primary' : undefined}
                    active={channel.id === currentChannelId}
                  >
                    <button
                      type="button"
                      className={`list-group-item list-group-item-action border-0 p-0 bg-transparent text-start text-truncate flex-grow-1 ${channel.id === currentChannelId ? 'active' : ''}`}
                      onClick={() => handleSelectChannel(channel.id)}
                      aria-label={channel.name}
                    >
                      #
                      {' '}
                      {channel.name}
                    </button>
                    {channel.removable && (
                      <Dropdown
                        onClick={e => e.stopPropagation()}
                        show={menuChannelId === channel.id}
                        onToggle={isOpen => setMenuChannelId(isOpen ? channel.id : null)}
                      >
                        <Dropdown.Toggle
                          size="sm"
                          variant="outline-secondary"
                          className="py-0"
                        >
                          <span className="visually-hidden">{t('chat.manageChannel')}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                          <Dropdown.Item onClick={() => openRenameModal(channel.id)}>
                            {t('chat.renameChannel')}
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => openRemoveModal(channel.id)}>
                            {t('chat.removeChannel')}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </aside>

          <main className="d-flex flex-column flex-grow-1 min-h-0 min-vw-0 border rounded p-3 overflow-hidden">
            <h2 className="h5 mb-3 flex-shrink-0">
              {currentChannel ? `# ${currentChannel.name}` : t('chat.selectChannel')}
            </h2>
            <div className="overflow-auto flex-grow-1 mb-3 min-h-0">
              {currentChannelMessages.map(message => (
                <div key={message.id} className="mb-2">
                  <span className="fw-bold me-2">
                    {message.username}
                    :
                  </span>
                  <span>{cleanText(message.body)}</span>
                </div>
              ))}
              {currentChannelMessages.length === 0 && <p className="text-muted">{t('chat.noMessages')}</p>}
              <div ref={messagesEndRef} />
            </div>

            <Form onSubmit={handleSubmit} className="mt-auto pt-2 border-top flex-shrink-0">
              {sendError && (
                <Alert variant="danger" className="py-2 mb-2" role="alert">
                  {sendError}
                </Alert>
              )}
              <div className="d-flex gap-2">
                <Form.Control
                  ref={messageInputRef}
                  value={inputBody}
                  onChange={e => setInputBody(e.target.value)}
                  placeholder={t('chat.messageInputPlaceholder')}
                  disabled={isSending}
                  autoComplete="off"
                  aria-label={t('chat.messageInputAriaLabel')}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSending || !inputBody.trim()}
                >
                  {isSending ? t('chat.sending') : t('chat.send')}
                </Button>
              </div>
            </Form>
          </main>

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
                name => name !== activeModalChannel.name.toLowerCase(),
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
  )
}

export default HomePage
