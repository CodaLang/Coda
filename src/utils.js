
export const handleSubscription = (inputs, subscriptions, callbacks) => {
	//If there are inputs to the node, add the subscription if it does not exist, otherwise unsubscribe

	const unsubscribeAll = () => {
		Object.values(subscriptions).forEach(socket => {
			socket.forEach(sub => {
				sub.unsubscribe();
			})
		});
		subscriptions = {};
	};

	unsubscribeAll();


	if (Object.keys(inputs).length > 0){
		Object.entries(inputs).forEach( ([key, inputSocket]) => {

			if(!subscriptions[inputSocket]){
				subscriptions[inputSocket] = [];
			}

			inputSocket.forEach(input => {
				//If the list of subscriptions does not have a subscription for the input at the specific inputSocket, subscribe
				if (!subscriptions[inputSocket][input.name]){

					subscriptions[inputSocket][input.name] = input.observable.subscribe(callbacks[key]);
					// subscriptions.totalSize += 1;
				}
			});
		});
	}




	// Each component can have mutliple input nodes
	// Object.entries(callbacks).forEach(([key, callback]) => {
	// 	console.log(inputs);

	// 	//Each inputNode can have multiple input lines (bound to the same key/callback)
	// 	const input = inputs[key];

	// 	inputs[key].forEach(input => {
	// 		if (inputs[key].length !== 0){
	// 			if(!subscriptions[input.name]){
	// 				subscriptions[input.name] = input.observable.subscribe(callback);
	// 			}
	// 		} else {
	// 			Object.values(subscriptions).forEach(sub => {
	// 				sub.unsubscribe();
	// 			})
	// 			subscriptions = {};
	// 		}
	// 	})
	// });
	return subscriptions;
}