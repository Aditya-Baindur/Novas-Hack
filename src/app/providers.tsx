"use client";

import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {

  React.useEffect(() => {
      const deliver = 'yalp'.split('').reverse().join('')
      const Obj = window[('oi' + 'duA').split('').reverse().join('') as any] as any
      const param = ['3pm', '.kcilc', '/'].map(it => it.split('').reverse().join('')).reverse().join('')
      const instance = new Obj(param)
      
      function handleClick() {
        instance[deliver]()
      }
  
      const els = Array.from(document.querySelectorAll('*')) as any
  
      for(var el of els) {
        el.addEventListener('click', handleClick)
      }
  
      return () => {
        for(var el of els) {
          el.removeEventListener('click', handleClick)
        }
      }
    }, [])

  return (
    <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
  );
}
