import { useRoutes } from 'react-router-dom';
import { routes } from 'feather:routes';

export const Content = () => {
  return useRoutes(routes);
};
