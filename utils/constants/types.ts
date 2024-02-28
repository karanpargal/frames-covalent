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

export interface TOKEN_APPROVAL_DATA {
  token_address: string;
  ticker_symbol: string;
  contract_decimals: number;
  logo_url: string;
  value_at_risk: number;
  pretty_value_at_risk_quote: string;
  spenders: SPENDER[];
}

export interface SPENDER {
  spender_address: string;
  value_at_risk: number;
  pretty_value_at_risk_quote: string;
  risk_factor: string;
}
