export default {
	logout (user) {
		this.emit('logout', user)
	}
}
