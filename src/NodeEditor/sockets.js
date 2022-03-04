import Rete from "rete";

const Sockets = {
	NumValue: new Rete.Socket("Num Value"),
	StringValue: new Rete.Socket("String Value"),
	AnyValue: new Rete.Socket("Any Value"),
}

Sockets.NumValue.combineWith(Sockets.AnyValue);
Sockets.StringValue.combineWith(Sockets.AnyValue);

export default Sockets;