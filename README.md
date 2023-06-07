# CARLA's e-mirror LCT evaluation screen

## Development environment

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so the `tsc` CLI command is replaced with `vue-tsc` for type checking. In editors,  [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) is needed to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Development

### Setting up the project after it was cloned

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

Then open `localhost:3000` page in a browser

NOTE: some browsers may restrict connecting via WebSocket to the localhost via unsecured HTTP. It is recommended to use Firefox with this restriction disabled as follow:
- navigate to `about:config` and close (agree) any caution that may be displayed
- type `network.websocket.allowInsecureFromHTTPS` in the search field
- set this flag to `true`

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Deployment

```sh
./deploy.bat
```

## Usage

After deployment, open the project [GitHub page](https://lexasss.github.io/emirror-lct-eval/) in a browser.