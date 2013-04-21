// Wrapped in JavaScript, to avoid cross-origin restrictions, created using wrap-in-js.sh
define(function() {
return '<a:application xmlns:a="http://ajax.org/2005/aml">\n' +
'    <a:window\n' +
'        id = "commitWindow"\n' +
'        title = "Mercurial Commit"\n' +
'        center = "true"\n' +
'        modal = "false"\n' +
'        buttons = "close"\n' +
'        kbclose = "true"\n' +
'        width = "800"\n' +
'        height = "500">\n' +
'        \n' +
'        <a:vbox heigh="400" id="statusLines">\n' +
'            \n' +
'        </a:vbox>\n' +
'        <a:divider />\n' +
'        <a:hbox pack="start" padding="5" edge="10 10 5 10">\n' +
'            <a:button id="windowClose">Close</a:button>\n' +
'        </a:hbox>\n' +
'    </a:window>\n' +
'</a:application>\n' +'';});
