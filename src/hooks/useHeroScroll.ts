import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { avatarRotation, heroScrollState } from '../store/avatarRotation'
import { isMobileViewport, MOBILE_MEDIA_QUERY } from '../utils/isMobileViewport'

gsap.registerPlugin(ScrollTrigger)

const DESKTOP_ROTATION_VH = 1
const MOBILE_ROTATION_VH = 0.72

function getRotationScrollVh(mobile: boolean) {
  return mobile ? MOBILE_ROTATION_VH : DESKTOP_ROTATION_VH
}

function getScrollDistance(mobile: boolean) {
  return window.innerHeight * getRotationScrollVh(mobile)
}

function setRotationComplete(hero: HTMLElement, complete: boolean) {
  heroScrollState.rotationComplete = complete
  document.body.classList.toggle('hero-scroll-locked', !complete)
  hero.classList.toggle('hero-section--rotation-complete', complete)
}

function applyRotationProgress(progress: number) {
  const clamped = gsap.utils.clamp(0, 1, progress)
  avatarRotation.y = Math.PI * (1 - clamped)
  if (clamped >= 0.999) {
    avatarRotation.y = 0
  }
  return clamped
}

function setupMobileTouchFallback(
  hero: HTMLElement,
  getScrollTrigger: () => ScrollTrigger | null,
  mobile: boolean,
) {
  if (!mobile) return () => undefined

  let touchStartY = 0
  let progressAtTouchStart = 0
  let isTracking = false

  const getDistance = () => getScrollDistance(true)

  const setProgress = (progress: number) => {
    const trigger = getScrollTrigger()
    if (!trigger) return

    const clamped = applyRotationProgress(progress)
    const scrollPos = trigger.start + clamped * (trigger.end - trigger.start)
    trigger.scroll(scrollPos)

    if (clamped >= 0.999) {
      avatarRotation.y = 0
      setRotationComplete(hero, true)
    }
  }

  const onTouchStart = (event: TouchEvent) => {
    const trigger = getScrollTrigger()
    if (!trigger || event.touches.length !== 1) return

    if (heroScrollState.rotationComplete && trigger.progress >= 1) return

    isTracking = true
    touchStartY = event.touches[0].clientY
    progressAtTouchStart = trigger.progress
  }

  const onTouchMove = (event: TouchEvent) => {
    if (!isTracking || event.touches.length !== 1) return

    const trigger = getScrollTrigger()
    if (!trigger) return

    const deltaY = touchStartY - event.touches[0].clientY
    const nextProgress = progressAtTouchStart + deltaY / getDistance()

    if (!heroScrollState.rotationComplete || nextProgress < 1) {
      event.preventDefault()
    }

    setProgress(nextProgress)
  }

  const onTouchEnd = () => {
    if (!isTracking) return
    isTracking = false

    const trigger = getScrollTrigger()
    if (!trigger) return

    const progress = trigger.progress

    if (progress >= 0.55 && progress < 1) {
      const anim = { value: progress }
      gsap.to(anim, {
        value: 1,
        duration: 0.35,
        ease: 'power2.out',
        onUpdate: () => {
          setProgress(anim.value)
        },
        onComplete: () => {
          avatarRotation.y = 0
          setRotationComplete(hero, true)
        },
      })
      return
    }

    if (progress > 0 && progress < 0.45) {
      const anim = { value: progress }
      gsap.to(anim, {
        value: 0,
        duration: 0.3,
        ease: 'power2.out',
        onUpdate: () => {
          setProgress(anim.value)
        },
        onComplete: () => {
          avatarRotation.y = Math.PI
          setRotationComplete(hero, false)
        },
      })
    }
  }

  hero.addEventListener('touchstart', onTouchStart, { passive: true })
  hero.addEventListener('touchmove', onTouchMove, { passive: false })
  hero.addEventListener('touchend', onTouchEnd, { passive: true })
  hero.addEventListener('touchcancel', onTouchEnd, { passive: true })

  return () => {
    hero.removeEventListener('touchstart', onTouchStart)
    hero.removeEventListener('touchmove', onTouchMove)
    hero.removeEventListener('touchend', onTouchEnd)
    hero.removeEventListener('touchcancel', onTouchEnd)
  }
}

export function useHeroScroll(heroRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    let mobile = isMobileViewport()
    let scrollTriggerInstance: ScrollTrigger | null = null
    let normalizeScrollEnabled = false

    hero.classList.toggle('hero-section--mobile', mobile)
    avatarRotation.y = Math.PI
    setRotationComplete(hero, false)

    if (mobile) {
      ScrollTrigger.config({ ignoreMobileResize: true })
      ScrollTrigger.normalizeScroll({
        allowNestedScroll: true,
        type: 'touch,pointer,wheel',
      })
      normalizeScrollEnabled = true
    }

    const ctx = gsap.context(() => {
      const tween = gsap.to(avatarRotation, {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: () => `+=${getScrollDistance(mobile)}`,
          scrub: mobile ? 0.2 : 0.35,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          ...(mobile
            ? {}
            : {
                snap: {
                  snapTo: 1,
                  duration: { min: 0.12, max: 0.28 },
                  delay: 0.02,
                  ease: 'power1.inOut',
                },
              }),
          onUpdate: (self) => {
            applyRotationProgress(self.progress)
          },
          onLeave: () => {
            avatarRotation.y = 0
            setRotationComplete(hero, true)
          },
          onEnterBack: () => {
            setRotationComplete(hero, false)
          },
        },
      })

      scrollTriggerInstance = tween.scrollTrigger ?? null
    }, hero)

    const removeTouchFallback = setupMobileTouchFallback(
      hero,
      () => scrollTriggerInstance,
      mobile,
    )

    const onResize = () => ScrollTrigger.refresh()

    const onMediaChange = (event: MediaQueryListEvent) => {
      mobile = event.matches
      hero.classList.toggle('hero-section--mobile', mobile)
      ScrollTrigger.refresh()
    }

    const mobileMq = window.matchMedia(MOBILE_MEDIA_QUERY)
    window.addEventListener('resize', onResize)
    mobileMq.addEventListener('change', onMediaChange)

    return () => {
      window.removeEventListener('resize', onResize)
      mobileMq.removeEventListener('change', onMediaChange)
      removeTouchFallback()
      if (normalizeScrollEnabled) {
        ScrollTrigger.normalizeScroll(false)
      }
      hero.classList.remove('hero-section--mobile', 'hero-section--rotation-complete')
      document.body.classList.remove('hero-scroll-locked')
      ctx.revert()
    }
  }, [heroRef])
}
