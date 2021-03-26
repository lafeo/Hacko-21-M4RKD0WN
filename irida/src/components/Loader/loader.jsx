import React, {useState} from 'react';

import {useTransition, animated} from 'react-spring';
const Loader = () =>{
    const letters = ['I','R','I','D','A'];

    const [index,setIndex] = useState(0);
    const item = letters[index];
    const increment = () => 
    setIndex(state => (state+1))
    setInterval(increment, 1000);
    const transitions =  useTransition(letters[index], item,{
        from: {opacity:0},
        to: {opacity: 1},
        leave : {opacity:0}
    
    })
    return transitions.map(({item,props,key})=>{
        (
            <div className="loader">
                <animated.h1>{item}</animated.h1>
            </div>
        )   
    }
    )
}

export default Loader;