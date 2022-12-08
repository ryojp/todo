import { Menu, MenuItem } from "@mui/material";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/auth-context";

type Props = {
  anchorEl: null | HTMLElement;
  onClose: () => void;
};

const UserMenu: React.FC<Props> = (props) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const loginItem = (
    <MenuItem color="inherit" onClick={props.onClose}>
      <Link
        to="/auth/login"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        Login
      </Link>
    </MenuItem>
  );

  const logoutItem = (
    <MenuItem
      color="inherit"
      onClick={() => {
        authCtx.logout();
        props.onClose();
      }}
    >
      Logout
    </MenuItem>
  );

  const profileItem = (
    <MenuItem
      color="inherit"
      onClick={() => {
        props.onClose();
        navigate("/profile");
      }}
    >
      Edit Profile
    </MenuItem>
  );

  return (
    <Menu
      anchorEl={props.anchorEl}
      open={Boolean(props.anchorEl)}
      onClose={props.onClose}
    >
      {!authCtx.isLoggedIn && loginItem}
      {authCtx.isLoggedIn && profileItem}
      {authCtx.isLoggedIn && logoutItem}
    </Menu>
  );
};

export default UserMenu;
