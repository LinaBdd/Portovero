export function SortSelect() {
  return (
    <select className="rounded-full border border-neutral-300 px-5 py-3 outline-none">
      <option>Newest</option>
      <option>Best Sellers</option>
      <option>Highest Rated</option>
      <option>Price ↑</option>
      <option>Price ↓</option>
    </select>
  );
}