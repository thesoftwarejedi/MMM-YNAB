const ynab = require('ynab');
var NodeHelper = require("node_helper");
var ynabBudgetId;
var config;
var self;
var interval;

module.exports = NodeHelper.create({

	socketNotificationReceived: function (noti, payload) {
		if (noti == "YNAB_SET_CONFIG") {
			this.initialize(payload);
		}
	},

	initialize: function (payload) {
		config = payload;
		var ynabAPI = new ynab.API(config.token);

		ynabAPI.budgets.getBudgets().then(budgetsResponse => {
			ynabBudgetId = budgetsResponse.data.budgets[0].id;
			this.updateBudget();
			if (!interval) {
				self = this;
				interval = setInterval(this.updateBudget, 90000);
			}
		}).catch(e => {
			console.log("error: " + e);
		});
	},

	updateBudget: function () {
		var ynabAPI = new ynab.API(config.token);
		ynabAPI.categories.getCategories(ynabBudgetId).then(categoriesResponse => {
			const map = [].concat(...Array.from(categoriesResponse.data.category_groups.map(a => Array.from(a.categories)))).reduce((map, o) => { map[o.name] = o; return map; }, new Map());
			var list = config.categories.map(a => map[a]).filter(a => a != undefined);
			self.sendSocketNotification("YNAB_UPDATE", {
				items: list,
			});
		}).catch(e => {
			console.log("error: " + e);
		});
	}
});
