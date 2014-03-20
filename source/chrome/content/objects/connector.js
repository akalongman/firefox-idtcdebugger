define([
		"firebug/lib/object",
		"firebug/lib/trace",
		"firebug/lib/locale",
		"firebug/lib/domplate"
	],
	function (Obj, FBTrace, Locale, Domplate) {
		Firebug.registerStringBundle("chrome://itdcdebugger/locale/itdcdebugger.properties");
		var DFFapi = "legacy";
		var error = Locale.$STR("itdcdebugger.panel.error")
		var ITDCDBGSite = content.document.getElementById('itdcdebugger_general');
		var defaultContent = error;
		if (ITDCDBGSite) {
			defaultContent = ITDCDBGSite.innerHTML;
		}

		Firebug.Connection = Obj.extend(Firebug.Module, {
			buttons: [],
			api: DFFapi,
			currentButton: "general",
			panel: defaultContent,

			initialize: function (owner) {
				Firebug.Module.initialize.apply(this, arguments);
				Firebug.registerStringBundle("chrome://itdcdebugger/locale/itdcdebugger.properties");

				this.api = Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService)
					.getBranch("extensions.itdcdebugger.");

				this.api.QueryInterface(Components.interfaces.nsIPrefBranch2);
				this.api.addObserver("", this, false);

				this.api = this.api.getCharPref("API").toUpperCase();

				var url = window.content.document.location;

				var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
				//var pattern = new RegExp('^(\.+)$','i'); // fragment locater

    				if (!pattern.test(url)) {
					FBTrace.sysout("ITDCDebugger; not valid url: "+url, this);
					return false;
				}
				url += '/itdc/system/debug';
				this.panel = '<iframe id="itdcdebugger_iframe" src="'+url+'" width="100%" height="100%"></iframe>';

				this.MyTemplate.render(this.panel);

/*Components.utils.import("resource://gre/modules/FileUtils.jsm");

var env = Components.classes["@mozilla.org/process/environment;1"]
                    .getService(Components.interfaces.nsIEnvironment);
var shell = new FileUtils.File(env.get("COMSPEC"));
var args = ["/c", "ping stackoverflow.org"];

var process = Components.classes["@mozilla.org/process/util;1"]
                        .createInstance(Components.interfaces.nsIProcess);
process.init(shell);
process.runAsync(args, args.length);*/

//var iframe = document.getElementById('itdcdebugger_iframe');

FBTrace.sysout("ITDCDebugger; IFRAME: "+Firebug.Connection.MyTemplate, this);

var open_file = window.content.document.getElementsByClassName('open_file');
//alert(open_file.length);

if (open_file) {
	for (var key = 0; key < open_file.length; key++) {
		//FBTrace.sysout("ITDCDebugger; "+key, this);

		open_file[key].addEventListener('click', function(e) {
			e.preventDefault()
			if (this.dataset.openfile) {
				var filePath = this.dataset.openfile.trim();
				alert('CLICK');
			};
		});
	}
}



				if (FBTrace.DBG_ITDCDEBUGGER) {
					FBTrace.sysout("ITDCDebugger; ITDCDBGConnection.initialize", this);
				}
			},

			shutdown: function () {
				Firebug.Module.shutdown.apply(this, arguments);
				this.api.removeObserver("", this);

				/*for (var i = 0; i < this.buttons.length; i++) {
					Firebug.chrome.removeToolbarButton(this.buttons[i]);
				}*/

				if (FBTrace.DBG_ITDCDEBUGGER) {
					FBTrace.sysout("ITDCDebugger; ITDCDBGConnection.shutdown");
				}

			},

			changePanel: function (hook) {
				filterCategory = this.currentButton;
				var parserUtils = Components.classes["@mozilla.org/parserutils;1"]
					.getService(Components.interfaces.nsIParserUtils);

				// get the currently requested content
				var ITDCDBGFirebugContent = content.document.getElementById('itdcdebugger_' + filterCategory).cloneNode(true);
				//hidden = ITDCDBGFirebugContent.getElementsByClassName("content");
				// remove the style="hidded" from the .content elements.
				//for(var i = 0; i < hidden.length; i++) {
				//   hidden[i].removeAttribute("style");
				//}

				if (ITDCDBGFirebugContent) {
					this.panel = parserUtils.sanitize(ITDCDBGFirebugContent.innerHTML, 0);
				} else {
					this.panel = error;
				}

				if (FBTrace.DBG_ITDCDEBUGGER) {
					FBTrace.sysout("ITDCDebugger; ITDCDBGConnection.changePanel", parserUtils);
				}

			},

			onButton: function (hook, panel) {
				this.currentButton = hook;
				this.changePanel(hook);

				if (FBTrace.DBG_ITDCDEBUGGER) {
					FBTrace.sysout("ITDCDebugger; ITDCDBGConnection.onButton", this);
				}

				panel.refresh();

			}

		});

		// ********************************************************************** //
		// Panel UI (Domplate)

		// Register locales before the following template definition.
		Firebug.registerStringBundle("chrome://itdcdebugger/locale/itdcdebugger.properties");

		/**
		 * Domplate template used to render panel's content. Note that the template uses
		 * localized strings and so, Firebug.registerStringBundle for the appropriate
		 * locale file must be already executed at this moment.
		 */
		with(Domplate) {
			Firebug.Connection.MyTemplate = domplate({
				tag: DIV(
					SPAN(
						Locale.$STR("itdcdebugger.panel.error")
					)
				),

				render: function (parentNode) {
					this.tag.replace({}, parentNode);
				}



			})
		}

		return Firebug.Connection;
	});