import { Snackbar, SnackbarCloseReason } from "@mui/material";
import Alert, { AlertColor } from "@mui/material/Alert";

type Props = {
  open: boolean;
  handleClose: (
    _event: Event | React.SyntheticEvent<any, Event>,
    _reason: SnackbarCloseReason
  ) => void;
  severity: AlertColor;
  message: string;
  showDuration?: number;
};

const CustomSnackbar: React.FC<Props> = ({
  open,
  handleClose,
  severity,
  message,
  showDuration,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={showDuration || 3000}
      onClose={handleClose}
    >
      <Alert severity={severity} elevation={6} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
