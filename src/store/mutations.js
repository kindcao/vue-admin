import {sessionStorage} from 'src/assets/js/storage';

const mutations = {
  SET_USER(state, user) {
    state.user = user;
    sessionStorage.setItem('user', user);
  },
  SET_TOKEN(state, token) {
    state.token = token;
    sessionStorage.setItem('token', token);
  },
  SET_TOKEN_ACCESS(state, accToken) {
    state.token_access = accToken;
    sessionStorage.setItem('token_access', accToken)
  },
  SET_TOKEN_REFRESH(state, refToken) {
    state.token_refresh = refToken;
    sessionStorage.setItem('token_refresh', refToken)
  }
};

export default mutations;

