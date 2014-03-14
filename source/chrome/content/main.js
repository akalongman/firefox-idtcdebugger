define([
  "firebug/lib/trace",
  "ITDCDebugger/ITDCDBGPanel",
  "ITDCDebugger/myListener",
  "ITDCDebugger/myModule"
],
  // Currently only FBTrace and ITDCDBGPanel are in use.
  function(FBTrace, ITDCDBGPanel, MyListener, MyModule) {
  // ********************************************************************************************* //
  // Documentation

  // Firebug coding style: http://getfirebug.com/wiki/index.php/Coding_Style
  // Now using
  // ITDCDBG coding standards : http://drupal.org/coding-standards and http://drupal.org/node/172169
  // Firebug tracing: http://getfirebug.com/wiki/index.php/FBTrace

  // ********************************************************************************************* //
  // The application/extension object

  var theApp = {
    initialize: function() {

      Firebug.registerStylesheet("chrome://itdcdebugger/skin/itdcdebugger.css");
      Firebug.registerStringBundle("chrome://itdcdebugger/locale/itdcdebugger.properties");
      // Firebug.registerModule(MyModule);
      // Firebug.registerUIListener(MyListener);
      Firebug.registerPanel(ITDCDBGPanel);

      if (FBTrace.DBG_ITDCDEBUGGER) {
        FBTrace.sysout("ITDCDebugger; extension initialize");
      }
    },

    shutdown: function() {
      if (FBTrace.DBG_ITDCDEBUGGER) {
        FBTrace.sysout("ITDCDebugger; extension shutdown");
      }

      // Unregister all registered Firebug components
      // Firebug.unregisterModule(Firebug.MyModule);
      // Firebug.unregisterUIListener(MyListener);
      Firebug.unregisterPanel(Firebug.ITDCDBGPanel);
      Firebug.unregisterStylesheet("chrome://itdcdebugger/skin/itdcdebugger.css");
      Firebug.unregisterStringBundle("chrome://itdcdebugger/locale/itdcdebugger.properties");

      }
  }
  return theApp;
});
