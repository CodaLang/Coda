
export const handleSubscription = (inputs, subscriptions, callbacks) => {
	//If there are inputs to the node, add the subscription if it does not exist, otherwise unsubscribe

	const unsubscribeAll = () => {
		Object.entries(subscriptions).forEach( ([socketKey, sub]) => {
			sub.unsubscribe();
			delete subscriptions[socketKey];
		});
	};

	unsubscribeAll();

	if (Object.keys(inputs).length > 0){
		Object.entries(inputs).forEach( ([key, inputSocket]) => {
			const inputNode = inputSocket[0];
			if (inputNode && inputNode.name && (!subscriptions[key] || subscriptions[key] === undefined)){
				subscriptions[key] = inputNode.observable.subscribe(callbacks[key]);
			}
		});
	}

	return subscriptions;
}
