import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "M0AZ_OS",
    short_name: "M0AZ_OS",
    description: "Moaz's browser-native portfolio operating system.",
    start_url: "/",
    display: "standalone",
    background_color: "#030704",
    theme_color: "#75ff70",
  };
}
