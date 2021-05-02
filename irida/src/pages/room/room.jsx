import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./room.scss";
import firebase from "../../firebase";

import callIcon from "../../images/callIcon.svg";
import ekOutlineIcon from "../../images/ekOutline.svg";

const socket = io.connect("https://ek-backend.herokuapp.com/");

// const socket = io.connect("http://localhost:5000/");

const Room = (props) => {
  const [roomData, setRoomData] = useState(0);
  const [volunteerCert, setVolunteerCert] = useState(0);
  const [me, setMe] = useState(""); //user
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [isVolunteer, setIsVolunteer] = useState(0);
  const [called, setCalled] = useState(0);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket.on("me", (id) => {
      setMe(id);

      const roomRef = firebase
        .database()
        .ref("rooms")
        .child(props.match.params.id.slice(0, 6));
      roomRef.on("value", (snapshot) => {
        if (snapshot.val()) {
          setRoomData(snapshot.val());
          setVolunteerCert(snapshot.val().cert);
        }
      });
      if (props.match.params.id.length === 6) {
        setIsVolunteer(0);

        roomRef.update(
          {
            userSocketId: id,
          },
          (err) => {
            if (err) console.log(err);
          }
        );
      } else {
        setIsVolunteer(1);
        roomRef.update(
          {
            volunteerSocketId: id,
          },
          (err) => {
            if (err) console.log(err);
          }
        );
      }
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, [props.match.params.id]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    setReceivingCall(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    if (isVolunteer) {
      let deleted = 0;
      const vRef = firebase
        .database()
        .ref("Users")
        .orderByChild("profile/cert")
        .equalTo(volunteerCert);
      vRef.on("value", (snapshot) => {
        for (var key in snapshot.val()) {
          const uRef = firebase.database().ref("Users");

          uRef.child(key + "/profile").update(
            {
              engaged: 0,
            },
            (err) => {
              if (err) console.log(err);
            }
          );

          uRef.child(key + "/profile/tempRoomId").remove();
          deleted = 1;
        }
      });
      const roomRef = firebase
        .database()
        .ref("rooms")
        .child(props.match.params.id.slice(0, 6));
      roomRef.remove();

      if (deleted) {
        connectionRef.current.destroy();
        setCallEnded(true);

        window.location.href = "/";
      }
    } else {
      connectionRef.current.destroy();
      setCallEnded(true);

      window.location.href = "/";
    }
  };

  return (
    <Container className="room" fluid>
      <Row className="video-col mt-4">
        <div className="col col-12 col-md-6">
          <h3>You</h3>
          {stream && (
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="video-container my-3"
            />
          )}
        </div>

        <div className="col col-md-6 col-12">
          {callAccepted && !callEnded ? (
            <>
              <h3>{isVolunteer ? "Client" : "Volunteer"}</h3>
              <video
                playsInline
                ref={userVideo}
                autoPlay
                className="video-container"
              />
            </>
          ) : null}
        </div>
      </Row>

      <Row className="justify-content-center">
        <Col md={6} className="py-3 d-flex justify-content-center flex-column">
          <div className="card-container">
            <div className="d-flex">
              <div className="card-section">
                <h3>Client</h3>
                <p className="m-0">{roomData.cient}</p>
              </div>
              <div className=" card-section">
                <h3>Volunteer</h3>
                <p className="m-0">{roomData.volunteer}</p>
              </div>
            </div>
            <div className="card-section d-flex">
              <div>
                <h3>Certification ID</h3>
                <p className="m-0">{roomData.cert}</p>
              </div>

              <div className="profile-img"></div>
            </div>
          </div>
        </Col>
        <Row>
          <Col className="my-md-3 d-flex mb-3 flex-column">
            <div className="card-container">
              <div className="d-flex">
                <div className="d-flex justify-content-center align-items-center card-section">
                  <img
                    src={ekOutlineIcon}
                    alt="ek-icon"
                    className="ek-outline-icon"
                  />
                </div>

                {!isVolunteer && !called ? (
                  <>
                    <div className="d-flex align-items-center justify-content-center card-section">
                      <div className="not-connection">INITIATE CALL</div>
                    </div>
                    <div className="d-flex align-items-center justify-content-center card-section">
                      <Button
                        variant="none"
                        onClick={() => {
                          setCalled(1);
                          callUser(roomData.volunteerSocketId);
                        }}
                      >
                        <img
                          src={callIcon}
                          alt="call-button"
                          className="text-light call-icon"
                        />
                      </Button>
                    </div>
                  </>
                ) : called && !callAccepted ? (
                  <>
                    <div className="d-flex align-items-center justify-content-center card-section">
                      <div className="wait-connection">CALLING</div>
                    </div>
                    <div className="d-flex align-items-center justify-content-center card-section">
                      <Button
                        variant="none"
                        onClick={() => {
                          setCalled(1);
                          callUser(roomData.volunteerSocketId);
                        }}
                      >
                        <img
                          src={callIcon}
                          alt="call-button"
                          className="text-light call-icon"
                        />
                      </Button>
                    </div>
                  </>
                ) : isVolunteer && !receivingCall && !callAccepted ? (
                  <>
                    <div className="d-flex align-items-center justify-content-center card-section">
                      <div className="wait-connection">INCOMING CALL</div>
                    </div>

                    <div className="d-flex align-items-center justify-content-center card-section">
                      <Button variant="none" onClick={leaveCall}>
                        <img
                          src={callIcon}
                          alt="call-button"
                          className="call-icon"
                        />
                      </Button>
                    </div>
                  </>
                ) : isVolunteer && receivingCall && !callAccepted ? (
                  <>
                    <div className="d-flex align-items-center justify-content-center card-section">
                      <div className="connection">Client is calling</div>
                    </div>

                    <div className="d-flex align-items-center justify-content-center card-section">
                      <Button variant="none" onClick={answerCall}>
                        <img
                          src={callIcon}
                          alt="call-button"
                          className="call-icon"
                        />
                      </Button>
                    </div>
                  </>
                ) : callAccepted && !callEnded ? (
                  <>
                    <div className="d-flex align-items-center justify-content-center card-section">
                      <div className="connection">CONNECTED</div>
                    </div>

                  <div className="d-flex align-items-center justify-content-center card-section">
                    <Button variant="none" onClick={leaveCall}>
                      <img
                        src={callIcon}
                        alt="call-button"
                        className="text-light call-icon"
                      />
                      <p className="text-light">End Call</p>
                    </Button>
                  </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Room;
