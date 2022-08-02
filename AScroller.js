// Copyright © 2021 Dmitry Y. Lepikhin. All rights reserved.

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.addEventListener( 'load', function(e){

  var scrollers = [].slice.call(document.getElementsByClassName('AScroller'));
  if( !scrollers.length )return;
  
  var touches = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  var AScrollerBoxMax, keyArrows, AScrollerBox, curElementBX;

  HTMLElement.__proto__.cssScroller = HTMLElement.prototype.cssScroller = Array.prototype.cssScroller = HTMLCollection.prototype.cssScroller = function cssScroller(styles){

      var arr = this;
        if ( this.length == undefined  )arr = [this];
        for(var i = 0; i < arr.length; i++){
          var elStyle = arr[i].style;
            for(var key in styles ){
                keyCss = key.replace(/-(\w)/gim, function(a){return a.replace("-", "").toUpperCase()});
              elStyle[keyCss] = styles[key];
           }
        }
        
    }

  for(var i = 0;i < scrollers.length; i++){
      AScroller ( scrollers[i]);
  }


function AScroller(scroller_in, curElement){
  
  var curElementMini;

  if(!curElement)
    for(var i = 0; i < scroller_in.children.length; i++){
      var el = scroller_in.children[i];
      if(el.tagName !== "IMG")continue;
      var box_flex = document.createElement("DIV");
      box_flex.className = "Ascroller_box_flex";


      scroller_in.insertBefore( box_flex , el );
      box_flex.appendChild( el );
    }
  
  curElement = curElement || scroller_in.children[0];
  init(scroller_in);

  function init(scroller_in){


    var nativeStyleWidth = parseInt( scroller_in.style.width ) || parseInt( scroller_in.style.maxWidth )  || parseInt( window.getComputedStyle(scroller_in).width ) ;
    var nativeStyleHeight = parseInt( scroller_in.style.height ) || parseInt( scroller_in.style.maxHeight ) || parseInt( window.getComputedStyle(scroller_in).height ) ;

    var data_ascroller = scroller_in.getAttribute("data-ascroller");

    if(data_ascroller){

      scroller_in.setAttribute("data-ascroller", "");

      var gallery = data_ascroller.search(/(^|\s+)gallery\b/) !== -1 ? true : false;

      if(gallery)
        var mini_images = data_ascroller.match(/(^|\s+)mini-images(X(\d)+)*\b/i);
      
      var condition = data_ascroller.search(/(^|\s+)condition\b/) !== -1 ? true : false;
      var full = data_ascroller.search(/(^|\s+)full\b/) !== -1 ? true : false;
      var loupe = data_ascroller.search(/(^|\s+)loupe\b/) !== -1 ? true : false;
      var arrows = !touches && data_ascroller.search(/(^|\s+)arrows\b/) !== -1 ? true : false;

    }
    
      var parent = scroller_in.parentElement;  
      var scroller = document.createElement('div'); 
      scroller.className = (scroller_in.parent && "AScrollerBoxMini" ) || "AScrollerBox";

      scroller_in.parentNode.insertBefore( scroller , scroller_in );

      var scroller_area = document.createElement('div');

      scroller_in.scroller_area = scroller_area;

      var transitionDuration = '0.5s';
      var scrollerStyle = scroller_in.style;
      scrollerStyle.oTransitionProperty = scrollerStyle.mozTransitionProperty = scrollerStyle.transitionProperty = scrollerStyle.webkitTransitionProperty = 'transform';
      scrollerStyle.oTransitionDuration = scrollerStyle.mozTransitionDuration = scrollerStyle.transitionDuration = scrollerStyle.webkitTransitionDuration = transitionDuration;
      

      scroller.cssScroller({ 'width' : scroller_in.style.width , 'position':'relative'});

      scroller_area.cssScroller({'overflow':'hidden', 'cursor': 'pointer', 'margin' : 'auto'});

      scroller.appendChild( scroller_area );
      
      scroller_area.appendChild( scroller_in );


      if(condition){

        condition = document.createElement("DIV");
        condition.className = "AScrollerCondition";
        var el_C = document.createElement("DIV");
        condition.appendChild( el_C );
        
        ( scroller_area.nextElementSibling && scroller.insertBefore(condition , scroller_area.nextElementSibling ) ) || scroller.appendChild( condition );

      }

      
      if( full || loupe ){

        function fullBox(e){
          if( moving ) return;
            
            var BoxMax = document.createElement("DIV");
            BoxMax.className = "AScrollerBoxMax";
            var close = document.createElement("DIV");
            close.className = "closeBM";

            if(AScrollerBoxMax && AScrollerBoxMax.parentNode)
              AScrollerBoxMax.remove();
              
            AScrollerBoxMax = BoxMax;

            var overflow = document.documentElement.style.overflow;

            close.addEventListener("click", function(){ 
              document.documentElement.style.overflow = overflow; 
              BoxMax.remove(); 
              AScrollerBoxMax = null; 
              window.removeEventListener("keydown", keyArrows)
            });

            if( keyArrows )
              window.addEventListener("keydown", keyArrows)

            document.body.appendChild(BoxMax);

            var box = document.createElement("DIV");
            box.setAttribute("data-ascroller",  "gallery" + (!touches ? " mini-imagesx5 arrows" : "") + " condition");
            var parent = this.parentNode.children;
            for(var i = 0; i < parent.length; i++){
              if( !parent[i].children[0] || parent[i].children[0].tagName !== "IMG" )continue;
              var el_c = parent[i].cloneNode(true);
              if( this === parent[i] ) var curEl = el_c;
              el_c.removeAttribute("style");
              box.appendChild( el_c );
            }
            
            document.documentElement.style.overflow = "hidden";
            BoxMax.appendChild( close );
            BoxMax.appendChild( box );
            AScrollerBox = box;
            AScroller( box , curEl );
        }

        for(var i = 0; i < scroller_in.children.length; i++){
          var sc = scroller_in.children[i];
          if( full && sc.children[0] && sc.children[0].tagName === "IMG" )
            scroller_in.children[i].addEventListener('click', fullBox);
        }
      }

      if(gallery){

        
        
        if( !touches && mini_images && scroller_in.children.length > 1){
          var d_x = mini_images[3];

          var mini_images = document.createElement("DIV");
          mini_images.className = "AScroller_miniImages";
          mini_images.setAttribute("data-ascroller",  "arrows");
          for (var i = 0; i < scroller_in.children.length; i++){
            if(scroller_in.children[i].children[0].tagName !== "IMG") continue;
            scroller_in.children[i].mini = scroller_in.children[i].cloneNode(true);
            scroller_in.children[i].mini.style = '';
            scroller_in.children[i].mini.big = scroller_in.children[i];
            mini_images.appendChild( scroller_in.children[i].mini );
          }

          if(mini_images.children.length){

            scroller.appendChild( mini_images );
            scroller_in.scroller_area = scroller_area;
            scroller_in.mini = mini_images;
            mini_images.parent = scroller_in;
            mini_images.style.width = d_x > 0 ? ( d_x < i ? d_x : i) * ( parseInt(window.getComputedStyle(mini_images.children[0]).width) ) + "px" : ""; 
            if(condition)mini_images.condition = condition;

            init(mini_images);
          
          }

        }

      }

      if(scroller_in.parent){

        function changeImages(e){
          if( moving || !this.big ) return;
          curElement = this.big;
          curElementMini = this;
          moveScroller(e);
        }

        for (var i = 0; i < scroller_in.children.length; i++){
          if(scroller_in.children[i].children[0].tagName !== "IMG") continue;
          scroller_in.children[i].addEventListener( touches ? "touchstart" : "click", changeImages)
          
        }

      }

      scroller.cssScroller({
        'position':'relative'
      });
            
    
      scroller.ondragstart = scroller.ondrop = scroller.onselectstart = function(){return false;};

      var max = getMax() ;
      var curCSS = curCss();

      if(scroller_in.parent){
        curElementMini = scroller_in.children[0] || null;
      }

      function curCss( style , scroller_ , prev ){

        var styleScrollerIn = style ? ( scroller_ || scroller_in ).style : window.getComputedStyle( ( scroller_ || scroller_in ) );
        var curCSS = 0;
        var elems = scroller_in.children;
        var el_style;

        if(style)
          curCSS =  (styleScrollerIn.transform || styleScrollerIn.mozTransform || styleScrollerIn.oTransform || styleScrollerIn.webkitTransform).match(/translateX\((-*\d+)px\)/);
        else 
          curCSS =  (styleScrollerIn.transform || styleScrollerIn.mozTransform || styleScrollerIn.oTransform || styleScrollerIn.webkitTransform).split(', ');


        if( curCSS && (curCSS = parseInt( style ? curCSS[1] : curCSS[4])) ) 
            if(prev && curCSS)
              for(var i = 0;i < elems.length; i++){
                if( (el_style = window.getComputedStyle( elems[i] )) && elems[i].offsetLeft - parseInt(el_style.marginLeft) < (-curCSS) && elems[i].offsetLeft + parseInt(el_style.marginLeft) + parseInt(el_style.marginRight) + parseInt(el_style.width) > (-curCSS))
                  {return - ( elems[i].offsetLeft + parseInt(el_style.marginLeft) + parseInt(el_style.marginRight) + parseInt(el_style.width))}
              }
            
        return curCSS||0;

      }

    
        if( arrows ){

          scroller_in.arrow_prev = document.createElement('div'); scroller_in.arrow_prev.setAttribute('class', 'arrows prev');
          scroller_in.arrow_next = document.createElement('div'); scroller_in.arrow_next.setAttribute('class', 'arrows next');

          scroller.appendChild(scroller_in.arrow_prev);
          scroller.appendChild(scroller_in.arrow_next);

          if( scroller_in.mini || !scroller_in.parent ){
            scroller_in.arrow_next.innerHTML = '    <svg width="19" height="16" viewBox="0 0 19 16">    <path d="M18.7071 8.70711C19.0976 8.31658 19.0976 7.68342 18.7071 7.29289L12.3431 0.928932C11.9526 0.538408 11.3195 0.538408 10.9289 0.928932C10.5384 1.31946 10.5384 1.95262 10.9289 2.34315L16.5858 8L10.9289 13.6569C10.5384 14.0474 10.5384 14.6805 10.9289 15.0711C11.3195 15.4616 11.9526 15.4616 12.3431 15.0711L18.7071 8.70711ZM0 9H18V7H0V9Z" />    </svg>    ';
            scroller_in.arrow_prev.innerHTML = '    <svg width="19" height="16" viewBox="0 0 19 16"">    <path transform="rotate(-180 9.499987602233887,8.000007629394531) " d="m18.7071,8.70711c0.3905,-0.39053 0.3905,-1.02369 0,-1.41422l-6.364,-6.36396c-0.3905,-0.39052 -1.0236,-0.39052 -1.4142,0c-0.3905,0.39053 -0.3905,1.02369 0,1.41422l5.6569,5.65685l-5.6569,5.6569c-0.3905,0.3905 -0.3905,1.0236 0,1.4142c0.3906,0.3905 1.0237,0.3905 1.4142,0l6.364,-6.36399zm-18.7071,0.29289l18,0l0,-2l-18,0l0,2z" />    </svg>    ';
          }else if( scroller_in.parent ){
            scroller_in.arrow_next.innerHTML = '    <svg width="19" height="16" viewBox="4 0 19 16">    <path d="M 18.7071 8.7071 C 19.0976 8.3166 19.0976 7.6834 18.7071 7.2929 L 12.3431 0.9289 C 11.9526 0.5384 11.3195 0.5384 10.9289 0.9289 C 10.5384 1.3195 10.5384 1.9526 10.9289 2.3432 L 16.5858 8 L 10.9289 13.6569 C 10.5384 14.0474 10.5384 14.6805 10.9289 15.0711 C 11.3195 15.4616 11.9526 15.4616 12.3431 15.0711 L 18.7071 8.7071 Z Z" />    </svg>    ';
            scroller_in.arrow_prev.innerHTML = '    <svg width="19" height="16" viewBox="-4 0 19 16"">    <path transform="rotate(-180 9.499987602233887,8.000007629394531) " d="M 18.7071 8.7071 C 19.0976 8.3166 19.0976 7.6834 18.7071 7.2929 L 12.3431 0.9289 C 11.9526 0.5384 11.3195 0.5384 10.9289 0.9289 C 10.5384 1.3195 10.5384 1.9526 10.9289 2.3432 L 16.5858 8 L 10.9289 13.6569 C 10.5384 14.0474 10.5384 14.6805 10.9289 15.0711 C 11.3195 15.4616 11.9526 15.4616 12.3431 15.0711 L 18.7071 8.7071 Z Z" />    </svg>    ';
          }

          scroller_in.arrow_prev.ondragstart = scroller_in.arrow_prev.ondrop = scroller_in.arrow_prev.onselectstart = function(){return false;};
          scroller_in.arrow_next.ondragstart = scroller_in.arrow_next.ondrop = scroller_in.arrow_next.onselectstart = function(){return false;};

        }

        function resize(){

          var sc_i;
          
          scroller_in.children.cssScroller({ 'width' : '' , 'min-width' : '', 'max-width' : '' , 'max-height' : '' , 'heigth' : '' , "padding-left":"","padding-right":"","padding-top":"","padding-bottom":""});
          [scroller,scroller_in,scroller_area].cssScroller({'height' : ''});
          scroller_in.cssScroller({'display' : 'block'});

              var width = 0, height = 0;

              for(var i = 0; i < scroller_in.children.length; i++){
                sc_i = scroller_in.children[i]; 
                var get_c = window.getComputedStyle(sc_i);
                sc_i.dim = {};
                var m_l = parseInt( get_c.marginLeft );
                var m_r = parseInt( get_c.marginRight );

                  var width_i = sc_i.offsetWidth + m_l + m_r;
                  if( width_i > width ){
                    width = width_i ;
                  } 

                  var m_t = parseInt( get_c.marginBottom );
                  var m_b = parseInt( get_c.marginTop );

                  var height_i = sc_i.offsetHeight + m_t + m_b;
                if( height_i > height ){
                    height = height_i ;
                  }

                  sc_i.dim.margin = {l: m_l, r: m_r, t: m_t, b: m_b};
                  sc_i.dim.padding = {l: parseInt( get_c.paddingLeft ), r: parseInt( get_c.paddingRight ), t: parseInt( get_c.paddingTop ), b: parseInt( get_c.paddingBottom )};
                
              }

              scroller_in.cssScroller({'display' : 'flex'});

            if( nativeStyleWidth && nativeStyleWidth < width )
              width = nativeStyleWidth;
          
          var parentWidth = parent.offsetWidth - parseInt(window.getComputedStyle(parent).paddingLeft) - parseInt(window.getComputedStyle(parent).paddingRight);

          if( nativeStyleHeight && nativeStyleHeight < height )
            height = nativeStyleHeight;
            
            
          if( width > parentWidth ) width = parentWidth;
            
            if( AScrollerBox === scroller_in ){
              width = window.innerWidth;
              height = window.innerHeight - ( (condition && condition.offsetHeight) || 0 ) - ( (scroller_in.condition && scroller_in.condition.offsetHeight) || 0 ) - (  scroller_in.mini ? scroller_in.mini.condition ? scroller_in.mini.offsetHeight + scroller_in.mini.condition.clientHeight : scroller_in.mini.offsetHeight : 0 );
            } else if( !nativeStyleHeight || gallery ){
              scroller_in.children.cssScroller({'max-width': width + "px", 'max-height': height + "px"})
              height = scroller_area.offsetHeight;
            }

            for(var i = 0; i < scroller_in.children.length; i++){
              sc_i = scroller_in.children[i];  
              var offset_m_w = ( sc_i.dim.margin.l + sc_i.dim.margin.r ) || 0;
              var offset_m_h = ( sc_i.dim.margin.t + sc_i.dim.margin.b ) || 0;
              var offset_p_w = ( sc_i.dim.padding.t + sc_i.dim.padding.b ) || 0;
              var offset_p_h = ( sc_i.dim.padding.t + sc_i.dim.padding.b ) || 0;

              sc_i.children.cssScroller( { 'max-width' : width - offset_m_w - offset_p_w + "px " , "max-height" : height - offset_m_h - offset_p_h + "px " } );

              var style_o = { 'max-width' : width - offset_m_w + "px" , "max-height" : height - offset_m_h + "px" }
              
              if( ( gallery && width ) || scroller_in.parent )
                style_o['min-width'] = width - offset_m_w + "px";
              else
                style_o['height'] = "100%";
              
                sc_i.cssScroller(style_o);
            }

            
            if( gallery && width )
              [scroller,scroller_area].cssScroller({'width': width + 'px' });

              [scroller_in,scroller_area].cssScroller({'height': height + 'px' });
            

          
          scroller_in.cssScroller({'overflow':'', 'font-size': '0', 'position': 'relative', 'left': '0', 'display': 'flex', 'flex-wrap' : 'nowrap' /*, 'max-width' : 'unset'*/ ,'align-items':'center', /*'width': 'max-content',*/ 'white-space': 'nowrap'});
          
          scroller_in.children.cssScroller({ 'overflow': 'unset' });
          
          var toCur = curElement.offsetLeft - parseInt( window.getComputedStyle(curElement).marginLeft ) ;

          if( scroller_in.arrow_next && scroller_in.arrow_prev ){

            var s_width = scroller.offsetWidth;
            [scroller_in.arrow_next , scroller_in.arrow_prev].cssScroller({'display' : 'block'});
            var top = ( ( scroller_area.offsetHeight ) / 2) - ( (scroller_in.arrow_prev.offsetHeight || scroller_in.arrow_next.offsetHeight) /2 )+'px'; 
            scroller_in.arrow_prev.cssScroller({'left': ( s_width + scroller_in.arrow_prev.offsetWidth * 1.5 < parentWidth ? -( scroller_in.arrow_prev.offsetWidth * 1.5 ) : ( scroller_in.arrow_prev.offsetWidth * 0.5 ) ) +'px', "top" : top});
            scroller_in.arrow_next.cssScroller({'right': ( s_width + scroller_in.arrow_next.offsetWidth * 1.5 < parentWidth ?  -( scroller_in.arrow_next.offsetWidth * 1.5 ) : ( scroller_in.arrow_next.offsetWidth * 0.5 ) ) +'px', "top" : top});
            [scroller_in.arrow_next , scroller_in.arrow_prev].cssScroller({'display' : ''});

          }

          moveScroller(true, toCur );

        }

        function moveScroller( e, left ){

          var scroller_mini , ce_mini ;
          if( ( ce_mini = curElement.mini ) && ( scroller_mini = ce_mini.parentNode )){
            for(var i = 0, els = scroller_mini.children; i < els.length; i++){
              els[i].className = els[i].className.replace(/(^|\s+)curElementMini\b/, '');
              if(els[i] === ce_mini)
                els[i].className += ' curElementMini';
            }
              
          }
          
          if(!scroller_in.children.length) return;
            
            var elem = ( (scroller_in.parent && curElementMini) || curElement);
            var max;

            function toCurMove(elem, scroller_in, left){
              var toCur = left || elem.offsetLeft - parseInt( window.getComputedStyle(elem).marginLeft ) ;
              
              var max = getMax(scroller_in);
              
              if( toCur > max ) toCur = max;
              if( toCur <= 0 ) toCur = 0; 

              scroller_in.cssScroller({'mozTransform': 'translateX('+( - toCur )+'px)','oTransform': 'translateX('+( - toCur )+'px)','webkitTransform': 'translateX('+( - toCur )+'px)', 'transform': 'translateX('+( - toCur )+'px)'});
            }

            if(scroller_in.mini){ 
              curElementMini = curElement.mini;
              toCurMove(curElement.mini, scroller_in.mini)
              arrows(scroller_in.mini, scroller_in.mini.arrow_prev,scroller_in.mini.arrow_next,curElement.mini);
            }
        
          if( e ){

            toCurMove(elem, scroller_in, left);

            arrows(scroller_in , scroller_in.arrow_prev , scroller_in.arrow_next , elem);
            
            if(scroller_in.parent){
              toCurMove(curElement, scroller_in.parent);
              arrows(scroller_in.parent, scroller_in.parent.arrow_prev , scroller_in.parent.arrow_next , curElement);
            }

          }

          var ref_condition = scroller_in.condition || condition;

          if( ref_condition ){

            
            ref_condition.style.display = "block";

            var ref_condition_pre = document.createElement("DIV");
            

            var el = ( scroller_in.parent || scroller_in).children[0];
            var sim_curCss = 0;
            var max = getMax( scroller_in.parent || scroller_in)
            var clsnm = "curCondition"
            var index_cur_condition;

            while(el){
              var el_R = el.offsetLeft + el.offsetWidth + parseInt( window.getComputedStyle(el).marginRight );
              
              if( el_R > sim_curCss ){
                
                  var el_C = document.createElement("DIV");
                  ref_condition_pre.appendChild( el_C );
                
                sim_curCss += scroller_area.clientWidth;
              }
              if( el_C && clsnm && ( el === curElement ) ) el_C.className = clsnm , clsnm = undefined , index_cur_condition = ref_condition_pre.children.length - 1 ;
              
              el = el.nextElementSibling;
            }

            if( ref_condition_pre.children.length < 2 ){
              ref_condition.innerHTML = "";
            }else if( ref_condition.children.length !== ref_condition_pre.children.length ){
              ref_condition.innerHTML = "";

              for( ;ref_condition_pre.children.length; )
                ref_condition.appendChild( ref_condition_pre.children[0] );

            }else if( index_cur_condition !== undefined ){
              for( var i = 0 ; ref_condition.children.length > i ; i++ )
                 ref_condition.children[i].className = ref_condition_pre.children[i].className ;
            }

            ref_condition_pre = null;

            ref_condition.style.display = "";

            ref_condition.style.height = window.getComputedStyle( ref_condition ).height;
          
          
          }


          function arrows( scroller , a_p , a_n , elem ){
            
            var curCSS = - curCss(true, scroller);
            max = getMax(scroller);

            if(a_n && ( last = scroller.children[ scroller.children.length - 1] )){
              a_n.className = a_n.className.replace(/(^|\s+)hide_arrow\b/,'')
              if( curCSS >= max || elem === last )
                a_n.className += ' hide_arrow';
            }

            if(a_p && (first = scroller.children[0])){
                a_p.className = a_p.className.replace(/(^|\s+)hide_arrow\b/,'')
              if( curCSS <= 0 || elem === first )
                a_p.className += ' hide_arrow';
            }

          }
        
        }
        
        resize();

        window.addEventListener('resize', resize);

        function getMax(other){
          other = other || scroller_in;
          var width = 0;

          for( var i = 0, el = other.children[i]; i < other.children.length; el = other.children[++i])
          width += el.offsetWidth + parseFloat(window.getComputedStyle(el).marginLeft) + parseFloat(window.getComputedStyle(el).marginRight);

          return width - (other ? other.scroller_area : scroller_area ).clientWidth;

        }

        function event_off_move(e){
          if(!moving) return;
          
          (e.preventDefault) ? e.preventDefault() : (e.returnValue = false) ;
          return false;

        }

        var moving;

        scroller_in.addEventListener( 'click', event_off_move);

        function startmove(e){

          moving = false;
          
          if( (e && e.button != undefined && e.button != 0) || (getMax() < 0) )return;

          var curCSS = curCss();  
          var elemX = (e.clientX!=undefined)?e.clientX : e.changedTouches[0].clientX;
          var elemY = (e.clientY!=undefined)?e.clientY : e.changedTouches[0].clientY;
          var max = - getMax();
          if( !max ) return;
          
          var maxMoved = scroller_area.clientWidth / 5;
          var left = curCSS;
          var timeStamp = e.timeStamp;
          var se = e;
          scrollerStyle.mozTransitionDuration = scrollerStyle.oTransitionDuration = scrollerStyle.transitionDuration = scrollerStyle.webkitTransitionDuration = '0s';
          scrollerStyle.mozTransform = scrollerStyle.oTransform = scrollerStyle.webkitTransform = scrollerStyle.transform = 'translateX('+left+'px)';


            function move(e){

              if( touches && !moving ){
                var difY = ( ( (e.clientY!=undefined)? e.clientY : e.changedTouches[0].clientY) - elemY );
                if( Math.abs(difY) > 5 ) { endmove(e); return; };
              }

              var difX = ( ( (e.clientX!=undefined)? e.clientX : e.changedTouches[0].clientX) - elemX );
              left = curCSS + difX;
              if( difX || moving ) ( e.preventDefault ? e.preventDefault() : (e.returnValue = false) ) ;
              if( !difX || left <= max - maxMoved || left > maxMoved )return;

                moving = true; 
              
              scrollerStyle.mozTransform = scrollerStyle.oTransform = scrollerStyle.webkitTransform = scrollerStyle.transform = 'translateX('+left+'px)';
              
            }

            
            if(!touches)
              window.addEventListener("mousemove", move);    
            else
              window.addEventListener("touchmove", move, {passive: false});

            function endmove(e){

              if( moving && se)(se.preventDefault) ? se.preventDefault() : (se.returnValue = false) ;
              
              window.removeEventListener("mousemove", move);
              window.removeEventListener("touchmove", move);
              window.removeEventListener("mouseup", endmove);
              window.removeEventListener("touchend", endmove);
              

              if( !e || e.clientX === undefined && e.changedTouches === undefined ) return;
              
              scrollerStyle.oTransitionDuration = scrollerStyle.mozTransitionDuration = scrollerStyle.transitionDuration = scrollerStyle.webkitTransitionDuration = transitionDuration;
            
              var moved = ( (e.clientX!=undefined) ? e.clientX : e.changedTouches[0].clientX );
              var speed = ( ( ( Math.abs( moved - elemX) / scroller_area.clientWidth ) * ( 10000 / ( e.timeStamp - timeStamp ) ) ) ) > 15 ; 
              
              if( moved < elemX && speed ){
                moveTo('next'); 
              }
              else if ( moved > elemX && speed ){
                moveTo('previous')
              }
              else {
                moveTo('close')
              }

              
            }

              window.addEventListener( !touches ? "mouseup" : "touchend", endmove );    
      
        }
        
          scroller_area.addEventListener( !touches ? "mousedown" : "touchstart" ,  startmove)  
        

      function moveTo(direction,e){
        if( (e && e.button != undefined && e.button != 0) || (getMax() < 0) || !direction )return;

        if(!scroller_in.children.length)
          return;

        var left;
        var cur = - curCss();
        var s_area = scroller_area.clientWidth;
        var elemCycle;
        var close = direction === 'close';
        var elemCycle_i = true;
        if(!curElement || ( close && ( direction = 'next' ) ) )
          elemCycle = (scroller_in).children[0];
        else 
          elemCycle = (scroller_in.parent && curElementMini) || curElement;


        scrollerStyle.oTransitionDuration = scrollerStyle.mozTransitionDuration = scrollerStyle.transitionDuration = scrollerStyle.webkitTransitionDuration = transitionDuration;

        if(direction === 'next' || direction === 'previous'){

          if(!close){
            elemCycle = elemCycle[direction+'ElementSibling'] || elemCycle;
          }

            while(elemCycle_i){
              var elemCycle_L = elemCycle.offsetLeft - parseInt(window.getComputedStyle(elemCycle).marginLeft);
              var elemCycle_R = elemCycle.offsetLeft + elemCycle.offsetWidth + parseInt(window.getComputedStyle(elemCycle).marginRight);

              if ( ( direction === 'next' && !close && elemCycle_R > cur + s_area )){
                break;
              }else if ( direction === 'previous' ) {
                var prevEC = elemCycle[direction+'ElementSibling'];
                if( left === undefined && elemCycle_L < cur )
                  left = ((elemCycle.offsetLeft + elemCycle.offsetWidth + parseInt(window.getComputedStyle(elemCycle).marginRight) ) - s_area);
                if( !prevEC || ( left !== undefined && prevEC.offsetLeft - parseInt(window.getComputedStyle(prevEC).marginLeft) < left ) )
                break;
              }else if( close && ( elemCycle_R > cur ) ){
                var elemCycle_W = parseInt(window.getComputedStyle(elemCycle).marginLeft) + elemCycle.offsetWidth + parseInt(window.getComputedStyle(elemCycle).marginRight);
                  if( elemCycle_L + elemCycle_W / 2 < cur ) 
                    elemCycle = elemCycle[direction+'ElementSibling'] || elemCycle;
                break;
              }
              
              elemCycle = elemCycle[direction+'ElementSibling'] || ( !(elemCycle_i = false) && elemCycle );
            }

          }

          if(!scroller_in.parent)
            curElement = elemCycle;
          else
            curElementMini = elemCycle;

          moveScroller(true, left)
          
      }


      if( scroller_in === AScrollerBox ){
      
        keyArrows = (function(e){
            
          var access = false;
          var tm = []

          function reset(){
            for(var i = 0; i < tm.length; i++)
              clearTimeout(tm[i])

            access = false;
          }

          return function keyArrows( e ){

            if( !AScrollerBoxMax ) return;
            
            var where = ( e.keyCode === 39 && 'next' ) || ( e.keyCode === 37 && 'previous' );
            if( !where || access === where ) return;
            access = where;
            
            moveTo( where );
            tm.push( setTimeout( reset , 600) );
            
          };

        })();

        window.addEventListener( 'keydown' , keyArrows );

      }

      
    if(scroller_in.arrow_next){
      if(!touches)
        scroller_in.arrow_next.addEventListener('mousedown', moveTo.bind(null,'next'));
      else
        scroller_in.arrow_next.addEventListener('touchstart', moveTo.bind(null,'next'));
    }

    if(scroller_in.arrow_prev){
      if(!touches)
        scroller_in.arrow_prev.addEventListener('mousedown', moveTo.bind(null,'previous'));
      else
        scroller_in.arrow_prev.addEventListener('touchstart', moveTo.bind(null,'previous'));
    }


  }

}

}, {once:true} );

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////