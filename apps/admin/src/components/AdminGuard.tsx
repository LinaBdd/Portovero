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

  const { user, token } = useAdminAuth();

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
      (!user || !token) &&
      pathname !== "/login"
    ) {
      router.replace("/login");
    }

  }, [
    hydrated,
    user,
    token,
    pathname,
    router,
  ]);



  if (!hydrated) {
    return null;
  }


  if ((!user || !token) && pathname !== "/login") {
    return null;
  }


  return <>{children}</>;
}