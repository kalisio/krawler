import{s as o,Z as i,$ as u,a0 as c,a1 as l,a2 as d,a3 as f,a4 as m,a5 as h,a6 as A,a7 as g,a8 as y,d as P,u as v,j as w,y as C,a9 as R,aa as _,ab as b,ac as E}from"./chunks/framework.e713b733.js";import{t as D}from"./chunks/theme.df5366ae.js";const T={extends:D};function p(e){if(e.extends){const a=p(e.extends);return{...a,...e,async enhanceApp(t){a.enhanceApp&&await a.enhanceApp(t),e.enhanceApp&&await e.enhanceApp(t)}}}return e}const s=p(T),j=P({name:"VitePressApp",setup(){const{site:e}=v();return w(()=>{C(()=>{document.documentElement.lang=e.value.lang,document.documentElement.dir=e.value.dir})}),R(),_(),b(),s.setup&&s.setup(),()=>E(s.Layout)}});async function x(){const e=S(),a=O();a.provide(u,e);const t=c(e.route);return a.provide(l,t),a.component("Content",d),a.component("ClientOnly",f),Object.defineProperties(a.config.globalProperties,{$frontmatter:{get(){return t.frontmatter.value}},$params:{get(){return t.page.value.params}}}),s.enhanceApp&&await s.enhanceApp({app:a,router:e,siteData:m}),{app:a,router:e,data:t}}function O(){return h(j)}function S(){let e=o,a;return A(t=>{let n=g(t),r=null;return n&&(e&&(a=n),(e||a===n)&&(n=n.replace(/\.js$/,".lean.js")),r=y(()=>import(n),[])),o&&(e=!1),r},s.NotFound)}o&&x().then(({app:e,router:a,data:t})=>{a.go().then(()=>{i(a.route,t.site),e.mount("#app")})});export{x as createApp};