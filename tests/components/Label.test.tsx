import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import { Language } from "../../src/providers/language/type";

const renderComponent = (text: string, language: Language) => {
  render(
    <LanguageProvider language={language}>
      <Label labelId={text} />
    </LanguageProvider>
  );
};

describe("when providing language is en", () => {
  it.each([
    { text: "welcome", label: "Welcome" },
    { text: "new_product", label: "New Product" },
    { text: "edit_product", label: "Edit Product" },
  ])("should render $label when text is $text", ({ text, label }) => {
    renderComponent(text, "en");
    expect(screen.getByText(label));
  });
});

describe("when providing language is es", () => {
  it.each([
    { text: "welcome", label: "Bienvenidos" },
    { text: "new_product", label: "Nuevo Producto" },
    { text: "edit_product", label: "Editar Producto" },
  ])("should render $label when text is $text", ({ text, label }) => {
    renderComponent(text, "es");
    expect(screen.getByText(label));
  });
});

it("should throw an error if text is not definded", () => {
  expect(() => renderComponent("!", "en")).toThrowError();
});
