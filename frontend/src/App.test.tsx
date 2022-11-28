import { render, screen } from "@testing-library/react";
import App from "./App";
import { AuthContextProvider } from "./contexts/auth-context";
import { BrowserRouter } from "react-router-dom";
import { TaskContextProvider } from "./contexts/task-context";

test("renders NavBar", () => {
  render(
    <BrowserRouter>
      <AuthContextProvider>
        <TaskContextProvider>
          <App />
        </TaskContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/ToDo App/);
  expect(linkElement).toBeInTheDocument();
});
