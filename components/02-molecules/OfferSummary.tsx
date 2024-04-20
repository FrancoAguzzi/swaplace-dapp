import { ForWhom } from "../03-organisms";
import {
  ENSAvatar,
  ENSAvatarSize,
  PersonIcon,
  SwapContext,
} from "@/components/01-atoms";
import { TokenCardStyleType, TokensList } from "@/components/02-molecules";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { useEnsData } from "@/lib/client/hooks/useENSData";
import { useContext } from "react";

interface IOfferSummary {
  variant: ForWhom;
}

export const OfferSummary = ({ variant }: IOfferSummary) => {
  const {
    validatedAddressToSwap,
    authenticatedUserTokensList,
    searchedUserTokensList,
  } = useContext(SwapContext);

  const { authenticatedUserAddress } = useAuthenticatedUser();
  const tokensList =
    variant === ForWhom.Yours
      ? authenticatedUserTokensList
      : searchedUserTokensList;

  const { primaryName: searchedENSName } = useEnsData({
    ensAddress: validatedAddressToSwap,
  });
  const { primaryName: authenticatedUserENSName } = useEnsData({
    ensAddress: authenticatedUserAddress,
  });

  return (
    <div className="w-full h-full dark:bg-[#282B29] border dark:border-[#353836] bg-[#F0EEEE] border-[#E4E4E4] rounded-lg ">
      <div className="flex flex-col gap-4 px-4 pt-2 pb-4">
        <div className="flex justify-between items-center h-9 gap-2">
          <div className="flex space-x-2 items-center">
            <div className="flex items-center">
              {variant === ForWhom.Yours && validatedAddressToSwap ? (
                <ENSAvatar
                  avatarENSAddress={validatedAddressToSwap}
                  size={ENSAvatarSize.SMALL}
                />
              ) : variant === ForWhom.Their && authenticatedUserAddress ? (
                <ENSAvatar
                  avatarENSAddress={authenticatedUserAddress}
                  size={ENSAvatarSize.SMALL}
                />
              ) : (
                <div className="bg-[#E4E4E4] dark:bg-[#353836] p-[5px] rounded-md">
                  <PersonIcon
                    size="14"
                    className="text-[#A3A9A5] dark:text-[#707572]"
                  />
                </div>
              )}
            </div>
            <div className="items-center">
              <p className="p-small-variant-black-3 dark:p-small-variant-light-2 contrast-50">
                {variant === ForWhom.Yours && validatedAddressToSwap
                  ? `${
                      searchedENSName
                        ? searchedENSName
                        : validatedAddressToSwap
                        ? validatedAddressToSwap.getEllipsedAddress()
                        : "Use the search bar"
                    }`
                  : variant === ForWhom.Yours && !validatedAddressToSwap
                  ? "They get"
                  : variant === ForWhom.Their && authenticatedUserAddress
                  ? `${
                      authenticatedUserENSName
                        ? authenticatedUserENSName
                        : authenticatedUserAddress
                        ? authenticatedUserAddress.getEllipsedAddress()
                        : "Connect your wallet"
                    }`
                  : "You get"}
              </p>
            </div>
          </div>
          {(variant === ForWhom.Their && !validatedAddressToSwap) ||
          (variant === ForWhom.Yours && !authenticatedUserAddress) ? null : (
            <div className="contrast-50">
              {tokensList.length} item
              {tokensList.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
        <div className="w-full h-full max-h-[156px] rounded overflow-x-hidden overflow-y-auto no-scrollbar">
          {variant === ForWhom.Yours && authenticatedUserAddress ? (
            <TokensList
              withAddTokenCard={false}
              displayERC20TokensAmount={true}
              withSelectionValidation={false}
              ownerAddress={authenticatedUserAddress}
              tokensList={tokensList}
              variant={variant}
              wideScreenTotalCards={10}
              desktopTotalCards={6}
              tabletTotalCards={12}
              mobileTotalCards={6}
              tokenCardStyleType={TokenCardStyleType.MEDIUM}
              gridClassNames="w-full grid grid-cols-3 md:grid-cols-6 xl:grid-cols-5 lg:grid-cols-3 gap-2 md:gap-3 xl:gap-3 lg:gap-3"
            />
          ) : variant === ForWhom.Their && validatedAddressToSwap ? (
            <TokensList
              withAddTokenCard={false}
              displayERC20TokensAmount={true}
              withSelectionValidation={false}
              ownerAddress={validatedAddressToSwap}
              tokensList={tokensList}
              variant={variant}
              wideScreenTotalCards={10}
              desktopTotalCards={6}
              tabletTotalCards={12}
              mobileTotalCards={6}
              tokenCardStyleType={TokenCardStyleType.MEDIUM}
              gridClassNames="w-full grid grid-cols-3 md:grid-cols-6 xl:grid-cols-5 lg:grid-cols-3 gap-2 md:gap-3 xl:gap-3 lg:gap-3"
            />
          ) : (
            <TokensList
              withAddTokenCard={false}
              displayERC20TokensAmount={true}
              withSelectionValidation={false}
              ownerAddress={null}
              tokensList={tokensList}
              variant={variant}
              wideScreenTotalCards={10}
              desktopTotalCards={6}
              tabletTotalCards={12}
              mobileTotalCards={6}
              tokenCardStyleType={TokenCardStyleType.MEDIUM}
              gridClassNames="w-full grid grid-cols-3 md:grid-cols-6 xl:grid-cols-5 lg:grid-cols-3 gap-2 md:gap-3 xl:gap-3 lg:gap-3"
            />
          )}
        </div>
      </div>
    </div>
  );
};
