import { Button, TextField } from "@mui/material";
import { Container, Stack } from "@mui/system";
import { useForm } from "react-hook-form";

const TaskForm = (props) => {
  const { register, handleSubmit, reset } = useForm();

  const submitHandler = (event) => {
    event.preventDefault(); // prevent page refresh
    handleSubmit(props.onSubmit)();
    reset({ name: "" });
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 5 }}>
      <Stack component="form" onSubmit={submitHandler} spacing={3}>
        <TextField
          required
          label="Task Name"
          {...register("name", { required: true })}
        />
        <Button type="submit" variant="contained" size="large">
          Add Task
        </Button>
      </Stack>
    </Container>
  );
};

export default TaskForm;
