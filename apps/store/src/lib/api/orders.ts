import { API_URL } from "./config";

export async function createGuestOrder(data: unknown) {
  const res = await fetch(`${API_URL}/orders/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let message = "Impossible de créer la commande.";

    try {
      const body = await res.json();

      if (typeof body.detail === "string") {
        message = body.detail;
      } else if (Array.isArray(body.detail)) {
        // 422 : champ + raison
        message = body.detail
          .map((d: { loc?: (string | number)[]; msg: string }) =>
            `${(d.loc ?? []).slice(1).join(".")} : ${d.msg}`
          )
          .join(" · ");
      }
    } catch {
      // réponse non JSON : on garde le message par défaut
    }

    throw new Error(message);
  }


  return res.json();
}