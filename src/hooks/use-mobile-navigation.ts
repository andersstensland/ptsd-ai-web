"use client"

import { useCallback, useEffect, useRef } from 'react'
import { useSidebar } from '@/components/ui/sidebar'
import { useScreenSize } from './use-mobile'

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
}

export function useSwipeGestures({ 
  onSwipeLeft, 
  onSwipeRight, 
  threshold = 100 
}: SwipeHandlers) {
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)
  const isScrolling = useRef<boolean>(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isScrolling.current = false
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    
    const diffX = Math.abs(currentX - touchStartX.current)
    const diffY = Math.abs(currentY - touchStartY.current)

    // If vertical movement is greater, it's likely scrolling
    if (diffY > diffX) {
      isScrolling.current = true
    }
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (isScrolling.current) return

    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    
    const diffX = touchStartX.current - touchEndX
    const diffY = Math.abs(touchStartY.current - touchEndY)
    
    // Ensure horizontal swipe (not vertical scroll)
    if (diffY > 50) return

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && onSwipeLeft) {
        onSwipeLeft()
      } else if (diffX < 0 && onSwipeRight) {
        onSwipeRight()
      }
    }

    touchStartX.current = 0
    touchStartY.current = 0
  }, [onSwipeLeft, onSwipeRight, threshold])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  }
}

export function useMobileNavigation() {
  const { toggleSidebar, setOpenMobile } = useSidebar()
  const { isMobile, isTouchDevice } = useScreenSize()

  const closeSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [isMobile, setOpenMobile])

  const openSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(true)
    }
  }, [isMobile, setOpenMobile])

  const swipeHandlers = useSwipeGestures({
    onSwipeLeft: closeSidebar,
    onSwipeRight: openSidebar,
    threshold: 80
  })

  // Auto-close sidebar on route change for mobile
  useEffect(() => {
    if (!isMobile) return

    const handleRouteChange = () => {
      setOpenMobile(false)
    }

    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange)
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [isMobile, setOpenMobile])

  return {
    isMobile,
    isTouchDevice,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    swipeHandlers: isTouchDevice ? swipeHandlers : null
  }
}

export function useKeyboardNavigation() {
  const { toggleSidebar, isMobile, setOpenMobile } = useSidebar()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle sidebar toggle with Cmd/Ctrl + B
      if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
        event.preventDefault()
        toggleSidebar()
      }

      // Handle escape key to close sidebar on mobile
      if (event.key === 'Escape') {
        if (isMobile) {
          setOpenMobile(false)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar, isMobile, setOpenMobile])
}
