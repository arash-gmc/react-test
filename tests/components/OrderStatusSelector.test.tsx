import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(
      <>
        <Theme>
          <OrderStatusSelector onChange={onChange} />
        </Theme>
      </>
    );

    return {
      button: screen.getByRole("combobox"),
      user: userEvent.setup(),
      getOptions: () => screen.findAllByRole("option"),
      getOption: (label: RegExp) =>
        screen.findByRole("option", { name: label }),
      onChange,
    };
  };
  it("should render new option as default option", async () => {
    const { button } = renderComponent();
    expect(button).toHaveTextContent(/new/i);
  });

  it("should render options properly", async () => {
    const { button, user, getOptions } = renderComponent();

    await user.click(button);
    const options = await getOptions();
    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });

  it.each([
    { value: "processed", label: /processed/i },
    { value: "fulfilled", label: /fulfilled/i },
  ])(
    "should call onChange with $value when click on the $label option",
    async ({ label, value }) => {
      const { button, user, onChange, getOption } = renderComponent();

      await user.click(button);
      const option = await getOption(label);
      await user.click(option);
      expect(onChange).toHaveBeenCalledWith(value);
    }
  );

  it("should call onChange with 'new' when click on the /new/i option", async () => {
    const { button, user, onChange, getOption } = renderComponent();
    await user.click(button);
    const processedOption = await getOption(/processed/i);
    await user.click(processedOption);
    await user.click(button);
    const newOption = await getOption(/new/i);
    await user.click(newOption);
    expect(onChange).toHaveBeenCalledWith("new");
  });
});
