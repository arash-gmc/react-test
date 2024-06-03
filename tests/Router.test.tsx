import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import routes from "../src/routes";
import { navigateTo } from "./utils";
import { db } from "./mocks/db";

describe("Router", () => {
  it("should render the home page for / ", () => {
    navigateTo("/");
    screen.getByRole("heading", { name: /home/i });
  });

  it("should render products page for /products", () => {
    navigateTo("/products");
    screen.getByRole("heading", { name: /products/i });
  });

  it("should render the product details page when hitting /products/:id with valid id", async () => {
    const product = db.products.create({ id: 1, name: "product1" });
    navigateTo("/products/" + product.id);
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    expect(screen.getByText(product.name)).toBeInTheDocument();
    db.products.delete({ where: { id: { equals: product.id } } });
  });

  it("should render the product details page when hitting /products/:id with invalid id", async () => {
    navigateTo("/products/1");
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it("should render not found page when hitting invalid path", async () => {
    navigateTo("/invalid-route");
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it("should render not found page when hitting invalid path", async () => {
    navigateTo("/admin");
    expect(screen.getByRole("heading", { name: /admin/i })).toBeInTheDocument();
  });
});
