/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { SwapModalSteps } from "@/lib/client/ui-utils";
import { ADDRESS_ZERO, SupportedNetworks } from "@/lib/client/constants";
import { EthereumAddress, Token } from "@/lib/shared/types";
import { ButtonClickPossibilities } from "@/lib/client/blockchain-utils";
import React, { Dispatch, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

interface SwapContextProps {
  // Application universal need
  destinyChain: SupportedNetworks;
  setDestinyChain: Dispatch<React.SetStateAction<SupportedNetworks>>;

  // Searched user related
  lastWalletConnected: string;
  setLastWalletConnected: (address: string) => void;
  inputAddress: string;
  setInputAddress: (address: string) => void;

  setValidatedAddressToSwap: Dispatch<
    React.SetStateAction<EthereumAddress | null>
  >;
  validatedAddressToSwap: EthereumAddress | null;
  validateAddressToSwap: (
    authedUser: EthereumAddress | null,
    inputEnsAddress: string | null | undefined,
  ) => void;
  searchedUserTokensList: Token[];
  setSearchedUserTokensList: Dispatch<React.SetStateAction<Token[]>>;
  /* 
    Below state is used for Ui rules only, setting new stylings
    if the Search bar content was just now submitted
  */
  userJustValidatedInput: boolean;
  setUserJustValidatedInput: Dispatch<React.SetStateAction<boolean>>;

  // Authed user related
  authenticatedUserTokensList: Token[];
  setAuthenticatedUserTokensList: Dispatch<React.SetStateAction<Token[]>>;
  approvedTokensCount: number;
  setApprovedTokensCount: Dispatch<React.SetStateAction<number>>;

  // Swap modal related
  currentSwapModalStep: SwapModalSteps;
  updateSwapStep: (buttonClickAction: ButtonClickPossibilities) => void;
  timeDate: bigint;
  setTimeDate: Dispatch<React.SetStateAction<bigint>>;

  clearSwapData: () => void;
}

export const SwapContextProvider = ({ children }: any) => {
  const [lastWalletConnected, setLastWalletConnected] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [validatedAddressToSwap, setValidatedAddressToSwap] =
    useState<EthereumAddress | null>(null);
  const [userJustValidatedInput, setUserJustValidatedInput] = useState(true);
  const [authenticatedUserTokensList, setAuthenticatedUserTokensList] =
    useState<Token[]>([]);
  const [searchedUserTokensList, setSearchedUserTokensList] = useState<Token[]>(
    [],
  );
  const [destinyChain, setDestinyChain] = useState<SupportedNetworks>(
    SupportedNetworks.SEPOLIA,
  );
  const [timeDate, setTimeDate] = useState<bigint>(BigInt(1));

  const [currentSwapModalStep, setCurrentSwapModalStep] =
    useState<SwapModalSteps>(SwapModalSteps.APPROVE_TOKENS);
  const [approvedTokensCount, setApprovedTokensCount] = useState(0);

  const router = useRouter();

  const validateAddressToSwap = (
    _authedUser: EthereumAddress | null,
    _inputEnsAddress: string | null | undefined,
    shouldToast = true,
  ) => {
    if (!inputAddress && !_inputEnsAddress) {
      shouldToast &&
        toast.error(
          "Please enter a valid address or some registered ENS domain",
        );
      setUserJustValidatedInput(true);
      return;
    }

    let searchedAddress = inputAddress;

    if (_inputEnsAddress !== ADDRESS_ZERO && searchedAddress) {
      searchedAddress = _inputEnsAddress ?? "";
    }

    let inputIsValidAddress = false;
    try {
      new EthereumAddress(searchedAddress);
      inputIsValidAddress = true;
    } catch (e) {
      console.error(e);
    }

    if (inputIsValidAddress) {
      const inputEthAddress = new EthereumAddress(searchedAddress);

      if (inputEthAddress.equals(_authedUser)) {
        shouldToast && toast.error("You cannot swap with yourself");
        setValidatedAddressToSwap(null);
        setUserJustValidatedInput(true);
        return;
      } else if (searchedAddress === ADDRESS_ZERO) {
        shouldToast && toast.error("You cannot swap with an invalid address");
        setValidatedAddressToSwap(null);
        setUserJustValidatedInput(true);
        return;
      }

      setValidatedAddressToSwap(inputEthAddress);
      shouldToast && toast.success("Searching Address");
    } else {
      setValidatedAddressToSwap(null);
      shouldToast &&
        toast.error(
          "Your input is not a valid address and neither some registered ENS domain",
        );
    }
    setUserJustValidatedInput(true);
  };

  const updateSwapStep = (buttonClicked: ButtonClickPossibilities) => {
    switch (currentSwapModalStep) {
      case SwapModalSteps.APPROVE_TOKENS:
        if (buttonClicked === ButtonClickPossibilities.NEXT_STEP) {
          setCurrentSwapModalStep(SwapModalSteps.ACCEPT_SWAP);
        }
        break;
      case SwapModalSteps.ACCEPT_SWAP:
        if (buttonClicked === ButtonClickPossibilities.PREVIOUS_STEP) {
          setCurrentSwapModalStep(SwapModalSteps.APPROVE_TOKENS);
        } else if (buttonClicked === ButtonClickPossibilities.NEXT_STEP) {
          setCurrentSwapModalStep(SwapModalSteps.WAIT_BLOCKCHAIN_INTERACTION);
        }
        break;
      case SwapModalSteps.WAIT_BLOCKCHAIN_INTERACTION:
        if (buttonClicked === ButtonClickPossibilities.NEXT_STEP) {
          setCurrentSwapModalStep(SwapModalSteps.SUCCESSFUL_SWAP);
        } else if (buttonClicked === ButtonClickPossibilities.PREVIOUS_STEP) {
          setCurrentSwapModalStep(SwapModalSteps.ACCEPT_SWAP);
        }
        break;
      case SwapModalSteps.SUCCESSFUL_SWAP:
        if (buttonClicked === ButtonClickPossibilities.PREVIOUS_STEP) {
          setCurrentSwapModalStep(SwapModalSteps.APPROVE_TOKENS);
        }
        break;
    }
  };

  const clearSwapData = () => {
    setAuthenticatedUserTokensList([]);
    setSearchedUserTokensList([]);
    setCurrentSwapModalStep(SwapModalSteps.APPROVE_TOKENS);
  };

  // useEffect(() => {
  //   setSearchedUserTokensList([]);
  //   setUserJustValidatedInput(false);
  // }, [inputAddress]);

  // useEffect(() => {
  //   setSearchedUserTokensList([]);
  // }, [destinyChain]);

  useEffect(() => {
    setSwapData({
      lastWalletConnected,
      setLastWalletConnected,
      inputAddress,
      setInputAddress,
      validatedAddressToSwap,
      validateAddressToSwap,
      setValidatedAddressToSwap,
      setUserJustValidatedInput,
      userJustValidatedInput,
      setAuthenticatedUserTokensList,
      authenticatedUserTokensList,
      setSearchedUserTokensList,
      searchedUserTokensList,
      destinyChain,
      setDestinyChain,
      setTimeDate,
      timeDate,
      approvedTokensCount,
      setApprovedTokensCount,
      updateSwapStep,
      currentSwapModalStep,
      clearSwapData,
    });
  }, [
    lastWalletConnected,
    inputAddress,
    validatedAddressToSwap,
    userJustValidatedInput,
    authenticatedUserTokensList,
    searchedUserTokensList,
    destinyChain,
    timeDate,
    approvedTokensCount,
    currentSwapModalStep,
  ]);

  const [swapData, setSwapData] = useState<SwapContextProps>({
    lastWalletConnected,
    setLastWalletConnected,
    inputAddress,
    setInputAddress,
    setValidatedAddressToSwap,
    validatedAddressToSwap,
    validateAddressToSwap,
    setUserJustValidatedInput,
    userJustValidatedInput,
    setAuthenticatedUserTokensList,
    authenticatedUserTokensList,
    setSearchedUserTokensList,
    searchedUserTokensList,
    destinyChain,
    setDestinyChain,
    setTimeDate,
    timeDate,
    approvedTokensCount,
    setApprovedTokensCount,
    updateSwapStep,
    currentSwapModalStep,
    clearSwapData,
  });

  // This is a temporary measure while we don't turn the dApp into a SPA
  // We are reseting the inputAddress to reload the inventory
  useEffect(() => {
    setValidatedAddressToSwap(null);
  }, [router.asPath]);

  return (
    <SwapContext.Provider value={swapData}>{children}</SwapContext.Provider>
  );
};

export const SwapContext = React.createContext<SwapContextProps>({
  lastWalletConnected: "",
  setLastWalletConnected: (address: string) => {},
  inputAddress: "",
  validatedAddressToSwap: null,
  setValidatedAddressToSwap: () => {},
  validateAddressToSwap: (
    _authedUser: EthereumAddress | null,
    _inputEnsAddress: string | null | undefined,
  ) => {},
  setInputAddress: (address: string) => {},
  setUserJustValidatedInput: () => {},
  userJustValidatedInput: false,
  setAuthenticatedUserTokensList: () => {},
  authenticatedUserTokensList: [],
  setSearchedUserTokensList: () => {},
  searchedUserTokensList: [],
  destinyChain: SupportedNetworks.SEPOLIA,
  setDestinyChain: () => {},
  timeDate: BigInt(1),
  setTimeDate: () => {},
  approvedTokensCount: 0,
  setApprovedTokensCount: () => {},
  currentSwapModalStep: SwapModalSteps.APPROVE_TOKENS,
  updateSwapStep: (buttonClickAction: ButtonClickPossibilities) => {},
  clearSwapData: () => {},
});
