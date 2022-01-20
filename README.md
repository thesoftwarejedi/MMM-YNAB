# MMM-YNAB

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/) which can show remaining dollars in categories from budgets from YNAB.

![Example of MMM-YNAB](./screenshot.png)

## Installation ##

1. Run `git clone https://github.com/thesoftwarejedi/MMM-YNAB.git` in the directory `~/MagicMirror/modules`
2. Change directories to the new folder `cd MMM-YNAB` and then run `npm install`

## Using the module

To use this module, get a YNAB access token for your YNAB account from https://api.youneedabudget.com/, then add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
    modules: [
        {
            module: "MMM-YNAB",
            position: "top_bar",
            config: {
                token: "ADD_YNAB_TOKEN_HERE",
                categories: [ "Household", "Pets", "Grocery", "Kids Clothes", "Restaurants", "Lunch", "Spontaneous Fun" ],
                // budgetId: 3d894cb9-d783-4bd0-a9a6-f7a3c79becc1, // Optional
            }
        },
    ]
}
```

Your own categories will work, but the ones above are default

By default the first budget found in your account will be used. To specify a specific budget, use the `budgetId` config option. Find your budget Id by navigating to your budget in YNAB and looking at the URL. `https://app.youneedabudget.com/{{BUDGET_ID_AS_UUID}}/budget`
