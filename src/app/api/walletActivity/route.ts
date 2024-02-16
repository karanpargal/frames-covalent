import { NextResponse, NextRequest } from "next/server";
import { CovalentService } from "../../../../utils/services/covalent.service";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const walletAddress = body?.frameInputText;

  if (!walletAddress) {
    return NextResponse.json(
      { message: "Missing wallet address" },
      { status: 400 }
    );
  }

  const resp =
    await CovalentService.getCovalentClient().TransactionService.getAllTransactionsForAddressByPage(
      "eth-mainnet",
      walletAddress
    );

  return NextResponse.json(resp, { status: 200 });
}
