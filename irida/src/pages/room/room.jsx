import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
// import TextField from "@material-ui/core/TextField"
// import AssignmentIcon from "@material-ui/icons/Assignment"
import PhoneIcon from "@material-ui/icons/Phone"
import React, { useEffect, useRef, useState } from "react"
// import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"
import './room.scss'
// import { useLocation } from "react-router-dom";
import firebase from '../../firebase'



const socket = io.connect('https://hacko-ek.herokuapp.com:5000')

const Room = (props) => {
    // const location = useLocation();
    const [roomData,setRoomData] = useState(0);
    const [volunteerCert,setVolunteerCert] = useState(0);
    
    const [ me, setMe ] = useState("") //user
	const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	// const [ idToCall, setIdToCall ] = useState("") //volunteer
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef= useRef()

    // location.volunteerProfile shows me the volunteer profile
    console.log(props);

    useEffect(() => {
  
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
				myVideo.current.srcObject = stream
		})

	socket.on("me", (id) => {
			setMe(id)
            console.log(id);

            const roomRef = firebase.database().ref('rooms').child(props.match.params.id.slice(0,6));
            if(props.match.params.id.length === 6)
           { 
               roomRef.update(    
                {
                    userSocketId: id
                },
                err => {
                    if(err)
                    console.log(err);
                }
            )
        }
        else{
            roomRef.update(    
                {
                    volunteerSocketId: id
                },
                err => {
                    if(err)
                    console.log(err);
                }
            )
        }
            

		})

		socket.on("callUser", (data) => {
			setReceivingCall(true)
			setCaller(data.from)
			setName(data.name)
			setCallerSignal(data.signal)
		})

        const roomRef = firebase.database().ref('rooms').child(props.match.params.id.slice(0,6));
        roomRef.on('value', (snapshot)=>{
            setRoomData(snapshot.val());
            console.log(snapshot.val())
            setVolunteerCert(snapshot.val().cert);
        })


	}, [props.match.params.id])

	const callUser = (id) => {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: me,
				name: name
			})
		})
		peer.on("stream", (stream) => {
			
				userVideo.current.srcObject = stream
			
		})
		socket.on("callAccepted", (signal) => {
			setCallAccepted(true)
			peer.signal(signal)
		})

		connectionRef.current = peer
	}

	const answerCall =() =>  {
		setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("answerCall", { signal: data, to: caller })
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})

		peer.signal(callerSignal)
		connectionRef.current = peer
	}

	const leaveCall = () => {
		setCallEnded(true)
        
        if(props.match.params.id.length>6){
        const roomRef = firebase.database().ref('rooms').child(props.match.params.id.slice(0,6));
        roomRef.remove();
        
        console.log("==========");
        console.log(roomData);

        
        console.log("-----------");
        console.log(volunteerCert);
        if(roomData.profile){
        const uRef = firebase.database().ref('Users').orderByChild("profile/cert").equalTo(volunteerCert);
        uRef.remove();
		}
        else{
            window.location.href = '/';
        }
    }
    else{
        window.location.href = '/';
        
    }
        connectionRef.current.destroy()
	}

	return (
		<section className="room">
			<h1 style={{ textAlign: "center", color: '#fff' }}>ek</h1>
		<div className="container">
			<div className="video-container">
				<div className="video">
					{stream &&  <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
				</div>
				<div className="video">
					{callAccepted && !callEnded ?
					<video playsInline ref={userVideo} autoPlay style={{ width: "300px"}} />:
					null}
				</div>
			</div>
            {roomData? console.log(roomData) : <></>}
			<div className="myId">
				{/* <TextField
					id="filled-basic"
					label="Name"
					variant="filled"
					value={name}
					onChange={(e) => setName(e.target.value)}
					style={{ marginBottom: "20px" }}
				/> */}
				{/* <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
					<Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
						Copy ID
					</Button>
				</CopyToClipboard> */}

				{/* <TextField
					id="filled-basic"
					label="ID to call"
					variant="filled"
					value={idToCall}
					onChange={(e) => setIdToCall(e.target.value)}
				/> */}
				<div className="call-button">
					{callAccepted && !callEnded ? (
						<Button variant="contained" color="secondary" onClick={leaveCall}>
							End Call
						</Button>
					) : (

                        <>
                        {roomData.volunteerSocketId ? 
						<IconButton color="primary" aria-label="call" onClick={() => callUser(roomData.volunteerSocketId)}>
							<PhoneIcon fontSize="large" />
						</IconButton>
                        :
                        <></>}
                    </>
                )}
					{roomData.volunteerSocketId? roomData.volunteerSocketId : <></>}
				</div>
			</div>
			<div>
				{receivingCall && !callAccepted ? (
						<div className="caller">
						<h1 >{name} is calling...</h1>
						<Button variant="contained" color="primary" onClick={answerCall}>
							Answer
						</Button>
					</div>
				) : null}
			</div>
		</div>
		</section>
		
    );
}

export default Room;
