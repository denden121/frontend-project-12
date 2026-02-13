import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import {
  addMessage,
  channelAdded,
  channelRemoved,
  channelRenamed,
  setSocketConnected,
} from '../slices/chatSlice'

export function useSocket(enabled) {
  const dispatch = useDispatch()
  const socketRef = useRef(null)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!enabled) return

    const s = io({
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    })

    socketRef.current = s

    s.on('connect', () => {
      setSocket(s)
      dispatch(setSocketConnected(true))
    })

    s.on('disconnect', () => {
      dispatch(setSocketConnected(false))
    })

    s.on('newMessage', (payload) => {
      dispatch(addMessage(payload))
    })

    s.on('newChannel', (payload) => {
      dispatch(channelAdded(payload))
    })

    s.on('renameChannel', (payload) => {
      dispatch(channelRenamed(payload))
    })

    s.on('removeChannel', (payload) => {
      dispatch(channelRemoved(payload))
    })

    return () => {
      s.off('connect')
      s.off('disconnect')
      s.off('newMessage')
      s.off('newChannel')
      s.off('renameChannel')
      s.off('removeChannel')
      s.disconnect()
      socketRef.current = null
      setSocket(null)
      dispatch(setSocketConnected(false))
    }
  }, [enabled, dispatch])

  return socket
}
