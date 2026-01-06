import { JSX } from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'l-line-spinner': any;
        }
    }
}
