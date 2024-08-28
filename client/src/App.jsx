
import Login from './components/Login'
import { useEffect, useState } from 'react';
import Signup from './components/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home.jsx';
import MainLayout from './components/MainLayout';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice.jsx';
import { setLikeNotification } from './redux/rtnSlice';
import CheckPost from './components/CheckPost';
// import { useState } from 'react';
const browserRouter = createBrowserRouter([
  {
    Path:"/",
    element:<MainLayout/>,
    children:[
      {
        path:"/",
        element:<CheckPost><Home/></CheckPost>
      },
      {
        path:"/profile/:id",
        element:<CheckPost><Profile/></CheckPost>
      },
      {
        path:"/account/edit",
        element:<EditProfile/>
      },
      {
        path:"/chat",
        element:<ChatPage/>
      }
    ]
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/signup",
    element:<Signup/>
  },
])
function App() {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000',{
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      // listen all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        console.log(onlineUsers);
        dispatch(setOnlineUsers(onlineUsers));
        console.log(onlineUsers)
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App