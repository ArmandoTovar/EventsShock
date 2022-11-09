class AuthStorage {
  constructor(namespace = 'auth') {
    this.namespace = namespace;
  }
  getAccessToken() {
    // Get the access token for the storage
    const token = localStorage.getItem(`${this.namespace}:token`);
    return token ? token : null;
  }

  setAccessToken(accessToken) {
    localStorage.setItem(`${this.namespace}:token`, accessToken);
    // Add the access token to the storage
  }

  removeAccessToken() {
    localStorage.removeItem(`${this.namespace}:token`);
    // Remove the access token from the storage
  }
}

export default AuthStorage;
