import{_ as s,o as a,c as n,Q as l}from"./chunks/framework.e713b733.js";const m=JSON.parse('{"title":"Known issues","description":"","frontmatter":{},"headers":[],"relativePath":"reference/known-issues.md","filePath":"reference/known-issues.md"}'),e={name:"reference/known-issues.md"},p=l(`<h1 id="known-issues" tabindex="-1">Known issues <a class="header-anchor" href="#known-issues" aria-label="Permalink to &quot;Known issues&quot;">​</a></h1><h2 id="use-the-same-hook-multiple-times" tabindex="-1">Use the same hook multiple times <a class="header-anchor" href="#use-the-same-hook-multiple-times" aria-label="Permalink to &quot;Use the same hook multiple times&quot;">​</a></h2><p>By default hook names are used as JSON object keys so you cannot have the same hook appearing twice in your pipeline using this notation. However, you can also use the <em>named hook syntax</em> if you want to use the same hook multiple times in your pipeline. In this case the key used in the configuration file can be whatever you want but the associated object value must have a <code>hook</code> property containing the name of the hook to be run like this:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">tasks</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">after</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">readXML</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">writeTemplateYaml</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">hook</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;writeTemplate&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">templateFile</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;mapproxy-template.yaml&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">writeTemplateHtml</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">hook</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;writeTemplate&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">templateFile</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;leaflet-template.html&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">tasks</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">after</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">readXML</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">writeTemplateYaml</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">hook</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;writeTemplate&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">templateFile</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;mapproxy-template.yaml&#39;</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">writeTemplateHtml</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">hook</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;writeTemplate&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">templateFile</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;leaflet-template.html&#39;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="use-parallelism" tabindex="-1">Use parallelism <a class="header-anchor" href="#use-parallelism" aria-label="Permalink to &quot;Use parallelism&quot;">​</a></h2><p>By default all hooks are run in sequence, if at given step of your pipeline you want a parallel execution of some you can use the reserved hook name <code>parallel</code> and give the hooks to be run in parallel as an array of items each containing the hook name as a <code>hook</code> property and its options as other properties:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">tasks</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">after</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">readXML</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">parallel</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">      {</span></span>
<span class="line"><span style="color:#E1E4E8;">        hook: </span><span style="color:#9ECBFF;">&#39;writeTemplate&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        templateFile: </span><span style="color:#9ECBFF;">&#39;mapproxy-template.yaml&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">      },</span></span>
<span class="line"><span style="color:#E1E4E8;">      {</span></span>
<span class="line"><span style="color:#E1E4E8;">        hook: </span><span style="color:#9ECBFF;">&#39;writeTemplate&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        templateFile: </span><span style="color:#9ECBFF;">&#39;leaflet-template.html&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"><span style="color:#E1E4E8;">    ]</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">tasks</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">after</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">readXML</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    },</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">parallel</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">      {</span></span>
<span class="line"><span style="color:#24292E;">        hook: </span><span style="color:#032F62;">&#39;writeTemplate&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        templateFile: </span><span style="color:#032F62;">&#39;mapproxy-template.yaml&#39;</span></span>
<span class="line"><span style="color:#24292E;">      },</span></span>
<span class="line"><span style="color:#24292E;">      {</span></span>
<span class="line"><span style="color:#24292E;">        hook: </span><span style="color:#032F62;">&#39;writeTemplate&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        templateFile: </span><span style="color:#032F62;">&#39;leaflet-template.html&#39;</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"><span style="color:#24292E;">    ]</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h2 id="handling-error" tabindex="-1">Handling error <a class="header-anchor" href="#handling-error" aria-label="Permalink to &quot;Handling error&quot;">​</a></h2><p>You can use the <strong>faultTolerant</strong> option to catch any error raised in a hook so that the hook chain will continue anyway. However, it is sometimes hard to ensure the pipeline will run fine until the end once an error occurred In this case, you&#39;d better let the chain stop (the default behavior) and register specific hooks to be run whenever an error occurs, such as one used to clear intermediate outputs:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">tasks</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">after</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">error</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">clearOutputs</span><span style="color:#E1E4E8;">: {}</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">tasks</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">after</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">...</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">error</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">clearOutputs</span><span style="color:#24292E;">: {}</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div>`,10),o=[p];function t(c,r,i,E,y,h){return a(),n("div",null,o)}const u=s(e,[["render",t]]);export{m as __pageData,u as default};
