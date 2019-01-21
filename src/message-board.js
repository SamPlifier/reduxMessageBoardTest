import {createStore, combineReducers} from 'redux';

export const ONLINE = `ONLINE`;
export const AWAY = `AWAY`;
export const BUSY = `BUSY`;
export const OFFLINE = `OFFLINE`;
export const UPDATE_STATUS = `UPDATE_STATUS`;

export const CREATE_NEW_MESSAGE = `CREATE_NEW_MESSAGE`;

const defaultState = {
    messages: [{
        date: new Date('2019-1-20 10:00:00'),
        postedBy: 'Stan',
        content: `Omg they killed kenny!`
    }, {
        date: new Date('2019-1-20 10:01:00'),
        postedBy: 'Kyle',
        content: `You bastards!`
    }, {
        date: new Date('2019-1-20 10:02:00'),
        postedBy: 'Kenny',
        content: `No, I'm ok...`
    }, {
        date: new Date('2019-1-20 10:04:00'),
        postedBy: 'Cartman',
        content: `Screw you guys, I'm going home.`
    }],
    userStatus: `ONLINE`
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
    messages: messageReducer
});

const store = createStore(combinedReducer);

const render = () => {
    const {
        messages,
        userStatus
    } = store.getState();
    document.getElementById('messages').innerHTML = messages
        .sort((a, b) => b.date - a.date)
        .map(message => (`
        <div>${message.postedBy} : ${message.content}</div>
        `)).join('');
    document.forms.newMessage.fields.disabled = (userStatus === OFFLINE);
    document.forms.newMessage.value = '';
};

const statusUpdateAction = (value) => {
    return {
        type: UPDATE_STATUS,
        value
    }
}
const newMessageAction = (content, postedBy) => {
    const date = new Date();
    return {
        type: CREATE_NEW_MESSAGE,
        value: content,
        postedBy,
        date
    }
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