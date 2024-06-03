import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { db } from "../mocks/db";
import { Product } from "../../src/entities";
import { navigateTo } from "../utils";

describe("ProductDetailPage", () => {
  let product: Product;
  beforeAll(() => {
    product = db.products.create();
  });
  afterAll(() => {
    db.products.delete({ where: { id: { equals: product.id } } });
  });

  it("should render the name and price of the product", async () => {
    navigateTo("/products/" + product.id);
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    expect(screen.getByRole("heading", { name: product.name }));
    expect(screen.getByText("$" + product.price));
    screen.debug();
  });
});
