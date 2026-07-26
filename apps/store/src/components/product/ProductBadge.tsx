interface Props {
  isNew?: boolean;
  isSale?: boolean;
}

export function ProductBadge({
  isNew,
  isSale,
}: Props) {
  return (
    <div className="absolute left-4 top-4 flex gap-2 z-10">

      {isNew && (
        <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
          NEW
        </span>
      )}

      {isSale && (
        <span className="rounded-full bg-red-600 px-3 py-1 text-xs text-white">
          SALE
        </span>
      )}

    </div>
  );
}