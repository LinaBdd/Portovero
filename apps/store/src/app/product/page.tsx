import {
  CollectionBanner,
  ProductGrid,
  ProductToolbar,
} from "../../components/collection";

export default function CollectionsPage() {
  return (
    <>
      <main>

        <CollectionBanner />

        <ProductToolbar />

        <ProductGrid />

      </main>
    </>
  );
}