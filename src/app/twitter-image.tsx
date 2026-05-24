import { ImageResponse } from "next/og";
import {
  SocialPreviewImage,
  socialImageAlt,
  socialImageSize,
} from "@/lib/social-preview-image";

export const alt = socialImageAlt;
export const size = socialImageSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<SocialPreviewImage />, {
    ...size,
  });
}
