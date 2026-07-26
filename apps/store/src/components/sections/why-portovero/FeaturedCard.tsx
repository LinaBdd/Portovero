interface Props {
  icon: React.ElementType;
  title: string;
  description: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: Props) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
        <Icon size={26} />
      </div>

      <h3 className="mb-3 text-2xl font-serif">
        {title}
      </h3>

      <p className="text-neutral-600 leading-7">
        {description}
      </p>

    </div>
  );
}