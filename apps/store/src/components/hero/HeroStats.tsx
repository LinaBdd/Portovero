const stats = [
  {
    value: "+2000",
    label: "Happy Clients",
  },
  {
    value: "48h",
    label: "Shipping",
  },
  {
    value: "100%",
    label: "Premium Quality",
  },
];

export function HeroStats() {
  return (
    <div className="mt-12 grid grid-cols-3 gap-8">
      {stats.map((item) => (
        <div key={item.label}>
          <h3 className="text-3xl font-semibold">
            {item.value}
          </h3>

          <p className="mt-2 text-neutral-500">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}