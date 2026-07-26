import { Container } from "../ui/container";

export function Footer() {
  return (
    <footer className="border-t py-16">

      <Container>

        <div className="grid gap-10 md:grid-cols-4">

          <div>

            <h3 className="font-serif text-3xl">
              Portovero
            </h3>

            <p className="mt-4 text-neutral-500">
              Timeless luxury for modern elegance.
            </p>

          </div>

          <div>

            <h4 className="mb-4 font-semibold">
              Shop
            </h4>

            <ul className="space-y-3 text-neutral-500">

              <li>Men</li>
              <li>Women</li>
              <li>Accessories</li>

            </ul>

          </div>

          <div>

            <h4 className="mb-4 font-semibold">
              Company
            </h4>

            <ul className="space-y-3 text-neutral-500">

              <li>About</li>
              <li>Journal</li>
              <li>Contact</li>

            </ul>

          </div>

          <div>

            <h4 className="mb-4 font-semibold">
              Support
            </h4>

            <ul className="space-y-3 text-neutral-500">

              <li>FAQ</li>
              <li>Shipping</li>
              <li>Returns</li>

            </ul>

          </div>

        </div>

      </Container>

    </footer>
  );
}