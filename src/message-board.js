import {createStore, combineReducers, applyMiddleware} from 'redux';
import { get } from './http';
import {createLogger} from 'redux-logger';

export const ONLINE = `ONLINE`;
export const AWAY = `AWAY`;
export const BUSY = `BUSY`;
export const OFFLINE = `OFFLINE`;
export const UPDATE_STATUS = `UPDATE_STATUS`;

export const READY = `READY`;
export const WAITING = `WAITING`;
export const NEW_MESSAGE_SERVER_ACCEPTED = `NEW_MESSAGE_SERVER_ACCEPTED`;

export const CREATE_NEW_MESSAGE = `CREATE_NEW_MESSAGE`;

const defaultState = {
    messages: [{
        date: new Date('2019-1-20 10:00:00'),
        postedBy: 'Professor Chaos',
        content: `Myself, General Disarray, and my minions will be plunge the world into darkness!`
    }, {
        date: new Date('2019-1-20 10:01:00'),
        postedBy: 'The Human Kite',
        content: `Not if my laser eyes light you up...`
    }, {
        date: new Date('2019-1-20 10:02:00'),
        postedBy: 'Tool Shed',
        content: `Chaos, aren't you grounded this week?`
    }, {
        date: new Date('2019-1-20 10:04:00'),
        postedBy: 'Mintberry Crunch',
        content: `I'll cool Chaos' plans with the power of minty berries and a satisfying crunch!`
    }],
    userStatus: `ONLINE`,
    apiCommunicationStatus: READY
}

const apiCommunicationsReducer = (state = READY, {type}) => {
    switch (type) {
        case CREATE_NEW_MESSAGE:
            return WAITING;
            break;
        case NEW_MESSAGE_SERVER_ACCEPTED:
            return READY;
            break;
    }
    return state;
}

const userStatusReducer = (state = defaultState.userStatus, {type, value}) => {
    switch (type) {
        case UPDATE_STATUS:
            return value;
            break;
    }
    return state;
}
const messageReducer = (state = defaultState.messages, {type, value, postedBy, date}) => {
    switch (type) {
        case CREATE_NEW_MESSAGE:
            const newState = [{date, postedBy, content:value},...state];//arrays = mutable, make copy instead of altering original
            return newState;
    }
    return state;
}
const combinedReducer = combineReducers({
    userStatus: userStatusReducer,
    messages: messageReducer,
    apiCommunicationStatus: apiCommunicationsReducer
});

const store = createStore(
    combinedReducer, 
    applyMiddleware(createLogger())
);

const render = () => {
    const {
        messages,
        userStatus,
        apiCommunicationStatus
    } = store.getState();

    document.getElementById('messages').innerHTML = messages
        .sort((a, b) => a.date - b.date)
        .map(message => (`
        <div><span class="msgAuthor">${message.postedBy}</span>: ${message.content} <span class="msgTime">${message.date.toLocaleTimeString()}</span></div>
        `)).join('');
    document.forms.newMessage.fields.disabled = (userStatus === OFFLINE);
    // document.forms.newMessage.fields.disabled = (userStatus === OFFLINE || apiCommunicationStatus ===  WAITING);
    document.forms.newMessage.newMessage.value = ''
};

const statusUpdateAction = (value) => {
    return {
        type: UPDATE_STATUS,
        value
    }
}
const newMessageAction = (content, postedBy) => {
    const date = new Date();
    get('/api/create', (id) => {
        store.dispatch({
            type: NEW_MESSAGE_SERVER_ACCEPTED
        })
    })
    return {
        type: CREATE_NEW_MESSAGE,
        value: content,
        postedBy,
        date
    }
}
const alGore = () => {
    store.dispatch(newMessageAction(`He's super...`, 'Al Gore'));
    setTimeout(()=>{
        store.dispatch(newMessageAction(`CEREAL`, 'Al Gore'));
    },2000)
}
let cartmanArr = ['OMG Mintberry...', 'what', 'even', 'are you', 'dude?'];
const phraseWait = (i) => {
    let wait = i * 900;
    
    setTimeout(() => {
        store.dispatch(newMessageAction(cartmanArr[i], 'The Coon'));
        if (i === cartmanArr.length - 1) {
            setTimeout(()=>{
                alGore();
            },2000);
        }
    }, wait);
}
for (let i = 0; i < cartmanArr.length; i++) {
    phraseWait(i);
}

document.forms.selectStatus.addEventListener('change', (e) => {
    store.dispatch(statusUpdateAction(e.target.value));
});
document.forms.newMessage.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = e.target.newMessage.value;
    const username = localStorage['preferences'] ? JSON.parse(localStorage['preferences']).userName : 'Rando';
    store.dispatch(newMessageAction(value, username));
});

render();

store.subscribe(render);
console.log('Making request');
get('http://pluralsight.com', (id) => {
    console.log('received callback', id);
})