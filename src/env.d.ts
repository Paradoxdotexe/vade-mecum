import { VTheme } from './common/VTheme';

import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends VTheme {}
}
