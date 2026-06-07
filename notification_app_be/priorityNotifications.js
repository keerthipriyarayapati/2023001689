import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const weights = {
  Placement: 3,
  Result: 2,
  Event: 1
};

async function getNotifications() {
  const response = await axios.get(
    "http://4.224.186.213/evaluation-service/notifications",
    {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    }
  );

  return response.data.notifications;
}

function calculateScore(notification) {
  const weight = weights[notification.Type] || 0;

  const timestamp = new Date(notification.Timestamp).getTime();

  return weight * 1000000000000 + timestamp;
}

async function main() {
  try {
    const notifications = await getNotifications();

    const top10 = notifications
      .sort((a, b) => calculateScore(b) - calculateScore(a))
      .slice(0, 10);

    console.log("Top 10 Priority Notifications");

    top10.forEach((n, index) => {
      console.log(
        `${index + 1}. ${n.Type} - ${n.Message} - ${n.Timestamp}`
      );
    });
  } catch (error) {
    console.log(error.message);
  }
}

main();