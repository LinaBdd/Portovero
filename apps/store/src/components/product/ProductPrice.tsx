interface Props {
  price: number;
  oldPrice?: number;
}

export function ProductPrice({
  price,
  oldPrice,
}: Props) {
  return (
    <div className="flex items-center gap-3">

      <span className="text-xl font-semibold">
        €{price}
      </span>

      {oldPrice && (
        <span className="text-neutral-400 line-through">
          €{oldPrice}
        </span>
      )}

    </div>
  );
}