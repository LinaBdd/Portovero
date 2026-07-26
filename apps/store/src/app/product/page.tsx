import { Navbar } from "../../components/navigation";
import { Footer } from "../../components/footer";

import {
  CollectionBanner,
  ProductGrid,
  ProductToolbar,
} from "../../components/collection";

export default function CollectionsPage() {
  return (
    <>
      <Navbar />

      <main>

        <CollectionBanner />

        <ProductToolbar />

        <ProductGrid />

      </main>

      <Footer />
    </>
  );
}