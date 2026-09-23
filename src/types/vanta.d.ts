declare module 'vanta/dist/vanta.dots.min' {
  interface VantaEffect {
    destroy(): void
    restart(): void
    setOptions(options: Record<string, unknown>): void
  }
  const DOTS: (options: { el: HTMLElement } & Record<string, unknown>) => VantaEffect
  export default DOTS
}
