import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import ogs from "open-graph-scraper-lite";
import { useEffect, useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import config from "~/config.json";
import { safeFetch } from "~/lib/utils";
import { FrameSDKProvider, useFrameSDK } from "~/providers/FrameSDKContext";

interface LoaderData {
  fullPath: string;
  imageUrl: string;
}

export const meta: MetaFunction<LoaderData> = ({ data }) => {
  const { fullPath, imageUrl } = data as LoaderData;

  // https://docs.farcaster.xyz/developers/frames/v2/spec
  const appUrl = config.appUrl;
  const name = config.meta.name;
  const frame = {
    version: "next",
    imageUrl,
    button: {
      title: config.button.title,
      action: {
        type: "launch_frame",
        name: name,
        url: `${appUrl}/${fullPath}/`,
        splashImageUrl: `${appUrl}/assets/9i9x7t.jpg`,
        splashBackgroundColor: "#050709",
      },
    },
  };

  return [
    { title: `Xzibit Frames V2 for ${fullPath} by @artlu` },
    { name: "fc:frame", content: JSON.stringify(frame) },
    { name: "og:image", content: [{ url: imageUrl }] },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  // Get base path without query parameters (for OG image fetching)
  const basePath = params["*"];

  // Get full URL including query parameters (for redirection)
  const url = new URL(request.url);
  const fullPathWithParams = basePath + (url.search || "");

  // Fetch OpenGraph data using only the base path
  const html = await safeFetch(`https://${basePath}`);
  const ogData = html ? await ogs({ html, onlyGetOpenGraphInfo: true }) : null;
  const imageUrl =
    ogData?.result.ogImage?.[0]?.url ?? `${config.appUrl}/splash.png`;

  return {
    fullPath: fullPathWithParams, // Return full path with params for redirection
    imageUrl, // Image URL fetched from base path
  };
}

const Component = ({ fullPath }: { fullPath: string | undefined }) => {
  const { isSDKLoaded, context } = useFrameSDK();
  const [fid, setFid] = useState<number>();

  useEffect(() => {
    if (context?.user?.fid) {
      setFid(context.user.fid);
    }
  }, [context]);

  useEffect(() => {
    const redirect = () => {
      if (fullPath) {
        // Validate URL before redirecting
        try {
          const url = new URL(`https://${fullPath}`);
          // Only redirect if it's a valid URL
          if (url.protocol === "https:") {
            window.location.replace(url.toString());
          } else {
            console.error("Invalid URL protocol");
          }
        } catch (e) {
          console.error("Invalid URL:", e);
        }
      }
    };

    if (fid) {
      redirect();
    }
  }, [fid, fullPath]);

  return isSDKLoaded ? (
    <a href={`https://${fullPath}`}>{fullPath}</a>
  ) : (
    <div>Loading...</div>
  );
};

export default function CatchAllRoute() {
  const { fullPath } = useLoaderData<typeof loader>();

  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      {() => (
        <FrameSDKProvider>
          <Component fullPath={fullPath} />
        </FrameSDKProvider>
      )}
    </ClientOnly>
  );
}
