import React, { createContext, useContext } from "react";
import { NFTStorage } from "nft.storage";
import { UtilitiesContext } from "./UtilitiesProvider";

export const NFTStorageContext = createContext();

const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY;
function NFTStorageProvider({ children }) {
  const { makeToast } = useContext(UtilitiesContext);
  const deployToNFTStorage = async (name, description, image) => {
    try {
      const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
      // call client.store, passing in the image & metadata
      const res = await nftstorage.store({
        image,
        name,
        description,
      });
      makeToast(
        "NFT Storage Success",
        "Successfully deployed to NFTStorage",
        "success"
      );
      return res;
    } catch (error) {
      makeToast("NFT Storage Error", "Error deploying to NFTStorage", "error");
    }
  };
  const data = { deployToNFTStorage };
  return (
    <NFTStorageContext.Provider value={data}>
      {children}
    </NFTStorageContext.Provider>
  );
}

export default NFTStorageProvider;
