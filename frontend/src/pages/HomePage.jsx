import { useEffect, useState } from 'react'
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
    if (!socketConnected && status === 'succeeded') {
      toast.warning(t('errors.networkError'))
    }
  }, [socketConnected, status, t])

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
  const isSending = sendStatus === 'loading'
  const activeModalChannel = channels.find(c => c.id === modal.channelId) ?? null

  const existingNames = channels.map(c => c.name.toLowerCase())

  return (
    <div className="d-flex flex-column flex-grow-1">
      {status === 'loading' && <p>{t('chat.loading')}</p>}
      {status === 'failed' && <p>{error || t('chat.loadError')}</p>}

      {status === 'succeeded' && (
        <>
          {!socketConnected && (
            <p className="text-warning small mb-2">
              {t('chat.offlineNotice')}
            </p>
          )}
          <div className="row flex-grow-1 g-3">
            <aside className="col-12 col-md-4 col-lg-3">
              <div className="border rounded p-3 overflow-auto">
                <div className="d-flex justify-content-between align-items-center mb-2">
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
                <ListGroup variant="flush">
                  {channels.map(channel => (
                    <ListGroup.Item
                      key={channel.id}
                      as="li"
                      className="d-flex justify-content-between align-items-center px-2 py-1"
                      variant={channel.id === currentChannelId ? 'primary' : undefined}
                      action={channel.id !== currentChannelId}
                      active={channel.id === currentChannelId}
                      onClick={channel.id !== currentChannelId ? () => handleSelectChannel(channel.id) : undefined}
                    >
                      <span className="text-truncate flex-grow-1">
                        #
                        {' '}
                        {channel.name}
                      </span>
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

            <main className="col border rounded p-3 d-flex flex-column overflow-hidden min-vh-0">
              <h2 className="h5 mb-3">
                {currentChannel ? `# ${currentChannel.name}` : t('chat.selectChannel')}
              </h2>
              <div className="overflow-auto flex-grow-1 mb-3">
                {currentChannelMessages.map(message => (
                  <div key={message.id} className="mb-2">
                    <span className="fw-bold me-2">{message.username}:</span>
                    <span>{cleanText(message.body)}</span>
                  </div>
                ))}
                {currentChannelMessages.length === 0 && <p className="text-muted">{t('chat.noMessages')}</p>}
              </div>

              <Form onSubmit={handleSubmit} className="mt-auto pt-2 border-top">
                {sendError && (
                  <Alert variant="danger" className="py-2 mb-2" role="alert">
                    {sendError}
                  </Alert>
                )}
                <div className="d-flex gap-2">
                  <Form.Control
                    value={inputBody}
                    onChange={e => setInputBody(e.target.value)}
                    placeholder={t('chat.messageInputPlaceholder')}
                    disabled={isSending}
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
