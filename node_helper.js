const ynab = require('ynab');
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

	socketNotificationReceived: function (noti, payload) {
		console.log("Notification received: " + noti);
		if (noti == "SET_CONFIG") {
			this.initialize(payload);
		}
	},

	initialize: function (payload) {
		console.log("initialize");
		this.config = payload;
		var ynabAPI = new ynab.API(this.config.token);

		console.log("created api");

		ynabAPI.budgets.getBudgets().then(budgetsResponse => {
			console.log("budgetsResponse: " + JSON.stringify(budgetsResponse));
			this.ynabBudgetId = budgetsResponse.data.budgets[0].id;
			this.updateBudget();
			setInterval(this.updateBudget, 30000);
		}).catch(e => {
			console.log("error: " + e);
		});
	},

	updateBudget: function () {
		console.log("updateBudget: " + this.ynabBudgetId);

		var ynabAPI = new ynab.API(this.config.token);

		console.log("created api");
		
		ynabAPI.categories.getCategories(this.ynabBudgetId).then(categoriesResponse => {
			console.log("categoriesResponse: " + JSON.stringify(categoriesResponse));

			var items = [];
			for (let grp of categoriesResponse.data.category_groups) {
				console.log("group: " + grp);
				if (grp.name == this.config.categoryGroup) {
					console.log("matched group");
					for (let cat of grp.categories) {
						if (!cat.hidden) {
							console.log("cat: " + cat.name);
							items.push(cat);
						}
					}
					console.log("done matched group");
					break;
				}
			}
			this.sendSocketNotification("UPDATE", {
				items: items,
			});
			console.log("sent update");
		}).catch(e => {
			console.log("error: " + e);
		});
	}
});
