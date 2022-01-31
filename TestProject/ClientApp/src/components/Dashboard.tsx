import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import './Dashboard.css'

const Dashboard = () => {
    let history = useHistory();
    const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
    const [users, setUser] = useState([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const taskStates = [
        'To do',
        'Doing',
        'Done',
        'Pending'
    ]

    const openClosePopup = () => {
        setShowAddTaskDialog(true);
    }
    const handleClosePopup = () => {
        setShowAddTaskDialog(false);
    }

    useEffect(() => {
        fetch('https://localhost:44366/api/Users', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (!res.ok) {
                throw Error('Username or Password is wrong');
            }
            return res.json()
        }).then(data => onGetUsersSuccess(data))
            .catch(error => onGetUsersError(error.message));
        getTasks();
    }, []);

    const getTasks = () => {
        fetch('https://localhost:44366/api/Tasks', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (!res.ok) {
                throw Error('Username or Password is wrong');
            }
            return res.json()
        }).then(data => {
            console.log(data);
            setTasks(data);
        });
    }

    const onGetUsersSuccess = (data: any) => {
        setUser(data);
    }

    const onGetUsersError = (error: any) => {
        console.error(error);
    }

    const onAddTaskClick = (event: any) => {
        event.preventDefault();
        const title = event.target.title.value;
        const description = event.target.description.value;
        const currentState = event.target.currentState.value;
        const assigneeId = event.target.assigneeId.value;
        const payload = {
            title,
            description,
            currentState,
            assigneeId
        }
        fetch('https://localhost:44366/api/Tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(res => {
            if (!res.ok) {
                throw Error('Failed to add new task');
            }
            return res.json()
        }).then(data => onAddNewTaskSuccess(data))
            .catch(error => onAddNewTaskError(error.message))
    }

    const onAddNewTaskSuccess = (data: any) => {
        getTasks();
        setShowAddTaskDialog(false);
    }
    const onAddNewTaskError = (error: any) => {
        console.log(error);
    }

    const onUpdateClick = (index: number) => {
        console.log('tasks', tasks[index]);
        const payload = tasks[index];
        const id = tasks[index].Id;
        fetch('https://localhost:44366/api/Tasks/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(res => {
            if (!res.ok) {
                throw Error('Failed to add new task');
            }
            return res.json()
        }).then(data => {
            console.log(data);
        }).catch(error => {
            console.error(error);
        });
    }

    return (
        <>
            {
                showAddTaskDialog &&
                <div className="pop-up shadow rounded border px-4 py-3 bg-white" role="dialog">
                    <div className='border-bottom pb-2 mb-3'>
                        <b>Add New Task</b>
                    </div>
                    <form action="submit" onSubmit={($event) => onAddTaskClick($event)}>
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input type="title" className="form-control" name='title' placeholder="Enter task title ..." />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" name='description' placeholder="Enter task description ..." />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">State</label>
                            <select className="form-control" name='currentState'>
                                {
                                    taskStates.map((ts: any, index: number) => {
                                        return <option value={ts} key={index}>{ts}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Assignee</label>
                            <select className="form-control" name='assigneeId'>
                                {
                                    users.map((u: any) => {
                                        return <option value={u.Id} key={u.Id}>{u.Username}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className='text-right'>
                            <button type="submit" className="btn btn-primary mr-3">Add</button>
                            <button type="button" className="btn btn-link" onClick={handleClosePopup}>Close</button>
                        </div>
                    </form>
                </div>
            }
            <div className="mb-3 px-3 py-2 d-flex justify-content-between bg-light shadow-sm">
                <span className="py-2">
                    <b className="text-muted">
                        Task Manager
                    </b>
                </span>
                <span>
                    <button className="btn btn-primary mr-3" type="button" onClick={openClosePopup}>
                        Add new task
                    </button>
                    <a className="btn btn-link" onClick={() => history.push('/')}>
                        Logout
                    </a>
                </span>
            </div>
            <div className="container">
                <div className="d-flex justify-content-between mb-3">

                </div>
                {
                    tasks.map((t: any, index: number) =>
                        <div className="border rounded p-3 mb-3" key={t.Id}>
                            <div className="row my-0">
                                <span className='col-md-2 py-2 col-sm-12'>
                                    <span className='text-muted mr-1'>
                                        <b>
                                            Title:
                                        </b>
                                    </span>
                                    {t.Title}
                                </span>
                                <span className='col-md-3 py-2 col-sm-12'>
                                    <span className='text-muted mr-1'>
                                        <b>
                                            Description:
                                        </b>
                                    </span>
                                    {t.Description}
                                </span>
                                <span className='col-md-2 py-2 col-sm-12'>
                                    <span className='text-muted mr-1'>
                                        <b>
                                            Assignee:
                                        </b>
                                    </span>
                                    {t.Assignee.Username}
                                </span>
                                <span className='col-md-3 mbsm-3 col-sm-12'>
                                    <select className="form-control d-inline-block" name='currentState' value={t.CurrentState} onChange={event => {
                                        t.CurrentState = event.target.value;
                                        setTasks(JSON.parse(JSON.stringify(tasks)));
                                    }}>
                                        {
                                            taskStates.map((ts: any, index: number) => {
                                                return <option value={ts} key={index}>{ts}</option>
                                            })
                                        }
                                    </select>
                                </span>
                                <span className='col-md-2 col-sm-12'>
                                    <button type="button" className="btn btn-primary w-100" onClick={() => onUpdateClick(index)}>Update</button>
                                </span>
                            </div>
                        </div>)
                }
            </div>
        </>
    );
}

export default Dashboard;   