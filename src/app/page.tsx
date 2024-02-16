import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import Link from "next/link";
import { DEBUG_HUB_OPTIONS } from "./debug/constants";

type State = {
  active: string;
  total_button_presses: number;
};

const initialState = { active: "1", total_button_presses: 0 };

const reducer: FrameReducer<State> = (state, action) => {
  return {
    total_button_presses: state.total_button_presses + 1,
    active: action.postBody?.untrustedData.buttonIndex
      ? String(action.postBody?.untrustedData.buttonIndex)
      : "1",
  };
};

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
