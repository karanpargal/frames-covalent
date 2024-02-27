import { NextRequest } from "next/server";
import { CovalentService } from "../../../../utils/services/covalent.service";
import { TOKEN_APPROVAL_DATA } from "../../../../utils/constants/types";
import { ImageResponse } from "@vercel/og";
import {
  convert_to_base64_url,
  minify_address,
} from "../../../../utils/functions/helper";
import {
  Frame,
  FrameButtonsType,
  getFrame,
  getFrameHtml,
  getFrameMessage,
} from "frames.js";
import { ERROR_FRAME } from "../../../../utils/functions/error-frame";

const COVALENT_SERVICE = CovalentService.getCovalentClient();

export async function POST(req: NextRequest) {
  try {
    // const timeout_Promise = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     reject({
    //       message:
    //         "The response for that address was big, resulting in a > 5s request time. Please try again with a different address.",
    //       slug: "timeout",
    //     });
    //   }, 4500);
    // });

    const frame_Promise = new Promise(async (resolve, reject) => {
      const body = await getFrameMessage(await req.json());
      if (!body) {
        reject({
          message: "Invalid frame payload",
          slug: "invalid_frame_payload",
        });
      }

      const walletAddress = body.inputText;

      if (!walletAddress) {
        reject({
          message: "Invalid wallet address",
          slug: "invalid_wallet_address",
        });
      }

      let approval_details: Array<TOKEN_APPROVAL_DATA> = [];
      const resp = await COVALENT_SERVICE.SecurityService.getApprovals(
        "eth-mainnet",
        walletAddress!
      );

      for (const approval of resp.data.items) {
        approval_details.push({
          token_address: approval.token_address,
          ticker_symbol: approval.ticker_symbol,
          contract_decimals: approval.contract_decimals,
          logo_url: approval.logo_url,
          value_at_risk: Number(approval.value_at_risk),
          pretty_value_at_risk_quote: approval.pretty_value_at_risk_quote,
          spenders: approval.spenders.map((spender) => {
            return {
              spender_address: spender.spender_address,
              value_at_risk: Number(spender.value_at_risk),
              pretty_value_at_risk_quote: spender.pretty_value_at_risk_quote,
              risk_factor: spender.risk_factor,
            };
          }),
        });
        if (approval_details.length >= 4) break;
      }

      const react_component = new ImageResponse(
        (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              backgroundColor: "#000426",
              fontSize: 32,
              fontWeight: 800,
              padding: "20px 20px",
            }}
          >
            <svg
              width="228"
              height="55"
              viewBox="0 0 341 82"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_2_0)">
                <path
                  d="M92.1593 41.8772C92.1593 28.5791 99.2408 21.9842 113.133 21.9842C118.809 21.9842 122.161 23.0113 125.027 24.3086L122.594 30.9577C118.972 29.9846 117.459 29.6062 113.242 29.5512C106.322 29.4441 101.512 33.3352 101.512 41.3356C101.512 49.3371 106.594 53.6076 114.324 53.6076C118.053 53.6076 120.27 53.2832 123.187 52.5264L125.134 59.4457C121.458 60.7972 118.27 61.2837 113.351 61.2837C99.3499 61.2837 92.1593 54.4184 92.1593 41.8772ZM150.869 45.9855C150.869 41.2285 149.681 37.6067 144.705 37.6067C139.841 37.6067 138.49 41.2285 138.49 46.0406C138.49 51.1209 140.004 54.2022 144.814 54.2022C149.681 54.2022 150.868 51.0128 150.868 45.9855H150.869ZM129.407 46.2558C129.407 36.4705 135.516 30.4701 144.868 30.4701C155.355 30.4701 160.06 36.3634 160.06 45.9865C160.06 56.0401 153.462 61.3928 144.38 61.3928C134.651 61.3928 129.407 55.4996 129.407 46.2548V46.2558ZM162.982 31.2279H172.658L177.632 47.2288L179.145 53.1211L180.822 47.2288L186.334 31.2279H195.796L184.335 60.7431H173.63L162.982 31.2279ZM216.499 53.2292V48.5813L212.069 48.6904C209.418 48.7434 207.474 49.6083 207.474 51.7706C207.474 53.5005 209.149 54.2573 210.771 54.2573C212.5 54.2573 214.555 53.7697 216.5 53.2302L216.499 53.2292ZM198.715 52.3102C198.715 44.8503 205.528 43.3367 211.366 43.3367H216.5V41.4978C216.5 38.904 214.824 38.1472 211.15 38.1472C208.229 38.1472 205.094 38.7959 202.337 39.4436L200.555 32.9027C203.906 31.6063 207.798 30.5252 212.5 30.5252C221.637 30.5252 225.313 33.1199 225.313 39.769V52.9048C225.313 53.8778 226.286 54.0941 227.961 54.1481L227.636 60.9593C226.935 61.0134 226.23 61.0134 225.527 61.0134C221.961 61.0134 218.177 60.4188 217.366 57.8781C215.204 59.5548 212.123 61.2296 208.878 61.2296C202.393 61.2296 198.715 58.2024 198.715 52.3102ZM234.667 19.9831H243.694V60.7441H234.667V19.9831ZM268.725 42.9583C268.833 39.3906 267.265 36.9039 264.346 36.9039C261.265 36.9039 259.266 39.0662 259.103 42.9583H268.725ZM249.857 46.417C249.857 34.3632 256.183 30.5252 265.103 30.5252C274.401 30.5252 277.969 36.5796 277.969 45.499V48.7424H258.833C258.78 53.3913 262.454 54.2563 267.155 54.2563C269.157 54.2563 272.509 53.6076 275.591 53.067L276.942 59.9312C273.645 60.9053 269.428 61.3928 265.861 61.3928C256.13 61.3928 249.857 58.2024 249.857 46.417ZM284.135 31.2279H293.162V34.2011C294.947 32.8497 298.839 30.4701 302.787 30.4701C312.029 30.4701 312.678 35.5515 312.678 42.2556V60.7441H303.704V43.0124C303.704 38.9581 302.787 38.2554 299.756 38.2554C297.055 38.2554 294.623 39.1203 293.162 39.823V60.7431H284.135V31.2279ZM321.544 51.5534V37.877H317.222V31.2279H321.544V25.1725H330.518V31.2279H339.656V37.877H330.518V51.4993C330.518 53.6616 331.33 53.8238 333.763 53.8238C335.762 53.8238 340.142 53.2292 340.142 53.2292L341.007 60.3106C338.898 60.9053 336.034 61.3377 333.871 61.3377C328.194 61.3377 321.544 61.608 321.544 51.5534ZM40.691 18.976V-0.00403258C18.2072 -0.00403258 0 18.2042 0 40.6869C0 63.1707 18.2082 81.3799 40.691 81.3799V62.3998C28.6903 62.3998 18.98 52.6886 18.98 40.6869C18.98 28.6873 28.6903 18.976 40.691 18.976Z"
                  fill="#FFF"
                />
                <path
                  d="M62.482 18.976C61.2357 18.976 60.0017 18.7305 58.8503 18.2536C57.6989 17.7767 56.6527 17.0777 55.7715 16.1964C54.8903 15.3152 54.1912 14.269 53.7143 13.1177C53.2374 11.9663 52.9919 10.7322 52.9919 9.48599C52.9919 8.23974 53.2374 7.0057 53.7143 5.85431C54.1912 4.70293 54.8903 3.65676 55.7715 2.77553C56.6527 1.8943 57.6989 1.19527 58.8503 0.718352C60.0017 0.241434 61.2357 -0.0040326 62.482 -0.00403258C64.9989 -0.00403254 67.4127 0.995806 69.1924 2.77553C70.9721 4.55525 71.972 6.96908 71.972 9.48599C71.972 12.0029 70.9721 14.4167 69.1924 16.1964C67.4127 17.9762 64.9989 18.976 62.482 18.976Z"
                  fill="#00D8D5"
                />
                <path
                  d="M62.3228 81.3789C59.8059 81.3789 57.3921 80.3791 55.6123 78.5994C53.8326 76.8196 52.8328 74.4058 52.8328 71.8889C52.8328 69.372 53.8326 66.9582 55.6123 65.1784C57.3921 63.3987 59.8059 62.3989 62.3228 62.3989C64.8397 62.3989 67.2535 63.3987 69.0332 65.1784C70.813 66.9582 71.8128 69.372 71.8128 71.8889C71.8128 74.4058 70.813 76.8196 69.0332 78.5994C67.2535 80.3791 64.8397 81.3789 62.3228 81.3789Z"
                  fill="#FF4C8B"
                />
                <path
                  d="M62.4029 40.6869C62.4029 52.6886 52.6926 62.3998 40.691 62.3998V18.975C52.6916 18.975 62.4029 28.6852 62.4029 40.6859"
                  fill="#FFF"
                />
              </g>
              <defs>
                <clipPath id="clip0_2_0">
                  <rect
                    width="340.64"
                    height="81.293"
                    fill="white"
                    transform="scale(1.00106)"
                  />
                </clipPath>
              </defs>
            </svg>

            <div
              style={{
                margin: "20px auto",
                color: "#FFF",
                fontSize: "42px",
                display: "flex",
              }}
            >
              Checkout all your token approvals!!
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                color: "#FFF",
                width: "100%",
                margin: "60px 0",
              }}
            >
              {approval_details.map((approval) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      width: "100%",
                      margin: "0 0 10px 0",
                    }}
                    key={approval.token_address}
                  >
                    <div
                      style={{
                        fontSize: "26px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "6px",
                        width: "100%",
                      }}
                      key={approval.token_address}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <img
                          src={approval.logo_url}
                          alt="token-logo"
                          width={24}
                          height={24}
                        />
                        <div>{approval.ticker_symbol}</div>
                        <div>{minify_address(approval.token_address)}</div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          padding: "3px 10px",
                          backgroundColor: `${
                            approval.pretty_value_at_risk_quote === "$0.00"
                              ? "#00A86B"
                              : "#BF0A30"
                          }`,
                          borderRadius: "5px",
                        }}
                      >
                        Total Value at Risk:{" "}
                        {approval.pretty_value_at_risk_quote}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          width: "100%",
                          margin: "10px 0",
                        }}
                      >
                        {approval.spenders.map((spender) => {
                          return (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                width: "100%",
                              }}
                              key={spender.spender_address}
                            >
                              <div
                                style={{
                                  fontSize: "24px",
                                  fontWeight: 600,
                                  display: "flex",
                                  width: "45%",
                                }}
                              >
                                Spender Address:{" "}
                                {minify_address(spender.spender_address)}
                              </div>
                              <div
                                style={{
                                  fontSize: "24px",
                                  fontWeight: 600,
                                  display: "flex",
                                  width: "20%",
                                }}
                              >
                                Value: {spender.pretty_value_at_risk_quote}
                              </div>
                              <div
                                style={{
                                  fontSize: "24px",
                                  display: "flex",
                                  width: "35%",
                                  color: `${
                                    spender.risk_factor.toLowerCase() ===
                                    "consider revoking"
                                      ? "#BF0A30"
                                      : "#00A86B"
                                  }`,
                                }}
                              >
                                {spender.risk_factor}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );

      const react_component_buffer = await react_component.arrayBuffer();
      const react_component_base64 = convert_to_base64_url(
        btoa(
          new Uint8Array(react_component_buffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )
      );

      let frame_buttons = [
        {
          action: "post",
          label: "Try Another Address",
          target: process.env.BASE_URL! + "/frames/wallet-approval",
        },
      ] as FrameButtonsType;

      const frame: Frame = {
        version: "vNext",
        image: react_component_base64,
        postUrl: process.env.BASE_URL! + "/api/wallet-approval",
        buttons: frame_buttons,
      };

      const frame_html = getFrameHtml(frame);

      resolve(
        new Response(frame_html, {
          headers: {
            "Content-Type": "text/html",
          },
          status: 200,
        })
      );
    });

    const response = await Promise.race([frame_Promise]);

    return response as Response;
  } catch (e: any) {
    const error_component = new ImageResponse(ERROR_FRAME(e), {
      width: 1200,
      height: 630,
    });

    const error_component_buffer = await error_component.arrayBuffer();
    const error_component_base64 = convert_to_base64_url(
      btoa(
        new Uint8Array(error_component_buffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )
    );

    const error_frame: Frame = {
      version: "vNext",
      image: error_component_base64,
      ogImage: error_component_base64,
      buttons: [
        {
          action: "post",
          label: "Try Again",
          target: process.env.BASE_URL! + "frames/wallet-approval",
        },
      ],
      postUrl: process.env.BASE_URL! + "frames/wallet-approval",
    };

    const error_frame_html = getFrameHtml(error_frame);

    return new Response(error_frame_html, {
      headers: {
        "Content-Type": "text/html",
      },
      status: 200,
    });
  }
}