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
        <UtilitiesProvider>
          <ContractProvider>
            <FirebaseProvider>
              <NFTStorageProvider>
                <Component {...pageProps} />
              </NFTStorageProvider>
            </FirebaseProvider>
          </ContractProvider>
        </UtilitiesProvider>
      </ChakraProvider>
    </MoralisProvider>
  );
}

export default MyApp;
