import type { Metadata } from "next";
import BlogDirectory from "./BlogDirectory";

export const metadata: Metadata = {
  title: "Learning Notes | Pranav Pappu",
  description:
    "Notes on building AI systems, developer tools, evaluations, and the lessons between them.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Learning Notes | Pranav Pappu",
    description:
      "Notes on building AI systems, developer tools, evaluations, and the lessons between them.",
    url: "/blog",
    siteName: "Pranav Pappu",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning Notes | Pranav Pappu",
    description:
      "Notes on building AI systems, developer tools, evaluations, and the lessons between them.",
  },
};

export default function BlogPage() {
  return <BlogDirectory />;
}
