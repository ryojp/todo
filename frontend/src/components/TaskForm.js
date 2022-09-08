import { Button, TextField } from "@mui/material";
import { Container, Stack } from "@mui/system";
import { useForm } from "react-hook-form";

const TaskForm = (props) => {
  const { register, handleSubmit } = useForm();

  return (
    <Container maxWidth="sm" sx={{ pt: 5 }}>
      <Stack spacing={3}>
        <TextField required label="Task Name" {...register("name")} />
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit(props.onSubmit)}
        >
          Add Task
        </Button>
      </Stack>
    </Container>
  );
};

export default TaskForm;
