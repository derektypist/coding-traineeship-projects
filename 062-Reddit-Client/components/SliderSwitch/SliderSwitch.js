import React from 'react';
import './SliderSwitch.css';

const SliderSwitch = (props) => {
    const {onClick, icon, id} = props;
    return (
        <label htmlFor={id} className="switch">
            <input id={id} type="checkbox" onClick={onClick} />
            <span className="slider"><div>{icon}</div></span>
        </label>
    )
}

export default SliderSwitch;