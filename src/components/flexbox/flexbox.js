import "./flexbox.css";

const React = require("react");

export default class FlexBox extends React.Component {

    render() {
        const imageUrl = 'https://cdn1.iconfinder.com/data/icons/image-manipulations/100/13-512.png';
        return <div>
            <div className='menu-container'>
                <div className='menu'>
                    <div className='date'>Aug 14, 2016</div>
                    <div className='aa'>
                        <div className='signup'>Sign Up</div>
                        <div className='login'>Login</div>
                    </div>
                </div>
            </div>
            <div className='header-container'>
                <div className='header'>
                    <div className='subscribe'>Subscribe &#9662;</div>
                    <div className='logo'><img src={imageUrl}/></div>
                    <div className='social'><img src={imageUrl}/></div>
                </div>
            </div>
            <div className='photo-grid-container'>
                <div className='photo-grid'>
                    <span className='photo-grid-item first-item'>
                        1
                    </span>
                    <span className='photo-grid-item second-item'>
                        2
                    </span>
                    <span className='photo-grid-item third-item'>
                        3
                    </span>
                </div>
            </div>
            <div className='footer'>
                <div className='footer-item footer-one'></div>
                <div className='footer-item footer-two'></div>
                <div className='footer-item footer-three'></div>
            </div>
        </div>;
    }
}


// const createMessageByMessageType = {
//     user: element => element + " my custom message",
//     register: element => element + " my custom message",
//     otherKey: element => element + " my custom message",
//     // and so on...
// };
//
// const data = [];
//
// // version 1: why it's bad:
// // 1. not readable.
// // 2. there is a use of a variable which can from no where.
// // 3. the createMessageByMessageType behavior is not really important to understand the overall pipeline.
// const result1 = data.map(element => createMessageByMessageType[element.type](element));
//
// // version 2:
// const byMessageType = messagesFactoryByMessageType => element => messagesFactoryByMessageType[element.type](element);
//
// const result2 = data.map(byMessageType(createMessageByMessageType));
//
//
//
//










