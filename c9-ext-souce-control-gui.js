/**
 * Extension Template for Cloud9 IDE
 * 
 * Inserts a context menu item under the "Edit" menu, which, when
 * clicked, displays a simple window with a "Close" button.
 * 
 * This file is stripped of comments in order to provide a quick template for 
 * future extensions. Please reference our documentation for a list of what's
 * going on.
 *
 * @copyright 2012, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */
 
define(function(require, exports, module) {

var ext     = require("core/ext");
var ide     = require("core/ide");
var menus   = require("ext/menus/menus");
var editors = require("ext/editors/editors");
var BlameJS = require("ext/gitblame/blamejs");
var util    = require("core/util");
var commands = require("ext/commands/commands");

//var markup = require("text!extension_template.xml");

module.exports = ext.register("extension_template", {
    name     : "Extension Template",
    dev      : "Ajax.org",
    alone    : true,
    deps     : [],
    type     : ext.GENERAL,

    nodes : [],

    init : function(){
        var _self = this;
        //this.winExtensionTemplate = winExtensionTemplate;
        commands.addCommand({
            name: "sayhello",
            hint: "I'll say something",
            msg: "this is where msg is",
            bindKey: {mac: "Shift-1", win: "Ctrl-1"},
            isAvailable : function() {
                return true;    
            },
            exec: function(){_self.requestStatus();}
            // function() {
            //     console.log('hi');
            //           var data = {
            //                 command : 'gittools',
            //                 subcommand : "log"
            //             };
            //             console.log('dispatchevent:');
            //     ide.dispatchEvent("track_action", {type: "gittools", cmd: 'gittools', subcommand: data.subcommand});
            //     console.log('dispatchevent:done');
            //     if (ext.execCommand('gittools', data) !== false) {
            //         if (ide.dispatchEvent("consolecommand." + 'gittools', {
            //           data: data
            //         }) !== false) {
            //             if (!ide.onLine) {
            //                 util.alert(
            //                     "Currently Offline",
            //                     "Currently Offline",
            //                     "This operation could not be completed because you are offline."
            //                 );
            //                 console.log('alert');
            //             }
            //             else {
            //                 ide.send(data);
            //                console.log('send');
            //             }
            //         }
            //         else
            //         {
            //             console.log('dispatchevent was false');
            //         }
            //     }
            //     else
            //     {
            //         console.log('execcommand was false');
            //     }
            // }
        });
      
        
        
        
        this.nodes.push(
            menus.addItemByPath("Edit/Extension Template", new apf.item({
                command : "sayhello"
            }), 5400)
        ); 

       /* Just a plain menu...
        this.nodes.push(
            menus.addItemByPath("Edit/Extension Template", new apf.item({
                onclick : function(){
                    _self.winExtensionTemplate.show();
                }
            }), 5400)
        ); */
    },
    requestStatus : function() {
        console.log('status begin')
        var cmd = "gittools";
        //var page = tabEditors.getPage();
        // if (!page)
        //     return;
//         var path = page.$model.data.getAttribute("path");
// 
//         var lastSlash = path.lastIndexOf("/");
//         var fileName = path.substr(lastSlash + 1);
//         var dirName = path.substring(ide.davPrefix.length + 1, lastSlash);
//         if (dirName == "/")
           var dirName = ide.workspaceDir;
        // else
        //     dirName = ide.workspaceDir + "/" + dirName;

        var data = {
            command: "git",
            argv: ["hg", "status"],
            extra: {type: "gitblame",scccmd: 'hgstatus', path:".", original_line: ""},
            requireshandling: !commands.commands.git,
            cwd: dirName // needed for nested repositories
        };
        // @todo should we change server side plugin to not require this?
        data.line = data.argv.join(" ");

        if (!this.$onMessage) {
            this.$onMessage = this.onMessage.bind(this);
            ide.addEventListener("socketMessage", this.$onMessage);
            this.blamejs = {};
        }
        //this.blamejs[path] = new BlameJS();

        var status = "Loading...";
        ide.dispatchEvent("track_action", {type: "blame", cmd: cmd});
        if (ext.execCommand(cmd, data) !== false) {
            if (ide.dispatchEvent("consolecommand." + cmd, {data: data}) !== false) {
                if (!ide.onLine) {
                    status = "This operation could not be completed because you are offline.";
                }
                else {
                    ide.send(data);
                }
            }
        }
       // this.displayGutter([{text: status, title: ""}], path);
    },
    onMessage: function(e) {
        var message = e.message;
        //console.log('onMessage');
        //console.log('type and subtype:' + message.type + ' ' + message.subtype);
        //console.log('extra and extra type:' + message.extra + message.extra.type);
        if (!message.extra || message.extra.type != "gitblame")
            return false;
        // if (!this.blamejs[message.extra.path])
        //     return;
        
        var type = message.type.substr(-5);
        if (type == "-exit") {
            // message.code && util.alert(
            //     "Error", "There was an error returned from the server:",
            //     message.data
            // );
            // delete this.blamejs[path];
            return;
        }
        // Is the body coming in piecemeal? Process after this message
        if (type != "-data" || !message.data) {
            return;
        }
        
        var commandType = message.extra.scccmd;
        
        //real stuff here, parse output
        console.log(commandType + " message received back from server:");
        console.log(message.data);
        
        switch(commandType) {
            case "hgstatus":
                this.onHgStatus(message.data);
        }
//         var path = message.extra.path;
//         var blamejs = this.blamejs[path];
// 
//         if (!blamejs.parseBlame(message.data)) {
//             util.alert(
//                 "Problem Parsing", "Problem Parsing",
//                 "There was a problem parsing the blame output. Blame us, blame the file, but don't blame blame.\nBlame."
//             );
//             return false;
//         }
// 
//         // Now formulate the output
//         this.formulateOutput(blamejs, path);
    },

    onHgStatus : function(message) {
        console.log('on hg status');
        // this.gitLogs[message.body.file].revisions[message.body.hash] =
        //     message.body.out;
        // editors.currentEditor.amlEditor.getSession().setValue(message.body.out);
        // editors.currentEditor.amlEditor.$editor.setReadOnly(true);
    },

    onGitBlameMessage: function(message) {
        if (!this.blamejs.parseBlame(message.body.out)) {
            util.alert(
                "Problem Parsing",
                "Problem Parsing",
                "There was a problem parsing the blame output."
            );

            return false;
        }

        this.outputGitBlame(this.blamejs.getCommitData(), this.blamejs.getLineData());
    },

    hook : function(){
        var _self = this;
        ext.initExtension(this);
    },

    enable : function(){
        this.nodes.each(function(item){
            item.enable();
        });
    },

    disable : function(){
        this.nodes.each(function(item){
            item.disable();
        });
    },

    destroy : function(){
        this.nodes.each(function(item){
            item.destroy(true, true);
        });
        this.nodes = [];
    },

     closeExtensionTemplateWindow : function(){
       // this.winExtensionTemplate.hide();
     }
});

});