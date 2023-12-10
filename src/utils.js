const hostNoti = process.env.REACT_APP_HOST_NOTIFICATION;
const keyServerNotification = "key=AAAAblZTcnw:APA91bH_XO8DjYVy6q5hPM60tU-J5v4rkFL0-f3MjGH81cV2LXrL2SKeCJDSwDPsKxcFs-DLTl4RHDN82Dxw13Xj6hTuvAXEHk_-wJY8g-yIm88Lfsk55iSYiIHXjAOg1wmmqBk97Pxy";

const PostNotification = async (tokenDevice, username, str) => {
  console.log(keyServerNotification);
  console.log(username);
  const response = await fetch(hostNoti, {
    method: "POST",
    headers: {
      Authorization: keyServerNotification,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: tokenDevice,
      data: {
        description: `HI ${username}, YOU HAVE A NEW ${str}`,
      },
    }),
  });
  if (!response.ok) {
    throw new Error("Error");
  }
  console.log("push noti success");
};

export default PostNotification;
