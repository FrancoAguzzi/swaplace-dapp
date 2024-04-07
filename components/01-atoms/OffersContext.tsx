/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { SwapOfferInterface } from "@/components/03-organisms";
import { PonderFilter, useOffers } from "@/lib/client/hooks/useOffers";
import React, { Dispatch, useEffect, useState } from "react";

const DEFAULT_OFFERS_DATA = {
  [PonderFilter.ALL_OFFERS]: [],
  [PonderFilter.CREATED]: [],
  [PonderFilter.RECEIVED]: [],
  [PonderFilter.ACCEPTED]: [],
  [PonderFilter.CANCELED]: [],
  [PonderFilter.EXPIRED]: [],
};

interface OffersContextProps {
  setPonderFilterStatus: Dispatch<React.SetStateAction<PonderFilter>>;
  ponderFilterStatus: PonderFilter;
  updateOffersData: (filter: PonderFilter, data: SwapOfferInterface[]) => void;
  offersQueries: Record<PonderFilter, Array<SwapOfferInterface>>;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  isLoadingOffersQuery: boolean;
  swapOfferToAccept: SwapOfferInterface | null;
  acceptSwapOffer: (swap: SwapOfferInterface) => void;
}

export const OffersContextProvider = ({ children }: any) => {
  const [swapOfferToAccept, setSwapOfferToBeAccepted] =
    useState<SwapOfferInterface | null>(null);
  const [offersQueries, setOffersQueries] =
    useState<Record<PonderFilter, Array<SwapOfferInterface>>>(
      DEFAULT_OFFERS_DATA,
    );

  const [ponderFilterStatus, setPonderFilterStatus] = useState<PonderFilter>(
    PonderFilter.ALL_OFFERS,
  );

  const [isLoadingOffersQuery, setIsLoadingOffersQuery] = useState(false);

  const { fetchNextPage, isFetchingNextPage, status } = useOffers();

  const acceptSwapOffer = async (swap: SwapOfferInterface) => {
    setSwapOfferToBeAccepted(swap);
  };

  const updateOffersData = (
    filter: PonderFilter,
    data: SwapOfferInterface[],
  ) => {
    setOffersQueries({
      ...offersQueries,
      [filter]: data,
    });
  };

  useEffect(() => {
    setIsLoadingOffersQuery(status === "pending" || isFetchingNextPage);
  }, [isFetchingNextPage, status]);

  useEffect(() => {
    setOffersData({
      setPonderFilterStatus,
      ponderFilterStatus,
      updateOffersData,
      offersQueries,
      fetchNextPage,
      isFetchingNextPage,
      isLoadingOffersQuery,
      acceptSwapOffer,
      swapOfferToAccept,
    });
  }, [
    setPonderFilterStatus,
    ponderFilterStatus,
    offersQueries,
    fetchNextPage,
    updateOffersData,
    isFetchingNextPage,
    isLoadingOffersQuery,
    swapOfferToAccept,
  ]);

  const [offersData, setOffersData] = useState<OffersContextProps>({
    setPonderFilterStatus,
    ponderFilterStatus,
    updateOffersData,
    offersQueries,
    fetchNextPage,
    isFetchingNextPage,
    isLoadingOffersQuery,
    acceptSwapOffer,
    swapOfferToAccept,
  });

  return (
    <OffersContext.Provider value={offersData}>
      {children}
    </OffersContext.Provider>
  );
};

export const OffersContext = React.createContext<OffersContextProps>({
  setPonderFilterStatus: () => {},
  ponderFilterStatus: PonderFilter.ALL_OFFERS,
  updateOffersData: () => {},
  offersQueries: DEFAULT_OFFERS_DATA,
  fetchNextPage: () => {},
  isFetchingNextPage: false,
  isLoadingOffersQuery: false,
  acceptSwapOffer: () => {},
  swapOfferToAccept: null,
});
