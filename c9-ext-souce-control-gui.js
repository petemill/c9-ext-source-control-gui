
(function() {
    
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  
define(function(require, exports, module) {
      
    var editors, ext, ide, markup, util, menus;
    ide = require('core/ide');
    ext = require('core/ext');
    util = require('core/util');
    editors = require('ext/editors/editors');
    markup = require('./markup-ams.xml.js');
    menus = require("ext/menus/menus");
    
    return module.exports = ext.register('ext/sourcecontrolgui/sourcecontrolgui', {
        name     : "Source Control GUI",
        dev      : "Wishfulcode",
        type: ext.GENERAL,
        alone: true,
        markup: markup,
        hotitems: {},
        nodes: [],

        hook: function() {
            var mnuTools = menus.addItemByPath("Tools");
            this.nodes.push(mnuTools.appendChild(new apf.item({
              caption: 'Mercurial Commit',
              onclick: __bind(function() {
                this.beginMercurialCommit();
              }, this)
            })));
        },
        
        beginMercurialCommit: function() {
            ext.initExtension(this);
            //show the window
            this.commitWindow.show();
            //begin the process by checking which files have been modified
            this.runCommand('hgstatus',["hg", "status"], '.');
            //display waiting status
            this.tempStatusLine = new apf.checkbox({
                id   : "chk1",
                label : "Waiting for data..."
            });
            this.uiStatusLines.appendChild(this.tempStatusLine);
        },
        
        init: function() {
            
            //define UI item references
            this.uiStatusLines = statusLines;
            this.uiWindowClose = windowClose;
            this.commitWindow = commitWindow;
            
            this.uiWindowClose.addEventListener('click', __bind(function() {
              return this.commitWindow.close();
            }, this));
            
            
        },
        
        enable: function() {
            this.nodes.each(function(item) {
              item.enable();
            });
        },
        
        disable: function() {
            this.nodes.each(function(item) {
              item.disable();
            });
        },
        
        destroy: function() {
            this.nodes.each(function(item) {
              item.destroy(true, true);
            });
            this.nodes = [];
            this.scratchpadClose.removeEventListener('click');
            this.scratchpadAdd.removeEventListener('click');
            this.scratchpadTabs.destroy(true, true);
            this.scratchpadAdd.destroy(true, true);
            this.scratchpadClose.destroy(true, true);
            this.commitWindow.destroy(true, true);
        },
        
        onHgStatus : function(message) {
            console.log('on hg status');
            
            //parse hg status results
            var statusRaw = message;
            var statusLines = statusRaw.split('\n');
            console.log('split lines', statusLines);
            //display results
            for (var statusLinesIt in statusLines) {
                var statusLine = statusLines[statusLinesIt];
                if (statusLine !== "" && typeof statusLine === "string") {
                     this.uiStatusLines.appendChild(new apf.checkbox({
                        label : statusLine
                    }));
                }
            }
            
            //temp: show the raw results
            this.tempStatusLine.setAttribute('label',statusRaw);

        },
        
        onMessage: function(e) {
            var message = e.message;
            
            if (!message.extra || message.extra.type != "gitblame")
                return false;
            
            var type = message.type.substr(-5);
            if (type == "-exit") {
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
        },
        
        runCommand : function(scccmd, argv, path) {
        
            console.log('runCommand');
            console.log('argb',argv,'sccmd',scccmd,'path',path);
            var cmd = "gittools";
            
            var dirName = ide.workspaceDir;
            
            var data = {
                command: "git",
                argv: argv,
                extra: {type: "gitblame",scccmd: scccmd, path:path, original_line: ""},
                requireshandling: true,
                cwd: dirName 
            };
            // server side plugin requires this
            data.line = data.argv.join(" ");
            
            if (!this.$onMessage) {
                this.$onMessage = this.onMessage.bind(this);
                ide.addEventListener("socketMessage", this.$onMessage);
                this.blamejs = {};
            }
            
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
            
        },
    });
});
}).call(this);

