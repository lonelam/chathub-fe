export interface ExposedBot {
  id: string;
  isLoggedIn: boolean;
  currentUser: { id: string };
}
