import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { db } from "../mocks/db";
import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";
import AllProviders from "../AllProviders";

describe("ProductDetail", () => {
  let productId: number;
  beforeAll(() => {
    const product = db.products.create();
    productId = product.id;
  });

  afterAll(() => {
    db.products.deleteMany({ where: { id: { equals: productId } } });
  });

  it("should render product detail", async () => {
    const product = db.products.findFirst({
      where: { id: { equals: productId } },
    });
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });
    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });

  it("should say not found if can not find any products who matches", async () => {
    server.use(http.get("products/1", () => HttpResponse.json(null)));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });

  it("should return error if product id is invalid", async () => {
    render(<ProductDetail productId={0} />, { wrapper: AllProviders });
    const message = await screen.findByText(/invalid/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error message if there was an error when fetching data", async () => {
    server.use(http.get("products/1", () => HttpResponse.error()));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render a loading indicator when fetching data", () => {
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove loading indicator after data is fetched", async () => {
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
