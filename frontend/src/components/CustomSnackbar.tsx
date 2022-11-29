import { Snackbar, SnackbarCloseReason, SnackbarOrigin } from "@mui/material";
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
  position?: SnackbarOrigin;
};

const CustomSnackbar: React.FC<Props> = ({
  open,
  handleClose,
  severity,
  message,
  showDuration,
  position,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={showDuration || 3000}
      onClose={handleClose}
      anchorOrigin={position || { vertical: "top", horizontal: "center" }}
    >
      <Alert severity={severity} elevation={6} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
