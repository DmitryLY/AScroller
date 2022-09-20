// Copyright © 2021-2022 Dmitry Y. Lepikhin. All rights reserved.

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
      AScroller ( scrollers[i] );
  }

  

function AScroller(scroller_in, curElement_){
  
  var big_scroller, mini_scroller, condition, set_condition, toCurMove_funcs = [], arrows_funcs = [], big_mini_elements = [], set_cur_element_funcs = [];

  

    for(var i = 0; i < scroller_in.children.length; i++){
      var el = scroller_in.children[i];
      if(el.tagName !== "IMG")continue;
      var box_flex = document.createElement("DIV");
      box_flex.className = "Ascroller_box_flex";


      scroller_in.insertBefore( box_flex , el );
      box_flex.appendChild( el );
    }

    big_scroller = scroller_in;
  
  init(scroller_in);

  function set_cur_element_func( elem , left ){

    for( var i = 0; i < set_cur_element_funcs.length; i++)
      set_cur_element_funcs[i]( elem , left );


    for (var i = 0; i < big_mini_elements.length; i++){
      big_mini_elements[i][1].className = big_mini_elements[i][1].className.replace(/(^|\s+)curElementMini\b/, '');
      if( big_mini_elements[i].indexOf( elem ) !== -1 )
        big_mini_elements[i][1].className += ' curElementMini';
    }

  }

  function init(scroller_in){

    var curElement = curElement_ || scroller_in.children[0];

    var nativeStyleWidth = parseInt( scroller_in.style.width ) || parseInt( scroller_in.style.maxWidth )  || parseInt( window.getComputedStyle(scroller_in).width ) ;
    var nativeStyleHeight = parseInt( scroller_in.style.height ) || parseInt( scroller_in.style.maxHeight ) || parseInt( window.getComputedStyle(scroller_in).height ) ;

    var data_ascroller = scroller_in.getAttribute("data-ascroller");

    if(data_ascroller){

      scroller_in.setAttribute("data-ascroller", "");

      var gallery = data_ascroller.search(/(^|\s+)gallery\b/) !== -1 ? true : false;

      if(gallery)
        mini_scroller_flag = data_ascroller.match(/(^|\s+)mini-scroller(X(\d)+)*\b/i);
      
      var condition_flag = data_ascroller.search(/(^|\s+)condition\b/) !== -1 ? true : false;
      var full = data_ascroller.search(/(^|\s+)full\b/) !== -1 ? true : false;
      var loupe = data_ascroller.search(/(^|\s+)loupe\b/) !== -1 ? true : false;
      var arrows = !touches && data_ascroller.search(/(^|\s+)arrows\b/) !== -1 ? true : false;

    }
    
      var parent = scroller_in.parentElement;  
      var scroller = document.createElement('div'); 
      scroller.className = ( scroller_in === mini_scroller && "AScrollerBoxMini" ) || "AScrollerBox";

      if( scroller_in === mini_scroller ){

        function changeImages(e){
          if( moving ) return;
          set_cur_element_func( this );
          moveScroller();
        }

        for (var i = 0; i < scroller_in.children.length; i++){
          if(scroller_in.children[i].children[0].tagName !== "IMG") continue;
          scroller_in.children[i].addEventListener( touches ? "touchstart" : "click", changeImages)
          
        }

        set_cur_element_funcs.push( function( elem , left ){
          for (var i = 0; i < big_mini_elements.length; i++)
              if( big_mini_elements[i].indexOf( elem ) !== -1 ){
                curElement = big_mini_elements[i][1];
                moveScroller();
                return;
              }
        });

      }

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


      if( condition_flag ){

        condition = document.createElement("DIV");
        condition.className = "AScrollerCondition";
        var el_C = document.createElement("DIV");
        condition.appendChild( el_C );
        
        ( scroller_area.nextElementSibling && scroller.insertBefore(condition , scroller_area.nextElementSibling ) ) || scroller.appendChild( condition );

        set_condition = function(){ 
            
          condition.style.display = "block";

          var condition_pre = document.createElement("DIV");
          
          var el = big_scroller.children[0];
          var sim_curCss = 0;
          var clsnm = "curCondition"
          var index_cur_condition;

          while(el){
            var el_R = el.offsetLeft + el.offsetWidth + parseInt( window.getComputedStyle(el).marginRight );
            
            if( el_R > sim_curCss ){
              
                var el_C = document.createElement("DIV");
                condition_pre.appendChild( el_C );
              
              sim_curCss += scroller_area.clientWidth;
            }
            if( el_C && clsnm && ( el === curElement ) ) el_C.className = clsnm , clsnm = undefined , index_cur_condition = condition_pre.children.length - 1 ;
            
            el = el.nextElementSibling;
          }
          

          if( condition_pre.children.length < 2 ){
            condition.innerHTML = "";
          }else if( condition_pre.children.length !== condition.children.length ){
            condition.innerHTML = "";

            for( ;condition_pre.children.length; )
              condition.appendChild( condition_pre.children[0] );

          }else if( index_cur_condition !== undefined ){
            for( var i = 0 ; condition_pre.children.length > i ; i++ )
              condition.children[i].className = condition_pre.children[i].className;
          }

          condition_pre = null;

          condition.style.display = "";

          condition.style.height = window.getComputedStyle( condition ).height;
          
        
        };

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
            box.setAttribute("data-ascroller",  "gallery" + (!touches ? " mini-scrollerx5 arrows" : "") + " condition");
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
        
        if( !touches && mini_scroller_flag && !mini_scroller && scroller_in.children.length > 1){
          (function(){
              var d_x = mini_scroller_flag[3];

            set_cur_element_funcs.push( function( elem , left ){
              for (var i = 0; i < big_mini_elements.length; i++)
                  if( big_mini_elements[i].indexOf( elem ) !== -1 ){
                    curElement = big_mini_elements[i][0];
                    moveScroller( left );
                    return;
                  }
            });

            mini_scroller = document.createElement("DIV");
            mini_scroller.className = "AScroller_miniImages";
            mini_scroller.setAttribute("data-ascroller",  "arrows");
            
              for (var i = 0; i < scroller_in.children.length; i++){
                if(scroller_in.children[i].children[0].tagName !== "IMG") continue;
                var mini = scroller_in.children[i].cloneNode(true);
                mini.style = '';
                big_mini_elements.push( [ scroller_in.children[i] , mini ] );
                mini_scroller.appendChild( mini );
              }
            

            if(mini_scroller.children.length){

              scroller.appendChild( mini_scroller );
              mini_scroller.style.width = d_x > 0 ? ( d_x < i ? d_x : i) * ( parseInt(window.getComputedStyle(mini_scroller.children[0]).width) ) + "px" : ""; 

              init(mini_scroller);
              resize();
            }
          })();
        }

      }

      
      scroller.cssScroller({
        'position':'relative'
      });
            
    
      scroller.ondragstart = scroller.ondrop = scroller.onselectstart = function(){return false;};

      var max = getMax() ;
      var curCSS = curCss();

      function curCss( style , prev ){

        var styleScrollerIn = style ? scroller_in.style : window.getComputedStyle( scroller_in );
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

          var arrow_next, arrow_prev;

          arrow_prev = document.createElement('div'); arrow_prev.className =  'arrows prev';
          arrow_next = document.createElement('div'); arrow_next.className = 'arrows next';

          scroller.appendChild(arrow_prev);
          scroller.appendChild(arrow_next);

          arrow_next.innerHTML = '    <svg width="19" height="16" viewBox="4 0 19 16">    <path d="M 18.7071 8.7071 C 19.0976 8.3166 19.0976 7.6834 18.7071 7.2929 L 12.3431 0.9289 C 11.9526 0.5384 11.3195 0.5384 10.9289 0.9289 C 10.5384 1.3195 10.5384 1.9526 10.9289 2.3432 L 16.5858 8 L 10.9289 13.6569 C 10.5384 14.0474 10.5384 14.6805 10.9289 15.0711 C 11.3195 15.4616 11.9526 15.4616 12.3431 15.0711 L 18.7071 8.7071 Z Z" />    </svg>    ';
          arrow_prev.innerHTML = '    <svg width="19" height="16" viewBox="-4 0 19 16"">    <path transform="rotate(-180 9.499987602233887,8.000007629394531) " d="M 18.7071 8.7071 C 19.0976 8.3166 19.0976 7.6834 18.7071 7.2929 L 12.3431 0.9289 C 11.9526 0.5384 11.3195 0.5384 10.9289 0.9289 C 10.5384 1.3195 10.5384 1.9526 10.9289 2.3432 L 16.5858 8 L 10.9289 13.6569 C 10.5384 14.0474 10.5384 14.6805 10.9289 15.0711 C 11.3195 15.4616 11.9526 15.4616 12.3431 15.0711 L 18.7071 8.7071 Z Z" />    </svg>    ';

          arrow_prev.ondragstart = arrow_prev.ondrop = arrow_prev.onselectstart = function(){return false;};
          arrow_next.ondragstart = arrow_next.ondrop = arrow_next.onselectstart = function(){return false;};

        }

        function resize(){

          var sc_i , width = 0, height = 0, dimensions = [], children = [].slice.call( scroller_in.children );
          
          children.cssScroller({ 'box-sizing': 'border-box' , 'width' : '' , 'min-width' : '', 'max-width' : '' , 'max-height' : '' , 'heigth' : '' , "padding-left" : "" , "padding-right" : "" , "padding-top" : "" , "padding-bottom" : "" });
          [scroller,scroller_in,scroller_area].cssScroller({ 'height' : '' });
          scroller_in.cssScroller({'display' : 'block'});

            for(var i = 0; i < children.length; i++){
              sc_i = children[i]; 
              sc_i.children.cssScroller( { 'max-width' : "" , "max-height" : "" } );
              var get_c = window.getComputedStyle(sc_i);
              var dim = {};
              dimensions.push( dim );

              dim.margin = {h: parseInt( get_c.marginLeft ) + parseInt( get_c.marginRight ), v: parseInt( get_c.marginBottom ) + parseInt( get_c.marginTop )};
              dim.padding = {h: parseInt( get_c.paddingLeft ) + parseInt( get_c.paddingRight ), v: parseInt( get_c.paddingTop ) + parseInt( get_c.paddingBottom )};

              var width_i = sc_i.offsetWidth + dim.margin.h;
              if( width_i > width )
                  width = width_i ;

              var height_i = sc_i.offsetHeight + dim.margin.v;
              if( height_i > height )
                  height = height_i ;
                
            }

            scroller_in.cssScroller({'display' : 'flex'});

            if( nativeStyleWidth && nativeStyleWidth < width )
              width = nativeStyleWidth;
          
            var parentWidth = parent.offsetWidth - parseInt(window.getComputedStyle(parent).paddingLeft) - parseInt(window.getComputedStyle(parent).paddingRight);
            var parentHeight = parent.offsetHeight - parseInt(window.getComputedStyle(parent).paddingBottm) - parseInt(window.getComputedStyle(parent).paddingTop);
            
            
            if( AScrollerBox === scroller_in ){
              width = window.innerWidth;
              height = window.innerHeight - ( (condition && condition.offsetHeight) || 0 ) - ( (mini_scroller && mini_scroller.offsetHeight) || 0 );
            }else{

              if( nativeStyleHeight && nativeStyleHeight < height )
                height = nativeStyleHeight;
              
              if( nativeStyleWidth && nativeStyleWidth < width )
                width = nativeStyleWidth;
              
              if( width > parentWidth ) width = parentWidth;
              if( height > parentHeight ) height = parentHeight;
              
            }

            for(var i = 0; i < children.length; i++){
              sc_i = children[i];  
              dim = dimensions[i];

              sc_i.children.cssScroller( { 'max-width' : width - dim.margin.h - dim.padding.h + "px " , "max-height" : height - dim.margin.v - dim.padding.v + "px " } );

              var style_o = { 'max-width' : width - dim.margin.h + "px" , "max-height" : height - dim.margin.v + "px" }

              
              if( ( gallery && width ) || mini_scroller === scroller_in  )
                style_o['min-width'] = width - dim.margin.h + "px";
              else
                style_o['height'] = "100%";
              
                sc_i.cssScroller(style_o);
            }

            

            
            if( gallery && width )
              [scroller,scroller_area].cssScroller({'width': width + 'px' });

              [scroller_in,scroller_area].cssScroller({'height': AScrollerBox !== scroller_in ? scroller_area.offsetHeight : height + 'px' });
            
          
          scroller_in.cssScroller({'overflow':'', 'font-size': '0', 'position': 'relative', 'left': '0', 'display': 'flex', 'flex-wrap' : 'nowrap','align-items':'center', 'white-space': 'nowrap'});
          
          children.cssScroller({ 'overflow': 'unset' });
          
          if( arrow_next && arrow_prev ){

            var s_width = scroller.offsetWidth;
            [arrow_next , arrow_prev].cssScroller({'display' : 'block'});
            var top = ( ( scroller_area.offsetHeight ) / 2) - ( (arrow_prev.offsetHeight || arrow_next.offsetHeight) /2 )+'px'; 
            arrow_prev.cssScroller({'left': ( s_width + arrow_prev.offsetWidth * 1.5 < parentWidth ? -( arrow_prev.offsetWidth * 1.5 ) : ( arrow_prev.offsetWidth * 0.5 ) ) +'px', "top" : top});
            arrow_next.cssScroller({'right': ( s_width + arrow_next.offsetWidth * 1.5 < parentWidth ?  -( arrow_next.offsetWidth * 1.5 ) : ( arrow_next.offsetWidth * 0.5 ) ) +'px', "top" : top});
            [arrow_next , arrow_prev].cssScroller({'display' : ''});

          }

          moveScroller();

        }

        function moveScroller( left ){

          if( left )
            toCurMove( left );
          else
            for( var i = 0; i < toCurMove_funcs.length; i++)
              toCurMove_funcs[i]();

          for( var i = 0; i < arrows_funcs.length; i++)
            arrows_funcs[i]();

          if( set_condition ) set_condition();
        
        }

        

        function toCurMove(left){
          var toCur = left || curElement.offsetLeft - parseInt( window.getComputedStyle(curElement).marginLeft ) ;
          
          var max = getMax();
          
          if( toCur > max ) toCur = max;
          if( toCur <= 0 ) toCur = 0; 

          scroller_in.cssScroller({'mozTransform': 'translateX('+( - toCur )+'px)','oTransform': 'translateX('+( - toCur )+'px)','webkitTransform': 'translateX('+( - toCur )+'px)', 'transform': 'translateX('+( - toCur )+'px)'});
        }

        toCurMove_funcs.push(toCurMove);

        function arrows_func(){
            
          var curCSS = - curCss(true);
          max = getMax();

          if( arrow_next && ( last = scroller_in.children[ scroller_in.children.length - 1] )){
            arrow_next.className = arrow_next.className.replace(/(^|\s+)hide_arrow\b/,'')
            if( curCSS >= max || curElement === last )
              arrow_next.className += ' hide_arrow';
          }

          if( arrow_prev && (first = scroller_in.children[0])){
              arrow_prev.className = arrow_prev.className.replace(/(^|\s+)hide_arrow\b/,'')
            if( curCSS <= 0 || curElement === first )
              arrow_prev.className += ' hide_arrow';
          }

        }

        arrows_funcs.push(arrows_func);

        resize();

        if( scroller_in === big_scroller && set_cur_element_funcs.length > 1 ) 
          set_cur_element_func( curElement );

        window.addEventListener('resize', resize);

        function getMax(){
          var width = 0;

          for( var i = 0, el = scroller_in.children[i]; i < scroller_in.children.length; el = scroller_in.children[++i])
          width += el.offsetWidth + parseFloat(window.getComputedStyle(el).marginLeft) + parseFloat(window.getComputedStyle(el).marginRight);

          return width - scroller_area.clientWidth;
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

            if(!touches)
              window.addEventListener("mouseup", endmove );    
            else
              window.addEventListener("touchend", endmove );    
      
        }

        
        if(!touches)
          scroller_area.addEventListener("mousedown",  startmove)  
        else
          scroller_area.addEventListener("touchstart",  startmove)  
        

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
          elemCycle = curElement;


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

            curElement = elemCycle;

          if( scroller_in === big_scroller && set_cur_element_funcs.length > 1 ) 
            set_cur_element_func( elemCycle, left );
          else
            moveScroller(left);
          
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

      
    if(arrow_next){
      if(!touches)
        arrow_next.addEventListener('mousedown', moveTo.bind(null,'next'));
      else
        arrow_next.addEventListener('touchstart', moveTo.bind(null,'next'));
    }

    if(arrow_prev){
      if(!touches)
        arrow_prev.addEventListener('mousedown', moveTo.bind(null,'previous'));
      else
        arrow_prev.addEventListener('touchstart', moveTo.bind(null,'previous'));
    }


  }

}

} );

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////