import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-heading italic text-3xl text-brand mb-6">Add product</h1>
      <ProductForm />
    </div>
  );
}
