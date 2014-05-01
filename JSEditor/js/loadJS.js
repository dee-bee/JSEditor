function loadjscssfile(filename, filetype){
 if (filetype=="js"){ //if filename is a external JavaScript file
  var fileref=document.createElement('script')
  fileref.setAttribute("type","text/javascript")
  fileref.setAttribute("src", filename)
 }
 else if (filetype=="css"){ //if filename is an external CSS file
  var fileref=document.createElement("link")
  fileref.setAttribute("rel", "stylesheet")
  fileref.setAttribute("type", "text/css")
  fileref.setAttribute("href", filename)
 }
 if (typeof fileref!="undefined")
  document.getElementsByTagName("head")[0].appendChild(fileref)
}


loadjscssfile(JSpath + "js/jquery-1.7.2.js", "js");
loadjscssfile(JSpath + "js/jquery.highlight-3.js", "js");

loadjscssfile(JSpath + "js/ajaxslt-read-only/util.js", "js");
loadjscssfile(JSpath + "js/ajaxslt-read-only/xmltoken.js", "js");
loadjscssfile(JSpath + "js/ajaxslt-read-only/dom.js", "js");
loadjscssfile(JSpath + "js/ajaxslt-read-only/xpath.js", "js");
loadjscssfile(JSpath + "js/ajaxslt-read-only/xslt.js", "js");

loadjscssfile(JSpath + "js/jzaefferer-jquery-treeview-3937863/jquery.treeview.css", "css");
loadjscssfile(JSpath + "js/jzaefferer-jquery-treeview-3937863/demo/screen.css", "css");

loadjscssfile(JSpath + "js/jzaefferer-jquery-treeview-3937863/jquery.treeview.js", "js");
loadjscssfile(JSpath + "js/jzaefferer-jquery-treeview-3937863/lib/jquery.cookie.js", "js");
loadjscssfile(JSpath + "js/jzaefferer-jquery-treeview-3937863/demo/demo.js", "js");

loadjscssfile(JSpath + "js/jquery_ui/css/smoothness/jquery-ui-1.8.20.custom.css", "css");
loadjscssfile(JSpath + "js/jquery_ui/js/jquery-ui-1.8.20.custom.min.js", "js");

loadjscssfile(JSpath + "js/tiny_mce/tiny_mce.js", "js");

loadjscssfile(JSpath + "js/tiny_mce/jquery.highlight-3.js", "js");


tinyMCE.init({
		// General options
		mode : "specific_textareas",
		theme : "advanced",
		editor_selector : "mceEditor",
		plugins : "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,autosave,visualblocks",

		// Theme options
		theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft,visualblocks",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true,

		// Example content CSS (should be your site CSS)
		content_css : "css/content.css",

		// Drop lists for link/image/media/template dialogs
		template_external_list_url : "lists/template_list.js",
		external_link_list_url : "lists/link_list.js",
		external_image_list_url : "lists/image_list.js",
		media_external_list_url : "lists/media_list.js",

		// Style formats
		style_formats : [
			{title : 'Bold text', inline : 'b'},
			{title : 'Red text', inline : 'span', styles : {color : '#ff0000'}},
			{title : 'Red header', block : 'h1', styles : {color : '#ff0000'}},
			{title : 'Example 1', inline : 'span', classes : 'example1'},
			{title : 'Example 2', inline : 'span', classes : 'example2'},
			{title : 'Table styles'},
			{title : 'Table row 1', selector : 'tr', classes : 'tablerow1'}
		],

		// Replace values for the template plugin
		template_replace_values : {
			username : "Some User",
			staffid : "991234"
		}
	});
