import {
  Button,
  Card,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import BackspaceIcon from '@mui/icons-material/Backspace';

const TaskItem = (props) => {

  return (
    <Card>
      <ListItem>
        <ListItemText primary={props.task.name} />
        <Button onClick={() => props.onDelete(props.task)}>
          <ListItemIcon>
            <BackspaceIcon />
          </ListItemIcon>
        </Button>
      </ListItem>
    </Card>
  );
};

export default TaskItem;
