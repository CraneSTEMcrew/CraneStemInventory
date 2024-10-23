import { viewportBreakpoints } from '@/constants/viewport-breakpoints.js'

//viewport service a singleton, thus no constructor needed or wanted
export default {
  determineBreakpoint() {
    let width = window.innerWidth
    if (width < 576) {
      return viewportBreakpoints.XS
    }
    if (width < 768) {
      return viewportBreakpoints.SM
    }
    if (width < 992) {
      return viewportBreakpoints.MD
    }
    if (width < 1200) {
      return viewportBreakpoints.LG
    }
    if (width < 1400) {
      return viewportBreakpoints.XL
    }
    if (width >= 1400) {
      return viewportBreakpoints.XXL
    }
  }
}
