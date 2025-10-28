import { createPageLoadingGuard } from './page-loading-guard'
import { createPageTitleGuard } from './page-title-guard'

export function setupRouterGuard(router) {
  createPageLoadingGuard(router)
  createPageTitleGuard(router)
}
