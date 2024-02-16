import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex h-screen flex-col gap-4 justify-center mx-auto items-center">
      <div>Covalent Logo</div>
      <div>Welcome to Covalent frames</div>
      <div className="flex gap-4">
        <Link href="/frames/walletActivity" className="underline">
          Wallet Activity
        </Link>
        <a>Wallet Approval</a>
      </div>
    </div>
  );
}
