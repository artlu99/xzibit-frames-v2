# Xzibit Frame V2

## Wat is dis

This is a trivial Farcaster Frames v2 wrapper built on [Frames v2 Starter](http://github.com/artlu99/framesv2-remix-cf) by  [@artlu](http://warpcast.com/artlu).

Load up any webpage to see how it would render inside a Farcaster Frame V2.

Share a frame-ified link to any webpage by casting an "embed" as `https://xzibit.artlu.xyz/example.com`

### Notes

1. the frame wrapper looks for OG meta tags on your website, and passes them through as if your site was already a frame. If you see the default image, that means neither Xzibit nor Warpcast would be able to find an image to display for your site
2. this site renders differently in browser, and in a frame
3. some routing can be tricky, especially if it happens using client-side Javascript. Try your URL with or without a trailing `/` if you encounter problems.

## License

MIT
