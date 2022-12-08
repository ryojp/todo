import { Person } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { FC, Fragment, useState } from "react";
import UserMenu from "./UserMenu";

const UserIcon: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <IconButton onClick={handleClick}>
        <Person sx={{ color: "white" }} />
      </IconButton>
      <UserMenu anchorEl={anchorEl} onClose={handleClose} />
    </Fragment>
  );
};

export default UserIcon;
