import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
// import MinimalLayout from 'layout/MinimalLayout/index';
import MainLayout from 'layout/MainLayout/index';
import User from 'pages/extra-pages/User';

// render - dashboard
// const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));
const Vendor = Loadable(lazy(() => import('pages/extra-pages/Vendor')));
const Customer = Loadable(lazy(() => import('pages/extra-pages/Customer')));
const ProductCategory = Loadable(lazy(() => import('pages/extra-pages/ProductCategory')));
const Units = Loadable(lazy(() => import('pages/extra-pages/Units')));
const Product = Loadable(lazy(() => import('pages/extra-pages/Product')));
const IncomingStuff = Loadable(lazy(() => import('pages/extra-pages/IncomingStuff')));
const TermPay = Loadable(lazy(() => import('pages/extra-pages/TermPay')));
const Detail = Loadable(lazy(() => import('pages/extra-pages/Detail')));
const PurchaseOrder = Loadable(lazy(() => import('pages/extra-pages/PurchaseOrder')));
const PurchaseOrderAdd = Loadable(lazy(() => import('pages/extra-pages/PurchaseOrderAdd')));
const PurchaseOrderEdit = Loadable(lazy(() => import('pages/extra-pages/PurchaseOrderEdit')));
const PurchaseOrderReceiving = Loadable(lazy(() => import('pages/extra-pages/PurchaseOrderReceiving')));
const PurchaseOrderReceivingAdd = Loadable(lazy(() => import('pages/extra-pages/PurchaseOrderReceivingAdd')));
const PurchaseOrderReceivingEdit = Loadable(lazy(() => import('pages/extra-pages/PurchaseOrderReceivingEdit')));
const DirectBuying = Loadable(lazy(() => import('pages/extra-pages/DirectBuying')));
const DirectBuyingAdd = Loadable(lazy(() => import('pages/extra-pages/DirectBuyingAdd')));
const DirectBuyingEdit = Loadable(lazy(() => import('pages/extra-pages/DirectBuyingEdit')));
const DirectSelling = Loadable(lazy(() => import('pages/extra-pages/DirectSelling')));
const DirectSellingAdd = Loadable(lazy(() => import('pages/extra-pages/DirectSellingAdd')));
const DirectSellingEdit = Loadable(lazy(() => import('pages/extra-pages/DirectSellingEdit')));
const Roles = Loadable(lazy(() => import('pages/extra-pages/Roles')));
const Division = Loadable(lazy(() => import('pages/extra-pages/Division')));
const Menu = Loadable(lazy(() => import('pages/extra-pages/Menu')));
const RolesAction = Loadable(lazy(() => import('pages/extra-pages/RolesAction')));
// render - utilities
// const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
// const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
// const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
// const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  
  children: [
    // {
    //   path: '/',
    //   element: <DashboardDefault />
    // },
    // {
    //   path: 'color',
    //   element: <Color />
    // },

    {
      path: 'Vendor',
      element: <Vendor />
    },
    {
      path: 'Customer',
      element: <Customer />
    },
    {
      path: 'ProductCategory',
      element: <ProductCategory />
    },

    {
      path: 'Product',
      element: <Product/>
    },
    {
      path: 'Units',
      element: <Units />
    },

    {
      path: '/TermPay',
      element: <TermPay />
    },
   
   
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'IncomingStuff',
      element: <IncomingStuff />
    },
    {
      path: 'Detail',
      element: <Detail />
    },
    {
      path: 'PurchaseOrder',
      element: <PurchaseOrder />
    },
    {
      path: 'PurchaseOrderAdd',
      element: <PurchaseOrderAdd />
    },
    {
      path: 'PurchaseOrderEdit/:id',
      element: <PurchaseOrderEdit />
    },
    {
      path: 'PurchaseOrderReceiving',
      element: <PurchaseOrderReceiving />
    },
    {
      path: 'PurchaseOrderReceivingAdd',
      element: <PurchaseOrderReceivingAdd />
    },
    {
      path: 'PurchaseOrderReceivingEdit/:id',
      element: <PurchaseOrderReceivingEdit />
    },
    {
      path: 'DirectBuying',
      element: <DirectBuying />
    },
    {
      path: 'DirectBuyingAdd',
      element: <DirectBuyingAdd />
    },
    {
      path: 'DirectBuyingEdit/:id',
      element: <DirectBuyingEdit />
    },
    {
      path: 'DirectSelling',
      element: <DirectSelling />
    },
    {
      path: 'DirectSellingAdd',
      element: <DirectSellingAdd />
    },
    {
      path: 'DirectSellingEdit/:id',
      element: <DirectSellingEdit />
    },
    {
      path: 'Users',
      element: <User />
    },
    {
      path: 'Menu',
      element: <Menu />
    },
    {
      path: 'RolesAction',
      element: <RolesAction />
    }, 
    {
      path: '/Division',
      element: <Division />
    },
    {
      path: '/Roles',
      element: <Roles />
    },
  ]
};

export default MainRoutes;
