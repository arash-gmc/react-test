import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";
import { User } from "../../src/entities";

describe("UserList", () => {
  it("should say no user if user array is empty", () => {
    render(<UserList users={[]} />);
    screen.debug();
    const p = screen.getByText(/no user/i);
    expect(p).toBeInTheDocument();
  });
  it("should render the list of users", () => {
    const users: User[] = [
      { id: 1, name: "user1" },
      { id: 2, name: "user2" },
    ];
    render(<UserList users={users} />);
    users.forEach((user) => {
      const link = screen.getByRole("link", { name: user.name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/users/${user.id}`);
    });
  });
});
