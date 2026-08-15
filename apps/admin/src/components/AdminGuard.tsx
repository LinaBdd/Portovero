"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useAdminAuth } from "../store/auth";


export function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const pathname = usePathname();

  const { user } = useAdminAuth();

  const [hydrated, setHydrated] = useState(false);


  useEffect(() => {

    const unsub = useAdminAuth.persist.onFinishHydration(() => {
      setHydrated(true);
    });


    if (useAdminAuth.persist.hasHydrated()) {
      setHydrated(true);
    }


    return unsub;

  }, []);



  useEffect(() => {

    if (
      hydrated &&
      !user &&
      pathname !== "/login"
    ) {
      router.replace("/login");
    }

  }, [
    hydrated,
    user,
    pathname,
    router,
  ]);



  if (!hydrated) {
    return null;
  }


  if (!user && pathname !== "/login") {
    return null;
  }


  return <>{children}</>;
}