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

  if( !scroller_in.children.length ) return;
  
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

    var nativeStyleWidth = parseInt( scroller_in.style.width ) || parseInt( scroller_in.style.maxWidth ) ;
    var nativeStyleHeight = parseInt( scroller_in.style.height ) || parseInt( scroller_in.style.maxHeight ) ;

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
      var cycle_option = data_ascroller.match(/(^|\s+)(cycle)+(-(n|p)+(\d+))*\b/) ;

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

        var condition_mem = [].slice.call(big_scroller.children);

        condition = document.createElement("DIV");
        condition.className = "AScrollerCondition";
        var el_C = document.createElement("DIV");
        condition.appendChild( el_C );
        
        ( scroller_area.nextElementSibling && scroller.insertBefore(condition , scroller_area.nextElementSibling ) ) || scroller.appendChild( condition );

        set_condition = function(){ 

          

          condition.style.display = "block";

          var condition_pre = document.createElement("DIV");
          var clsnm = "curCondition";


            var el_S = 0;
            var el = condition_mem[i];
            var sim_curCss = 0;
            var set_clsN = false;
            
            var index_cur_condition;

            for(var i = 0, el = condition_mem[i] ; i < condition_mem.length; el = condition_mem[++i] ){
              if( !el ) continue;

              if( el === curElement )
                set_clsN = true; 
              
              
              el_S += get_dim( el , 'width' );
              if( el_S > sim_curCss ){
                
                  var el_C = document.createElement("DIV");
                  condition_pre.appendChild( el_C );
                
                  sim_curCss += scroller_area.clientWidth;
              }

              if( set_clsN && el_C )
                el_C.className = clsnm , index_cur_condition = el_C , set_clsN = false ;



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
            box.setAttribute("data-ascroller",  "gallery" + ( ( !touches && " mini-scrollerx5 arrows" ) || "") + ( ( cycle_option && ' cycle ' ) || '') + " condition");
            var parent = condition_mem || this.parentNode.children;
            for(var i = 0; i < parent.length; i++){
              if( get_cloned( undefined , parent[i] ) || !parent[i].children[0] || parent[i].children[0].tagName !== "IMG" )continue;
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
                
                mini.setAttribute('style' , '');
                mini.children[0].setAttribute('style' , '');
                
                big_mini_elements.push( [ scroller_in.children[i] , mini ] );
                mini_scroller.appendChild( mini );
              }
            

            if(mini_scroller.children.length){

              scroller.appendChild( mini_scroller );
              mini_scroller.style.width = d_x > 0 ? ( d_x < i ? d_x : i) * ( parseInt(window.getComputedStyle(mini_scroller.children[0]).width) ) + "px" : "" ; 

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

          //arrow_next.innerHTML = '    <svg width="19" height="16" viewBox="4 0 19 16">    <path d="M 18.7071 8.7071 C 19.0976 8.3166 19.0976 7.6834 18.7071 7.2929 L 12.3431 0.9289 C 11.9526 0.5384 11.3195 0.5384 10.9289 0.9289 C 10.5384 1.3195 10.5384 1.9526 10.9289 2.3432 L 16.5858 8 L 10.9289 13.6569 C 10.5384 14.0474 10.5384 14.6805 10.9289 15.0711 C 11.3195 15.4616 11.9526 15.4616 12.3431 15.0711 L 18.7071 8.7071 Z Z" />    </svg>    ';
          //arrow_prev.innerHTML = '    <svg width="19" height="16" viewBox="-4 0 19 16"">    <path transform="rotate(-180 9.499987602233887,8.000007629394531) " d="M 18.7071 8.7071 C 19.0976 8.3166 19.0976 7.6834 18.7071 7.2929 L 12.3431 0.9289 C 11.9526 0.5384 11.3195 0.5384 10.9289 0.9289 C 10.5384 1.3195 10.5384 1.9526 10.9289 2.3432 L 16.5858 8 L 10.9289 13.6569 C 10.5384 14.0474 10.5384 14.6805 10.9289 15.0711 C 11.3195 15.4616 11.9526 15.4616 12.3431 15.0711 L 18.7071 8.7071 Z Z" />    </svg>    ';

          arrow_next.innerHTML = '<svg width="10" height="18" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M2 18L10 10L2 2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/> </svg> ';
          arrow_prev.innerHTML = '<svg width="10" height="18" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10 2L2 10L10 18" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/> </svg> ';

          arrow_prev.ondragstart = arrow_prev.ondrop = arrow_prev.onselectstart = function(){ return false; };
          arrow_next.ondragstart = arrow_next.ondrop = arrow_next.onselectstart = function(){ return false; };

        }


        var resize_width;

        function resize(e){

          if( e && e.type === 'resize' && resize_width === window.innerWidth ) return;

          resize_width = window.innerWidth

          remove_cloned();

          scroller_in.cssScroller({'overflow':'', 'font-size': '0', 'position': 'relative', 'left': '0', 'display': 'flex', 'flex-wrap' : 'nowrap', 'white-space': 'nowrap'});

          var sc_i , width = 0, height = 0, children = [].slice.call( scroller_in.children );

          [scroller,scroller_in,scroller_area].cssScroller({ 'height' : 'auto' , 'width': 'auto'});

          children.cssScroller({ 'margin': '', 'box-sizing': 'border-box' , 'width' : '' , 'min-width' : '', 'max-width' : '' , 'max-height' : '' , 'heigth' : '' , "padding-left" : "" , "padding-right" : "" , "padding-top" : "" , "padding-bottom" : "" });
        

          
          var width, height;

          if( AScrollerBox === scroller_in ){
            width = window.innerWidth;
            height = window.innerHeight - ( (condition && condition.offsetHeight) || 0 ) - ( (mini_scroller && mini_scroller.offsetHeight) || 0 );
          }else{

            width = parent.offsetWidth - parseInt(window.getComputedStyle(parent).paddingLeft) - parseInt(window.getComputedStyle(parent).paddingRight);
            height = parent.offsetHeight - parseInt(window.getComputedStyle(parent).paddingBottom) - parseInt(window.getComputedStyle(parent).paddingTop);

            if( nativeStyleHeight && nativeStyleHeight < height )
              height = nativeStyleHeight;
            
            if( nativeStyleWidth && nativeStyleWidth < width )
              width = nativeStyleWidth;
            
          }

          if( mini_scroller !== scroller_in ){
            for(var i = 0; i < children.length; i++){
              sc_i = children[i]; 
              
              var style_o = { 'max-width' : width - parseInt(window.getComputedStyle(sc_i).paddingLeft) - parseInt(window.getComputedStyle(sc_i).paddingRight) + "px" };//, "max-height" : height - parseInt(window.getComputedStyle(sc_i).paddingTop) - parseInt(window.getComputedStyle(sc_i).paddingBottom) + "px" };

              if( ( gallery && width ) ){ 
                style_o['min-width'] = width + "px";
                AScrollerBox === scroller_in && ( style_o['min-height'] = height + "px" ) && ( style_o["max-height"] = height - parseInt(window.getComputedStyle(sc_i).paddingTop) - parseInt(window.getComputedStyle(sc_i).paddingBottom) + "px" );
              }
              
                sc_i.cssScroller(style_o);
            }

            if( AScrollerBox !== scroller_in  )
              for(var i = 0; i < children.length; i++){
                sc_i = children[i]; 
                
                var style_o = { "max-height" : height + "px" };
                
                  sc_i.cssScroller(style_o);
              }

          }

          AScrollerBox === scroller_in && [scroller_area].cssScroller({'height': height + 'px', 'width': width+'px' }) ||
          [scroller].cssScroller({ 'max-width': width+'px' });

          for(var i = 0; i < children.length; i++){
            sc_i = children[i]; 
            if( sc_i.offsetWidth + parseInt(window.getComputedStyle(sc_i).marginLeft) + parseInt(window.getComputedStyle(sc_i).marginRight) >= width )
              sc_i.cssScroller({'margin': '0'});
          }
          
          
          children.cssScroller({ 'overflow': 'unset' });

          if( arrow_next && arrow_prev ){

            var s_width = scroller.offsetWidth;
            [arrow_next , arrow_prev].cssScroller({'display' : 'block'});
            var top = ( ( scroller_area.offsetHeight ) / 2) - ( (arrow_prev.offsetHeight || arrow_next.offsetHeight) /2 )+'px'; 
            arrow_prev.cssScroller({'left': ( s_width + arrow_prev.offsetWidth * 1.5 < parent.offsetWidth ? -( arrow_prev.offsetWidth * 1.5 ) : ( arrow_prev.offsetWidth * 0.1 ) ) +'px', "top" : top});
            arrow_next.cssScroller({'right': ( s_width + arrow_next.offsetWidth * 1.5 < parent.offsetWidth ?  -( arrow_next.offsetWidth * 1.5 ) : ( arrow_next.offsetWidth * 0.1 ) ) +'px', "top" : top});
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
          var toCur = left || get_dim( curElement , 'left' );
          var max = getMax();
          
          if( toCur > max ) toCur = max;
          if( toCur <= 0 ) toCur = 0; 

          scroller_in.cssScroller({'mozTransform': 'translateX('+( - toCur )+'px)','oTransform': 'translateX('+( - toCur )+'px)','webkitTransform': 'translateX('+( - toCur )+'px)', 'transform': 'translateX('+( - toCur )+'px)'});


          move_elements_cycle( undefined );

        }

        toCurMove_funcs.push(toCurMove);

        function arrows_func(){

          if( scroller_in.children.length < 2 ){
            arrow_next && ( arrow_next.className = arrow_next.className.replace(/(^|\s+)hide_arrow\b/,'') ) && ( arrow_next.className += ' hide_arrow' );
            arrow_prev && ( arrow_prev.className = arrow_prev.className.replace(/(^|\s+)hide_arrow\b/,'') ) && ( arrow_prev.className += ' hide_arrow' );
            return;
          }

          if( cycle_option ){
            
            var width = 0;
            
            
              for( var i = 0, el = scroller_in.children[i]; i < scroller_in.children.length; el = scroller_in.children[++i])
                width += get_dim( el , 'width' );

            ( width < scroller_area.offsetWidth && !( width = 0 ) && !( access_move_elements_cycle = false ) ) || ( access_move_elements_cycle = true );

            if( arrow_next ){
              arrow_next.className = arrow_next.className.replace(/(^|\s+)hide_arrow\b/,'')
              if( width <= scroller_area.offsetWidth )
                arrow_next.className += ' hide_arrow';
            }

            if( arrow_prev ){
              arrow_prev.className = arrow_prev.className.replace(/(^|\s+)hide_arrow\b/,'')
              if( width <= scroller_area.offsetWidth )
                arrow_prev.className += ' hide_arrow';
            }
            
            return;

          }

          var max = getMax();
          var curCSS = - curCss(true);

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

        window.addEventListener( 'resize', resize);

        function getMax(){
          var width = 0;
          
          for( var i = 0, el = scroller_in.children[i]; i < scroller_in.children.length; el = scroller_in.children[++i])
            width += get_dim( el , 'width' );

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
          
          if( (e && e.button != undefined && e.button != 0) || (getMax() < 0) || scroller_in.children.length < 2 )
            return;

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
              if( !difX || ( !cycle_option && ( left <= max - maxMoved || left > maxMoved ) ) )return;

              if( !difX  )return;
              
              if( cycle_option && difX )
                curCSS = move_elements_cycle( difX > 0 ? 'previous' : 'next' , undefined , curCSS )[1];
                
              left = curCSS + difX;

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


        function get_dim( el , what ){
          if( what == 'left' )
            return el.offsetLeft - parseFloat(window.getComputedStyle(el).marginLeft);
          else if( what == 'right' )
            return el.offsetLeft + el.offsetWidth + parseFloat(window.getComputedStyle(el).marginRight);
          else if( what == 'width' )
            return el.offsetWidth + parseFloat(window.getComputedStyle(el).marginLeft) + parseFloat(window.getComputedStyle(el).marginRight);
        }
        
        var cloned_elems = [];

        function remove_cloned(){

          if( !cloned_elems ) return;

          for( var i = 0; i < cloned_elems.length; i++ )
          cloned_elems[i][1].parentNode && cloned_elems[i][1].parentNode.removeChild(cloned_elems[i][1]);

          cloned_elems = [];
        }

        function get_cloned( elem , cloned ){

          if( !cloned_elems ) 
            cloned_elems = [];
          
          if( elem && cloned ) throw 'Или оригинал или клон!';
          for( var i = 0; i < cloned_elems.length; i++ ){
            if( !cloned_elems[i] ) continue;

            if( elem && cloned_elems[i][0] === elem )
              return cloned_elems[i][1];
            else if( cloned && cloned_elems[i][1] === cloned )
              return cloned_elems[i][0];
          }

        }

        var access_move_elements_cycle;


        function move_elements_cycle( direction , cur , curCSS , curElement ){ 
          if( !access_move_elements_cycle ) return [ cur , curCSS , curElement ];

          ;( cur = curCss( direction ? false : true ) );
          var move_originals;
          var original;
          var move_element;
          var collected = false;

          var dif;
          
          var s_area = scroller_area.offsetWidth; 
          curCSS === undefined && ( ( direction == 'next' && ( dif = cur - s_area ) <= - getMax() ) || ( direction == 'previous' && ( dif = cur + s_area ) > 0 ) ) && ( move_originals = true );

          dif !== undefined && ( dif = direction == 'next' ? Math.abs(cur - s_area) - getMax() : dif );
          

          curCSS !== undefined && ( ( /*direction == 'next' &&*/ cur < - getMax() && ( direction = 'next' ) ) || ( /*direction == 'previous' &&*/ cur > 0 && ( direction = 'previous' ) ) ) && ( move_originals = true );
          
          var el_ = ( direction == 'previous' && scroller_in.children[scroller_in.children.length - 1] ) || ( /*direction == 'next' &&*/ scroller_in.children[0] ); 

          var instead = [];

          while( el_ ){
            
            if( ( original = get_cloned( null , el_ ) ) && ( instead.indexOf( el_ ) === -1 ) ){

              var el_W = get_dim( el_ , 'width' );
              var el_L = get_dim( el_ , 'left' );
              var el_R = el_L + el_W;

              var remove_el = el_;
              el_ = el_[direction+'ElementSibling'];

              
              if( curCSS !== undefined || !direction ){
                if(  ( ( !direction || direction == 'next' ) && el_L >= -cur && el_L < -cur + s_area ) || ( direction == 'previous' && el_R <= -cur + s_area && el_R > -cur ) ){

                  ( remove_el === curElement && ( curElement = original ) );

                    var pos_o = original.nextElementSibling || false;
                    var pos_c = remove_el.nextElementSibling || false;
                    pos_o ? remove_el.parentNode.insertBefore( remove_el , pos_o ) : remove_el.parentNode.appendChild(remove_el);
                    pos_c ? remove_el.parentNode.insertBefore( original , pos_c ) : remove_el.parentNode.appendChild(original);
                    instead.push(remove_el);
                }

              }

              if( direction && !( ( el_L >= -cur && el_L < -cur + s_area ) || ( el_R <= -cur + s_area && el_R > -cur ) ) ){
                remove_el.parentNode.removeChild(remove_el);
                ( el_R <= -cur )  && ( (cur += el_W) , ( curCSS !== undefined && ( curCSS += el_W) ) );
              }

              continue;

            }

            el_ = el_[ ( direction || 'next' )+'ElementSibling'];

          }


          if( !direction ) return;

          var el_ = ( direction == 'next' && scroller_in.children[0] ) || ( /*direction == 'previous' &&*/ scroller_in.children[scroller_in.children.length - 1] ); 
          curCSS === undefined && ( ( direction == 'next' && ( cur - s_area ) <= - getMax() ) || ( direction == 'previous' && ( cur + s_area ) > 0 ) ) && ( move_originals = true );
          
        if( move_originals )
          while( el_ ){

            clone = false;

            !collected && move_element && ( ( curCSS !== undefined ) || ( curCSS === undefined && dif <= 0 ) ) && ( collected = true );

            
            if( original = get_cloned( null , el_ ) || !move_originals || collected  || ( get_cloned( el_ ) && get_cloned( el_ ).parentNode === el_.parentNode ) ){
              el_ = el_[direction+'ElementSibling'];
              continue;
            }

            var el_W = get_dim( el_ , 'width' );
            var el_L = get_dim( el_ , 'left' );
            var el_R = el_L + el_W;

            
            //Передвигаю оригинальные элементы на крайнюю видимую позицию

              ;( ( ( el_L >= -cur && el_L < -cur + s_area ) || ( el_R <= -cur + s_area && el_R > -cur ) ) && (clone = true ));

              move_element = el_;

              el_ = el_[direction+'ElementSibling'];

                if( clone ){
                  if( !(cloned = get_cloned( move_element )) ){
                    cloned = move_element.cloneNode(true);
                    cloned_elems.push([ move_element , cloned ]);
                  }
                  
                    scroller_in.insertBefore( cloned , move_element );

                  el_ = cloned[direction+'ElementSibling'];
                }

                ( move_element === curElement && ( ( clone && ( curElement = cloned ) ) || ( !clone && ( curElement = el_ ) ) ) );

                if( direction == 'next' ){
                  move_element.parentNode.appendChild( move_element );
                  ;( !clone && ( ( curCSS !== undefined && (curCSS += el_W) ) , (cur += el_W) ) );
                }else if( direction == 'previous' ){
                  move_element.parentNode.insertBefore( move_element , scroller_in.children[0] );
                  ;( curCSS !== undefined && (curCSS -= el_W) );
                  ;( cur -= el_W );
                }

                dif -= el_W;

          }

          return [ cur , curCSS , curElement ];

        }


      function moveTo(direction,e){

        if( (e && e.button != undefined && e.button != 0) || ( !cycle_option && getMax() < 0) || !direction )return;

        if( scroller_in.children.length < 2 )
          return;
          
        var left, next;
        var cur = - curCss();
        var s_area = scroller_area.clientWidth;
        var elemCycle;
        var close = direction === 'close';
        var elemCycle_i = true;
        if(!curElement || ( close && ( direction = 'next' ) ) )
          elemCycle = (scroller_in).children[0];
        else 
          elemCycle = curElement;

        scrollerStyle.oTransitionDuration = scrollerStyle.mozTransitionDuration = scrollerStyle.transitionDuration = scrollerStyle.webkitTransitionDuration = '0s';//transitionDuration;

        if( direction === 'next' || direction === 'previous' ){

          if( !close && cycle_option ){
              res_m = move_elements_cycle( direction , undefined , undefined , curElement );
              elemCycle = res_m[2];
              cur = res_m[0];
              scrollerStyle.mozTransform = scrollerStyle.oTransform = scrollerStyle.webkitTransform = scrollerStyle.transform = 'translateX('+ cur +'px)';
              cur = -cur;
          }

            if(!close){
              elemCycle = elemCycle[direction+'ElementSibling'] || elemCycle ;
            }

            while(elemCycle_i){


              var elemCycle_L = get_dim( elemCycle , 'left' );
              var elemCycle_R = get_dim( elemCycle , 'right' );
              
              if ( ( direction === 'next' && !close && elemCycle_R > cur + s_area )){
                break;
              }else if ( direction === 'previous' ) {
                var prevEC = elemCycle[direction+'ElementSibling'];

                if( left === undefined && elemCycle_L < cur )
                  left = ( get_dim( elemCycle , 'right' ) - s_area);
                if( !prevEC || ( left !== undefined && get_dim( prevEC , 'left') <= left ) )
                
                break;
              }else if( close && ( elemCycle_R > cur ) ){
                var elemCycle_W = get_dim( elemCycle , 'width' );

                if( elemCycle_L + elemCycle_W / 2 < cur ) 
                    elemCycle = elemCycle[direction+'ElementSibling'] || elemCycle;

                break;
              }
              
              elemCycle = elemCycle[direction+'ElementSibling'] || ( !(elemCycle_i = false) && elemCycle );
            }

          }

            curElement = elemCycle;

        scrollerStyle.oTransitionDuration = scrollerStyle.mozTransitionDuration = scrollerStyle.transitionDuration = scrollerStyle.webkitTransitionDuration = transitionDuration;


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

      var cycle_interval;

    if( cycle_option && cycle_option[4] && cycle_option[5] ){
      set_cycle_interval();

      function set_cycle_interval(){
        cycle_interval = setInterval( moveTo.bind( null , ( cycle_option[4] == 'n' ? 'next' : 'previous' ) ) , cycle_option[5] < transitionDuration ? parseFloat( transitionDuration ) * 1000 : cycle_option[5]  );
      };

      scroller.addEventListener('mouseover', function(){ clearInterval( cycle_interval ) });
      scroller.addEventListener('mouseleave', set_cycle_interval );
      
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