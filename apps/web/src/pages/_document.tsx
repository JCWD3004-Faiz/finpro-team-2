import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        
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
        
        {/* Google Fonts Link for Material Symbols Outlined (Multiple Icons) */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=login,person,shopping_cart" 
        />

        
        {/* Custom Font Settings for Material Symbols */}
        <style>
          {`
            .material-symbols-outlined {
              font-variation-settings: 
                'FILL' 0, 
                'wght' 400, 
                'GRAD' 0, 
                'opsz' 48;
            }
          `}
        </style>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
