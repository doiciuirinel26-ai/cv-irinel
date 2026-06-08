/** Matches phones / small touch viewports — desktop layout stays unchanged above 768px. */
export const MOBILE_MEDIA_QUERY = '(max-width: 768px)'

export function isMobileViewport() {
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches
}
