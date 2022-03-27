
export const handleSubscription = (inputs, subscriptions, callbacks) => {
	//If there are inputs to the node, add the subscription if it does not exist, otherwise unsubscribe

	// callbacks = { key: callback }
	// inputs = { data: { key: {} } }

	//There are multiple callbacks
	// For every callback there can be multiple inputs
	// We subscribe to specific inputs
	// We unsubsribe if that specfic input is no longer present
	Object.entries(callbacks).forEach(([key, callback]) => {

		const inputNode = inputs[key];

		inputNode.forEach(input => {
			// If the specific input for the specific callback is not  subscribed to
			if (!subscriptions[key] || (subscriptions[key] && !subscriptions[key][input.key]) ){
				subscriptions[key] = subscriptions[key] || {};
				subscriptions[key][input.name] = input.observable.subscribe(callback);
				console.log(subscriptions[key]);
			}
		});
	});



	// Check if any subscriptions no longer have an input. If they don't, unsubscribe
	Object.entries(subscriptions).forEach(([key, inputNodes]) => {
		const inputNode = inputs[key];

		// console.log(inputNode, key, inputNodes);
		// console.log(inputNode.filter(input => input.name === key).length);

		// inputNode.forEach(input => {
		// 	let found = false;

		// });


		Object.entries(inputNodes).forEach( ([nodeID, subscription]) => {
			// console.log(inputNode, nodeID, inputNodes);
			console.log(inputNode);
			console.log(nodeID, subscription);

			if( inputNode.filter(input => input.name.toString() === nodeID).length === 0){
				console.log("unsubscribing");
				subscription.unsubscribe();
				subscriptions[key][nodeID] = null;
			}

			// if ( subscription && (!inputNode || !inputNode[nodeID]) ){
			// }
		});
	})



	// Object.entries(callbacks).forEach(([key, callback]) => {

	// 	if (inputs[key].length !== 0 ){
	// 		inputs[key].forEach(input => {
	// 			if(!subscriptions[input.name]){
	// 				console.log("New Subscription");
	// 				subscriptions[input.name] = input.observable.subscribe(callback);
	// 			}
	// 		});
	// 	}
	// 	else {
	// 		console.log("unsubscribe");
	// 		Object.values(subscriptions).forEach(sub => {
	// 			sub.unsubscribe();
	// 		})
	// 		subscriptions = {};
	// 	}


	// });

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