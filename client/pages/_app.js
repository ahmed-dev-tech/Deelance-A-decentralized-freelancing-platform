import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { ChakraProvider } from "@chakra-ui/react";
import ContractProvider from "../context/ContractProvider";
import FirebaseProvider from "../context/FirebaseProvider";
import NFTStorageProvider from "../context/NFTStorageProvider";
import UtilitiesProvider from "../context/UtilitiesProvider";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_APP_ID}
      serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}
    >
      <ChakraProvider resetCSS>
        <FirebaseProvider>
          <ContractProvider>
            <UtilitiesProvider>
              <NFTStorageProvider>
                <Component {...pageProps} />
              </NFTStorageProvider>
            </UtilitiesProvider>
          </ContractProvider>
        </FirebaseProvider>
      </ChakraProvider>
    </MoralisProvider>
  );
}

export default MyApp;
