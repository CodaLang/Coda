import Rete from "rete";

const Sockets = {
	NumValue: new Rete.Socket("Num Value"),
	AnyValue: new Rete.Socket("Any Value"),
	StringValue: new Rete.Socket("String Value"),
	BooleanValue: new Rete.Socket("Boolean Value"),
}

Sockets.NumValue.combineWith(Sockets.AnyValue);
Sockets.StringValue.combineWith(Sockets.AnyValue);
Sockets.BooleanValue.combineWith(Sockets.AnyValue);

export default Sockets;