import { apiClient } from "./client";

export type AddressCreate = {
  label?: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  wilaya_id: number;
  commune_id: number;
  postal_code?: string | null;
  is_default?: boolean;
};

export type AddressRead = AddressCreate & {
  id: number;
  user_id: number;
};

export async function createAddress(
  userId: number,
  data: AddressCreate
) {
  return apiClient<AddressRead>(
    `/addresses/user/${userId}`,
    {
      method: "POST",
      body: data,
    }
  );
}