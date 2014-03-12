FBL.ns(function() { with (FBL) {

function itdc_debuggerPanel() {}

itdc_debuggerPanel.prototype = extend(Firebug.Panel,
{
    name: "itdc_debugger",
    title: "ITDC Debugger",

    initialize: function() {
        Firebug.Panel.initialize.apply(this, arguments);
        alert('One-time ITDC Debugger extension init done.');
    }

});



Firebug.itdc_debuggerModel = extend(Firebug.Module,
{
    showPanel: function(browser, panel) {
        var isitdc_debuggerPanel = panel && panel.name == "itdc_debugger";
        var itdc_debuggerButtons = browser.chrome.$("fbitdc_debuggerButtons");
        collapse(itdc_debuggerButtons, !isitdc_debuggerPanel);

        if (!isitdc_debuggerPanel) return;

        var doc = panel.document;
        var itdc_debugger_div = panel.panelNode;

        if (!this.initialized) {
            var t = doc.createTextNode('I am the ITDC Debugger extension and I approved this message.');
            itdc_debugger_div.appendChild(t);
            this.initialized = true;
        }

    },

    onAboutButton: function(context) {
        alert("ITDC Debugger extension by Avtandil Kikabidze; http://www.long.ge");
    }
});



Firebug.registerPanel(itdc_debuggerPanel);
Firebug.registerModule(Firebug.itdc_debuggerModel);

}});