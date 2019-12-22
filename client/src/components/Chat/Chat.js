import React, { useState, useEffect } from "react";
// queryString same as querySelector in angular
import queryString from "query-string";
//for socket io
import io from "socket.io-client";
import TextContainer from "../TextContainer/TextContainer";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";

import "./Chat.css";

let socket;

const Chat = ({ location }) => {
  // using state in react hook
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const ENDPOINT = "https://react-chat-app1.herokuapp.com/";

  useEffect(() => {
    // this is used to show name="abhinav"&room="xyz" to url ie localhost:3000/chat?name="abhinav"&room="xyz"
    const { name, room } = queryString.parse(location.search);

    // socket joined to backend
    socket = io(ENDPOINT);
    setRoom(room);
    setName(name);

    // for emit diiff event using socket
    // {name:name,join:join} same in js syntax we can just write name ,room
    socket.emit("join", { name, room }, error => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", message => {
      setMessages([...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.emit("disconnect");

      socket.off();
    };
  }, [messages]);

  const sendMessage = event => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
