import type { MetaFunction } from "@remix-run/cloudflare";
import { ClientOnly } from "remix-utils/client-only";
import { LandingPage } from "~/components/LandingPage.client";
import config from "~/config.json";
import { FrameSDKProvider } from "~/providers/FrameSDKContext";

export const meta: MetaFunction = () => {
  const appUrl = config.appUrl;
  const { name, title, description } = config.meta;

  // https://docs.farcaster.xyz/developers/frames/v2/spec
  const frame = {
    version: "next",
    imageUrl: `${appUrl}/assets/9i9x7t.jpg`,
    button: {
      title: config.button.title,
      action: {
        type: "launch_frame",
        name: name,
        url: appUrl,
        splashImageUrl: `${appUrl}/assets/9i9x7t.jpg`,
        splashBackgroundColor: "#050709",
      },
    },
  };

  return [
    { title },
    { description },
    { name: "fc:frame", content: JSON.stringify(frame) },
    { "og:title": title },
    { "og:type": "website" },
    { "og:image": `${appUrl}/assets/9i9x7t.jpg` },
    { "og:url": appUrl },
  ];
};

export default function Index() {
  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <ClientOnly fallback={<div>Loading...</div>}>
        {() => (
          <FrameSDKProvider>
            <LandingPage />
          </FrameSDKProvider>
        )}
      </ClientOnly>
    </div>
  );
}
