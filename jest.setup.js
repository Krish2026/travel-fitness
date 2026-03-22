// Jest setup file
import "@testing-library/jest-native/extend-expect";

// Mock Firebase
jest.mock("./src/config/firebase", () => ({
  auth: {},
  firestore: {},
  storage: {},
}));
