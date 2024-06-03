import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
  it("should return the text with no button if text is short", () => {
    const text = "sample text";
    render(<ExpandableText text={text} />);

    const element = screen.getByText(/sample text/i);
    expect(element).toBeInTheDocument();
    expect(element.textContent?.length).toBe(text.length);

    expect(screen.queryByRole("button")).toBe(null);
  });

  it("should return the shorted text with button if text is long", async () => {
    const text = "start " + "a".repeat(500);
    render(<ExpandableText text={text} />);

    const element = screen.getByText(/start/i);
    expect(element).toBeInTheDocument();
    expect(element.textContent?.length).toBeLessThan(text.length);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(button);
    expect(element.textContent?.length).toBe(text.length);

    await user.click(button);
    expect(element.textContent?.length).toBeLessThan(text.length);
  });
});
