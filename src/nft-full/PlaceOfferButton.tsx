import { Fragment, useContext } from "react";

import { ZORA_SITE_URL_BASE } from "../constants/media-urls";
import { useMediaContext } from "../context/useMediaContext";
import { Button } from "../components/Button";
import { NFTDataContext } from "../context/NFTDataContext";
import { AuctionType } from "@zoralabs/nft-hooks";

type PlaceOfferButtonProps = {
  allowOffer?: boolean;
};

export const PlaceOfferButton = ({ allowOffer }: PlaceOfferButtonProps) => {
  const { nft } = useContext(NFTDataContext);
  const { getString, getStyles } = useMediaContext();

  if (!nft.data) {
    return <Fragment />;
  }

  // Disable offer functionality if not a zora NFT or if offers are disabled
  if (
    (allowOffer === false || !("zoraNFT" in nft.data)) &&
    nft.data.pricing.auctionType !== AuctionType.RESERVE
  ) {
    return <Fragment />;
  }

  function getBidURLParts() {
    const data = nft.data;
    if (!data) {
      return;
    }
    if (
      data.nft.contract.knownContract !== "zora" &&
      data.pricing.auctionType === AuctionType.RESERVE
    ) {
      return [
        ZORA_SITE_URL_BASE,
        "auction",
        data.nft.contract.address,
        data.nft.tokenId,
        "bid",
      ];
    }

    return [
      ZORA_SITE_URL_BASE,
      data.nft.creator,
      data.nft.tokenId,
      data.pricing.auctionType === AuctionType.RESERVE ? "auction/bid" : "bid",
    ];
  }

  const bidURL = getBidURLParts()?.join("/");

  if (!bidURL) {
    return <Fragment />;
  }

  return (
    <div {...getStyles("fullPlaceOfferButton")}>
      <Button primary={true} href={bidURL}>
        {getString(
          nft.data.pricing.auctionType === AuctionType.RESERVE
            ? "PLACE_BID"
            : "PLACE_OFFER"
        )}
      </Button>
    </div>
  );
};
