import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { db, getProductsByCategory } from "../mocks/db";
import { simulateDelay, simulateError } from "./utils";
import AllProviders from "../AllProviders";

describe("Loading State", () => {
  it("should render catagories skeleton when fetching data", async () => {
    simulateDelay("/categories");
    const { getCategoriesSkeleton } = renderComponent();
    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  it("should remove categories skeleton after data fetched", async () => {
    const { getCategoriesSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  it("should render products skeleton when fetching data", async () => {
    simulateDelay("/products");
    const { getProductsSkeleton } = renderComponent();
    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it("should remove products skeleton after data fetched", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);
  });
});

describe("error handling", () => {
  it("should not render categories selector if there was an error during fetch categories", async () => {
    simulateError("/categories");
    const { getCategoriesSkeleton, getCombobox } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(getCombobox()).not.toBeInTheDocument();
  });

  it("should render error if fetching products failed", async () => {
    simulateError("/products");
    renderComponent();
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});

describe("show proper options", () => {
  const dbCategories: Category[] = [];
  const dbProducts: Product[] = [];

  beforeAll(() => {
    [1, 2].map((num) => {
      const category = db.categories.create({ name: "category " + num });
      dbCategories.push(category);
      [1, 2].forEach(() => {
        dbProducts.push(db.products.create({ categoryId: category.id }));
      });
    });
  });
  afterAll(() => {
    const categoriesId = dbCategories.map((c) => c.id);
    const productsId = dbProducts.map((p) => p.id);
    db.categories.deleteMany({ where: { id: { in: categoriesId } } });
    db.products.deleteMany({ where: { id: { in: productsId } } });
  });

  it("should render the categories properly", async () => {
    const { getCategoriesSkeleton, getCombobox, user } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    await user.click(getCombobox()!);
    const options = await screen.findAllByRole("option");
    const categories = options.map((option) => option.textContent);
    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
    expect(categories.length).toBeGreaterThan(0);
    dbCategories.forEach((c) => {
      expect(categories).toContain(c.name);
    });
  });

  it("should render products properly", async () => {
    const { getProductsSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductsSkeleton);
    dbProducts.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
  });

  it("should filter products by category", async () => {
    const { selectCatagory, expectProductsToBeInTheDocument } =
      renderComponent();
    const selectedCategory = dbCategories[0];
    await selectCatagory(selectedCategory.name);
    const products = getProductsByCategory(selectedCategory.id);
    expectProductsToBeInTheDocument(products);
  });

  it("should render all products if all selected", async () => {
    const { selectCatagory, expectProductsToBeInTheDocument } =
      renderComponent();
    await selectCatagory(/all/i);
    const products = db.products.getAll();
    expectProductsToBeInTheDocument(products);
  });
});

const renderComponent = () => {
  render(<BrowseProducts />, { wrapper: AllProviders });

  const getCategoriesSkeleton = () =>
    screen.queryByRole("progressbar", { name: /categor/i });

  const getProductsSkeleton = () =>
    screen.queryByRole("progressbar", { name: /product/i });

  const getCombobox = () => screen.queryByRole("combobox");

  const user = userEvent.setup();

  const expectProductsToBeInTheDocument = (products: Product[]) => {
    const rows = screen.getAllByRole("row");
    const dataRows = rows.slice(1);
    expect(dataRows.length).toBe(products.length);
    products.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
  };

  const selectCatagory = async (name: RegExp | string) => {
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    await user.click(getCombobox()!);
    const option = screen.getByRole("option", { name });
    await user.click(option);
  };
  return {
    getCategoriesSkeleton,
    getProductsSkeleton,
    getCombobox,
    user,
    expectProductsToBeInTheDocument,
    selectCatagory,
  };
};
