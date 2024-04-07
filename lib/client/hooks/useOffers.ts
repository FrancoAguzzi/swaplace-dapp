/* eslint-disable react-hooks/exhaustive-deps */
import {
  ACCEPTED_OFFERS_QUERY,
  ALL_OFFERS_QUERY,
  CANCELED_OFFERS_QUERY,
  CREATED_OFFERS_QUERY,
  EXPIRED_OFFERS_QUERY,
  RECEIVED_OFFERS_QUERY,
} from "../offer-queries";
import { Asset } from "../swap-utils";
import { cleanJsonString } from "../utils";
import { EthereumAddress } from "@/lib/shared/types";
import { SwapOfferInterface } from "@/components/03-organisms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { OffersContext } from "@/components/01-atoms";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext } from "react";
import axios from "axios";

interface Item {
  swapId: string;
  status: string;
  owner: string;
  allowed: string;
  expiry: bigint;
  bid: Asset[];
  ask: Asset[];
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface PageParam {
  pageParam: string | null;
}

export enum PonderFilter {
  ALL_OFFERS = "All Offers",
  CREATED = "Created",
  RECEIVED = "Received",
  ACCEPTED = "Accepted",
  CANCELED = "Canceled",
  EXPIRED = "Expired",
}

export const useOffers = () => {
  const { ponderFilterStatus, updateOffersData } = useContext(OffersContext);
  const { authenticatedUserAddress } = useAuthenticatedUser();

  const userAddress = authenticatedUserAddress?.address;

  const currentUnixTimeSeconds = Math.floor(new Date().getTime() / 1000);

  const fetchSwaps = async ({ pageParam }: PageParam) => {
    if (status === "success") {
      const after = pageParam || null;
      let query = "";
      let variables = {};

      switch (ponderFilterStatus) {
        case PonderFilter.ALL_OFFERS:
          query = ALL_OFFERS_QUERY;
          variables = {
            orderBy: "blockTimestamp",
            orderDirection: "desc",
            inputAddress: userAddress,
            after: after,
            allowed: userAddress,
          };
          break;
        case PonderFilter.CREATED:
          query = CREATED_OFFERS_QUERY;
          variables = {
            orderBy: "blockTimestamp",
            orderDirection: "desc",
            inputAddress: userAddress,
            after: after,
            expiry_gt: currentUnixTimeSeconds,
          };
          break;
        case PonderFilter.RECEIVED:
          query = RECEIVED_OFFERS_QUERY;
          variables = {
            orderBy: "blockTimestamp",
            orderDirection: "desc",
            after: after,
            allowed: userAddress,
            expiry_gt: currentUnixTimeSeconds,
          };
          break;
        case PonderFilter.ACCEPTED:
          query = ACCEPTED_OFFERS_QUERY;
          variables = {
            orderBy: "blockTimestamp",
            orderDirection: "desc",
            inputAddress: userAddress,
            after: after,
            allowed: userAddress,
          };
          break;
        case PonderFilter.CANCELED:
          query = CANCELED_OFFERS_QUERY;
          variables = {
            orderBy: "blockTimestamp",
            orderDirection: "desc",
            inputAddress: userAddress,
            after: after,
            allowed: userAddress,
          };
          break;
        case PonderFilter.EXPIRED:
          query = EXPIRED_OFFERS_QUERY;
          variables = {
            orderBy: "blockTimestamp",
            orderDirection: "desc",
            inputAddress: userAddress,
            expiry_lt: currentUnixTimeSeconds,
            after: after,
          };
          break;
        default:
          console.error("Invalid ponderFilterStatus:", ponderFilterStatus);
          throw new Error("Invalid ponderFilterStatus");
      }

      const endpoint = process.env.NEXT_PUBLIC_PONDER_ENDPOINT;
      const headers = {
        "Content-Type": "application/json",
      };

      if (!endpoint) {
        throw new Error(
          "NEXT_PUBLIC_PONDER_ENDPOINT is not defined in the environment variables.",
        );
      }

      try {
        const response = await axios.post(
          endpoint,
          { query, variables },
          { headers },
        );

        if (response.data && response.data.data) {
          const items = response.data.data.databases.items as Item[];
          const pageInfo = response.data.data.databases.pageInfo as PageInfo;

          const processedItems = items.map((obj: any) => {
            return {
              ...obj,
              bid: cleanJsonString(obj.bid),
              ask: cleanJsonString(obj.ask),
            };
          });

          const itemsArrayAsSwapOffers: SwapOfferInterface[] =
            processedItems.map((item) => {
              return {
                id: item.swapId,
                status: item.status,
                expiryDate: item.expiry,
                bid: {
                  address: item.bid.owner,
                  tokens: item.bid.tokens,
                },
                ask: {
                  address: item.ask.owner,
                  tokens: item.ask.tokens,
                },
                allowed: new EthereumAddress(
                  "0x" + BigInt(item.allowed).toString(16),
                ),
              };
            });

          updateOffersData(ponderFilterStatus, itemsArrayAsSwapOffers);

          return {
            swapOffers: itemsArrayAsSwapOffers,
            pageInfo,
          };
        } else {
          console.error("Unexpected response structure:", response.data);
          throw new Error("Unexpected response structure");
        }
      } catch (error) {
        console.error("Error fetching swaps:", error);
        throw error;
      }
    }
  };

  const { error, status, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [
        "PonderQuerySwaps",
        authenticatedUserAddress,
        ponderFilterStatus,
      ],
      queryFn: async ({ pageParam }: { pageParam: string | null }) =>
        await fetchSwaps({ pageParam }),
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage?.pageInfo?.endCursor,
    });

  return {
    status,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};
