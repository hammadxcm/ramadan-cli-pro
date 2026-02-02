declare module "node-notifier" {
	const notifier: { notify(options: { title: string; message: string }): void };
	export default notifier;
}
