(function(){

  var WA_NUMBER = '5491138608235'; // 15 3860 8235 (AR, CABA/GBA) en formato wa.me

  /* ============================================================
     DATOS DEL CUESTIONARIO
     ============================================================ */
  var ACCENT_CYCLE = ['#6C4CE0','#E14434','#25D366','#6C4CE0','#E14434','#25D366'];

  var QUESTIONS = [
    {
      code:'Redes sociales',
      title:'¿Tienen cuenta activa de Instagram/Redes y qué nivel de publicación buscan realizar?',
      options:[
        { pts:1, text:'Sí/No. Queremos publicar poco (1 a 2 posteos estáticos o placas simples por semana).' },
        { pts:2, text:'Sí. Queremos movimiento constante (3 a 5 publicaciones semanales combinando posteos e historias).' },
        { pts:3, text:'Sí. Queremos presencia intensiva (publicaciones diarias, Reels editados, placas y dinamismo total).' }
      ]
    },
    {
      code:'Video y audio',
      title:'¿Necesitan producción de video (Reels/TikTok) y edición musical/audio?',
      options:[
        { pts:1, text:'No necesitamos videos ni edición de audio por el momento.' },
        { pts:2, text:'Sí, videos cortos simples y música de librería/tendencia (hasta 2 por semana).' },
        { pts:3, text:'Sí, edición de video compleja, guion audiovisual y musicalización/audio a medida.' }
      ]
    },
    {
      code:'Página web',
      title:'¿Cuál es la situación actual de su página web?',
      options:[
        { pts:1, text:'No tenemos, o solo necesitamos una presencia básica (Linktree, landing simple de 1 sección).' },
        { pts:2, text:'Tenemos o queremos un sitio institucional completo, o catálogo de productos/servicios.' },
        { pts:3, text:'Queremos un desarrollo más complejo (e-commerce completo, integraciones, plataforma a medida).' }
      ]
    },
    {
      code:'Aplicaciones de marca',
      title:'¿En cuántos soportes físicos/digitales aplica o imprime la marca su logo?',
      options:[
        { pts:1, text:'Pocos (solo foto de perfil, un par de impresos o tarjetas digitales).' },
        { pts:2, text:'Moderado (packaging, papelería, marquesinas, uniformes, placas digitales).' },
        { pts:3, text:'Muchos (submarcas, rotulación, eventos, stands, merchandising y piezas institucionales continuas).' }
      ]
    },
    {
      code:'Urgencias',
      title:'¿Con qué frecuencia surgen urgencias o pedidos "para ayer" en su empresa?',
      options:[
        { pts:1, text:'Casi nunca. Planificamos con tiempo y podemos esperar la entrega semanal.' },
        { pts:2, text:'A veces (hasta 2 urgencias semanales de un día para el otro).' },
        { pts:3, text:'Todo el tiempo. La empresa exige respuesta inmediata el mismo día o el hábil siguiente.' }
      ]
    },
    {
      code:'Consultoría',
      title:'¿Requieren acompañamiento estratégico, capacitaciones o reuniones de consultoría?',
      options:[
        { pts:1, text:'No, solo requerimos que nos entreguen los diseños solicitados.' },
        { pts:2, text:'Queremos que nos ayuden a armar y organizar el plan de publicación y piezas.' },
        { pts:3, text:'Sí: consultoría estratégica en proyectos externos, capacitaciones para el equipo y reuniones continuas.' }
      ]
    }
  ];

  var PLANS = {
    basico:  { key:'basico',  name:'Plan Básico',  eurMonth:200, arsMonth:340000,  eurWeek:46,  arsWeek:78500,
      summary:'Ideal para proyectos que requieren un flujo constante pero planificado de piezas gráficas simples y mantenimiento básico.' },
    medio:   { key:'medio',   name:'Plan Medio',   eurMonth:400, arsMonth:680000,  eurWeek:92,  arsWeek:157000,
      summary:'Pensado para marcas activas que necesitan producción de video corto, dinamismo en redes y resolución rápida de urgencias.' },
    superior:{ key:'superior',name:'Plan Superior', eurMonth:800, arsMonth:1360000, eurWeek:185, arsWeek:314000,
      summary:'Solución integral para empresas que buscan acompañamiento estratégico, consultoría externa, urgencias ilimitadas y máxima prioridad.' }
  };

  // Matriz de features por categoría (mismas 6 categorías del test), con
  // el valor concreto que ofrece cada plan — usada tanto en "Ver plan"
  // como en "Comparar planes".
  var FEATURES = [
    { cat:'Redes sociales', basico:{ok:true,  text:'1 a 2 piezas gráficas por semana'},
                             medio:{ok:true,  text:'3 a 5 publicaciones semanales (posteos + historias)'},
                             superior:{ok:true, text:'Publicación diaria + Reels editados'} },
    { cat:'Video y audio',  basico:{ok:false, text:'No incluye producción de video'},
                             medio:{ok:true,  text:'Videos cortos + música de tendencia (hasta 2/semana)'},
                             superior:{ok:true, text:'Edición compleja, guion audiovisual y música a medida'} },
    { cat:'Página web',     basico:{ok:true,  text:'Presencia básica (landing de 1 sección)'},
                             medio:{ok:true,  text:'Sitio institucional completo o catálogo'},
                             superior:{ok:true, text:'Desarrollo a medida (e-commerce, integraciones)'} },
    { cat:'Aplicaciones de marca', basico:{ok:true, text:'Piezas básicas (perfil, impresos simples)'},
                             medio:{ok:true,  text:'Packaging, papelería, uniformes, placas digitales'},
                             superior:{ok:true, text:'Submarcas, eventos, stands y merchandising'} },
    { cat:'Urgencias',      basico:{ok:false, text:'Sin urgencias — entregas semanales planificadas'},
                             medio:{ok:true,  text:'Hasta 2 urgencias semanales de un día para el otro'},
                             superior:{ok:true, text:'Urgencias ilimitadas, respuesta el mismo día'} },
    { cat:'Consultoría',    basico:{ok:false, text:'Solo entrega de los diseños solicitados'},
                             medio:{ok:true,  text:'Ayuda a organizar el plan de publicación'},
                             superior:{ok:true, text:'Consultoría estratégica, capacitaciones y reuniones continuas'} }
  ];

  function planFor(score){
    if (score <= 10) return PLANS.basico;
    if (score <= 14) return PLANS.medio;
    return PLANS.superior;
  }

  function fmtInt(n){ return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

  function waLink(msg){ return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg); }

  // Arma el detalle "categoría: respuesta elegida" para cada una de las
  // 6 preguntas, usando las respuestas guardadas en state.answers.
  function answersBreakdown(){
    return QUESTIONS.map(function(q, i){
      var pts = state.answers[i];
      var opt = q.options.find(function(o){ return o.pts === pts; });
      var text = opt ? opt.text : '(sin responder)';
      return (i+1) + '. ' + q.code + ': ' + text;
    }).join('\n');
  }

  var iconYes = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5 10 17 19 7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var iconNo  = '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

  /* ============================================================
     ESTADO Y REFERENCIAS DOM
     ============================================================ */
  var state = { current:0, answers:new Array(QUESTIONS.length).fill(null), lastScore:0, lastPlan:null };

  var elProgress      = document.getElementById('progress');
  var elProgressLabel = document.getElementById('progressLabel');
  var elPanel         = document.getElementById('panel');
  var elBtnPrev       = document.getElementById('btnPrev');
  var elBtnNext       = document.getElementById('btnNext');

  var viewQuiz    = document.getElementById('viewQuiz');
  var viewResult  = document.getElementById('viewResult');
  var viewDetail  = document.getElementById('viewDetail');
  var viewCompare = document.getElementById('viewCompare');

  function switchView(hide, show){
    hide.classList.add('hidden');
    show.classList.remove('hidden');
    show.classList.remove('fade-in');
    void show.offsetWidth;
    show.classList.add('fade-in');
  }

  /* ---------------- Progreso ---------------- */
  function renderProgress(popIndex){
    elProgress.innerHTML = '';
    for (var i=0; i<QUESTIONS.length; i++){
      var dot = document.createElement('div');
      dot.className = 'dot-step';
      var answered = state.answers[i] !== null;
      if (answered){
        dot.classList.add('filled');
        if (i === popIndex) dot.classList.add('pop');
      }
      if (i === state.current) dot.classList.add('current');
      elProgress.appendChild(dot);
    }
    elProgressLabel.textContent = 'Pregunta ' + (state.current+1) + ' de ' + QUESTIONS.length;
  }

  /* ---------------- Panel de pregunta ---------------- */
  function panelHTML(qIndex){
    var q = QUESTIONS[qIndex];
    var accent = ACCENT_CYCLE[qIndex];
    var html = '';
    html += '<div class="eyebrow" style="--accent:'+accent+'"><span class="dot"></span>' + q.code + '</div>';
    html += '<h2 class="q-title">' + q.title + '</h2>';
    html += '<div class="options" role="radiogroup" aria-label="'+q.title.replace(/"/g,'&quot;')+'">';
    q.options.forEach(function(opt,i){
      var id = 'q'+qIndex+'_o'+i;
      var checked = state.answers[qIndex] === opt.pts ? 'checked' : '';
      var ptsLabel = opt.pts === 1 ? '1 PTO' : opt.pts + ' PTS';
      html += '<label class="option" for="'+id+'">' +
                '<input type="radio" id="'+id+'" name="q'+qIndex+'" value="'+opt.pts+'" '+checked+'>' +
                '<span class="card-opt" style="--accent:'+accent+'">' +
                  '<span class="check" aria-hidden="true"></span>' +
                  '<span class="txt">'+opt.text+'</span>' +
                  '<span class="pts">'+ptsLabel+'</span>' +
                '</span>' +
              '</label>';
    });
    html += '</div>';
    return html;
  }

  function renderPanel(dir, popIndex){
    if (dir){
      elPanel.classList.remove('enter');
      elPanel.classList.add(dir === 'next' ? 'leave-next' : 'leave-prev');
      window.setTimeout(function(){
        fillPanel(popIndex);
        elPanel.classList.remove('leave-next','leave-prev');
        void elPanel.offsetWidth;
        elPanel.classList.add('enter');
      }, 190);
    } else {
      fillPanel(popIndex);
    }
  }

  function fillPanel(popIndex){
    elPanel.innerHTML = panelHTML(state.current);
    renderProgress(popIndex);
    bindOptionEvents();
    updateNav();
  }

  function bindOptionEvents(){
    var inputs = elPanel.querySelectorAll('input[type=radio]');
    inputs.forEach(function(inp){
      inp.addEventListener('change', function(){
        state.answers[state.current] = parseInt(inp.value, 10);
        renderProgress(state.current);
        updateNav();
      });
    });
  }

  function updateNav(){
    elBtnPrev.disabled = state.current === 0;
    var answered = state.answers[state.current] !== null;
    elBtnNext.disabled = !answered;
    elBtnNext.textContent = (state.current === QUESTIONS.length - 1) ? 'Ver mi presupuesto' : 'Siguiente';
  }

  elBtnNext.addEventListener('click', function(){
    if (state.answers[state.current] === null) return;
    if (state.current === QUESTIONS.length - 1){
      showResult();
    } else {
      state.current++;
      renderPanel('next', null);
    }
  });
  elBtnPrev.addEventListener('click', function(){
    if (state.current === 0) return;
    state.current--;
    renderPanel('prev', null);
  });

  /* ---------------- Resultado ---------------- */
  function showResult(){
    var total = state.answers.reduce(function(a,b){ return a + (b||0); }, 0);
    var plan = planFor(total);
    state.lastScore = total;
    state.lastPlan  = plan;

    document.getElementById('resultPlanName').textContent = plan.name;
    document.getElementById('resultPriceEur').innerHTML = plan.eurMonth + ' <span>€/mes</span>';
    document.getElementById('resultPriceArs').textContent = '$ ' + fmtInt(plan.arsMonth) + ' ARS/mes';
    document.getElementById('resultPriceWeek').textContent =
      '≈ ' + plan.eurWeek + ' €/semana · $ ' + fmtInt(plan.arsWeek) + ' ARS/semana';
    document.getElementById('resultSummary').textContent = plan.summary;
    document.getElementById('resultScore').textContent = total;

    var msg = 'Hola! Quiero una consulta detallada. Hice el cotizador de Mi Oficina de Diseño y el resultado fue ' +
      plan.name + ' (puntaje ' + total + '/18).\n\nEstas fueron mis respuestas:\n' + answersBreakdown() +
      '\n\nMe gustaría coordinar los próximos pasos para suscribirme.';
    document.getElementById('ctaWhatsapp').href = waLink(msg);

    switchView(viewQuiz, viewResult);
  }

  /* ---------------- Detalle del plan ---------------- */
  function showDetail(){
    var plan = state.lastPlan;
    document.getElementById('detailPlanName').textContent = plan.name;
    document.getElementById('detailPrice').innerHTML =
      plan.eurMonth + ' €/mes <span class="ars">· $ ' + fmtInt(plan.arsMonth) + ' ARS/mes</span>';

    var list = document.getElementById('featureList');
    list.innerHTML = '';
    FEATURES.forEach(function(row){
      var cell = row[plan.key];
      var li = document.createElement('li');
      li.innerHTML =
        '<span class="f-icon '+(cell.ok?'yes':'no')+'">'+(cell.ok?iconYes:iconNo)+'</span>' +
        '<span class="f-body"><b>'+row.cat+'</b><span>'+cell.text+'</span></span>';
      list.appendChild(li);
    });

    var msg = 'Hola! Quiero avanzar con el ' + plan.name + ' de Mi Oficina de Diseño (puntaje ' + state.lastScore + '/18).' +
      '\n\nEstas fueron mis respuestas en el cotizador:\n' + answersBreakdown() +
      '\n\n¿Podemos coordinar una consulta detallada?';
    document.getElementById('ctaWhatsapp2').href = waLink(msg);

    switchView(viewResult, viewDetail);
  }

  /* ---------------- Comparar planes ---------------- */
  function showCompare(){
    var recoKey = state.lastPlan.key;
    var order = ['basico','medio','superior'];

    var thead = '<thead><tr><th class="label"></th>';
    order.forEach(function(k){
      var p = PLANS[k];
      var isReco = k === recoKey;
      thead += '<th class="'+(isReco?'reco':'')+'">' +
                 (isReco ? '<span class="reco-badge">Recomendado</span><br>' : '') +
                 p.name.replace('Plan ','') +
                 '<span class="plan-price">'+p.eurMonth+' €/mes</span>' +
               '</th>';
    });
    thead += '</tr></thead>';

    var tbody = '<tbody>';
    FEATURES.forEach(function(row){
      tbody += '<tr><td class="label">'+row.cat+'</td>';
      order.forEach(function(k){
        var cell = row[k];
        var isReco = k === recoKey;
        tbody += '<td class="'+(isReco?'reco':'')+'"><span class="cell-inner">' +
                    '<span class="f-icon '+(cell.ok?'yes':'no')+'">'+(cell.ok?iconYes:iconNo)+'</span>' +
                    '<span>'+cell.text+'</span>' +
                  '</span></td>';
      });
      tbody += '</tr>';
    });
    tbody += '</tbody>';

    document.getElementById('compareTable').innerHTML = thead + tbody;

    var msg = 'Hola! Quiero una consulta detallada para elegir el plan de suscripción de Mi Oficina de Diseño. ' +
      'El cotizador me recomendó ' + state.lastPlan.name + ' (puntaje ' + state.lastScore + '/18).' +
      '\n\nEstas fueron mis respuestas:\n' + answersBreakdown();
    document.getElementById('ctaWhatsapp3').href = waLink(msg);

    switchView(viewResult, viewCompare);
  }

  function restart(){
    state.current = 0;
    state.answers = new Array(QUESTIONS.length).fill(null);
    renderPanel(null, null);
    switchView(viewResult, viewQuiz);
  }

  document.getElementById('btnVerPlan').addEventListener('click', showDetail);
  document.getElementById('btnComparar').addEventListener('click', showCompare);
  document.getElementById('backFromDetail').addEventListener('click', function(){ switchView(viewDetail, viewResult); });
  document.getElementById('backFromCompare').addEventListener('click', function(){ switchView(viewCompare, viewResult); });
  document.getElementById('btnRestart').addEventListener('click', restart);

  /* ---------------- Init ---------------- */
  renderPanel(null, null);


})();
