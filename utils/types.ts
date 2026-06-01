import type React from 'react';
export type IconFn = (size: number) => React.ReactNode;
export type IconMap = Record<string, IconFn>;
