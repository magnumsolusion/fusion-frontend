import { useRoutes } from 'react-router-dom';

// project import

import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
// ==============================|| ROUTING RENDER ||============================== //

// export default function ThemeRoutes() {
//   return useRoutes([MainRoutes]);
// }
export default function ThemeRoutes() {

  return GetRoutes();
 
}

const GetRoutes  = () => {
 const routes = window.location.pathname === "/" ? [LoginRoutes] : [MainRoutes];
 return useRoutes(routes);
 //return routes;
}