import { useNavigate } from "@remix-run/react";
import { useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import { ClearableInput } from "~/components/ui/clearable-input";
import config from "~/config.json";
import { useFrameSDK } from "~/providers/FrameSDKContext";

const DEBUG = import.meta.env.DEV;

export const LandingPage = () => {
  const { isSDKLoaded, context } = useFrameSDK();
  const [url, setUrl] = useState("https://example.com");
  const [msg, setMsg] = useState<string>("Yo Dawg, I heard you like frames");

  const { sdk } = useFrameSDK();

  const castIntent = useCallback(
    (msg: string, url: string) => {
      sdk.actions.openUrl(
        `https://warpcast.com/~/compose?text=${msg}&embeds[]=${
          config.appUrl
        }/${url.replace(/^https?:\/\//, "")}`
      );
    },
    [sdk]
  );

  const navigate = useNavigate();

  const name = context?.user?.displayName || "Fartcaster";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Strip protocol (http:// or https://) from URL
    const strippedUrl = url.replace(/^https?:\/\//, "");
    navigate(`/${strippedUrl}`);
  };

  return isSDKLoaded ? (
    <div>
      <article className="prose">
        <p className="text-lg font-bold">
          Yo {name},<br />I heard you like Frames
        </p>

        {context || DEBUG ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <ClearableInput
              type="text"
              placeholder="Enter URL (e.g., example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onClear={() => setUrl("")}
              className="w-full"
              pattern="^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$"
              required
            />

            <Button
              type="submit"
              className="relative w-[280px] min-h-[36px]"
              variant="default"
            >
              Preview
            </Button>
            <p className="text-sm text-muted-foreground">
              (there is no Back button, due to how we put the website in the
              Frame)
            </p>
            <Button
              type="submit"
              className={`transition-colors duration-200 bg-warpcast-ui text-white
                relative w-[280px] min-h-[48px] hover:bg-zinc-400 active:bg-zinc-400
                dark:bg-warpcast-ui dark:hover:bg-zinc-700 dark:active:bg-zinc-600`}
              onClick={() => castIntent(msg, url)}
            >
              Cast Frame
            </Button>
          </form>
        ) : (
          <p>You do not appear to be viewing this from a Farcaster Frame v2.</p>
        )}
      </article>
      {context || DEBUG ? (
        <div className="fixed bottom-16 right-8">
          <img
            src={"/assets/xzibit-ya-transparent.png"}
            alt="Xzibit"
            className="h-48"
          />
        </div>
      ) : (
        <div className="fixed bottom-16 left-8">
          <img
            src={"/assets/xzibit-nah-transparent.png"}
            alt="Xzibit"
            className="h-48"
          />
        </div>
      )}
    </div>
  ) : (
    <div>Loading...</div>
  );
};
