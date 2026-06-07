import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography } from "@mui/material";

const weights = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function PriorityNotifications() {
  const [notifications, setNotifications] = useState([]);

  async function fetchNotifications() {
    try {
      const response = await axios.get(
  "http://4.224.186.213/evaluation-service/notifications",
  {
    headers: {
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrcmF5YXBhdEBnaXRhbS5pbiIsImV4cCI6MTc4MDgxNjIyMCwiaWF0IjoxNzgwODE1MzIwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiY2FiMjA1MjgtNzk1Ni00NjYxLWJiOWMtMjA3ZDk1NDhkMjQxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoicmF5YXBhdGkga2VlcnRoaSBwcml5YSIsInN1YiI6ImY1ODQ3NDdjLWVjMzUtNDliOS1iNGM5LWIxZDBjNTg3Y2FmZiJ9LCJlbWFpbCI6ImtyYXlhcGF0QGdpdGFtLmluIiwibmFtZSI6InJheWFwYXRpIGtlZXJ0aGkgcHJpeWEiLCJyb2xsTm8iOiIyMDIzMDAxNjg5IiwiYWNjZXNzQ29kZSI6IndnS3RnWiIsImNsaWVudElEIjoiZjU4NDc0N2MtZWMzNS00OWI5LWI0YzktYjFkMGM1ODdjYWZmIiwiY2xpZW50U2VjcmV0IjoidW1kWUtCUEZ6ek5WenVuQyJ9.UlLtt-72TEgE_gO3MEs5FB1alxFcaYcBRRbyrR84e_Y"
    }
  }
);

      const data = response.data.notifications || [];

      data.sort(
        (a, b) =>
          (weights[b.Type] || 0) -
          (weights[a.Type] || 0)
      );

      setNotifications(data.slice(0, 10));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
  const loadData = async () => {
    await fetchNotifications();
  };

  loadData();
}, []);

  return (
    <div>
      <h2>Top 10 Priority Notifications</h2>

      {notifications.map((item, index) => (
        <Card key={index} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">
              {item.Type}
            </Typography>

            <Typography>
              {item.Message}
            </Typography>

            <Typography>
              {item.Timestamp}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default PriorityNotifications;