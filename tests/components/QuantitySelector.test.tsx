import { render, screen } from "@testing-library/react";
import { CartProvider } from "../../src/providers/CartProvider";
import QuantitySelector from "../../src/components/QuantitySelector";
import { Product } from "../../src/entities";
import userEvent from "@testing-library/user-event";

describe("QuantitySelector", () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: "a",
      categoryId: 1,
      price: 10,
    };
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );
    const user = userEvent.setup();
    const addToCartButton = screen.getByRole("button", { name: /add/i });
    const getAddToCartButton = () =>
      screen.getByRole("button", { name: /add/i });
    const getQuantityControls = () => ({
      quantityBadge: screen.queryByRole("status"),
      incrementButton: screen.queryByRole("button", { name: "+" }),
      decrementButton: screen.queryByRole("button", { name: "-" }),
    });
    const addToCart = async () => {
      await user.click(addToCartButton);
    };
    const increment = async () => {
      const { incrementButton } = getQuantityControls();
      await user.click(incrementButton!);
    };
    const decrement = async () => {
      const { decrementButton } = getQuantityControls();
      await user.click(decrementButton!);
    };
    return {
      addToCartButton,
      getAddToCartButton,
      getQuantityControls,
      addToCart,
      increment,
      decrement,
    };
  };

  it("should render the add to cart button", () => {
    const { addToCartButton } = renderComponent();
    expect(addToCartButton).toBeInTheDocument();
  });

  it("should show 1 after click on add", async () => {
    const { addToCartButton, getQuantityControls, addToCart } =
      renderComponent();

    await addToCart();
    const { decrementButton, incrementButton, quantityBadge } =
      getQuantityControls();

    expect(quantityBadge).toHaveTextContent("1");
    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
    expect(addToCartButton).not.toBeInTheDocument();
  });

  it("should increment quantity when click on +", async () => {
    const { getQuantityControls, addToCart, increment } = renderComponent();
    await addToCart();
    const { quantityBadge } = getQuantityControls();

    await increment();

    expect(quantityBadge).toHaveTextContent("2");
  });

  it("should decrement quantity when click on +", async () => {
    const { getQuantityControls, addToCart, increment, decrement } =
      renderComponent();
    await addToCart();
    const { quantityBadge } = getQuantityControls();
    await increment();

    await decrement();

    expect(quantityBadge).toHaveTextContent("1");
  });

  it("should remove quantity badge and show add button again", async () => {
    const { getQuantityControls, getAddToCartButton, addToCart, decrement } =
      renderComponent();
    await addToCart();
    const { decrementButton, incrementButton, quantityBadge } =
      getQuantityControls();

    await decrement();

    expect(getAddToCartButton()).toBeInTheDocument();
    expect(quantityBadge).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
  });
});
