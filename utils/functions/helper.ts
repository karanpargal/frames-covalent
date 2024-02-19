export const minify_address = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const is_address_or_ens = (address: string) => {
  if (!address) return false;
  if (address.match(/^0x[a-fA-F0-9]{40}$/)) return "address";
  if (address.match(/^.{2,}\.eth$/)) return "ens";
  return false;
};

export const convert_to_base64_url = (url: string) => {
  return `data:image/png;base64,${url}`;
};
