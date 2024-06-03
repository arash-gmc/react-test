import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={(text) => onChange(text)} />);
    return {
      input: screen.getByPlaceholderText(/search/i),
      onChange,
      user: userEvent.setup(),
    };
  };
  it("should render the componenr", () => {
    const { input } = renderComponent();
    expect(input).toBeInTheDocument();
  });
  it("should call onChange if type something and hit 'Enter'", async () => {
    const { input, onChange, user } = renderComponent();
    await user.type(input, "a{enter}");
    expect(onChange).toHaveBeenCalledWith("a");
  });
  it("should not call onChange if hit 'Enter'  without type", async () => {
    const { input, onChange, user } = renderComponent();
    await user.type(input, "{enter}");
    expect(onChange).not.toBeCalled();
  });
});
