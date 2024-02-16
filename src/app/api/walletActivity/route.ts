import { NextResponse, NextRequest } from "next/server";
import { CovalentService } from "../../../../utils/services/covalent.service";

export async function GET(request: NextRequest) {
  const walletAddress = request.nextUrl.searchParams.get("walletAddress");
  const page = request.nextUrl.searchParams.get("page");

  if (!walletAddress) {
    return NextResponse.json(
      { message: "Missing wallet address" },
      { status: 400 }
    );
  }

  let headers = new Headers();
  headers.set("Authorization", "Bearer cqt_rQBwgX9hXFkMFHY4kXrqKCjqghgK");

  const resp = await fetch(
    `https://api.covalenthq.com/v1/eth-mainnet/address/${walletAddress}/transactions_v3/page/${page}/`,
    { method: "GET", headers: headers }
  );

  if (resp.status !== 200) {
    return NextResponse.json(
      { message: "Invalid wallet address" },
      { status: 400 }
    );
  }

  const prettify = {};

  return NextResponse.json(
    { message: walletAddress || "Hello, world!" },
    { status: 200 }
  );
}
