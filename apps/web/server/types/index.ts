export type ActionResponse<T = null> = {
  success: boolean;
  message: string;
  data: T;
};
