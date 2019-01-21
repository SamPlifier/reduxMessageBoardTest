import {
    createStore
} from 'redux';

export const ONLINE = `ONLINE`;
export const AWAY = `AWAY`;
export const BUSY = `BUSY`;
export const OFFLINE = `OFFLINE`;
export const UPDATE_STATUS = `UPDATE_STATUS`;

const defaultState = {
    messages: [
        {
            date: new Date('2019-1-20 10:00:00'),
            postedBy: 'Stan',
            content: `Omg they killed kenny!`
        },  {
            date: new Date('2019-1-20 10:01:00'),
            postedBy: 'Kyle',
            content: `You bastards!`
        },  {
            date: new Date('2019-1-20 10:02:00'),
            postedBy: 'Kenny',
            content: `No, I'm ok...`
        },  {
            date: new Date('2019-1-20 10:04:00'),
            postedBy: 'Cartman',
            content: `Screw you guys, I'm going home.`
        }
    ],
    userStatus: `ONLINE`
}

const reducer = (state = defaultState, {type, value})=> {
    console.log(state);
    console.log(type, value);
    switch(type) {
        case `UPDATE_STATUS`:
            return {...state, userStatus:value};
            break;
    }
    return state;
}

const store = createStore(reducer);

const render = () => {
    const { messages, userStatus } = store.getState();
    document.getElementById('messages').innerHTML = messages
    .sort((a,b) => b.date - a.date)
    .map(message => (`
        <div>${message.postedBy} : ${message.content}</div>
        `)).join('');
        document.form.newMessage.fields.disabled = (userStatus === OFFLINE);
};

render();