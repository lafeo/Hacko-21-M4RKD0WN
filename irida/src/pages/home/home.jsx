import React, {useEffect} from 'react';
import './home.scss';
import {Button} from 'react-bootstrap';
import {useSpring, animated} from 'react-spring'
import $ from 'jquery'

const Home = () =>{
    
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
            <h1>I R I D A</h1>
            <p>- Some random tagline which can impress judges</p>
            <div>
                <Button variant="dark" size="lg" href="/shop">
                Shop Now
                </Button>{' '}
                <Button variant="dark" size="lg" href="/signup">
                Sell Now
                </Button>
            </div>
            </animated.section>
    )
}

export default Home;