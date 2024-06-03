import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { Category, Product } from "../../src/entities";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

describe("ProductForm", () => {
  let category: Category;
  let product: Product;
  beforeAll(() => {
    category = db.categories.create();
    product = db.products.create({ categoryId: category.id });
  });

  afterAll(() => {
    db.categories.delete({ where: { id: { equals: category.id } } });
    db.products.delete({ where: { id: { equals: product.id } } });
  });

  it("should render the input fields", async () => {
    const { renderForm } = renderComponent();
    const inputs = await renderForm();
    expect(inputs.name).toBeInTheDocument();
    expect(inputs.price).toBeInTheDocument();
    expect(inputs.category).toBeInTheDocument();
  });

  it("should render the initial values if product object passed", async () => {
    const { renderForm } = renderComponent(product);
    const inputs = await renderForm();
    expect(inputs.name).toHaveValue(product.name);
    expect(inputs.price).toHaveValue(product.price.toString());
    expect(inputs.category).toHaveTextContent(category.name);
  });

  it("should focus on name text field when component gets load", async () => {
    const { renderForm } = renderComponent();
    const inputs = await renderForm();
    expect(inputs.name).toHaveFocus();
  });

  it.each([
    { scenario: "missing", name: undefined, errorMessage: /required/i },
    {
      scenario: "longer than 255 characters",
      name: "a".repeat(256),
      errorMessage: /255/i,
    },
  ])(
    "should show an alert if name is $scenario",
    async ({ name, errorMessage }) => {
      const { renderForm, assertError } = renderComponent();
      const form = await renderForm();
      await form.fill({ ...form.validData, name });
      assertError(errorMessage);
    }
  );

  it.each([
    { scenario: "missing", price: undefined, errorMessage: /required/i },
    {
      scenario: "not a number",
      price: "a",
      errorMessage: /required/i,
    },
    {
      scenario: "0",
      price: 0,
      errorMessage: /required/i,
    },
    {
      scenario: "negative number",
      price: -1,
      errorMessage: /greater/i,
    },
    {
      scenario: "greater than 1000",
      price: 1001,
      errorMessage: /less/i,
    },
  ])(
    "should show an alert if price is $scenario",
    async ({ price, errorMessage }) => {
      const { renderForm, assertError } = renderComponent();
      const form = await renderForm();
      await form.fill({ ...form.validData, price });
      assertError(errorMessage);
    }
  );

  it("should call onSubmit with product object if subbmition is successfull", async () => {
    const { renderForm, onSubmit } = renderComponent();
    const { fill, validData } = await renderForm();
    await fill(validData);
    const { id, ...submitData } = validData;
    expect(onSubmit).toHaveBeenCalledWith(submitData);
  });

  it("should show an error toast if submition failed", async () => {
    const { renderForm, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue({});
    const { fill, validData } = await renderForm();
    await fill(validData);
    expect(await screen.findByRole("status")).toHaveTextContent(/error/i);
  });

  it("should show disable submit button while submitting", async () => {
    const { renderForm, onSubmit } = renderComponent();
    onSubmit.mockReturnValue(new Promise(() => null));
    const { fill, validData, submit } = await renderForm();
    await fill(validData);
    expect(submit).toBeDisabled();
  });

  it("should re-enable submit button after submition successed", async () => {
    const { renderForm, onSubmit } = renderComponent();
    onSubmit.mockResolvedValue({});
    const { fill, validData, submit } = await renderForm();
    await fill(validData);
    expect(submit).not.toBeDisabled();
  });
  it("should re-enable submit button after submition faild", async () => {
    const { renderForm, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue({});
    const { fill, validData, submit } = await renderForm();
    await fill(validData);
    expect(submit).not.toBeDisabled();
  });

  const renderComponent = (product?: Product) => {
    const onSubmit = vi.fn();
    render(
      <>
        <Toaster />
        <ProductForm onSubmit={onSubmit} product={product} />
      </>,
      {
        wrapper: AllProviders,
      }
    );

    return {
      renderForm: async () => {
        await screen.findByRole("form");
        const nameInput = screen.getByPlaceholderText(/name/i);
        const priceInput = screen.getByPlaceholderText(/price/i);
        const categoryInput = screen.getByRole("combobox", {
          name: /category/i,
        });
        const submitButton = screen.getByRole("button", { name: /submit/i });

        const validData: Product = {
          id: 1,
          name: "a",
          price: 10,
          categoryId: category.id,
        };

        type FormData = {
          [K in keyof Product]: any;
        };

        const fill = async (product: FormData) => {
          const user = userEvent.setup();
          if (product.name) await user.type(nameInput, product.name);
          if (product.price)
            await user.type(priceInput, product.price.toString());
          await user.tab();
          await user.click(categoryInput);
          const options = screen.getAllByRole("option");
          await user.click(options[0]);
          await user.click(submitButton);
        };

        return {
          name: nameInput,
          price: priceInput,
          category: categoryInput,
          submit: submitButton,
          validData,
          fill,
        };
      },
      assertError: (errorMessage: RegExp) => {
        expect(screen.getByRole("alert")).toHaveTextContent(errorMessage);
      },
      onSubmit,
    };
  };
});
