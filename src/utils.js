
// export const handleSubscription = (inputs, subscriptions, callbacks) => {
// 	//If there are inputs to the node, add the subscription if it does not exist, otherwise unsubscribe

// 	// callbacks = { key: callback }
// 	// inputs = { data: { key: {} } }

// 	//There are multiple callbacks
// 	// For every callback there can be multiple inputs
// 	// We subscribe to specific inputs
// 	// We unsubsribe if that specfic input is no longer present
// 	Object.entries(callbacks).forEach(([key, callback]) => {

// 		const inputNode = inputs[key];

// 		inputNode.forEach(input => {
// 			if (subscriptions[key]){
// 				console.log(subscriptions[key][input.key]);
// 			}


// 			if (!subscriptions[key] || 
// 				(subscriptions[key] && (subscriptions[key][input.key] === undefined || subscriptions[key][input.key] === null) ) ){
// 				console.log("New Subscription");
// 				subscriptions[key] = subscriptions[key] || {};
// 				subscriptions[key][input.name] = input.observable.subscribe(callback);
// 				// console.log(subscriptions[key]);
// 			}
// 		});
// 	});



// 	// Check if any subscriptions no longer have an input. If they don't, unsubscribe
// 	Object.entries(subscriptions).forEach(([key, inputNodes]) => {
// 		const inputNode = inputs[key];

// 		Object.entries(inputNodes).forEach( ([nodeID, subscription]) => {
// 			// console.log(inputNode, nodeID, inputNodes);
// 			// console.log(inputNode);
// 			// console.log(nodeID, subscription);

// 			if( subscription && inputNode.filter(input => input.name.toString() === nodeID).length === 0){
// 				console.log("unsubscribing");
// 				subscription.unsubscribe();
// 				subscriptions[key][nodeID] = null;
// 			}

// 			// if ( subscription && (!inputNode || !inputNode[nodeID]) ){
// 			// }
// 		});
// 	})

// 	console.log(subscriptions);



// 	// Object.entries(callbacks).forEach(([key, callback]) => {

// 	// 	if (inputs[key].length !== 0 ){
// 	// 		inputs[key].forEach(input => {
// 	// 			if(!subscriptions[input.name]){
// 	// 				console.log("New Subscription");
// 	// 				subscriptions[input.name] = input.observable.subscribe(callback);
// 	// 			}
// 	// 		});
// 	// 	}
// 	// 	else {
// 	// 		console.log("unsubscribe");
// 	// 		Object.values(subscriptions).forEach(sub => {
// 	// 			sub.unsubscribe();
// 	// 		})
// 	// 		subscriptions = {};
// 	// 	}


// 	// });

// 	// Object.entries(callbacks).forEach(([key, callback]) => {
// 	// 	inputs[key].forEach(input => {
// 	// 		if (inputs[key].length !== 0){ //if input socket is empty
// 	// 			if(!subscriptions[input.name]){
// 	// 				console.log("New Subscription");
// 	// 				subscriptions[input.name] = input.observable.subscribe(callback);
// 	// 			}
// 	// 		} else {
// 	// 			console.log("Unsubscribe");
// 	// 			Object.values(subscriptions).forEach(sub => {
// 	// 				sub.unsubscribe();
// 	// 			})
// 	// 			subscriptions = {};
// 	// 		}
// 	// 	});
// 	// });
// 	return subscriptions;
// }


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
	return subscriptions;
}
