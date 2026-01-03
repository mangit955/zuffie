export type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  metadata: any;
  created_at: string;
};
