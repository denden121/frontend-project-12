import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addMessage, setSocketConnected } from '../slices/chatSlice';

export function useSocket(enabled) {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const socket = io({
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      dispatch(setSocketConnected(true));
    });

    socket.on('disconnect', () => {
      dispatch(setSocketConnected(false));
    });

    socket.on('newMessage', (payload) => {
      dispatch(addMessage(payload));
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('newMessage');
      socket.disconnect();
      socketRef.current = null;
      dispatch(setSocketConnected(false));
    };
  }, [enabled, dispatch]);

  return socketRef.current;
}
