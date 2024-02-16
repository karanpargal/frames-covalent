import { NextResponse, NextRequest } from "next/server";
import { CovalentService } from "../../../../utils/services/covalent.service";
import { ImageResponse } from "@vercel/og";
import {
  Frame,
  getFrameHtml,
  getFrameMessage,
  validateFrameMessage,
} from "frames.js";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const frameMessage = await getFrameMessage(body);
  if (!frameMessage) {
    return NextResponse.json(
      { message: "Invalid frame payload" },
      { status: 400 }
    );
  }

  const walletAddress = frameMessage.inputText;
  console.log("walletAddress", walletAddress);

  if (!walletAddress) {
    return NextResponse.json(
      { message: "Missing wallet address" },
      { status: 400 }
    );
  }

  let headers = new Headers();
  headers.set("Authorization", "Bearer cqt_rQBwgX9hXFkMFHY4kXrqKCjqghgK");

  const resp = await fetch(
    `https://api.covalenthq.com/v1/eth-mainnet/address/${walletAddress}/transactions_v3/page/1/`,
    { method: "GET", headers: headers }
  );

  //   const frame: Frame = {
  //     version: "vNext",
  //     postUrl: "https://covalent-frames.vercel.app/api/walletActivity",
  //     buttons: [
  //       {
  //         label: "Test1",
  //         action: "post",
  //       },
  //     ],
  //     image:
  //       "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   };

  const randomInt = Math.floor(Math.random() * 100);
  const imageUrl = `https://picsum.photos/seed/${randomInt}/1146/600`;

  const frame: Frame = {
    version: "vNext",
    image: imageUrl,
    buttons: [
      {
        label: `Next (pressed by)`,
        action: "post",
      },
      {
        label: "Visit frames.js",
        action: "post_redirect",
      },
    ],
    ogImage: imageUrl,
    postUrl: "https://covalent-frames.vercel.app/api/walletActivity",
  };

  const html = getFrameHtml(frame);

  if (resp.status !== 200) {
    return NextResponse.json(
      { message: "Invalid wallet address" },
      { status: 400 }
    );
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
    status: 200,
  });
}
