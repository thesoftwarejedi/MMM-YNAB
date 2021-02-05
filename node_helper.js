const ynab = require('ynab');
var NodeHelper = require("node_helper");
var ynabBudgetId;
var config;
var self;
var interval;

module.exports = NodeHelper.create({

	socketNotificationReceived: function (noti, payload) {
		console.log("Notification received: " + noti);
		if (noti == "SET_CONFIG") {
			this.initialize(payload);
		}
	},

	initialize: function (payload) {
		console.log("initialize");
		config = payload;
		var ynabAPI = new ynab.API(config.token);

		console.log("created api");

		ynabAPI.budgets.getBudgets().then(budgetsResponse => {
			console.log("budgetsResponse: " + JSON.stringify(budgetsResponse));
			ynabBudgetId = budgetsResponse.data.budgets[0].id;
			this.updateBudget();
			if (!interval) {
				self = this;
				interval = setInterval(this.updateBudget, 30000);
			}
		}).catch(e => {
			console.log("error: " + e);
		});
	},

	updateBudget: function () {
		console.log("updateBudget: " + ynabBudgetId);
		var ynabAPI = new ynab.API(config.token);
		console.log("created api");
		ynabAPI.categories.getCategories(ynabBudgetId).then(categoriesResponse => {
			console.log("got cats");
			const map = [].concat(...Array.from(categoriesResponse.data.category_groups.map(a => Array.from(a.categories)))).reduce((map, o) => { map[o.name] = o; return map; }, new Map());
			var list = config.categories.map(a => map[a]).filter(a => a != undefined);
			console.log("list: " + JSON.stringify(list));
			self.sendSocketNotification("UPDATE", {
				items: list,
			});
			console.log("sent update");
		}).catch(e => {
			console.log("error: " + e);
		});
	}
});
