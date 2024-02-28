/* eslint-disable react-hooks/exhaustive-deps */
import { TokensShelf } from "@/components/03-organisms";
import {
  SearchItemsShelf,
  SwapContext,
  SwappingShelfID,
  Tab,
} from "@/components/01-atoms/";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { useContext, useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import cc from "classcat";

/**
 * SwappingShelfs Component
 *
 * React component that display of tokens swapping shelves.
 *
 * @return The rendered SwappingShelfs component.
 */
export const SwappingShelfs = () => {
  const { chain } = useNetwork();
  const { authenticatedUserAddress } = useAuthenticatedUser();
  const [activeSwappingShelfID, setActiveSwappingShelfID] =
    useState<SwappingShelfID>(SwappingShelfID.THEIR_ITEMS);

  const {
    validatedAddressToSwap,
    setAuthenticatedUserTokensList,
    setSearchedUserTokensList,
    setInputAddress,
  } = useContext(SwapContext);

  useEffect(() => {
    setAuthenticatedUserTokensList([]);
    setSearchedUserTokensList([]);
    setInputAddress("");
  }, [chain]);

  return (
    <div className="w-[95%] mb-20 dark:bg-[#212322] dark:border-[#353836] border rounded-2xl ">
      <div className="flex items-center justify-between max-h-[48px]">
        <div className="flex max-w-[224px]">
          <Tab
            setActiveSwappingShelfID={(input) =>
              setActiveSwappingShelfID(input)
            }
          />
        </div>
        <div className="pr-2">
          <SearchItemsShelf />
        </div>
      </div>
      <div className={cc([activeSwappingShelfID ? "hidden" : "block"])}>
        <TokensShelf address={validatedAddressToSwap} variant="their" />
      </div>
      <div className={cc([activeSwappingShelfID ? "block" : "hidden"])}>
        <TokensShelf
          address={authenticatedUserAddress?.address ?? null}
          variant="your"
        />
      </div>
    </div>
  );
};
