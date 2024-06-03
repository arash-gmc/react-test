import { useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import ProductTable from "../components/ProductTable";
import SelectCategory from "../components/SelectCategory";

function BrowseProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">
        <SelectCategory
          passCategoryId={(categoryId) =>
            setSelectedCategoryId(parseInt(categoryId))
          }
        />
      </div>
      <ProductTable selectedCategoryId={selectedCategoryId} />
    </div>
  );
}

export default BrowseProducts;
