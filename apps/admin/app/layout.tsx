import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="container mx-auto p-4 max-w-xl">
          {children}
        </div>
      </body>
    </html>
  );
}
