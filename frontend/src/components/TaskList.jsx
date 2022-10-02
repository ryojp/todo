import { List, Typography } from "@mui/material";
import { Container } from "@mui/system";
import TaskItem from "./TaskItem";

const TaskList = (props) => {
  if (props.tasks.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ pt: 5 }}>
        <Typography variant="h4" align="center">No Tasks Found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ pt: 5 }}>
      <List>
        {props.tasks.map((task) => {
          return <TaskItem key={task._id} task={task} onDelete={props.onDeleteTask} onEdit={props.onEditTask} />;
        })}
      </List>
    </Container>
  );
};

export default TaskList;
