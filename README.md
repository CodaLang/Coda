# The Coda Visual Programming Language
`Coda` is a visual programming language designed for interactive audio development.

It utilizes concepts from Functional Reactive Programming to enable features such as hot-reloading and runtime rewinding to provide a responsive, snappy, and creative environment for developers.

## Getting Started
The simplest way to start composing with Coda is by cloning this repository and installing dependencies with `npm install`. From there, the project can be run with `npm start`. Open [http://localhost:3000](http://localhost:3000) to view the editor in your browser.
___

## The Language
Coda works as a visual programming language, which means that you can drag and drop nodes from the bottom menu onto the editor interface. Each node either represents a function or a signal. A signal, such as `MouseClickSignal`, models a *time-varying value*. In the case of `MouseClickSignal`, this signal represents the coordinates of the mouse whenever the mouse was clicked. Connecting this signal to a function nodes will pipe its value through the function, returning the transformed value continuously.

These function nodes compose further together to form longer chains which will make up your program. Along the way, you can include various functions that will build up audio elements, such as the `Synthesizer` function. These elements allow you to declaratively design the audio and interaction model, such as audio properties or triggers. Finally, the actual IO action of playing audio is done by connecting your audio elements to the ending signal `AudioDestination`.

## Hot Reloading and Rewinding
Coda also allows for quick iterations and debugging by providing reloading and rewinding functionalities. Reloading occurs seamlessly throughout development, where changing variable values in the editor automatically update runtime behavior without needing to restart. Inserting and removing functions also update the runtime once connections are made.

Whenever a signal's value is changed, such as through a mouse click or keyboard press, it's value is recorded to a *timeline*. Pressing the left and right arrow key will allow you to move backwards or forwards through this timeline. At each timeframe, the value is replayed their recorded signal. This allows you to return to older runtime states, but with a potentially new program model.

