import { getUserData } from './lib.js';

export default {
	async fetch(request) {
		const params = new URL(request.url).searchParams;
		const userId = params.get("userId");

		if(!userId) {
			return new Response('no userId searchParam provided', { status: 400 });
		}
		const userData = await getUserData(userId);
		return Response.json(userData);
	},
};
