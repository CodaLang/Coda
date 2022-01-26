
export const handleSubscription = (inputs, key, subscriptions, callback) => {
	//If there are inputs to the node, add the subscription if it does not exist, otherwise unsubscribe

	console.log(inputs);

	const input = inputs.data[0];

	if(inputs.data.length !== 0 ){
		if(!subscriptions[input.name]){
			subscriptions[input.name] = input.observable.subscribe(callback)
		}

	} else {
		Object.values(subscriptions).forEach((sub) => {
			sub.unsubscribe();
		})
		subscriptions = {};
	}
	return subscriptions;
}