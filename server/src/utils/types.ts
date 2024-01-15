export type CreateUserParams = {
  username: string;
  email: string;
  password: string;
};
export type UpdateUserParams = {
  email: string;
  username: string;
};

export type CreateTodoParams = {
  title: string;
  description: string;
  status: string;
  user: string;
};

export type UpdateTodoParams = {
  id: number;
  title: string;
  description: string;
  status: string;
};
