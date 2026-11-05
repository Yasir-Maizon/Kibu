/* KIBU v0.8 — extensiones sobre la interfaz original, sin dependencias. */
(() => {
  const ST = 'assets/stickers/';
  const stickerAssets = {
    idea:'icon-ideas.png', adapt:'icon-adaptar.png', learn:'icon-aprender.png', explore:'icon-explorar.png',
    heart:'recompensa-corazon.png', star:'recompensa-estrella.png', triple:'recompensa-tres-estrellas.png',
    medal:'recompensa-medalla-kibu.png', flame:'recompensa-llamita.png', achievement:'recompensa-logro.png',
    trophy:'recompensa-trofeo-kibu.png', listening:'mascota-escuchando.png', animals:'animales-ingles.png'
  };
  const asset = k => ST+stickerAssets[k];
  const name = () => String(S.prof.name||'').trim().slice(0,28);
  const kid = () => name() || 'pequeño explorador';
  const safeName = () => esc(name());
  if (!S.prof || !Array.isArray(S.prof.needs)) S.prof={age:4,needs:[],name:''};
  S.prof.name=typeof S.prof.name==='string'?S.prof.name:'';
  S.game = {id:'',step:0,feedback:'',win:false};
  S.gameProgress=ld('games',{});
  S.theme=ld('theme','auto');
  if(S.theme==='dark'||S.theme==='light')document.documentElement.dataset.theme=S.theme;
  S.chatTopic='';
  S.chatSkips=false;
  Object.assign(IMG,{
    'recompensa-estrella':asset('star'),
    'recompensa-corazon':asset('heart'),
    'recompensa-trofeo':asset('trophy'),
    'recompensa-medalla':asset('medal'),
    'recompensa-llamita':asset('flame'),
    'recompensa-logro':asset('achievement'),
    'mascot-escuchando':asset('listening')
  });
  // La colección antigua se conserva; los nuevos logros tienen sus propios hitos.
  [['recompensa-corazon',6],['recompensa-medalla',12],['recompensa-llamita',20],['recompensa-trofeo',30],['recompensa-logro',45]].forEach(x=>{
    if (!STK.some(a=>a[0]===x[0])) STK.push(x);
  });
  STK.sort((a,b)=>a[1]-b[1]);

  const oldHome=V.home;
  V.home=()=>oldHome()
    .replace('¡Hola!<br>¿Qué hacemos hoy?',`¡Hola${name()?', '+safeName():''}!<br>¿Qué hacemos hoy?`)
    .replace(`src="${UI.folder}"`,`src="${asset('adapt')}"`)
    .replace(`src="${UI.idea}"`,`src="${asset('idea')}"`)
    .replace(`src="${UI.books}"`,`src="${asset('explore')}"`)
    .replace(`src="${UI.target}"`,`src="${asset('learn')}"`);
  const oldOb=V.ob;
  V.ob=()=>{
    let html=oldOb();
    if(S.ob===0)html=html.replace('<div class="foot">',`<div class="kid-name"><label for="kidName">¿Cómo te gustaría llamar al niño? <small>(opcional)</small></label><input class="inp" id="kidName" maxlength="28" autocomplete="off" placeholder="Nombre o apodo" value="${safeName()}"><small>Solo se guarda en este navegador. Puedes cambiarlo en Perfil.</small></div><div class="foot">`);
    return html;
  };
  const oldProfile=V.profile;
  V.profile=()=>oldProfile()
    .replace('<h3 style="margin-top:6px">Edad</h3>',`<div class="kid-name profile-name"><label for="profileKidName">Nombre o apodo del niño</label><input class="inp" id="profileKidName" maxlength="28" value="${safeName()}" placeholder="Opcional"></div><h3 style="margin-top:6px">Edad</h3>`)
    .replace('<div class="card sw" style="margin-top:18px">',`<div class="card sw"><div>Tema de Kibu<br><small style="color:var(--mut)">Claro, oscuro cálido o automático</small></div><button class="btn ghost theme-btn" data-act="theme">${S.theme==='auto'?'Automático':S.theme==='dark'?'Oscuro':'Claro'}</button></div><div class="card sw" style="margin-top:18px">`)
    .replace('<div id="keybox"></div>',`<div class="card progress-card"><h3>Progreso al aprender</h3><p>¡Cada intento cuenta! Los juegos se guardan únicamente en este dispositivo.</p><div class="game-progress">${['numbers','vowels','letters','syllables','english','colors'].map(id=>{let g=GAMES[id],p=S.gameProgress[id]||0;return `<div><b>${esc(g.label)}</b><span>${p} ${p===1?'respuesta':'respuestas'} logradas</span></div>`}).join('')}</div></div><div id="keybox"></div>`);
  const oldResult=V.result;
  V.result=()=>oldResult().replace('<small>Objetivo educativo</small>',`<small>Objetivo educativo${name()?' para '+safeName():''}</small>`);
  const oldPlay=V.play;
  V.play=()=>oldPlay().replace('<div class="play">',`<div class="play"><p class="kid-greeting">${name()?'¡Vamos, '+safeName()+'!':'¡Vamos a aprender!'}</p>`);
  const oldDone=V.done;
  V.done=()=>oldDone().replace('¡Lo lograron!',`¡${name()?safeName()+', lo lograste':'Lo lograron'}!`);
  const oldAdapt=V.adapt;
  V.adapt=()=>oldAdapt().replace('<textarea id="desc"',`<p class="photo-disclaimer" role="note">${ic('info',16)} La foto se previsualiza aquí. <b>Sin servidor con IA, Kibu no la analiza:</b> describe la actividad con texto para recibir una propuesta local.</p><textarea id="desc"`);
  window.miss=function(){const f=S.f,m=[];const demo=location.protocol==='file:'||!(apiReady&&apiReady.ai);
    if(f.mode!=='ideas' && (!f.blob || demo) && f.desc.trim().length<5)m.push(demo?'una descripción de al menos 5 letras (la foto no se analiza en modo prototipo)':'una foto o una descripción');
    if(!f.age)m.push('la edad');if(!f.mats.length&&!f.custom.length)m.push('al menos un material');return m;
  };
  window.loadPhoto=function(file){
    if(!file)return;
    const types=['image/jpeg','image/png','image/webp'];
    if(!types.includes(file.type)){alert('Kibu admite fotos JPG, PNG o WebP.');return;}
    if(file.size>6*1024*1024){alert('La foto debe ocupar menos de 6 MB.');return;}
    const temp=URL.createObjectURL(file),test=new Image();
    test.onload=()=>{if(test.width>12000||test.height>12000){URL.revokeObjectURL(temp);alert('La imagen tiene dimensiones demasiado grandes.');return;}
      const scale=Math.min(1,1024/Math.max(test.width,test.height)),can=document.createElement('canvas');
      can.width=Math.max(1,Math.round(test.width*scale));can.height=Math.max(1,Math.round(test.height*scale));
      can.getContext('2d').drawImage(test,0,0,can.width,can.height);
      can.toBlob(blob=>{URL.revokeObjectURL(temp);if(!blob){alert('No se pudo procesar la foto.');return;}
        if(S.f.url)URL.revokeObjectURL(S.f.url);S.f.blob=blob;S.f.url=URL.createObjectURL(blob);render();},'image/jpeg',.8);
    };
    test.onerror=()=>{URL.revokeObjectURL(temp);alert('No pudimos abrir la imagen. Prueba otra foto.')};test.src=temp;
  };
  const oldRemove=ACT.rmph;
  ACT.rmph=()=>{if(S.f.url)URL.revokeObjectURL(S.f.url);oldRemove()};

  /* Voz de Kibu: más infantil y animada, tipo personaje. Usa la mejor voz femenina disponible del
     dispositivo, tono agudo, ritmo alegre y entonación que "rebota" frase por frase.
     La calidad final depende de las voces instaladas en el sistema/navegador. */
  const KIBU_VOICE_HINTS=[/sabina/i,/dalia/i,/paulina/i,/m[oó]nica/i,/luc[ií]a/i,/elena/i,/helena/i,/laura/i,/paloma/i,/salom[eé]/i,/google espa[nñ]ol de estados unidos/i,/google espa[nñ]ol/i,/female|mujer|child|kid|ni[ñn]/i];
  const KIBU_VOICE_AVOID=[/\b(raul|raúl|pablo|jorge|diego|carlos|alvaro|álvaro|enrique|male|hombre)\b/i];
  const chooseVoice=lang=>{
    if(!('speechSynthesis' in window))return null;
    const want=/^en/i.test(lang)?'en':'es';
    const arr=window.speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith(want));
    if(!arr.length)return null;
    const score=v=>{
      let n=0;const name=v.name||'';
      KIBU_VOICE_HINTS.forEach((r,i)=>{if(r.test(name))n+=40-i});
      if(KIBU_VOICE_AVOID.some(r=>r.test(name)))n-=60;
      if(want==='es'&&/es-(mx|us|pa|419|co|ar|cl)/i.test(v.lang))n+=8;
      if(want==='en'&&/en-us/i.test(v.lang))n+=6;
      if(v.localService)n+=12; /* las voces locales sí respetan el tono agudo */
      return n;
    };
    return arr.map(v=>[score(v),v]).sort((x,y)=>y[0]-x[0])[0][1];
  };
  if('speechSynthesis' in window){try{window.speechSynthesis.getVoices();window.speechSynthesis.addEventListener('voiceschanged',()=>{})}catch(_e){}}
  let speechActive=false,speechToken=0,speechKeep=[];
  const kibuChunks=text=>{
    const parts=String(text||'').match(/[^.!?¡¿:;\n]+[.!?:;]*/g)||[String(text||'')];
    const out=[];
    parts.map(x=>x.trim()).filter(Boolean).forEach(x=>{
      if(x.length<=110){out.push(x);return}
      let cur='';
      x.split(/(?<=,)\s+/).forEach(y=>{if((cur+' '+y).trim().length>110&&cur){out.push(cur.trim());cur=y}else cur=(cur+' '+y).trim()});
      if(cur)out.push(cur);
    });
    return out;
  };
  window.speak=function(text,lang='es-PA'){
    if(!('speechSynthesis' in window))return;
    try{
      const s=window.speechSynthesis;s.cancel();
      const clean=String(text||'').replace(/\bhttps?:\/\/\S+/g,'').replace(/[«»"“”]/g,'').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,'').replace(/\s+/g,' ').trim().slice(0,1100);
      if(!clean)return;
      const en=/^en/i.test(lang),voice=chooseVoice(lang),chunks=kibuChunks(clean),token=++speechToken;
      speechKeep=chunks.map((c,i)=>{
        const u=new SpeechSynthesisUtterance(c);
        if(voice){u.voice=voice;u.lang=voice.lang}else u.lang=en?'en-US':lang;
        const excited=/!\s*$/.test(c)||/^¡/.test(c),asks=/\?\s*$/.test(c),single=c.split(/\s+/).length<=2;
        /* Tono muy agudo + vaivén por frase = voz animada y juguetona */
        let pitch=(en?1.7:1.8)+(i%2?.12:-.05)+(excited?.15:0)+(asks?.1:0);
        u.pitch=Math.max(1.4,Math.min(2,pitch));
        u.rate=single?.85:(excited?1.08:(asks?1.02:.98));
        u.volume=1;
        if(i===0)u.onstart=()=>{if(token!==speechToken)return;speechActive=true;document.body.classList.add('kibu-speaking')};
        const done=()=>{if(token!==speechToken)return;if(i===chunks.length-1){speechActive=false;document.body.classList.remove('kibu-speaking')}};
        u.onend=done;u.onerror=done;
        return u;
      });
      speechKeep.forEach(u=>s.speak(u));
    }catch(_e){}
  };
  ACT.theme=()=>{S.theme= S.theme==='auto'?'light':S.theme==='light'?'dark':'auto';sv('theme',S.theme);if(S.theme==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.dataset.theme=S.theme;render()};
  ACT.stopVoice=()=>{try{speechSynthesis.cancel()}catch(e){}speechActive=false;document.body.classList.remove('kibu-speaking')};
  // Se muestra como control adicional cuando existe voz.
  const oldChatHeader=()=>`<button class="ib voice-stop" data-act="stopVoice" title="Detener lectura" aria-label="Detener lectura">${ic('speaker',18)} ×</button>`;

  /* Chat directo con contexto opcional, historial en memoria y respuestas locales variadas. */
  const namePrefix=()=>name()?`Para ${name()}, `:'';
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const variant=(arr)=>arr[(S.chat.filter(x=>x.role==='user').length-1+arr.length)%arr.length];
  const materials=()=>S.ci.mats.map(label);
  const age=()=>S.ci.age||S.prof.age||4;
  const adaptations=()=>S.ci.needs.length?` Como apoyo: ${S.ci.needs.map(n=>NT[n]).filter(Boolean).join(' ')}`:S.prof.needs.length?` Como apoyo: ${S.prof.needs.map(n=>NT[n]).filter(Boolean).join(' ')}`:'';
  const activitySuggestion=()=>{const m=materials(),valid=m.length?S.ci.mats:['papel','crayones'];const d=demoAct({age:age(),area:S.ci.area||'Matemática',needs:S.ci.needs.length?S.ci.needs:S.prof.needs,mats:valid,custom:[]});return `Te propongo «${d.title}» para ${kid()}: ${d.steps.map((s,i)=>`${i+1}. ${s.x}`).join(' ')} ${adaptations()} ¿Quieres otra idea o prefieres que sea de lenguaje?`;};
  const fallback=()=>`Te escucho. ¿Quieres que te ayude con 1) una actividad usando materiales de casa, 2) letras y números, o 3) cómo acompañar una emoción? También puedes contarme qué necesita ${kid()}.`;
  window.demoChat=function(txt){
    const x=norm(txt),short=x.trim(),p=namePrefix();
    if(/\b(comprar|pagar|llamar|videollamada|whatsapp|enviar correo|inscribir|transferir dinero|conectar cuenta|enviar mensajes)\b/.test(x))return variant([
      'Estás dentro del prototipo de Kibu. No puedo hacer llamadas ni compras, pero puedo ayudarte a preparar una actividad para casa.',
      'Esta versión es un prototipo y todavía no realiza acciones fuera de la app. ¿Te ayudo a buscar materiales o crear un juego?'
    ]);
    const another=/^(si|sí|otra|otro|mas|más|dame otra|claro|continuar|siguiente|otra idea)/.test(short);
    if(another&&S.chatTopic){
      if(S.chatTopic==='activities')return variant([activitySuggestion(),`Otra opción: ${p}busca 3 objetos de colores diferentes, ordénalos, nómbralos y cuenta cuántos tienes. ¿Quieres adaptarla para una edad específica?`]);
      if(S.chatTopic==='feelings')return variant([`Otra estrategia: cuando ${kid()} esté tranquilo, ensayen una respiración lenta como si olieran una flor y apagaran una vela. No fuerces el ejercicio.`,`También pueden crear un rincón tranquilo con libros y una textura agradable. Ofrécelo como opción de calma, nunca como castigo.`]);
      if(S.chatTopic==='literacy')return variant([`Otra idea: nombra una palabra sencilla como «mesa» y escucha juntos su sonido inicial. Usa letras grandes o gestos si hace falta.`,`Prueben a palmear las sílabas de nombres de objetos: ca-sa, me-sa, pe-lo-ta.`]);
      if(S.chatTopic==='numbers')return variant([`Prueben a ordenar 5 objetos grandes de menor a mayor, contando cada uno al moverlo.`,`Esconde 3 figuras grandes bajo una tela y pregunta cuántas recuerdan antes de levantarlas.`]);
    }
    if(/\b(hola|buenos dias|buenas tardes|buenas noches|saludos)\b/.test(x)){S.chatTopic='welcome';return `¡Hola${name()?', familia de '+name():''}! Soy Kibu. Podemos inventar actividades, practicar palabras o ayudarte con una situación de crianza. ¿Qué te gustaría hacer?`;}
    if(/(frustr|rabiet|berrinch|llor|calmar|calma|trist|enoja|ansied|enfad|grit|emocion)/.test(x)){
      S.chatTopic='feelings';return variant([
        `Primero verifica que ${kid()} esté seguro. Habla bajito y a su altura: «Veo que esto te molestó». Dale tiempo; después ofrece dos opciones pequeñas, como descansar o intentar un solo paso. No hace falta resolver todo en ese momento.`,
        `${p}haz una pausa corta. Evita discutir mientras está muy molesto. Cuando se calme, nombra lo que pasó y busca una solución sencilla juntos. Si hay riesgo de lesiones o la situación se repite con mucha intensidad, consulta a un profesional.`
      ]);
    }
    if(/(concentr|atencion|distra|inquiet|rutina|horario|tarea|no quiere|obliga|resiste)/.test(x)){
      S.chatTopic='routines';return variant([
        `Para ${kid()}, prueba sesiones breves de 5 minutos. Muestra un solo material y da una instrucción a la vez. Deja elegir entre dos actividades posibles.`,
        'Preparen una rutina sencilla: juego corto, pausa de movimiento y cierre. Anticipa el cambio con una frase clara. Acompaña sin regaños ni comparaciones.'
      ]);
    }
    if(/(discapaci|autis|apoyo|vision|visual|audici|auditiv|motricidad|sensorial|señas|necesidades|inclusion|inclusi)/.test(x)){
      S.chatTopic='supports';return variant([
        `Podemos adaptar la actividad sin diagnosticar. Si necesita apoyo visual, describe los objetos y usa texturas; si necesita ayuda motriz, ofrece piezas grandes y movimientos cómodos; si le ayuda la calma, reduce estímulos. ${adaptations()} ¿Qué apoyo quieres priorizar?`,
        `Dale a ${kid()} varias maneras de participar: señalar, mover una pieza, responder con una palabra o gesto. Respeta las pausas y evita materiales que no sean adecuados para su edad o habilidades. ¿Qué tipo de actividad te gustaría adaptar?`
      ]);
    }
    if(/(falta|no tengo|sustitu|reemplaza|alternativa|sin material|en lugar de)/.test(x)){
      S.chatTopic='materials';return variant([
        'Para sustituir materiales: papel por cartón o periódico; crayones por lápices; bloques por recipientes grandes. Evita piezas pequeñas que puedan tragarse. ¿Qué material te falta?',
        'No necesitas comprar nada. Cuéntame qué objeto tienes: una caja, una tela, un vaso plástico o papel. Con supervisión adulta podemos adaptar el juego.'
      ]);
    }
    if(/(ingles|english|pronunci|cat|dog|animal)/.test(x)){
      S.chatTopic='english';return variant([
        `Para practicar inglés con ${kid()}, señala un animal de juguete y di «cat» (gato), «dog» (perro), «bird» (pájaro). Repite despacio sin exigir pronunciación perfecta. En Aprender hay un juego de inglés con audio.`,
        'Prueben tres colores: red, yellow y purple. Señala un objeto de ese color y di la palabra. En la sección Aprender puedes escuchar la pronunciación.'
      ]);
    }
    if(/(numero|contar|cantidad|matemat|sumar|uno dos|cuantos)/.test(x)){
      S.chatTopic='numbers';return variant([
        `${p}pongan cinco objetos grandes en fila. Tóquenlos uno por uno mientras cuentan en voz alta; cambien el orden y vuelvan a contar. También pueden jugar en Aprender > Números.`,
        'Prueba el juego «¿Cuántos hay?»: coloca 3 tapas grandes, cúbrelas, descubre una y cuenten juntos las restantes. No uses piezas pequeñas con niños que puedan llevárselas a la boca.'
      ]);
    }
    if(/(vocal|letra|abeced|silab|palabra|cuento|lectur|lenguaje|escrib)/.test(x)){
      S.chatTopic='literacy';return variant([
        `Busca con ${kid()} tres objetos cuyos nombres empiecen por un sonido sencillo: «m» de mesa, «p» de papel. Nómbralos, repítelos y señálalos juntos.`,
        'Para las vocales, dibuja una A grande en papel, recórrela con el dedo y di su sonido. Continúa con E, I, O y U sin prisas; también puedes usar los juegos de Aprender.'
      ]);
    }
    if(/(foto|camara|galeria|imagen)/.test(x)){
      S.chatTopic='photo';return 'En Adaptar actividad puedes tomar una foto o elegirla de tu galería. En modo prototipo la foto solo se previsualiza: escribe una descripción para que Kibu proponga los pasos. Con IA conectada, decides explícitamente cuándo enviarla.';
    }
    if(/(video|youtube)/.test(x)){
      S.chatTopic='videos';return 'En Aprender puedes buscar videos sobre números, colores y animales. Un adulto debe revisar cada video antes de mostrarlo a un niño. Si no hay API, se ofrece una búsqueda externa.';
    }
    if(/(privaci|seguridad|datos|cuenta|guardar|borrar|funciona|usar kibu|ayuda)/.test(x)){
      S.chatTopic='help';return 'En Kibu puedes crear actividades desde Adaptar, explorar propuestas, jugar en Aprender y guardar favoritos. Los datos del prototipo se guardan en este navegador y puedes borrarlos desde Perfil. No compartas datos personales ni rostros de menores.';
    }
    if(/(actividad|ideas|jugar|juego|crear|material|papel|carton|tapas|botella|tela|crayon|colores|pintar|formas|pegamento|recortar|manualidad)/.test(x)){
      S.chatTopic='activities';return materials().length?activitySuggestion():variant([
        `Para ${kid()}, propongo un collage con papel y crayones: dibujen 3 formas, nómbrenlas y agrupen los colores. Supervisen cualquier uso de tijeras. ¿Qué materiales tienes?`,
        `Prueben «Encuentra la forma»: señala círculos y cuadrados grandes que haya en casa. Cada vez que encuentre uno, conversen sobre su color o tamaño. ¿Quieres una idea de motricidad o números?`
      ]);
    }
    return fallback();
  };
  window.chatH=function(){
    const c=S.ci,ex=['Dame una actividad con papel','Mi hijo se frustra, ¿qué hago?','Quiero practicar vocales'];
    return `<div class="sheet chat"><div class="hd">${im('mascot-escuchando','','Kibu escuchando')}<h3>Hablar con Kibu <small class="chat-mode">${apiReady&&apiReady.ai?'IA conectada':'Modo prototipo'}</small></h3>${oldChatHeader()}<button class="ib" data-act="close" aria-label="Cerrar chat">${ic('x')}</button></div>
    <details id="chat-params" class="chat-params" ${S.chatSkips?'':'open'}><summary>Personalizar conversación <span class="option-label">(opcional)</span></summary><p class="hint">Puedes escribir sin completar nada. Estos datos solo sirven para adaptar sugerencias.</p><h4>Edad</h4><div class="chips">${[3,4,5].map(a=>`<button class="chip ${c.age===a?'sel':''}" data-act="cage" data-v="${a}">${a} años</button>`).join('')}</div><h4>Área</h4><div class="chips">${Object.keys(AREA).map(k=>`<button class="chip ${c.area===k?'sel':''}" data-act="carea" data-v="${k}">${esc(AREA_N[k])}</button>`).join('')}</div><h4>Materiales</h4><div class="chips">${MATS.map(m=>`<button class="chip ${c.mats.includes(m[0])?'sel':''}" data-act="cmat" data-v="${m[0]}">${esc(m[1])}</button>`).join('')}</div><h4>Apoyos</h4><div class="chips">${NEEDS.map(n=>`<button class="chip ${c.needs.includes(n.id)?'sel':''}" data-act="cneed" data-v="${n.id}">${esc(n.l)}</button>`).join('')}</div><button class="btn ghost mini" data-act="chatSkip">Saltar / Listo, quiero conversar</button></details>
    <div class="msgs" id="msgs" role="log" aria-live="polite">${S.chat.map(m=>`<div class="m1 ${m.role==='user'?'me':'ai'}">${esc(m.content)}</div>`).join('')}${S.chat.length<2?`<div class="chips suggestions">${ex.map(t=>`<button class="chip" data-act="ex" data-v="${esc(t)}">${esc(t)}</button>`).join('')}</div>`:''}</div>
    <div class="cbar"><button class="ib ${S.rec?'rec':''}" id="mic" data-act="mic" aria-label="Hablar por micrófono" style="${(window.SpeechRecognition||window.webkitSpeechRecognition)?'':'display:none'}">${ic('mic')}</button><input id="ci" class="inp" placeholder="Pregunta lo que quieras…" maxlength="500" aria-label="Mensaje para Kibu"><button class="ib send-chat" data-act="csend" aria-label="Enviar mensaje">${ic('send')}</button></div></div>`;
  };
  window.openChat=function(ctx){
    S.ctx=ctx||'';S.ci.done=true;
    if(!S.ci.age&&S.prof.age)S.ci.age=S.prof.age;
    if(!S.ci.needs.length&&S.prof.needs.length)S.ci.needs=[...S.prof.needs];
    if(!S.chat.length)S.chat=[{role:'assistant',content:`¡Hola${name()?', '+name():''}! Soy Kibu. Puedes preguntarme sobre actividades, palabras, números, emociones o materiales. ¿Qué necesitas hoy?`}];
    const layer=$('#layer');layer.innerHTML=`<div class="ov">${chatH()}</div>`;
    const msgs=$('#msgs');if(msgs)msgs.scrollTop=msgs.scrollHeight;
  };
  ACT.chatSkip=()=>{S.chatSkips=true;refreshChat();const i=$('#ci');if(i)i.focus()};
  ACT.cedit=()=>{S.chatSkips=false;refreshChat()};
  ACT.cstart=()=>{S.chatSkips=true;refreshChat()};
  // Mantener visibilidad del formulario, en lugar de cerrar la entrada de texto.
  const rawRefreshChat=window.refreshChat;
  window.refreshChat=function(){rawRefreshChat();if(S.chatSkips){const p=$('#chat-params');if(p)p.open=false;}};

  /* Juegos educativos visuales: preguntas propias, no requieren red. */
  const GAMES={
    numbers:{label:'Números',desc:'Cuenta objetos y relaciona cantidades.',asset:'star',age:'3–5'},
    vowels:{label:'Vocales',desc:'Escucha y reconoce las vocales.',asset:'idea',age:'3–5'},
    letters:{label:'Letras',desc:'Encuentra el sonido inicial.',asset:'learn',age:'4–5'},
    syllables:{label:'Palabras y sílabas',desc:'Juega con sonidos cortitos.',asset:'explore',age:'4–5'},
    english:{label:'Inglés básico',desc:'Animales, colores, números y cuerpo.',asset:'animals',age:'3–5'},
    colors:{label:'Colores y formas',desc:'Descubre figuras y tonalidades.',asset:'adapt',age:'3–5'}
  };
  const animalSVG=(animal)=>{
    const base=(fill,ears,details)=>`<svg class="animal-svg" viewBox="0 0 120 100" aria-hidden="true"><g fill="${fill}" stroke="#613C4E" stroke-width="2.5"><ellipse cx="60" cy="55" rx="38" ry="35"/>${ears}</g><ellipse cx="60" cy="68" rx="21" ry="14" fill="#FFF7EE"/>${details}<circle cx="47" cy="52" r="4" fill="#392434"/><circle cx="73" cy="52" r="4" fill="#392434"/><path d="M53 73q7 7 14 0" stroke="#694054" fill="none" stroke-width="2.7" stroke-linecap="round"/></svg>`;
    if(animal==='cat')return base('#F8A043','<path d="M26 37L28 7L50 28M70 28L93 7L95 37"/>','<path d="M58 66h5l-3 4z" fill="#EF8E9C"/>');
    if(animal==='dog')return base('#D8A176','<ellipse cx="26" cy="42" rx="15" ry="27"/><ellipse cx="94" cy="42" rx="15" ry="27"/>','<circle cx="60" cy="66" r="5" fill="#503139"/>');
    if(animal==='bird')return `<svg class="animal-svg" viewBox="0 0 120 100" aria-hidden="true"><ellipse cx="61" cy="53" rx="35" ry="37" fill="#FFD550" stroke="#A36A13" stroke-width="3"/><path d="M54 59L39 52 53 46" fill="#FF8C33"/><circle cx="70" cy="43" r="5" fill="#382A22"/><path d="M40 67q-18 0-21-16" fill="none" stroke="#AA7A18" stroke-width="6"/></svg>`;
    return base('#F8E1F1','<ellipse cx="45" cy="14" rx="12" ry="29"/><ellipse cx="75" cy="14" rx="12" ry="29"/>','<circle cx="60" cy="66" r="5" fill="#F48B9C"/>');
  };
  const visualHTML=(q)=>{
    if(q.visual?.type==='dots')return `<div class="count-dots" aria-label="${q.visual.num} objetos">${Array.from({length:q.visual.num},()=>`<span class="count-dot"></span>`).join('')}</div>`;
    if(q.visual?.type==='animal')return animalSVG(q.visual.value);
    if(q.visual?.type==='shape')return `<span class="big-shape shape-${esc(q.visual.value)}" aria-hidden="true"></span>`;
    if(q.visual?.type==='letter')return `<span class="big-letter">${esc(q.visual.value)}</span>`;
    if(q.visual?.type==='word')return `<span class="big-word">${esc(q.visual.value)}</span>`;
    if(q.visual?.type==='listening')return `<img class="game-decoration" src="${asset('listening')}" alt="Kibu escuchando">`;
    return `<img class="game-decoration" src="${asset(q.visual?.asset||'learn')}" alt="">`;
  };
  function questionSet(id){const g=age();
    if(id==='numbers')return (g===3?[2,3,4,5,1]:g===4?[4,5,6,7,8]:[8,10,12,15,20]).map((n,i)=>({text:i%2?'¿Cuántos puntos hay?':'Cuenta los objetos.',visual:{type:'dots',num:n},choices:[String(n),String(Math.max(1,n-1)),String(n+1)].sort((a,b)=>a.localeCompare(b)),correct:String(n),voice:`Cuenta los puntos. ¿Cuántos hay?` }));
    if(id==='vowels')return ['A','E','I','O','U'].map(l=>({text:`Busca la vocal «${l}».`,visual:{type:'listening'},choices:['A','E','I','O','U'],correct:l,voice:`¿Dónde está la vocal ${l}?`}));
    if(id==='letters')return [{word:'mesa',letter:'M',v:'learn'},{word:'sol',letter:'S',v:'idea'},{word:'pato',letter:'P',v:'animals'},{word:'luna',letter:'L',v:'star'},{word:'casa',letter:'C',v:'adapt'}].map((o,i)=>({text:`¿Con qué letra empieza «${o.word}»?`,visual:{type:'word',value:o.word},choices:[o.letter,['M','S','P','L','C'][(i+1)%5],['M','S','P','L','C'][(i+2)%5]],correct:o.letter,voice:`Escucha: ${o.word}. ¿Con qué letra empieza?`}));
    if(id==='syllables')return [{word:'mesa',correct:'ME',choices:['MA','ME','MI']},{word:'pato',correct:'PA',choices:['PA','PE','PI']},{word:'luna',correct:'LU',choices:['LA','LU','LO']},{word:'casa',correct:'CA',choices:['CU','CO','CA']},{word:'sopa',correct:'SO',choices:['SA','SU','SO']}].map(o=>({text:`¿Qué sílaba escuchas al principio de «${o.word}»?`,visual:{type:'word',value:o.word},choices:o.choices,correct:o.correct,voice:`Escucha la palabra: ${o.word}. ¿Cuál es su primera sílaba?`}));
    if(id==='english')return [
      {text:'Listen: cat. ¿Cuál es el gato?',choices:['cat','dog','bird'],correct:'cat',visual:{type:'listening'},voice:'cat',lang:'en-US',pictures:true},
      {text:'Listen: dog. ¿Cuál es el perro?',choices:['bird','dog','rabbit'],correct:'dog',visual:{type:'listening'},voice:'dog',lang:'en-US',pictures:true},
      {text:'Listen: bird. ¿Cuál es el pájaro?',choices:['bird','cat','dog'],correct:'bird',visual:{type:'listening'},voice:'bird',lang:'en-US',pictures:true},
      {text:'Listen: yellow. ¿Cuál es el amarillo?',choices:['yellow','purple','orange'],correct:'yellow',visual:{type:'listening'},voice:'yellow',lang:'en-US'},
      {text:'Listen: two. ¿Cuál es el número 2?',choices:['1','2','3'],correct:'2',visual:{type:'listening'},voice:'two',lang:'en-US'},
      {text:'Listen: nose. ¿Dónde está la nariz? Elige la palabra.',choices:['hand','nose','foot'],correct:'nose',visual:{type:'listening'},voice:'nose',lang:'en-US'}
    ];
    if(id==='colors')return [
      {text:'Encuentra el naranja.',visual:{type:'shape',value:'circle'},choices:['naranja','morado','amarillo'],correct:'naranja',colors:true},
      {text:'Encuentra el morado.',visual:{type:'shape',value:'square'},choices:['verde','morado','amarillo'],correct:'morado',colors:true},
      {text:'¿Cuál es el triángulo?',visual:{type:'shape',value:'triangle'},choices:['círculo','cuadrado','triángulo'],correct:'triángulo',shapes:true},
      {text:'¿Cuál es el círculo?',visual:{type:'shape',value:'circle'},choices:['círculo','triángulo','cuadrado'],correct:'círculo',shapes:true},
      {text:'Encuentra el amarillo.',visual:{type:'shape',value:'square'},choices:['amarillo','naranja','verde'],correct:'amarillo',colors:true}
    ];
    return [];
  }
  const swatches={naranja:'#FF7A00',morado:'#6A3DFF',amarillo:'#FFB400',verde:'#34C759',purple:'#6A3DFF',yellow:'#FFB400',orange:'#FF7A00'};
  const shapeMap={círculo:'circle',cuadrado:'square',triángulo:'triangle'};
  function choiceVisual(q,word){
    if(q.pictures)return animalSVG(word);
    if(q.colors)return `<span class="choice-color" style="background:${swatches[word]||'#FFB400'}" aria-hidden="true"></span>`;
    if(q.shapes)return `<span class="mini-shape shape-${shapeMap[word]||'circle'}"></span>`;
    if(q.lang&&swatches[word])return `<span class="choice-color" style="background:${swatches[word]}"></span>`;
    return '';
  }
  function gameContent(){if(!S.game.id)return '';
    const id=S.game.id,arr=questionSet(id),i=Math.min(S.game.step,arr.length-1),q=arr[i];
    if(S.game.win)return `<div class="game-play complete-game"><img src="${asset('trophy')}" alt="Trofeo de Kibu"><h3>¡${name()?safeName()+', excelente trabajo!':'Excelente trabajo!'}</h3><p>Practicaste ${esc(GAMES[id].label.toLowerCase())} a tu ritmo. ¡Cada intento cuenta!</p><button class="btn" data-act="gameRestart">Jugar de nuevo</button><button class="btn ghost" data-act="gameExit">Elegir otro juego</button></div>`;
    return `<div class="game-play" aria-live="polite"><div class="game-progress-top"><b>${esc(GAMES[id].label)}</b><span>${i+1} de ${arr.length}</span></div><div class="prog"><i style="width:${(i+1)/arr.length*100}%"></i></div><div class="game-question"><h3>${esc(q.text)}</h3>${visualHTML(q)}</div>
      <button class="btn ghost sound-question" data-act="gameListen">${ic('speaker',19)} Escuchar la pregunta</button>
      <div class="game-choices">${q.choices.map(c=>`<button class="game-answer" data-act="gameAnswer" data-v="${esc(c)}">${choiceVisual(q,c)}<span>${esc(c)}</span></button>`).join('')}</div>
      <div class="game-feedback" role="status">${esc(S.game.feedback||'Puedes intentarlo las veces que quieras.')}</div>
      <button class="btn ghost" data-act="gameExit">Volver a los juegos</button></div>`;
  }
  let videoDisclaimerShown=ld('video_notice',false);
  V.learn=()=>`${tb('home','Aprender')}${say('estudiando',`¡Vamos a explorar juntos${name()?', '+safeName():''}! Escucha, observa y aprende sin prisas.`)}
    <section class="learn-intro"><img src="${asset('animals')}" alt="Animales para aprender idiomas"><div><h3>Pequeños juegos, grandes descubrimientos</h3><p>Juegos táctiles de preescolar. Sin cronómetro, sin perder vidas y con estrellas por cada intento logrado.</p></div></section>
    <div class="learning-grid">${Object.entries(GAMES).map(([id,g])=>`<button class="learning-card ${S.game.id===id?'on':''}" data-act="gameSelect" data-v="${id}"><img src="${asset(g.asset)}" alt=""><span><b>${esc(g.label)}</b><small>${esc(g.desc)}</small></span></button>`).join('')}</div>
    ${gameContent()}
    <section class="card video-panel"><h3>Videos educativos <span class="small-info">${ic('info',17)}</span></h3><p>Busca temas para aprender con supervisión adulta.</p>${!videoDisclaimerShown?'<p class="video-note">YouTube es externo. Un adulto debe revisar el contenido antes de mostrarlo a un menor.</p>':''}
    <div class="chips">${TOPICS.map(t=>`<button class="chip" data-act="videos" data-v="${esc(t[0])}">${esc(t[1])}</button>`).join('')}</div><p class="hint" id="videoStatus">${esc(videoStatus)}</p><div id="videoResults">${renderVideos()}</div></section>
    <button class="btn o" data-act="open" data-v="ideas">${ic('bulb',20)} Crear una actividad sin foto</button>`;
  ACT.gameSelect=e=>{S.game={id:e.dataset.v,step:0,feedback:'',win:false};render();document.querySelector('.game-play')?.scrollIntoView({block:'start',behavior:'smooth'})};
  ACT.gameExit=()=>{S.game={id:'',step:0,feedback:'',win:false};render()};
  ACT.gameRestart=()=>{S.game.step=0;S.game.feedback='';S.game.win=false;render()};
  ACT.gameListen=()=>{if(!S.game.id)return;const q=questionSet(S.game.id)[S.game.step];speak(q.voice||q.text,q.lang||'es-PA')};
  ACT.gameAnswer=e=>{if(!S.game.id||S.game.win)return;
    const q=questionSet(S.game.id)[S.game.step],guess=e.dataset.v;
    if(guess!==q.correct){S.game.feedback=['¡Buen intento! Mira las opciones y prueba otra vez.','Podemos intentarlo de nuevo, sin prisa.','Escucha y observa una vez más. ¡Tú puedes!'][S.gameProgress[S.game.id]%3];render();document.querySelector('.game-play')?.scrollIntoView({block:'start'});return;}
    const old=S.stars;S.stars+=1;sv('stars',S.stars);S.gameProgress[S.game.id]=(S.gameProgress[S.game.id]||0)+1;sv('games',S.gameProgress);
    const awarded=STK.filter(k=>k[1]>old&&k[1]<=S.stars).pop();if(awarded)S.newStk=awarded[0];
    const arr=questionSet(S.game.id);
    if(S.game.step>=arr.length-1){S.game.win=true;confetti();if(S.voice)speak(`¡Lo hiciste muy bien${name()?', '+name():''}!`);}
    else {S.game.step++;S.game.feedback='¡Excelente! Ganaste una estrella. Vamos con otra.';if(S.voice)speak('¡Excelente! Sigamos jugando.');}
    render();document.querySelector('.game-play')?.scrollIntoView({block:'start'});if(awarded)showStickerToast(awarded[0]);
  };
  function showStickerToast(key){const el=document.createElement('div');el.className='earned-sticker';el.setAttribute('role','status');el.innerHTML=`<img src="${esc(IMG[key]||asset('star'))}" alt=""><div><b>¡Sticker desbloqueado!</b><span>¡Buen trabajo!</span></div>`;document.body.appendChild(el);setTimeout(()=>el.remove(),3500);}
  const oldVideos=window.loadVideos;
  window.loadVideos=async topic=>{videoStatus='Buscando videos educativos…';videoItems=[];render();try{
      if(location.protocol==='file:')throw Error('Local');
      const r=await fetch('/api/videos?q='+encodeURIComponent(topic));if(!r.ok)throw Error('API');const data=await r.json();
      if(!data.configured||!Array.isArray(data.videos)||!data.videos.length)throw Error('Sin API');
      videoItems=data.videos;videoStatus=`Resultados para «${topic}» · revisa cada video antes de reproducirlo.`;
    }catch(_e){videoItems=[{title:'Buscar «'+topic+'» en YouTube',channel:'Búsqueda externa, no verificada por Kibu',url:'https://www.youtube.com/results?search_query='+encodeURIComponent(topic+' educativo preescolar')}];videoStatus='Se abrirá una búsqueda externa supervisada por un adulto.';}
    render();
  };
  // Se informa sobre el sitio externo justo cuando se solicita abrirlo.
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href*="youtube.com"]');if(!a)return;
    if(!confirm('Abrirás YouTube, un servicio externo. Un adulto debe revisar el contenido antes de que un niño lo vea. ¿Continuar?')){e.preventDefault();return;}
    videoDisclaimerShown=true;sv('video_notice',true);
  },true);
  // Nombre opcional persistido; no se almacena el chat del niño.
  document.addEventListener('input',e=>{
    if(['kidName','profileKidName'].includes(e.target.id)){
      S.prof.name=e.target.value.slice(0,28);sv('prof',S.prof);
    }
  });
  // Evita continuar onboarding con el foco abierto o cierres bruscos.
  const oldNext=ACT.onext;
  ACT.onext=()=>{const input=$('#kidName');if(input){S.prof.name=input.value.slice(0,28);sv('prof',S.prof);}oldNext()};
  // Restaurar opción de voz o detener de forma accesible.
  if(!('SpeechRecognition' in window)&&!('webkitSpeechRecognition' in window)){
    // Se mantiene el campo de texto accesible; el botón mic aparece solo si está soportado.
  }
  // Actualizar la pantalla inicial después de cargar los ajustes.
  render();
})();
