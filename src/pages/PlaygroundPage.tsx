import QuantitySelector from "../components/QuantitySelector";
import { Product } from "../entities";
import { CartProvider } from "../providers/CartProvider";

const PlaygroundPage = () => {
  const product: Product = {
    id: 1,
    name: "a",
    categoryId: 1,
    price: 10,
  };
  return (
    <CartProvider>
      <QuantitySelector product={product} />
    </CartProvider>
  );
};

export default PlaygroundPage;
