import {
    Dispatcher,
    ReduceStore
} from './flux';
import {
    generate as id
} from 'shortid';

const tasksDispatcher = new Dispatcher();

const CREATE_TASK = `CREATE_TASK`;
const COMPLETE_TASK = `COMPLETE_TASK`;
const SHOW_TASKS = `SHOW_TASKS`;

const createNewTaskAction = (content) => {
    return {
        type: CREATE_TASK,
        value: content
    }
};

const completeTaskAction = (id, isComplete) => {
    return {
        type: COMPLETE_TASK,
        id,
        value: isComplete
    }
};

const showTasksAction = (show) => {
    return {
        type: SHOW_TASKS,
        value: show
    }
};

const initialState = {
    tasks: [{
        id: id(),
        content: `Adobe Experience Manager Authoring Fundamentals`,
        complete: true,
        link: `https://app.pluralsight.com/library/courses/aem-authoring-fundamentals/table-of-contents`
    }, {
        id: id(),
        content: `Google Analytics Fundamentals`,
        complete: true,
        link: `https://app.pluralsight.com/library/courses/google-analytics/table-of-contents`
    }, {
        id: id(),
        content: `Node.js: Getting Started`,
        complete: true,
        link: `https://app.pluralsight.com/library/courses/nodejs-getting-started/table-of-contents`
    }, {
        id: id(),
        content: `Advanced Node.js`,
        complete: true,
        link: `https://app.pluralsight.com/library/courses/nodejs-advanced/table-of-contents`
    }, {
        id: id(),
        content: `React.js: Getting Started`,
        complete: true,
        link: `https://app.pluralsight.com/library/courses/react-js-getting-started/table-of-contents`
    }, {
        id: id(),
        content: `Building Apps with React and Flux`,
        complete: true,
        link: `https://app.pluralsight.com/library/courses/react-flux-building-applications/table-of-contents`
    }, {
        id: id(),
        content: `Mastering Flux and Redux`,
        complete: true,
        link: `https://app.pluralsight.com/library/courses/flux-redux-mastering/table-of-contents`
    }, {
        id: id(),
        content: `Angular: Getting Started`,
        complete: true,
        link: `https://app.pluralsight.com/library/courses/angular-2-getting-started-update/table-of-contents`
    }, {
        id: id(),
        content: `HTML5 Fundamentals`,
        complete: true,
        link: `https://app.pluralsight.com/library/courses/html5-fundamentals/table-of-contents`
    }, {
        id: id(),
        content: `D3.js Data Visualization Fundamentals`,
        complete: false,
        link: `https://app.pluralsight.com/library/courses/d3js-data-visualization-fundamentals/table-of-contents`
    }, {
        id: id(),
        content: `Rapid ES6 Training`,
        complete: false,
        link: `https://app.pluralsight.com/library/courses/rapid-es6-training/table-of-contents`
    }, {
        id: id(),
        content: `Building Apps with React & Redux in ES6`,
        complete: false,
        link: `https://app.pluralsight.com/library/courses/react-redux-react-router-es6/table-of-contents`
    }, {
        id: id(),
        content: `Typescript Fundamentals`,
        complete: true,
        link: `https://app.pluralsight.com/library/courses/typescript/table-of-contents`
    }, {
        id: id(),
        content: `Angular Fundamentals`,
        complete: false,
        link:`https://app.pluralsight.com/library/courses/angular-fundamentals/table-of-contents`
    }, {
        id: id(),
        content: `Building Web Apps with Node.js and Express 4.0`,
        complete: false,
        link: `https://app.pluralsight.com/library/courses/nodejs-express-web-applications-update/table-of-contents`
    }],
    showComplete: true
};

class TasksStore extends ReduceStore {
    getInitialState() {
        return initialState;
    }
    reduce(state, action) {
        let newState;
        console.log("Processing action", action.type);
        switch (action.type) {
            case CREATE_TASK:
                newState = { ...state,
                    tasks: [...state.tasks]
                };
                newState.tasks.push({
                    id: id(),
                    content: action.value,
                    complete: false
                });
                return newState;
            case COMPLETE_TASK:
                newState = { ...state,
                    tasks: [...state.tasks]
                };
                const affectedElementIndex = newState.tasks.findIndex(t => t.id === action.id);
                newState.tasks[affectedElementIndex] = { ...state.tasks[affectedElementIndex],
                    complete: action.value
                }
                return newState;
            case SHOW_TASKS:
                newState = { ...state,
                    showComplete: action.value
                };
                return newState;
        }
        return state;
    }
    getState() {
        return this.__state;
    }
}

const tasksStore = new TasksStore(tasksDispatcher);

const render = () => {

    const TaskComponent = ({
        content,
        complete,
        id,
        link
    }) => (
        `<section>
            <a href=${link} alt=${link}>
        ${content} <input type="checkbox" name="taskCompleteCheck" data-taskid=${id} ${complete ? "checked" : ""}>
            </a>
    </section>`
    )

    const tasksSection = document.getElementById(`tasks`);
    const state = tasksStore.getState();
    const rendered = tasksStore.getState().tasks
        .filter(task => state.showComplete ? true : !task.complete)
        .map(TaskComponent).join("");
    tasksSection.innerHTML = rendered;

    /* Add listeners to newly generated checkboxes */
    document.getElementsByName('taskCompleteCheck').forEach(element => {
        element.addEventListener('change', (e) => {
            const id = e.target.attributes['data-taskid'].value;
            const checked = e.target.checked;
            tasksDispatcher.dispatch(completeTaskAction(id, checked));
        })
    });
};

document.forms.newTask.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.newTaskName.value;
    if (name) {
        tasksDispatcher.dispatch(createNewTaskAction(name));
        e.target.newTaskName.value = null;
    }
});

document.forms.undo.addEventListener('submit', (e) => {
    e.preventDefault();
    tasksStore.revertLastState();
})

document.getElementById(`showComplete`).addEventListener('change', ({
    target
}) => {
    const showComplete = target.checked;
    tasksDispatcher.dispatch(showTasksAction(showComplete));
});

tasksStore.addListener(() => {
    render();
});

render();
