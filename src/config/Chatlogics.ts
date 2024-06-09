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
