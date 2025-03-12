import { getSheetsClient } from '../libs/google-sheets';

export const fetcher = async <APIResponse>(path: `/${string}`, init: RequestInit = {}): Promise<APIResponse> => {
  const { headers, ...args } = init;
  const token = await getSheetsClient();

  const res = await fetch(`https://sheets.googleapis.com/v4${path}`, {
    headers: new Headers({
      ...(headers ?? {}),
      Authorization: `Bearer ${token}`,
    }),
    ...args,
  });

  return await res.json();
};
