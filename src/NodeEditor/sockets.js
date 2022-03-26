import Rete from "rete";

const Sockets = {
	NumValue: new Rete.Socket("Num Value"),
	AnyValue: new Rete.Socket("Any Value"),
	StringValue: new Rete.Socket("String Value")
}

Sockets.NumValue.combineWith(Sockets.AnyValue);
Sockets.StringValue.combineWith(Sockets.AnyValue);

export default Sockets;