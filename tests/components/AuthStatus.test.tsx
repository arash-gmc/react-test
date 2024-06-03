import { render, screen } from "@testing-library/react";
import AuthStatus from "../../src/components/AuthStatus";
import { mockAuthState } from "../utils";

describe("AuthStatus", () => {
  it("should show a loading message when loading authentication", () => {
    mockAuthState({
      isAuthenticated: false,
      isLoading: true,
      user: undefined,
    });
    render(<AuthStatus />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  it("should show a login button when user is not authenticated", () => {
    mockAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
    });
    render(<AuthStatus />);
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });
  it("should show user's name when user is authenticated", () => {
    const user = { name: "user1" };
    mockAuthState({
      isAuthenticated: true,
      isLoading: false,
      user,
    });
    render(<AuthStatus />);
    expect(screen.getByText(user.name)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).not.toBeInTheDocument();
  });
});
