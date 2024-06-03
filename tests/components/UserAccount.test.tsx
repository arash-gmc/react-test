import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  it("should render user name", () => {
    const user: User = {
      id: 123,
      name: "user1",
    };
    render(<UserAccount user={user} />);
    screen.debug();
    const nameDiv = screen.getByText(/user1/i);
    expect(nameDiv).toBeInTheDocument();
  });
  it("should render edit button if user is an admin", () => {
    const user: User = {
      id: 123,
      name: "user1",
      isAdmin: true,
    };
    render(<UserAccount user={user} />);
    screen.debug();
    const editButton = screen.getByRole("button");
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveTextContent(/edit/i);
  });
  it("should not render edit button if user is not an admin", () => {
    const user: User = {
      id: 123,
      name: "user1",
      isAdmin: false,
    };
    render(<UserAccount user={user} />);
    screen.debug();
    const editButton = screen.queryByRole("button");
    expect(editButton).not.toBeInTheDocument();
  });
});
