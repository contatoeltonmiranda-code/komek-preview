/* KOMEK — JS compartilhado (menu, dropdowns, scroll reveal, filtro de catalogo) */
(function(){
  'use strict';

  // ---- Header shadow no scroll ----
  var header=document.getElementById('header');
  function onScroll(){if(!header)return;header.classList.toggle('scrolled',window.pageYOffset>10);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // ---- Menu mobile + dropdowns ----
  var burger=document.getElementById('burger');
  var menu=document.getElementById('navMenu');
  if(burger&&menu){
    burger.addEventListener('click',function(){
      var open=menu.classList.toggle('open');
      burger.classList.toggle('open',open);
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        if(!a.parentElement.classList.contains('has-drop')||window.innerWidth>960){
          menu.classList.remove('open');burger.classList.remove('open');
        }
      });
    });
    menu.querySelectorAll('.has-drop > a').forEach(function(a){
      a.addEventListener('click',function(e){
        if(window.innerWidth<=960){
          e.preventDefault();
          a.parentElement.classList.toggle('open-sub');
        }
      });
    });
  }

  // ---- Marca item ativo do menu pela pagina atual ----
  if(menu){
    var path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    if(path==='')path='index.html';
    menu.querySelectorAll('a[href]').forEach(function(a){
      var href=(a.getAttribute('href')||'').toLowerCase();
      if(href&&href.indexOf('http')!==0&&href.indexOf('#')!==0){
        var file=href.split('/').pop();
        if(file===path){
          if(a.classList.contains('is-cta'))return;
          var top=a.closest('.nav-menu > li');
          if(top){var topA=top.querySelector(':scope > a');if(topA)topA.classList.add('active');}
        }
      }
    });
  }

  // ---- Scroll reveal ----
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var targets=document.querySelectorAll('.sec-head,.diff-card,.about-img,.about-text,.serv-card,.prod-card,.why-item,.seg-card,.logo-card,.tst-card,.stat,.cta-band .wrap,.cat-item,.list-item,.prose,.svc-list li,.svc-item,.svc-aside,.form-card,.info-card,.qc-item');
  if(reduce||!('IntersectionObserver' in window)){
    targets.forEach(function(el){el.classList.add('sr-visible');});
  }else{
    targets.forEach(function(el){el.classList.add('sr-hidden');});
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var el=entry.target;
          var sibs=el.parentElement?Array.from(el.parentElement.children).filter(function(c){return c.classList.contains('sr-hidden')}):[];
          var idx=sibs.indexOf(el);
          setTimeout(function(){el.classList.add('sr-visible');},Math.max(0,idx)*70);
          io.unobserve(el);
        }
      });
    },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    targets.forEach(function(el){io.observe(el);});
  }

  // ---- Filtro + busca do catalogo (pagina produtos.html) ----
  var catGrid=document.getElementById('catalogGrid');
  if(catGrid){
    var items=Array.prototype.slice.call(catGrid.querySelectorAll('.cat-item'));
    var chips=Array.prototype.slice.call(document.querySelectorAll('.chip-btn'));
    var search=document.getElementById('catalogSearch');
    var empty=document.getElementById('catalogEmpty');
    var activeCat='todos';

    function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');}

    function apply(){
      var q=norm(search?search.value:'');
      var visible=0;
      items.forEach(function(it){
        var cat=(it.getAttribute('data-cat')||'').toLowerCase();
        var name=norm(it.getAttribute('data-name'));
        var okCat=activeCat==='todos'||cat===activeCat;
        var okQ=!q||name.indexOf(q)>-1;
        var show=okCat&&okQ;
        it.style.display=show?'':'none';
        if(show)visible++;
      });
      if(empty)empty.style.display=visible===0?'':'none';
    }

    chips.forEach(function(c){
      c.addEventListener('click',function(){
        chips.forEach(function(x){x.classList.remove('active');});
        c.classList.add('active');
        activeCat=(c.getAttribute('data-cat')||'todos').toLowerCase();
        apply();
      });
    });
    if(search)search.addEventListener('input',apply);
    apply();
  }
})();
