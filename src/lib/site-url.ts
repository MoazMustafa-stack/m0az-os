const configured = process.env.NEXT_PUBLIC_SITE_URL;

export const SITE_URL = (() => {
  try {
    return new URL(configured ?? "https://m0az-os.vercel.app");
  } catch {
    return new URL("https://m0az-os.vercel.app");
  }
})();
