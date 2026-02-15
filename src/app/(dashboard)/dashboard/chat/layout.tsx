import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
