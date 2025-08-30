import "./globals.css";
import { SessionProvider } from "@/components/session-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SessionProvider>
          <main className="mx-auto max-w-[600px]">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
