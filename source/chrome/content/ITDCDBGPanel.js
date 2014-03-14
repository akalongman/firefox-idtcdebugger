define([
		"firebug/lib/lib",
		"firebug/lib/object",
		"firebug/lib/trace",
		"firebug/lib/locale",
		"ITDCDebugger/objects/connector"
	],
	function (FBL, Obj, FBTrace, Locale, Connection) {
		Firebug.registerStringBundle("chrome://itdcdebugger/locale/itdcdebugger.properties");
		var panelName = "itdcdebugger";
		var title = Locale.$STR("itdcdebugger.toolbar.button.label")

		Firebug.ITDCDBGPanel = function ITDCDBGPanel() {};
		Firebug.ITDCDBGPanel.prototype = FBL.extend(Firebug.Panel, {
			name: panelName,
			title: title,
			buttons: Connection.buttons,

			initialize: function () {
				Firebug.Panel.initialize.apply(this, arguments);
				Firebug.registerModule(Connection);

				this.panelNode.innerHTML = Connection.panel;
				//this.panelNode.innerHTML = '<iframe src="http://ipn.ge" width="100%" height="100%"></iframe>';

				if (FBTrace.DBG_ITDCDEBUGGER) {
					FBTrace.sysout("ITDCDebugger; ITDCDBGPanel.initialize", this);
				}
			},

			destroy: function (state) {
				Firebug.unregisterModule(Connection);
				Firebug.Panel.destroy.apply(this, arguments);
				if (FBTrace.DBG_ITDCDEBUGGER) {
					FBTrace.sysout("ITDCDebugger; ITDCDBGPanel.destroy");
				}
			},

			/**
			 * Extends toolbar for this panel.
			 */
			getPanelToolbarButtons: function () {
				var buttons = this.buttons;

				for (var i = 0; i < this.buttons.length; i++) {
					hook = this.buttons[i].hook;
					this.buttons[i].command = FBL.bindFixed(Connection.onButton, Connection, hook, this);
				}

				return buttons;
			},

			show: function (state) {
				Firebug.Panel.show.apply(this, arguments);

				Connection.changePanel(Connection.currentButton);
				this.refresh();

				if (FBTrace.DBG_ITDCDEBUGGER) {
					FBTrace.sysout("ITDCDebugger; ITDCDBGPanel.show", state);
				}
			},

			refresh: function () {
				// Render panel content. The HTML result of the template corresponds to:
				// this.panelNode.innerHTML = "<span>" + Locale.$STR("hellobootamd.panel.label") + "</span>";
				// this.MyTemplate.render(this.panelNode);
				this.panelNode.innerHTML = Connection.panel;

				if (FBTrace.DBG_ITDCDEBUGGER) {
					FBTrace.sysout("ITDCDebugger; ITDCDBGPanel.refresh", context);
				}
			}
		});

		return Firebug.ITDCDBGPanel;
	});