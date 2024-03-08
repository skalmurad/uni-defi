import { ethers } from "ethers";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PositionInfo, getPositionInfo } from "../utils/uniswap/liquidity";
import { useToast } from "../components/ui/use-toast";
import { IRootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { Token } from "@uniswap/sdk-core";
import { CoinData } from "../utils/types";
import { getProvider } from "../utils/wallet";
import { getNetworkCoins, getNetworkData } from "../utils/corefunctions";

const usePoolDetails = () => {
  const { toast } = useToast();
  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);
  const dispatch = useDispatch();

  const [selectedCoin, setSelectedCoin] = useState<string>();
  const { tokenId } = useParams<{ tokenId: string }>();
  const [fromCoin, setFromCoin] = useState<CoinData>(null);
  const [toCoin, setToCoin] = useState<CoinData>(null);
  // console.log(tokenId, "params");

  const [positionDetails, setPositionDetails] = useState<PositionInfo>(null);
  const [openClaim, setOpenClaim] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null);
  const [firstCoin, setFirstCoin] = useState<CoinData>();
  const [secondCoin, setSecondCoin] = useState<CoinData>();

  /* core functions */
  const getCoinData = async (token: Token): Promise<CoinData> => {
    const network_data = await getNetworkData(provider);
    return network_data.coin_or_token[token.symbol];
  };

  const getPositionDetails = async (
    tokenId: string,
    load = true,
  ): Promise<PositionInfo> => {
    try {
      load && setLoading(true);
      const position = await getPositionInfo(tokenId, provider, null, true);

      setPositionDetails(position);
      setFromCoin(await getCoinData(position.token0));
      setToCoin(await getCoinData(position.token1));
      setFirstCoin(await getCoinData(position.token0));
      setSecondCoin(await getCoinData(position.token1));
      setSelectedCoin(position.token1.symbol);

      console.log(position, "position");

      load && setLoading(false);
      return positionDetails;
    } catch (error) {
      setLoading(false);
      router.back();
      toast({
        title: "Error",
        description: "Position not found",
      });
      console.error(error);
      return null;
    }
  };

  const clearData = (action: "clear_all" = "clear_all") => {};
  /*  */

  /* useEffects */

  useEffect(() => {
    setProvider(getProvider());
    tokenId && chain_id && getPositionDetails(tokenId);
  }, [tokenId, chain_id]);

  useEffect(() => {
    // chain_id && router.push("/pool");
  }, [chain_id]);

  useEffect(() => {
    tokenId && chain_id && getPositionDetails(tokenId, false);
  }, [block_number]);
  /*  */

  /* handlers */
  const handleClearAll = () => {
    try {
      clearData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleConnectWallet = () => {
    try {
      dispatch(setWallet<walletSliceType>({ open_wallet_sidebar: true }));
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSwapCoin = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
  };

  return {
    fromCoin,
    toCoin,
    positionDetails,
    loading,
    handleSwapCoin,
    firstCoin,
    secondCoin,
    selectedCoin,
    setSelectedCoin,
    tokenId,
    setOpenClaim,
    openClaim,
  };
};
export default usePoolDetails;
