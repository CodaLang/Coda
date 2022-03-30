const ProjectBar = () => (
	<nav className="bg-white">
		<div className="h-12 flex mx-auto px-5 shadow-sm items-center flex-wrap">
			{/* Left Side */}
			<div className="w-1/2 flex space-x-5">
				<h1 className="">⚡</h1>
				<h1 className="font-bold">Coda</h1>
			</div>
			<div className="text-right w-1/2">
				<button>
					<h1 className="text-right text-green-500">▶</h1>
				</button>
			</div>
		</div>
	</nav>
);

export default ProjectBar;
