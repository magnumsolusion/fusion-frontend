// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const setting = {
  id: 'Setting',
  title: 'Setting',
  type: 'group',
  children: [
    {
      id: 'Terms Payment',
      title: 'Terms Payment',
      type: 'item',
      url: '/TermPay',
      icon: icons.ProfileOutlined,
      // Replace the anchor tag with React Router's Link
      // 'to' attribute defines the destination URL
      element: <Link to="/TermPay">Terms Payment</Link>
    },
    {
      id: 'Details',
      title: 'Details',
      type: 'item',
      url: '/Detail',
      icon: icons.ProfileOutlined,
      // Replace the anchor tag with React Router's Link
      // 'to' attribute defines the destination URL
      element: <Link to="/Detail">Customer</Link>
    }
  ]
};

export default setting;
