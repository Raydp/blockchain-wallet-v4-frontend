import React from 'react'
import {
  Flex,
  IconChevronDown,
  IconChevronUp,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'

import { Image } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { selectors } from 'data'
import { useRemote } from 'hooks'

import { GasFeeWrapper, ShowDetailsWrapper, Wrapper } from './styled'

type OwnProps = {
  handleDetailsToggle: () => void
  isQuoteLocked: boolean
  swapDetailsOpen: boolean
  walletCurrency: string
}

export const BaseRateAndFees = ({
  handleDetailsToggle,
  isQuoteLocked,
  swapDetailsOpen,
  walletCurrency
}: OwnProps) => {
  const { data: currentChain } = useRemote(selectors.components.dex.getCurrentChain)

  // import { SkeletonRectangle } from 'blockchain-info-components'
  // import { DexSwapQuoteResponse } from '@core/network/api/dex/types'

  // Loading
  // <>
  //    <SkeletonRectangle height='28px' width='25%' bgColor='white' />
  //    <SkeletonRectangle height='28px' width='25%' bgColor='white' />
  //  </>

  // NotAsked, Failure: () => null

  // {quoteR?.cata({
  //       Failure: () => null,
  //       Loading: () => (
  //         <>
  //           <SkeletonRectangle height='28px' width='25%' bgColor='white' />
  //           <SkeletonRectangle height='28px' width='25%' bgColor='white' />
  //         </>
  //       ),
  //       NotAsked: () => null,
  //       Success: (val: DexSwapQuoteResponse) => {

  // TODO: rewrite to support multi-leg quotes
  // const quote = val?.quotes?.[0] (val is DexSwapQuoteResponse)
  // const txLeg = val?.txs?.[0]

  // FIXME: Pass data from remote response
  const txLeg = {
    gasLimit: 1,
    gasPrice: 1,
    sellAmount: {
      symbol: 'SYMBOL'
    }
  }

  const quote = {
    buyAmount: {
      symbol: 'SYMBOL'
    },
    price: 1,
    sellAmount: {
      symbol: 'SYMBOL'
    }
  }

  return (
    <Wrapper>
      <Text variant='paragraph-mono' color={SemanticColors.body}>
        1 {quote.sellAmount.symbol} = ~{quote.price.toFixed(8)} {quote.buyAmount.symbol}
      </Text>
      {!isQuoteLocked && (
        <Flex alignItems='center'>
          <GasFeeWrapper>
            <Image name='gas-icon' width='16px' height='16px' />
            <FiatDisplay
              size='12px'
              weight={600}
              coin={currentChain?.nativeCurrency.symbol}
              currency={walletCurrency}
            >
              {new BigNumber(txLeg.gasLimit).multipliedBy(txLeg.gasPrice).toString()}
            </FiatDisplay>
          </GasFeeWrapper>

          <ShowDetailsWrapper>
            {swapDetailsOpen ? (
              <IconChevronUp
                size='medium'
                label='hide swap details'
                color={PaletteColors['grey-400']}
                onClick={handleDetailsToggle}
              />
            ) : (
              <IconChevronDown
                size='medium'
                label='show swap details'
                color={PaletteColors['grey-400']}
                onClick={handleDetailsToggle}
              />
            )}
          </ShowDetailsWrapper>
        </Flex>
      )}
    </Wrapper>
  )
}
