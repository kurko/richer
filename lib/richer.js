/*
 * Richer text editing
 *
 * Based on RTE by Batiste Bieler
 */

var richer = {

	heightEqualText: false,

	init: function(){
		if( document.designMode || document.contentEditable ){
        	$('textarea.richer').each( function(){
	            richer.startDesignMode($(this));
	        });
		}
    },

	sendFormatMessage: function(iframe, command, option){
        iframe.contentWindow.focus();
        try {
            iframe.contentWindow.document.execCommand(command, false, option);
        } catch(e){ console.log(e) }
        iframe.contentWindow.focus();
    },
		
	startDesignMode: function(textarea) {
        var iframe = document.createElement("iframe");
		var content = textarea.val();
        iframe.frameBorder  = 0;
        iframe.frameMargin  = 0;
        iframe.framePadding = 0;
        iframe.height = 100;
            iframe.className = textarea.attr('class');
        if(textarea.attr('id'))
            iframe.id = textarea.attr('id');
        if(textarea.attr('name'))
            iframe.title = textarea.attr('name');
        textarea.after(iframe);

        if( $.trim(content) == '' ) content = '<br>';

		var defaultEditorMarkup = "<html><head></head><body class='richerBody'>"+content+"</body></html>";
        richer.tryEnableDesignMode(
			iframe,
			defaultEditorMarkup,
			function() {
	            $("#styling-"+iframe.title).remove();
	            $(iframe).before( richer.stylebar(iframe) );
	            textarea.remove();
        	}
		);
    },

    tryEnableDesignMode: function(iframe, doc, callback){
        try {
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(doc);
            iframe.contentWindow.document.close();
        } catch(error) {
            console.log(error);
        }
        if( document.contentEditable ){
            iframe.contentWindow.document.designMode = "On";
            callback();
            return true;
        } else if( document.designMode != null ){
            try {
                iframe.contentWindow.document.designMode = "on";
                callback();
                return true;
            } catch (error) {
                console.log(error)
            }
        }
        setTimeout(function(){
			richer.tryEnableDesignMode(iframe, doc, callback)
		}, 250);
        return false;
    },

    disableDesignMode: function(iframe, submit) {
        var content = iframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML;
        if( submit == true )
            var textarea = $('<input type="hidden" />');
        else
            var textarea = $('<textarea cols="40" rows="10"></textarea>');
        textarea.val(content);
        t = textarea.get(0);
        if(iframe.className) 	t.className = iframe.className;
        if(iframe.id) 			t.id = iframe.id;
        if(iframe.title) 		t.name = iframe.title;
        $(iframe).before(textarea);
        if( submit != true )
            $(iframe).remove();
        return textarea;
    },

	stylebar: function(iframe) {

	       var tb = $("<div class='richer_stylebar' id='styling-"+iframe.title+"'><div class='containner'>\
                <select class='option'>\
                    <option value='p'>Paragraph</option>\
                    <option value='h1'>Title 1</option>\
                    <option value='h2'>Title 2</option>\
                    <option value='h3'>Title 3</option>\
                    <option value='h4'>Title 4</option>\
                </select>\
				<span class='option separation'></span>\
                <a href='javascript:void(0)' data-format-message='bold' class='option btn bold'></a>\
                <a href='javascript:void(0)' data-format-message='italic' class='option btn italic'></a>\
                <a href='javascript:void(0)' data-format-message='underline' class='option btn underline'></a>\
                <a href='javascript:void(0)' data-format-message='insertunorderedlist' class='option btn unorderedlist'></a>\
            </div></div>");
			//<a href='javascript:void(0)' data-format-method='link' class='option btn link'></a>*/

		richer.sendFormatMessage(iframe, "styleWithCSS", false);

		/*
		 * Maps formats
		 */
        $('select', tb).change(function(){
            var index = this.selectedIndex;
            if( index != 0 ) {
                var selected = this.options[index].value;
                richer.sendFormatMessage(iframe, "formatblock", '<'+selected+'>');
            }
        });

		/*
		 * Maps each button formatting messages
		 */
        $('a[data-format-message]', tb).click(function(){
			richer.sendFormatMessage(iframe, $(this).attr('data-format-message'));
			return false;
		});
		
        $('.link', tb).click(function(){ 
            var p = prompt("URL:");
            if( p )
                richer.sendFormatMessage(iframe, 'CreateLink', p);
            return false;
		});

        $(iframe).parents('form').submit(function(){
            richer.disableDesignMode(iframe, true);
		});
        var iframeDoc = $(iframe.contentWindow.document);

        var select = $('select', tb)[0];
        iframeDoc.mouseup(function(){ 
            richer.setSelectedType( richer.getSelectionElement(iframe), select );
            return true;
        });
        iframeDoc.keyup(function(){ 
            richer.setSelectedType( richer.getSelectionElement(iframe), select );
            var body = $('body', iframeDoc);
            if( body.scrollTop() > 0 ){
				var tempHeight = parseInt(iframe.height) + body.scrollTop();
				// textarea's height equals the textsize
                if( richer.heightEqualText )
					iframe.height = tempHeight
				else
					iframe.height = Math.min(350, tempHeight);
			}
            return true;
        });
		
        return tb;
    },

    setSelectedType: function(node, select) {
        while(node.parentNode) {
            var nName = node.nodeName.toLowerCase();
            for( var i = 0; i < select.options.length; i++ ){
                if( nName == select.options[i].value ){
                    select.selectedIndex=i;
                    return true;
                }
            }
            node = node.parentNode;
        }
        select.selectedIndex=0;
        return true;
    },
    
    getSelectionElement: function(iframe) {
		/*
		 * IE selections
		 */
        if (iframe.contentWindow.document.selection) {
            range = iframe.contentWindow.document.selection.createRange();
            try { 		node = range.parentElement(); 	}
            catch (e) { return false; 					}
        }
		/*
		 * Mozilla selections
		 */
		else {
            try {
                range = iframe.contentWindow.getSelection().getRangeAt(0);
            }
            catch(e){
                return false;
            }
            node = range.commonAncestorContainer;
        }
        return node;
    }
	
}

$(document).ready(function(){
	richer.init();
})

