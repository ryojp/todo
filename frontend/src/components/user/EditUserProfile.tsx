import { Container, List } from "@mui/material";
import { FC } from "react";
import UserProfileItem from "./UserProfileItem";

const EditUserProfile: FC = () => {
  return (
    <Container maxWidth="sm" sx={{ pt: 5 }}>
      <List>
        <UserProfileItem target="username" username={"yourusername"} />
        <UserProfileItem target="password" password={"current password"} />
      </List>
    </Container>
  );
};

export default EditUserProfile;
