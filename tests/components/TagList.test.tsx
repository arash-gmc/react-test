import { render, screen, waitFor } from "@testing-library/react";
import TagList from "../../src/components/TagList";

describe("TagList", () => {
  it("should return tag list", async () => {
    render(<TagList />);
    // await waitFor(() => {
    //   const list = screen.getAllByRole("listitem");
    //   expect(list.length).toBeGreaterThan(0);
    // });
    const list = await screen.findAllByRole("listitem");
    expect(list.length).toBeGreaterThan(0);
  });
});
