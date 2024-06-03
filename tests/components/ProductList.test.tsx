import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { HttpResponse, delay, http } from "msw";
import { db } from "../mocks/db";
import AllProviders from "../AllProviders";

describe("ProductList", () => {
  const productIds: number[] = [];
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.products.create();
      productIds.push(product.id);
    });
  });

  afterAll(() => {
    db.products.deleteMany({ where: { id: { in: productIds } } });
  });

  it("should render the products list ", async () => {
    render(<ProductList />, { wrapper: AllProviders });
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBe(3);
  });

  it("should render no product message if produc list is empty ", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />, { wrapper: AllProviders });
    const text = await screen.findByText(/no product/i);
    expect(text).toBeInTheDocument();
  });

  it("should return error if error happened when fetching data", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.error();
      })
    );
    render(<ProductList />, { wrapper: AllProviders });
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render a loading indicator when fetching data", async () => {
    server.use(
      http.get("/products", () => {
        delay();
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />, { wrapper: AllProviders });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove the loading indicator when fetch data done", async () => {
    render(<ProductList />, { wrapper: AllProviders });
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
