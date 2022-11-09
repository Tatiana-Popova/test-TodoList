import React, { useEffect, useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useFormik } from 'formik';
import cn from 'classnames';
import nextId from "react-id-generator";

const TaskList = () => {
  const taskRef = useRef();
  const [tasks, changeTasks] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [displayedTasks, changeDisplayedTasks] = useState([]);
  const [buttonsState, setButtonsState] = useState({ active: 'allButton' });

  const filterTasksByButtonsState = () => {
    const tasksToDisplay = () => {
      switch (buttonsState.active) {
      case 'allButton':
        return tasks;
      case 'activeButton':
        return activeTasks;
      case 'completedButton':
        return completedTasks;
      default:
        break;
      }
    };
    changeDisplayedTasks(() => tasksToDisplay());
  };

  useEffect(() => {
    taskRef.current.focus();
  }, []);

  useEffect(() => {
    setActiveTasks(() => tasks.filter((task) => !task.isDone));
    setCompletedTasks(() => tasks.filter((task) => task.isDone));
  }, [tasks]);

  useEffect(() => {
    filterTasksByButtonsState();
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonsState, activeTasks, completedTasks, tasks]);

  const handleButton = (e) => {
    const activeButtonId = e.target.id;
    setButtonsState((buttonsState) => {
      return { ...buttonsState, 'active': activeButtonId }
    });
  };

  const formik = useFormik({
    initialValues: {
      newTaskText: '',
    },
    onSubmit: (values, { resetForm }) => {
      const { newTaskText } = values;
      changeTasks(tasks => [...tasks, { id: nextId(), text: newTaskText, isDone: false }]);
      resetForm({ values: '' });
    }
  });

  return (
    <>  
      <Form onSubmit={formik.handleSubmit} style={{width: "45vw"}}>
        <Form.Control 
          placeholder="What needs to be done?"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          ref={taskRef}
          id="newTaskText"
          value={formik.values.newTaskText}
          className="mb-3 fst-italic shadow-none"
        />
        {displayedTasks.map((task) => {
          return (
            <div 
              key={task.id}
              className="d-flex justify-content-between align-items-center bg-white mb-1 px-2 rounded" 
              style={{height: "2em"}}
            >
              <span className="d-inline-block text-truncate" style={{maxWidth:"80%"}}>
                <Form.Check
                  inline
                  label={
                    <span 
                      style={{textDecoration: task.isDone ? "line-through": "none"}}
                      id="task"
                    >
                      {task.text}
                    </span>
                  }
                  checked={task.isDone}
                  type={'checkbox'}
                  id={task.text}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    changeTasks((tasks) => tasks.map((el) => {
                      if (el.id === task.id) {
                        el.isDone = isChecked;
                      }
                      return el;
                    }));
                    formik.handleChange(e);
                  }}
                />
              </span>
              <Button variant="link"
                className="ml-1 text-muted fw-light"
                onClick={(e) => {
                  changeTasks((tasks) => tasks.filter((el) => el.id !== task.id));
                }}             
              >
                delete
              </Button>
            </div>
          )
        })}
      </Form>
      <div className="mt-5 d-flex justify-content-between align-items-center rounded">
        <span className="d-flex justify-content-start bg-white">
          <Button 
            variant="outline-info"
            id="allButton"
            className={
              cn("me-1", { 'active': buttonsState.active === 'allButton'})
            }
            size="sm" 
            onClick={(e) => handleButton(e)}
          >
            All
          </Button>
          <Button 
            variant="outline-info"
            id="activeButton"
            className={
              cn("me-1", { 'active': buttonsState.active === 'activeButton'})
            }
            size="sm" 
            onClick={(e) => handleButton(e)}
          >
            Active
          </Button>
          <Button 
            variant="outline-info"
            id="completedButton"
            className={
              cn("me-1", { 'active': buttonsState.active === 'completedButton'})
            }
            size="sm" 
            onClick={(e) => handleButton(e)}
          >
            Completed
          </Button>
        </span>
        <Button 
          variant="link"
          className="ml-1 text-info"
          onClick={() => changeTasks((tasks) => [])}
        >
          Clear all
        </Button>
      </div>
    </>
  )
};

export default TaskList;
