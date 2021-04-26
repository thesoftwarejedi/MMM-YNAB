const ynab = require('ynab');
var NodeHelper = require("node_helper");
var ynabBudgetId;
var config;
var self;
var interval;

module.exports = NodeHelper.create({
	
	var ynabBudgetId;
	var ynabAPI;

	socketNotificationReceived: function (noti, payload) {
		console.log("Notification received: " + noti);
		if (noti == "SET_CONFIG") {
			this.initialize(payload);
		}
	},

	initialize: function (payload) {
		console.log("initialize");
		config = payload;
		this.ynabAPI = new ynab.API(config.token);

		console.log("created api");

		this.ynabAPI.budgets.getBudgets().then(budgetsResponse => {
			console.log("budgetsResponse: " + JSON.stringify(budgetsResponse));
			//ynabBudgetId = budgetsResponse.data.budgets[0].id;
			//ynabBudgetId = ynabAPI(config.budget_id);
			this ynabBudgetId = "22c7f7a8-4924-4b12-97a9-7f198dd9025b";
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
		console.log("updateBudget: " + this.ynabBudgetId);
		//var ynabAPI = new ynab.API(config.token);
		console.log("created api");
		this.ynabAPI.categories.getCategories(this.ynabBudgetId).then(categoriesResponse => {
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
