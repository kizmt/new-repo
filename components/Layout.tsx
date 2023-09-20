import { Fragment, ReactNode, useEffect, useMemo } from 'react'
import { useViewport } from '../hooks/useViewport'
import { breakpoints } from '../utils/theme'
import mangoStore from '@store/mangoStore'
import BottomBar from './mobile/BottomBar'
import BounceLoader from './shared/BounceLoader'
import TopBar from './TopBar'
import useLocalStorageState from '../hooks/useLocalStorageState'
import { SIDEBAR_COLLAPSE_KEY } from '../utils/constants'
import { useWallet } from '@solana/wallet-adapter-react'

const sideBarAnimationDuration = 500

const Layout = ({ children }: { children: ReactNode }) => {
  const { connected } = useWallet()
  const loadingMangoAccount = mangoStore((s) => s.mangoAccount.initialLoad)
  const [isCollapsed, setIsCollapsed] = useLocalStorageState(
    SIDEBAR_COLLAPSE_KEY,
    false
  )
  const { width } = useViewport()

  useEffect(() => {
    if (width < breakpoints.lg) {
      setIsCollapsed(true)
    }
  }, [width])

  useEffect(() => {
    const animationFrames = 15

    for (let x = 1; x <= animationFrames; x++) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, (sideBarAnimationDuration / animationFrames) * x)
    }
  }, [isCollapsed])

  return (
    <>
      {connected && loadingMangoAccount ? (
        <div className="fixed z-30 flex h-screen w-full items-center justify-center bg-[rgba(0,0,0,0.7)]">
          <BounceLoader />
        </div>
      ) : null}
      <div className="flex-grow bg-th-bkg-1 text-th-fgd-2 transition-all">
        <div className="fixed bottom-0 left-0 z-20 w-full md:hidden">
          <BottomBar />
        </div>

        {/* note: overflow-x-hidden below prevents position sticky from working in activity feed  */}
        <div
          className={`w-full overflow-x-hidden transition-all duration-${sideBarAnimationDuration} ease-in-out`}
        >
          <div className="flex h-16 items-center justify-between border-b border-th-bkg-3 bg-th-bkg-1">
            <TopBar />
          </div>
          {children}
        </div>
      </div>
    </>
  )
}

export default Layout
