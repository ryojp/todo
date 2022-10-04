import TaskForm from "./TaskForm";

const NewTask = (props) => {
  return (
    <div>
      <TaskForm
        onSubmit={(enteredTaskData) => {
          props.onAddTask(enteredTaskData);
        }}
      />
    </div>
  );
};

export default NewTask;
