
export const handleSubscription = (inputs, subscriptions, callbacks) => {
	//If there are inputs to the node, add the subscription if it does not exist, otherwise unsubscribe

	// callbacks = { key: callback }
	// inputs = { data: { key: {} } }

	Object.entries(callbacks).forEach(([key, callback]) => {

		if (inputs[key].length !== 0 ){
			inputs[key].forEach(input => {
				if(!subscriptions[input.name]){
					console.log("New Subscription");
					subscriptions[input.name] = input.observable.subscribe(callback);
				}
			});
		}
		else {
			console.log("unsubscribe");
			Object.values(subscriptions).forEach(sub => {
				sub.unsubscribe();
			})
			subscriptions = {};
		}


	});

	// Object.entries(callbacks).forEach(([key, callback]) => {
	// 	inputs[key].forEach(input => {
	// 		if (inputs[key].length !== 0){ //if input socket is empty
	// 			if(!subscriptions[input.name]){
	// 				console.log("New Subscription");
	// 				subscriptions[input.name] = input.observable.subscribe(callback);
	// 			}
	// 		} else {
	// 			console.log("Unsubscribe");
	// 			Object.values(subscriptions).forEach(sub => {
	// 				sub.unsubscribe();
	// 			})
	// 			subscriptions = {};
	// 		}
	// 	});
	// });
	return subscriptions;
}