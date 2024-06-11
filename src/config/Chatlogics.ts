export const getSender = (loggedUser: any, users: any) => {
  return users[0]._id === loggedUser?.data?.userLogin?._id
    ? users[1].name
    : users[0].name;
};

export const getSenderFull = (loggedUser: any, users: any) => {
  return users[0]._id === loggedUser?.data?.userLogin?._id
    ? users[1]
    : users[0];
};

export const isSameSender = (message: any, m: any, i: any, userId: string) => {
  return (
    i < message.length - 1 &&
    (message[i + 1].sender._id !== m.sender._id ||
      message[i + 1].sender._id === undefined) &&
    message[i].sender._id !== userId
  );
};

export const isLastMessage = (message: any, i: any, userId: string) => {
  return (
    i === message.length - 1 &&
    message[message.length - 1].sender._id !== userId &&
    message[message.length - 1].sender._id
  );
};
