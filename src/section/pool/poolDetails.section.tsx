import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MoveHorizontal } from "lucide-react";

import { COIN_BAISC_DATA } from "@/src/utils/network/coin-data";
import { INFINITY_TEXT, PoolFeeText } from "@/src/utils/coreconstants";
import usePoolDetails from "@/src/hooks/useDetailsLiquidity";
import Link from "next/link";
import ClaimFeesModal from "./claimFees.section";
import { IRootState } from "@/store";
import { useSelector } from "react-redux";
import {
  beautifyNumber,
  calculatePercentRatio,
  formatAmountKnL,
} from "@/src/utils/corefunctions";
const PoolDetailsSection = () => {
  const router = useRouter();

  const {
    token0,
    token1,
    positionDetails,
    loading,
    handleSwapCoin,
    firstCoin,
    secondCoin,
    selectedCoin,
    setSelectedCoin,
    tokenId,
    openClaim,
    setOpenClaim,
  } = usePoolDetails();

  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);

  const isOwner = (): boolean => {
    return walletAddress?.toLowerCase() == positionDetails?.owner.toLowerCase();
  };

  return chain_id ? (
    <div className="max-w-[800px] min-h-[500px] w-[90%] h-auto text-white mt-36 overflow-x-hidden">
      <div className="flex w-full justify-start items-start">
        <span
          onClick={() => router.back()}
          className="flex text-[14px] font-medium items-center text-gray-400 cursor-pointer"
        >
          <ArrowLeft size={16} className="" />
          Back to Pool
        </span>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div>
          <div className="my-5">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center ">
                <div className="relative">
                  <img
                    src={`${COIN_BAISC_DATA[token0?.symbol]?.icon}`}
                    className="h-7 w-7 ml-[20] rounded-full"
                    alt=""
                  />
                  <img
                    src={`${COIN_BAISC_DATA[token1?.symbol]?.icon}`}
                    className="h-7 w-7 top-0 absolute left-2  rounded-full"
                    alt=""
                  />
                </div>
                <div className="flex items-center gap-2 ml-5">
                  <h3 className="text-2xl font-medium text-white">
                    {token0?.symbol} / {token1?.symbol}
                  </h3>
                  <span className="text-sm bg-slate-900 px-2 rounded-full py-1 sm:text-xs text-gray-400">
                    {PoolFeeText[positionDetails?.fee]} %
                  </span>
                  {/* <span className="flex items-center text-green-500 text-xs gap-2">
                    In Range
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </span> */}
                  {positionDetails?.closed ? (
                    <span className="text-xs text-grey-500">Closed</span>
                  ) : positionDetails?.inRange ? (
                    <span className="tex-xs text-green-500">In Range</span>
                  ) : (
                    <span className="tex-xs text-yellow-500">Out of Range</span>
                  )}
                </div>
              </div>
              {isOwner() && (
                <div className="flex items-center gap-2">
                  <Link href={`/pool/increase/${tokenId}`}>
                    <div className="px-3 rounded-3xl py-2 text-sm text-gray-400 border border-slate-800">
                      Increase Liquidity
                    </div>
                  </Link>
                  <Link href={`/pool/remove/${tokenId}`}>
                    <div className="bg-primary px-3 rounded-3xl py-2 text-sm text-white font-bold">
                      Remove Liquidity
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2  gap-5">
            <div className="border border-slate-800 flex items-center justify-center rounded-3xl p-5">
              <img
                src={positionDetails?.other_details?.imgSrc}
                className="h-[320px] "
                alt=""
              />
            </div>
            <div className="flex gap-2 flex-col h-full  ">
              <div className="border rounded-3xl border-slate-800">
                <h1 className="p-2 text-white text-md font-medium">
                  Liquidity
                </h1>
                <div className="text-white text-2xl font-bold p-2">
                  {positionDetails && "-"}
                </div>
                <div className="border mb-2 bg-slate-900 text-gray-400 border-slate-800 rounded-3xl mx-2">
                  {positionDetails && (
                    <div>
                      {token0 && (
                        <div className="flex justify-between items-center px-2">
                          <div className="flex items-center gap-2 p-2 rounded-3xl">
                            <img
                              src={`${COIN_BAISC_DATA[token0?.symbol]?.icon}`}
                              className="h-7 w-7 rounded-full"
                              alt=""
                            />
                            <h1>{token0?.symbol}</h1>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-3xl">
                            <h1>
                              {beautifyNumber(
                                positionDetails?.other_details.token0Amount,
                                3,
                              )}
                            </h1>
                            <h1>
                              {
                                positionDetails?.other_details
                                  .token0AmountPercent
                              }{" "}
                              %
                            </h1>
                          </div>
                        </div>
                      )}
                      {token1 && (
                        <div className="flex justify-between items-center px-2">
                          <div className="flex items-center gap-2 p-2 rounded-3xl">
                            <img
                              src={`${COIN_BAISC_DATA[token1?.symbol]?.icon}`}
                              className="h-7 w-7 rounded-full"
                              alt=""
                            />
                            <h1>{token1?.symbol}</h1>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-3xl">
                            <h1>
                              {beautifyNumber(
                                positionDetails?.other_details.token1Amount,
                                3,
                              )}
                            </h1>
                            <h1>
                              {
                                positionDetails?.other_details
                                  .token1AmountPercent
                              }{" "}
                              %
                            </h1>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className=" border rounded-3xl  border-slate-800">
                <div className="flex justify-between items-center m-2">
                  <h1 className="p-2 text-white text-md font-medium">
                    Unclaimed fees
                  </h1>
                  {isOwner() &&
                    (positionDetails?.other_details.token0UnclaimedFee ||
                      positionDetails?.other_details.token1UnclaimedFee) && (
                      <button
                        className="bg-primary px-3 rounded-3xl py-2 text-sm text-white font-bold"
                        onClick={() => {
                          setOpenClaim(true);
                        }}
                      >
                        Collect Fees
                      </button>
                    )}
                </div>
                <div className="text-white text-2xl font-bold p-2">{"-"}</div>
                <div className="border mb-2 bg-slate-900 text-gray-400 border-slate-800 rounded-3xl mx-2">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2 p-2 rounded-3xl">
                      <img
                        src={`${COIN_BAISC_DATA[token0?.symbol]?.icon}`}
                        className="h-7 w-7 rounded-full"
                        alt=""
                      />
                      <h1>{token0?.symbol}</h1>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-3xl">
                      <h1>
                        {beautifyNumber(
                          positionDetails?.other_details.token0UnclaimedFee,
                          3,
                        )}
                      </h1>
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2 p-2 rounded-3xl">
                      <img
                        src={`${COIN_BAISC_DATA[token1?.symbol]?.icon}`}
                        className="h-7 w-7 rounded-full"
                        alt=""
                      />
                      <h1>{token1?.symbol}</h1>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-3xl">
                      <h1>
                        {beautifyNumber(
                          positionDetails?.other_details.token1UnclaimedFee,
                          3,
                        )}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-800 rounded-3xl  mt-4">
            <div className="my-5">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="flex items-center gap-2 ml-5">
                    <span className="">Price range</span>
                    <span className="flex items-center text-green-500 text-xs gap-2">
                      {/* {positionDetails?.inRange ? "In Range" : "Out of Range"}
                      <div
                        className={`h-2 w-2 ${positionDetails?.inRange ? "bg-green-500" : "bg-red-500"} rounded-full`}
                      ></div> */}
                      {positionDetails?.closed ? (
                        <span className="text-grey-500">Closed</span>
                      ) : positionDetails?.inRange ? (
                        <span className="text-green-500">In Range</span>
                      ) : (
                        <span className="text-yellow-500">Out of Range</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* swap section */}
                {/* <div className="border rounded-3xl flex justify-between items-center gap-2 text-gray-400 border-slate-800 mr-3 text-xs">
                  <div
                    className={`px-3 rounded-3xl py-1 text-white font-normal cursor-pointer ${selectedCoin === firstCoin?.symbol ? "bg-slate-900" : ""}`}
                    onClick={() => {
                      if (selectedCoin === firstCoin?.symbol) {
                        return;
                      }
                      setSelectedCoin(firstCoin?.symbol);
                      handleSwapCoin();
                    }}
                  >
                    {firstCoin?.symbol}
                  </div>
                  <div
                    className={`px-3 rounded-3xl py-1 text-white font-normal cursor-pointer ${selectedCoin === secondCoin?.symbol ? "bg-slate-900" : ""}`}
                    onClick={() => {
                      if (selectedCoin === secondCoin?.symbol) {
                        return;
                      }
                      setSelectedCoin(secondCoin?.symbol);
                      handleSwapCoin();
                    }}
                  >
                    {secondCoin?.symbol}
                  </div>
                </div> */}
              </div>
            </div>

            <div className="flex items-center justify-center rounded-3xl mb-5 mx-3">
              <div className="w-[380px] flex flex-col py-4 items-center justify-center border border-slate-800 bg-slate-900 rounded-md">
                <h1 className="text-gray-400 text-md font-medium">Min Price</h1>
                <h1 className="text-white text-xl font-bold">
                  {positionDetails.minPrice != INFINITY_TEXT
                    ? formatAmountKnL(positionDetails.minPrice)
                    : positionDetails.minPrice}{" "}
                </h1>
                <p className="text-gray-400 text-md font-medium">
                  {token1?.symbol} per {token0?.symbol}
                </p>
              </div>
              <div className="w-[40px] flex items-center justify-center rounded-md h-full">
                <MoveHorizontal className="h-6 w-6 text-gray-400" />
              </div>
              <div className="w-[380px] flex flex-col py-4 items-center justify-center border border-slate-800 bg-slate-900 rounded-md">
                <h1 className="text-gray-400 text-md font-medium">Max Price</h1>
                <h1 className="text-white text-xl font-bold">
                  {positionDetails.maxPrice != INFINITY_TEXT
                    ? formatAmountKnL(positionDetails.maxPrice)
                    : positionDetails.maxPrice}{" "}
                </h1>
                <p className="text-gray-400 text-md font-medium">
                  {token1?.symbol} per {token0?.symbol}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-2 mt-5 mb-5 border border-slate-800 rounded-3xl bg-slate-900 mx-3 py-3">
              <h1 className="text-gray-400 text-md font-medium">
                Current price
              </h1>
              <h1 className="text-white text-xl font-bold">
                {beautifyNumber(positionDetails?.currentPrice, 3)}
              </h1>
              <p className="text-gray-400 text-md font-medium">
                {token1?.symbol} per {token0?.symbol}
              </p>
            </div>
          </div>
        </div>
      )}

      <ClaimFeesModal openStatus={openClaim} setOpenStatus={setOpenClaim} />
    </div>
  ) : (
    <div className="max-w-[800px] min-h-[500px] w-[90%] h-auto text-white mt-36 overflow-x-hidden">
      <div className="flex w-full justify-start items-start">
        <span
          onClick={() => router.back()}
          className="flex text-[14px] font-medium items-center text-gray-400 cursor-pointer"
        >
          <ArrowLeft size={16} className="cursor-pointer" />
          Back to Pool
        </span>
      </div>
    </div>
  );
};

export default PoolDetailsSection;
