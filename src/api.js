const BASE_URL = 'http://localhost:8080';

let authInstance = null;
export class UserAuthSingleTone {
  #userName;
  #jwt;
  constructor() {
    if (authInstance) return authInstance;
  }

  login(gAccessToken, resolve, reject) {
    fetch(BASE_URL + '/user/auth', {
      method: 'GET',
      headers: {
        'X-Auth-Token': gAccessToken,
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
      .then(({data}) => {
        this.#userName = data.name;
        this.#jwt = data.jwt;
        resolve(data);
      }).catch(reject);
  }

  getUserName() {
    return this.#userName;
  }
  getUserJwt() {
    return this.#jwt
  }
}

export const uploadFile = (file, resolve, reject) => {
  const formData = new FormData();
  formData.append('file', file);
  console.log(formData);
  fetch(BASE_URL + '/pipo/new', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + (new UserAuthSingleTone().getUserJwt() || ''),
    },
    body: formData,
  }).then(res => res.json())
    .then(({data}) => {
      resolve(data);
    }).catch(reject);
};

export const processPipo = (pipo, resolve, reject) => {
  fetch(BASE_URL + '/pipo/process', {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + (new UserAuthSingleTone().getUserJwt() || ''),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'id': pipo.id,
      'difficulty': pipo.difficulty,
    })
  }).then(res => res.json())
    .then(({data}) => {
      resolve(data);
    }).catch(reject);
};

const getImage = (uri, resolve, reject) => {
  fetch(uri, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + (new UserAuthSingleTone().getUserJwt() || ''),
      'Content-Type': 'application/json',
    }
  }).then(async res => {
    resolve(await res.blob());
  }).catch(reason => {
    console.log(reason);
    reject(reason);
  });
}

export const originImage = (pipo, resolve, reject) => {
  const uri = BASE_URL + '/pipo/origin/' + pipo.id;
  getImage(uri, resolve, reject);
}

export const processedImage = (pipo, resolve, reject) => {
  const uri = BASE_URL + '/pipo/processed/' + pipo.id;
  getImage(uri, resolve, reject);
}

export const previewImage = (pipo, resolve, reject) => {
  const uri = BASE_URL + '/pipo/preview/' + pipo.id;
  getImage(uri, resolve, reject);
}
