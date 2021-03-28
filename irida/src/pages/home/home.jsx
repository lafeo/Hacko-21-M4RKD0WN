import React, {useEffect,useState} from 'react';
import './home.scss';
import {useSpring, animated} from 'react-spring';
import $ from 'jquery';
import MyVerticallyCenteredModal from 'components/Modal/Modal';


const Home = () =>{
    const [modalShow, setModalShow] = useState(false);
    
    const props = useSpring({
        from : { transform: 'scale(1.5)', overflow: 'hidden'},
        to : {transform: 'scale(1)',overflow: 'hidden',},
        config: {duration: 500}
    })

    useEffect(() => {
        $("#root").addClass('overflow-none');

        setTimeout(()=>{
            $("#root").removeClass('overflow-none');
        },1000);
        
    }, [])
    return(

          <animated.section style={props} className="home" >
                <div className="bg-skew"></div>
                <div className="center-out">
                    <h2> <b>You are doing well! Lets converse </b></h2>  
                    <h4>To get started click the button below</h4> 
                    
                    <div className="call-button" onClick={()=>setModalShow(!modalShow)}>
                        <i className="fas fa-phone-alt"></i>
                    </div>
                </div>
                <MyVerticallyCenteredModal

                show={modalShow}
                onHide={() => setModalShow(false)}/>

            </animated.section>

            )

}

export default Home;