export function getFailure() {
  return {type: '@user/LIST_USERS_FAILURE'};
}
export function reset() {
  return {type: '@user/RESET'};
}
export function getRequest({page, nextPage = false}) {
  return {type: '@user/LIST_USERS_REQUEST', payload: {page, nextPage}};
}
export function getSuccess({usersList, usersTotal}) {
  return {type: '@user/LIST_USERS_SUCCESS', payload: {usersList, usersTotal}};
}
