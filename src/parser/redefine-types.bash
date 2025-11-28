echo 'import * as types from "./types.ts";' | cat - parser.d.ts > temp && mv temp parser.d.ts
