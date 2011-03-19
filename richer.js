/*
 * Richer text editing
 *
 * Based on RTE by Batiste Bieler
 */
var heightEqualText = false;


$(document).ready(function(){

	if( document.designMode || document.contentEditable ){
        $('textarea.richer').each( function(){
            startDesignMode($(this));
        });
    }

	function formatText(iframe, command, option) {
        iframe.contentWindow.focus();
        try {
            iframe.contentWindow.document.execCommand(command, false, option);
        } catch(e){ console.log(e) }
        iframe.contentWindow.focus();
    }
		
	function startDesignMode(textarea) {
        var iframe = document.createElement("iframe");
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

		var defaultEditorMarkup = "<html><head></head><body class='richerBody'>"+textarea.val()+"</body></html>";
        tryEnableDesignMode(
			iframe,
			defaultEditorMarkup,
			function() {
	            $("#styling-"+iframe.title).remove();
	            $(iframe).before(stylebar(iframe));
	            textarea.remove();
        	}
		);
    }

    function tryEnableDesignMode(iframe, doc, callback) {
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
			//tryEnableDesignMode(iframe, doc, callback)
		}, 250);
        return false;
    }

    function disableDesignMode(iframe, submit) {
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
    }

	function stylebar(iframe) {

	       var tb = $("<div class='richer_stylebar' id='styling-"+iframe.title+"'><div>\
            <p>\
                <select>\
                    <option value='p'>Paragraph</option>\
                    <option value='h1'>Title 1</option>\
                    <option value='h2'>Title 2</option>\
                    <option value='h3'>Title 3</option>\
                    <option value='h4'>Title 4</option>\
                </select>\
                <a href='javascript:void(0)' class='bold'><strong>Bold</strong></a>\
                <a href='javascript:void(0)' class='italic'><em>Italic</em></a>\
                <a href='javascript:void(0)' class='unorderedlist'>List</a>\
                <a href='javascript:void(0)' class='link'>Link</a>\
            </p></div></div>");

        $('select', tb).change(function(){
            var index = this.selectedIndex;
            if( index!=0 ) {
                var selected = this.options[index].value;
                formatText(iframe, "formatblock", '<'+selected+'>');
            }
        });
        $('.bold', tb).click(function(){ formatText(iframe, 'bold'); 							return false; });
        $('.italic', tb).click(function(){ formatText(iframe, 'italic'); 						return false; });
        $('.unorderedlist', tb).click(function(){ formatText(iframe, 'insertunorderedlist'); 	return false; });
        $('.link', tb).click(function(){ 
            var p=prompt("URL:");
            if(p)
                formatText(iframe, 'CreateLink', p);
            return false; });

        $(iframe).parents('form').submit(function(){
            disableDesignMode(iframe, true);
		});
        var iframeDoc = $(iframe.contentWindow.document);

        var select = $('select', tb)[0];
        iframeDoc.mouseup(function(){ 
            setSelectedType(getSelectionElement(iframe), select);
            return true;
        });
        iframeDoc.keyup(function(){ 
            setSelectedType(getSelectionElement(iframe), select);
            var body = $('body', iframeDoc);
			window.status = body.scrollTop();
            if( body.scrollTop() > 0 ){
				var tempHeight = parseInt(iframe.height) + body.scrollTop();
				// textarea's height equals the textsize
                if( heightEqualText )
					iframe.height = tempHeight
				else
					iframe.height = Math.min(350, tempHeight);
			}
            return true;
        });
		
        return tb;
    }

    function setSelectedType(node, select) {
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
    }
    
    function getSelectionElement(iframe) {
        if (iframe.contentWindow.document.selection) {
            // IE selections
            selection = iframe.contentWindow.document.selection;
            range = selection.createRange();
            try {
                node = range.parentElement();
            }
            catch (e) {
                return false;
            }
        } else {
            // Mozilla selections
            try {
                selection = iframe.contentWindow.getSelection();
                range = selection.getRangeAt(0);
            }
            catch(e){
                return false;
            }
            node = range.commonAncestorContainer;
        }
        return node;
    }
	
})


