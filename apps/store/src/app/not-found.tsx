import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="relative flex min-h-[70vh] items-center justify-center bg-[#3b3a35] bg-cover bg-center px-6 text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(20,20,18,.55),rgba(20,20,18,.65)), url('/images/404.jpg')",
      }}
    >
      <div className="text-center">
        <h1 className="font-heading text-7xl md:text-8xl">404</h1>
        <p className="mt-2 font-heading text-2xl">Page not found</p>
        <p className="mx-auto mt-4 max-w-sm text-sm text-white/70">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-10 inline-block bg-[#0F2D52] px-8 py-3 text-xs tracking-[0.2em] transition hover:bg-[#0c2444]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}