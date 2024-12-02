import { makeAutoObservable } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthStore {
  isAuthenticated: boolean = false;
  userEmail: string | null = null;
  authToken: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Define checkAuthToken method to check token in AsyncStorage
  async checkAuthToken() {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      this.authToken = token;
      this.isAuthenticated = true;
      // Optionally, fetch the user's email or other details here
    } else {
      this.isAuthenticated = false;
    }
  }

  // Method to handle login
  async login(token: string, email: string) {
    this.authToken = token;
    this.userEmail = email;
    this.isAuthenticated = true;
    await AsyncStorage.setItem("authToken", token);
  }

  // Method to handle logout
  async logout() {
    this.authToken = null;
    this.userEmail = null;
    this.isAuthenticated = false;
    await AsyncStorage.removeItem("authToken");
  }
}

// Export an instance of AuthStore
export const authStore = new AuthStore();
