(function($){
    'use strict';
    var frame1 = new trans.ImgFrame($('#canvas1')[0]);
    var frame2 = new trans.ImgFrame($('#canvas2')[0]);
    var color = {};
    var animation = null;
    
    function updateScale(){
        frame1
        .start(Number($('#ox1').val()),Number($('#oy1').val()))
        .end(Number($('#ox2').val()),Number($('#oy2').val()));
        frame2
        .start(Number($('#ix1').val()),Number($('#iy1').val()))
        .end(Number($('#ix2').val()),Number($('#iy2').val()));
    }
    
    $('#img-file').on('change',function(){
        frame1.loadImgsrc(window.URL.createObjectURL(this.files[0]),function(){
            alert('loading done');
        });
    });
    $('#btn1').click(function () {
        updateScale();
        frame2.transFrom(frame1,Mathx.lambda($('#formula').val(),['z']),true);
        frame2.drawImg();
        
    });
    $('#btn2').click(function(){
        var scope = new Mathx.Scope();
        var pstart = scope.eval($('#pstart').val());
        var pend = scope.eval($('#pend').val());
        var tlength = Number($('#times').val());
        var afor = scope.lambda('(1 - t) * pstart + t * pend',['t']);
        var tranfor = scope.lambda($('#formula2').val(),['z']);
        scope.variable('pstart',pstart).variable('pend',pend);
        var i = 0;
        animation && clearInterval(animation);
        animation = setInterval(function(){
            if(i >= tlength){
                clearInterval(animation);
                animation = null;
                return;
            }
            scope.variable('a',afor(i++ / tlength));
            frame2.transFrom(frame1,tranfor);
            frame2.drawImg();
        },100);
    });
})(jQuery);
