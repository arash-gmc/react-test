import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
  it("should return empty page if array is empty", () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should return a list of images based on array", () => {
    const urls = ["url1", "url2"];
    render(<ProductImageGallery imageUrls={urls} />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBe(2);
    urls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute("src", url);
    });
  });
});
