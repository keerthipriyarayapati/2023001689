import { useState } from "react";
import { Button, Container } from "@mui/material";
import Notifications from "./Notifications";
import PriorityNotifications from "./PriorityNotifications";

function App() {
  const [page, setPage] = useState("all");

  return (
    <Container>
      <h1>Notification Dashboard</h1>

      <Button
        variant="contained"
        onClick={() => setPage("all")}
        sx={{ mr: 2 }}
      >
        All Notifications
      </Button>

      <Button
        variant="contained"
        onClick={() => setPage("priority")}
      >
        Priority Notifications
      </Button>

      {page === "all"
        ? <Notifications />
        : <PriorityNotifications />}
    </Container>
  );
}

export default App;