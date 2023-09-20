import { useState } from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
} from '@heroicons/react/20/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTranslation } from 'next-i18next'
import WalletIcon from './icons/WalletIcon'
import Button, { IconButton } from './shared/Button'
import ConnectedMenu from './wallet/ConnectedMenu'
import { ConnectWalletButton } from './wallet/ConnectWalletButton'
import { useRouter } from 'next/router'
import SolanaTps from './SolanaTps'
import { abbreviateAddress } from '../utils/formatting'
import { useViewport } from '../hooks/useViewport'
import { breakpoints } from '../utils/theme'
import useUnownedAccount from '../hooks/useUnownedAccount'

const TopBar = () => {
  const { t } = useTranslation('common')
  const { connected } = useWallet()
  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit')
  const router = useRouter()
  const { query } = router
  const { width } = useViewport()
  const isMobile = width ? width < breakpoints.sm : false
  const { isUnownedAccount } = useUnownedAccount()

  return (
    <>
      <div className="flex w-full items-center justify-between space-x-4 pl-6">
        <span className="mb-0 flex items-center">
          {query.token ? (
            <div className="mr-2 flex h-16 items-center border-r border-th-bkg-3 pr-4 md:mr-4 md:pr-6">
              <IconButton onClick={() => router.back()} hideBg size="small">
                <ArrowLeftIcon className="h-6 w-6" />
              </IconButton>
            </div>
          ) : null}
          {connected ? (
            <div className="hidden md:block">
              <SolanaTps />
            </div>
          ) : null}
          <img
            className="mr-4 h-8 w-auto md:hidden"
            src="/logos/logo-mark.svg"
            alt="next"
          />
          {!connected ? (
              <span className="hidden items-center md:flex">
                <WalletIcon className="h-5 w-5 text-th-fgd-3" />
                <span className="ml-2">{t('connect-helper')}</span>
                <ArrowRightIcon className="sideways-bounce ml-2 h-5 w-5 text-th-fgd-1" />
              </span>
            ): null}
        </span>
        <div className="flex items-center">
          {isUnownedAccount || (!connected && isMobile) ? null : (
            <div className="flex items-center pr-4 md:pr-0">
              <ConnectedMenu />
            </div>
            )}
            <ConnectWalletButton />
        </div>
      </div>
    </>
  )
}

export default TopBar
