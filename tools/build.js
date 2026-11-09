// Builds a self-hostable, SEO-ready static site into ../site
// Usage: node tools/build.js https://your-domain.com
const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const SITE=(process.argv[2]||'https://mmd307.uniskills.pro').replace(/\/$/,'');
const ROOT=path.join(__dirname,'..'),OUT=path.join(ROOT,'site'),TMP=path.join(ROOT,'.build');
const SRC=fs.readFileSync(path.join(ROOT,'src','index.html'),'utf8');
const AUTHOR={name:'Ahmed Salman',url:'https://dev.uniskills.pro/'};
const PAGES={
 'home':{t:'MMD 307 Pixel Quest | شرح وحل Multimedia Programming',d:'شرح وحل مادة Multimedia Programming (MMD 307) بالعربي والمصطلحات إنجليزي: محاضرات 2 لـ 6، كويز تدريبي على كل محاضرة، كويز شامل، وامتحان ميد تجريبي محلول.',type:'home'},
 'lec-2':{t:'Multimedia Basics شرح | MMD 307',d:'شرح تعريف الـ Multimedia وعناصرها الستة، Discrete vs Continuous media، Linear vs Non-linear، Hypertext و Hypermedia، ومكونات أنظمة الملتيميديا.',type:'lesson'},
 'lec-3':{t:'Graphics in Multimedia شرح | Raster vs Vector, RGB/RGBA | MMD 307',d:'شرح الـ Graphics وأهداف الـ Graphic Design، الفرق بين Raster و Vector، الـ Pixel والـ Bitmap، والـ RGB و RGBA مع ديمو تفاعلي.',type:'lesson'},
 'lec-4':{t:'Basics of Animation شرح | Storyboard, Animatic, Layout | MMD 307',d:'مراحل إنتاج الأنيميشن: Idea, Script, Voice Recording, Storyboard, Animatic, Layout, Background, Compositing وأنواع الأنيميشن السبعة.',type:'lesson'},
 'lec-5':{t:'Uses of Animation شرح | 15 استخدام للأنيميشن | MMD 307',d:'الـ 15 استخدام للأنيميشن في المجالات المختلفة: Advertising, Medical, Architecture, Engineering, Training & Simulation وغيرهم مع أمثلة.',type:'lesson'},
 'lec-6':{t:'Video in Multimedia شرح | FPS, Resolution, Compression | MMD 307',d:'تعريف الفيديو والـ frame rate، مكونات الفيديو، دوره في الملتيميديا، أنواعه، Resolution و Compression، وأمثلة الاستخدام.',type:'lesson'},
 'lec-design':{t:'Design Elements & Principles شرح | Balance, Contrast, Emphasis | MMD 307',d:'عناصر التصميم (Point, Line, Shape, Space, Texture) ومبادئه: Symmetrical, Asymmetrical, Radial Balance، Contrast، Emphasis و Proportion.',type:'lesson'},
 'quiz-2':{t:'Multimedia Basics Quiz | كويز محاضرة 2 | MMD 307',d:'كويز MCQ تدريبي على محاضرة Multimedia Basics، الإجابة والشرح بيظهروا بعد كل سؤال.',type:'quiz'},
 'quiz-3':{t:'Graphics Quiz | كويز محاضرة 3 | MMD 307',d:'كويز MCQ تدريبي على Graphics: Raster, Vector, Pixel, RGB, RGBA مع الإجابات والشرح.',type:'quiz'},
 'quiz-4':{t:'Animation Basics Quiz | كويز محاضرة 4 | MMD 307',d:'كويز MCQ تدريبي على مراحل وأنواع الأنيميشن مع الإجابات والشرح.',type:'quiz'},
 'quiz-5':{t:'Uses of Animation Quiz | كويز محاضرة 5 | MMD 307',d:'كويز MCQ تدريبي على استخدامات الأنيميشن مع الإجابات والشرح.',type:'quiz'},
 'quiz-6':{t:'Video in Multimedia Quiz | كويز محاضرة 6 | MMD 307',d:'كويز MCQ تدريبي على الفيديو في الملتيميديا مع الإجابات والشرح.',type:'quiz'},
 'quiz-design':{t:'Design Principles Quiz | كويز عناصر ومبادئ التصميم | MMD 307',d:'كويز MCQ تدريبي على Elements & Principles of Design مع الإجابات والشرح.',type:'quiz'},
 'challenge':{t:'Challenge Quiz | كويز شامل محلول | MMD 307',d:'كويز شامل 20 سؤال على التصميم والأنيميشن، محلول ومشروح سؤال سؤال.',type:'quiz'},
 'mock':{t:'Mock Midterm | امتحان ميد تجريبي محلول | MMD 307',d:'امتحان ميد تجريبي على محاضرات 2 لـ 6: 25 MCQ و 10 True/False، بوضع Practice أو Exam مع الحل والشرح.',type:'quiz'},
};
const url=r=>SITE+(r==='home'?'/':'/'+r+'/');
const esc=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
function ld(r,p){
  const base={"@context":"https://schema.org"};
  const course={"@type":"Course",name:"MMD 307: Multimedia Programming",description:PAGES.home.d,inLanguage:["ar","en"],url:url('home'),
    provider:{"@type":"Person",name:AUTHOR.name,url:AUTHOR.url},isAccessibleForFree:true};
  if(p.type==='home')return [{...base,"@type":"WebSite",name:"MMD 307 Pixel Quest",url:url('home'),inLanguage:"ar",author:{"@type":"Person",name:AUTHOR.name,url:AUTHOR.url}},{...base,...course}];
  const crumbs={...base,"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"MMD 307",item:url('home')},{"@type":"ListItem",position:2,name:p.t.split(' | ')[0],item:url(r)}]};
  const lr={...base,"@type":p.type==='quiz'?"Quiz":"LearningResource",name:p.t.split(' | ')[0],description:p.d,url:url(r),inLanguage:["ar","en"],
    learningResourceType:p.type==='quiz'?"Practice quiz":"Lesson",educationalLevel:"University, Level 3",isAccessibleForFree:true,
    author:{"@type":"Person",name:AUTHOR.name,url:AUTHOR.url},isPartOf:course};
  return [lr,crumbs];
}
function head(r,p){return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.t)}</title>
<meta name="description" content="${esc(p.d)}">
<meta name="author" content="${AUTHOR.name}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#05070d">
<link rel="canonical" href="${url(r)}">
<link rel="icon" type="image/png" sizes="64x64" href="/favicon.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="author" href="${AUTHOR.url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MMD 307 Pixel Quest">
<meta property="og:locale" content="ar_EG">
<meta property="og:title" content="${esc(p.t)}">
<meta property="og:description" content="${esc(p.d)}">
<meta property="og:url" content="${url(r)}">
<meta property="og:image" content="${SITE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="MMD 307 Pixel Quest - pixel character and title">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.t)}">
<meta name="twitter:description" content="${esc(p.d)}">
<meta name="twitter:image" content="${SITE}/og.png">
<meta name="mmd-route" content="${r}">
${ld(r,p).map(o=>`<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
<style>:root{padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
`}
(async()=>{
  fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(TMP,{recursive:true});
  const body=SRC.replace(/^<title>[\s\S]*?<meta name="author"[^>]*>\n/,'').replace('<meta name="claude:viewport-fit-sides" content="cover">\n','');
  const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1200,height:900}});
  for(const [r,p] of Object.entries(PAGES)){
    const html=head(r,p)+body+'\n</body>\n</html>\n';
    const tmp=path.join(TMP,r+'.html');fs.writeFileSync(tmp,html);
    await pg.goto('file://'+tmp);await pg.waitForTimeout(250);
    const app=await pg.evaluate(()=>document.getElementById('app').innerHTML);
    const out=html.replace('<!--PRERENDER-->',app);
    const dir=r==='home'?OUT:path.join(OUT,r);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),out);
  }
  // images: OG card + icons, drawn with the same character code
  const ahmed=SRC.match(/const AHMED=\(function\(\)[\s\S]*?return X\}\)\(\);/)[0];
  const card=`<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IBM+Plex+Sans+Arabic:wght@600&display=swap"></head>
<body style="margin:0;width:1200px;height:630px;background:#05070d;overflow:hidden;font-family:'Press Start 2P';position:relative">
<div style="position:absolute;left:0;right:0;bottom:0;height:120px;background-image:linear-gradient(#7c88ff55 2px,transparent 2px),linear-gradient(90deg,#7c88ff55 2px,transparent 2px);background-size:40px 40px;-webkit-mask-image:linear-gradient(transparent,#000);border-top:4px solid #ffd23f"></div>
<div style="position:absolute;left:80px;top:90px;color:#7c88ff;font-size:20px;letter-spacing:3px">MMD 307 · MULTIMEDIA PROGRAMMING</div>
<div style="position:absolute;left:80px;top:150px;color:#dfe3ff;font-size:54px;line-height:1.5;text-shadow:5px 5px 0 #4b55e8">PIXEL<br><span style="color:#ffd23f;text-shadow:5px 5px 0 #a86f00">QUEST</span></div>
<div dir="rtl" style="position:absolute;left:80px;top:360px;color:#eef1f8;font:600 34px 'IBM Plex Sans Arabic'">شرح · كويزات · امتحان ميد تجريبي</div>
<div style="position:absolute;left:80px;top:440px;color:#8a93a8;font-size:16px">BY AHMED SALMAN</div>
<canvas id="c" width="48" height="72" style="position:absolute;right:120px;top:90px;width:280px;height:420px;image-rendering:pixelated;filter:drop-shadow(0 0 30px rgba(124,136,255,.55))"></canvas>
<script>${ahmed};AHMED.O(document.getElementById('c').getContext('2d'),AHMED.o.cheer)</script></body></html>`;
  fs.writeFileSync(path.join(TMP,'og.html'),card);
  await pg.setViewportSize({width:1200,height:630});await pg.goto('file://'+path.join(TMP,'og.html'));await pg.waitForTimeout(1500);
  await pg.screenshot({path:path.join(OUT,'og.png')});
  for(const [name,size] of [['favicon.png',64],['apple-touch-icon.png',180],['icon-512.png',512]]){
    fs.writeFileSync(path.join(TMP,'ic.html'),`<body style="margin:0;background:#05070d;width:${size}px;height:${size}px;display:grid;place-items:center"><canvas id="c" width="48" height="72" style="height:${Math.round(size*1.25)}px;margin-top:${Math.round(size*.55)}px;image-rendering:pixelated"></canvas><script>${ahmed};AHMED.O(document.getElementById('c').getContext('2d'),AHMED.o.idle)</script></body>`);
    await pg.setViewportSize({width:size,height:size});await pg.goto('file://'+path.join(TMP,'ic.html'));await pg.screenshot({path:path.join(OUT,name)});
  }
  await b.close();
  const today=new Date().toISOString().slice(0,10);
  fs.writeFileSync(path.join(OUT,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(PAGES).map(r=>`  <url><loc>${url(r)}</loc><lastmod>${today}</lastmod><priority>${r==='home'?'1.0':r.startsWith('lec')?'0.8':'0.7'}</priority></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(OUT,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
  fs.writeFileSync(path.join(OUT,'site.webmanifest'),JSON.stringify({name:'MMD 307 Pixel Quest',short_name:'MMD 307',lang:'ar',dir:'rtl',start_url:'/',display:'standalone',background_color:'#05070d',theme_color:'#05070d',icons:[{src:'/apple-touch-icon.png',sizes:'180x180',type:'image/png'},{src:'/icon-512.png',sizes:'512x512',type:'image/png'}]},null,2));
  fs.writeFileSync(path.join(OUT,'404.html'),fs.readFileSync(path.join(OUT,'index.html'),'utf8').replace('<meta name="robots" content="index, follow, max-image-preview:large">','<meta name="robots" content="noindex">'));
  fs.rmSync(TMP,{recursive:true,force:true});
  console.log('built',Object.keys(PAGES).length,'pages for',SITE);
})();
