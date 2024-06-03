import { render, screen } from "@testing-library/react";
import ToastDemo from "../../src/components/ToastDemo";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

describe("ToatsDemo", () => {
  it("should call toast if we click on the button", async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );
    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);
    await screen.findByText(/success/i);
  });
});
