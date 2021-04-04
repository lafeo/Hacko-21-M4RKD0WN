import React, { useEffect, useRef, useState } from "react"
import {Container, Row,Col, Button} from 'react-bootstrap';
import Peer from "simple-peer"
import io from "socket.io-client"
import './room.scss'
import firebase from '../../firebase'

const socket = io.connect('https://ek-backend.herokuapp.com/')

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
    const [called,setCalled] = useState(0);
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

        
        const roomRef = firebase.database().ref("rooms").child(props.match.params.id.slice(0, 6));
        roomRef.on("value", (snapshot) => {
          if(snapshot.val()){
          setRoomData(snapshot.val());
          console.log(snapshot.val());
          setVolunteerCert(snapshot.val().cert);
          console.log(snapshot.val().cert);
          console.log("________________")
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
          vRef.on("value",(snapshot)=>{
            console.log(snapshot.val());
            for(var key in snapshot.val()){
              const uRef = firebase
              .database()
              .ref("Users")

              uRef.child(key+"/profile").update(
                {
                  engaged: 0,
                },
                (err) => {
                  if (err) console.log(err);
                }
              );
            
              uRef.child(key+"/profile/tempRoomId").remove();
               deleted = 1;
            }

          });
          const roomRef = firebase
          .database()
          .ref("rooms")
          .child(props.match.params.id.slice(0, 6));
          roomRef.remove();
    
          if(deleted) {
            
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
            {stream &&  <video playsInline muted ref={myVideo} autoPlay className="video-container my-3" />}
          </div>

          <div className="col col-md-6 col-12">  
            {callAccepted && !callEnded ?
            <>
            <h3>{isVolunteer? "Client" : "Volunteer"}</h3>
            <video playsInline ref={userVideo} autoPlay  className="video-container" />
            </>
            : null}
          </div>
			</Row>

      {!isVolunteer && !called?
			<Row>
        <Col className="mt-4 call-col bg-light py-3 my-4 d-flex justify-content-center flex-column">
			        <h4>When ready, click on the call button to initiate a video chat with our volunteer</h4>
              <Button variant="success" onClick={()=>
                {
                  setCalled(1)
                  callUser(roomData.volunteerSocketId)
                }}>
              <i className="fas fa-phone-alt"></i>  Call Volunteer 
              </Button>
      	</Col>
			</Row>
      :
      (called && !callAccepted)?
      <Row>
        <Col className="mt-4 call-col bg-light py-3 my-4 d-flex justify-content-center flex-column">
			        <h4>Waiting for Volunteer to connect</h4>
      	</Col>
			</Row>
      :
      (isVolunteer && !receivingCall && !callAccepted)?
      <Row>
        <Col className="mt-4 call-col bg-light py-3 my-4 d-flex justify-content-center flex-column">
			        <h4>If a client calls, it will show up here.. Currently no one is calling</h4>
      	</Col>
			</Row>
      :(isVolunteer && receivingCall && !callAccepted)?
      <Row>
        <Col className="mt-4 call-col bg-light py-3 my-4 d-flex justify-content-center flex-column">
			        <h4>A client wants to connect with you</h4>
              <Button variant="success" onClick={()=>{
                answerCall()
                
                }}>
                  Connect
              </Button>
      	</Col>
			</Row>
      :(callAccepted && !callEnded)?
      <Button variant="danger" onClick={leaveCall}>Leave Call</Button>
      :
      <></>
      
      }
      
			<Row>
        <Col className="mt-4 utility-col py-3 m-4 d-flex justify-content-center">
					<Container className="m-4">
						
						<h3>Client :  </h3>
						<p>Client is stressed out</p>

						<h3>Volunteer :  </h3>
						<p>Lorem ipsum dolor sit.</p>
					</Container>
				</Col>
			</Row>

		</Container>
		
    );
}

export default Room;
