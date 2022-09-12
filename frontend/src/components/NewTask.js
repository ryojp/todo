import TaskForm from './TaskForm';

const NewTask = (props) => (
  <div>
    <TaskForm
      onSubmit={(enteredTaskData) => {
        console.log(enteredTaskData);
        props.onAddTask(enteredTaskData);
      }}
    />
  </div>
);

export default NewTask;
