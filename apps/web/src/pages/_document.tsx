import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Fonts Link for Parkinsans (regular) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Parkinsans&display=swap"
        />
        {/* Google Fonts Link for Parkinsans with weight 700 */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Parkinsans:wght@700&display=swap"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
