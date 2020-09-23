/// <reference types="next" />
/// <reference types="next/types/global" />

declare interface Window {
  requestIdleCallback: Function;
}

declare interface Console {
  toJS: (data: any) => void;
}

declare module '*.po' {
  const poModule: { [key: string]: string };

  export default poModule;
}

declare module 'rc-slider' {
  const Slider: React.ComponentType<Partial<
    import('rc-slider/lib/Slider').SliderProps & {
      className?: string;
    }
  >>;

  export const Range: React.ComponentType<Partial<
    import('rc-slider/lib/Range').RangeProps & {
      className?: string;
    }
  >>;

  export const Handle: React.ComponentType<Partial<
    import('rc-slider/lib/Handle').HandleProps & {
      className?: string;
    }
  >>;

  export const createSliderWithTooltip: typeof import('rc-slider/lib/createSliderWithTooltip').default;

  export default Slider;
}

/* declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
} */

/* declare module '*.svg' {
  const content: string;
  export default content;
} */
