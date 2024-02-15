// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const inventory = {
  id: 'Inventory',
  title: 'Inventory',
  type: 'group',
  children: [
    {
      id: 'ProductCategory',
      title: 'Product Category',
      type: 'item',
      url: '/ProductCategory',
      icon: icons.ProfileOutlined,
      // Replace the anchor tag with React Router's Link
      // 'to' attribute defines the destination URL
      element: <Link to="/ProductCategory">ProductCategory</Link>
    },
    {
      id: 'Units',
      title: 'Units',
      type: 'item',
      url: '/Units',
      icon: icons.ProfileOutlined,
      // Replace the anchor tag with React Router's Link
      // 'to' attribute defines the destination URL
      element: <Link to="/Units">Units</Link>
    },
    {
      id: 'Product',
      title: 'Product',
      type: 'item',
      url: '/Product',
      icon: icons.ProfileOutlined,
      // Replace the anchor tag with React Router's Link
      // 'to' attribute defines the destination URL
      element: <Link to="/Product">Product</Link>
    },
  ]
  
};

export default inventory;
