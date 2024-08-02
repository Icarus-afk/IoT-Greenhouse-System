export const login = (token) => {
    localStorage.setItem('jwt', token);
  };
  
  export const logout = () => {
    localStorage.removeItem('jwt');
  };
  
  export const isAuthenticated = () => {
    return !!localStorage.getItem('jwt');
  };
  