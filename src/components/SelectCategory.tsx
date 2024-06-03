import { Select } from "@radix-ui/themes";
import { Category } from "../entities";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import { useQuery } from "react-query";

interface Props {
  passCategoryId: (categoryId: string) => void;
}

const SelectCategory = ({ passCategoryId }: Props) => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<Category[], Error>({
    queryKey: ["category"],
    queryFn: () => axios.get<Category[]>("/categories").then((res) => res.data),
  });

  if (isLoading)
    return (
      <div role="progressbar" aria-label="categories">
        <Skeleton />
      </div>
    );
  if (error) return null;
  return (
    <Select.Root onValueChange={(categoryId) => passCategoryId(categoryId)}>
      <Select.Trigger placeholder="Filter by Category" />
      <Select.Content>
        <Select.Group>
          <Select.Label>Category</Select.Label>
          <Select.Item value="all">All</Select.Item>
          {categories?.map((category) => (
            <Select.Item key={category.id} value={category.id.toString()}>
              {category.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default SelectCategory;
