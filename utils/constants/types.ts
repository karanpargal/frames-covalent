export interface TRANSACTION_DATA {
  tx_hash: string;
  block_signed_at: Date;
  from_address: string;
  to_address: string;
  to_address_label: string;
  value: number;
  pretty_value_quote: string;
  fees_paid: number;
  decimals: number;
  pretty_gas_quote: string;
  native_token_logo: string;
}
