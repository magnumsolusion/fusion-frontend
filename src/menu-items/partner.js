// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const partner = {
  id: 'Partner',
  title: 'Partners',
  type: 'group',
  children: [
    {
      id: 'Vendor',
      title: 'Vendor',
      type: 'item',
      url: '/Vendor',
      icon: icons.ProfileOutlined,
      // Replace the anchor tag with React Router's Link
      // 'to' attribute defines the destination URL
      element: <Link to="/Vendor">Vendor</Link>
    },
    {
      id: 'Customer',
      title: 'Customer',
      type: 'item',
      url: '/Customer',
      icon: icons.ProfileOutlined,
      // Replace the anchor tag with React Router's Link
      // 'to' attribute defines the destination URL
      element: <Link to="/Customer">Customer</Link>
    }
  ]
};

export default partner;
