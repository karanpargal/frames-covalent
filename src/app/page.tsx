import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex h-screen flex-col gap-4 justify-center mx-auto items-center">
      <div>Covalent Logo</div>
      <div>Welcome to Covalent frames</div>
      <div className="flex gap-4">
        <Link href="/frames/wallet-activity" className="underline">
          Wallet Activity on ETH Mainnet
        </Link>
        {/* <Link href="/frames/wallet-approval" className="underline">
          Wallet Approval
        </Link> */}
      </div>
    </div>
  );
}
