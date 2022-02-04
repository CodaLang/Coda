
export const handleSubscription = (inputs, subscriptions, callbacks) => {
	//If there are inputs to the node, add the subscription if it does not exist, otherwise unsubscribe

	Object.entries(callbacks).forEach(([key, callback]) => {
		console.log(inputs);
		inputs[key].forEach(input => {
			if (inputs[key].length !== 0){
				if(!subscriptions[input.name]){
					subscriptions[input.name] = input.observable.subscribe(callback);
				}
			} else {
				Object.values(subscriptions).forEach(sub => {
					sub.unsubscribe();
				})
				subscriptions = {};
			}
		})
	});
	return subscriptions;
}