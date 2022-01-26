import Rete from "rete";

const Sockets = {
	NumValue: new Rete.Socket("Num Value"),
	AnyValue: new Rete.Socket("Any Value"),
}

Sockets.NumValue.combineWith(Sockets.AnyValue);

export default Sockets;