import Image from "next/image";
import Link from "next/link";
import CovalentLogo from "../app/assets/logo/covalent.svg";

export default async function Home() {
  return (
    <div className="flex h-screen flex-col gap-4 justify-center mx-auto items-center">
      <Image src={CovalentLogo} alt="Covalent Logo" className="mb-10" />
      <p className="text-3xl">Welcome to Covalent frames</p>
      <div className="flex gap-4 text-lg">
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
