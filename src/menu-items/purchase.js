// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const purchase = {
  id: 'Purchase',
  title: 'Purchase/Transaction',
  type: 'group',
  children: [
    {
      id: 'Purchase Order',
      title: 'Purchase Order',
      type: 'item',
      url: '/PurchaseOrder',
      icon: icons.ProfileOutlined,
      // Replace the anchor tag with React Router's Link
      // 'to' attribute defines the destination URL
      element: <Link to="/PurchaseOrder">Purchase Order</Link>
    },
    {
      id: 'PO Receiving',
      title: 'PO Receiving',
      type: 'item',
      url: '/PurchaseOrderReceiving',
      icon: icons.ProfileOutlined,
      // Replace the anchor tag with React Router's Link
      // 'to' attribute defines the destination URL
      element: <Link to="/PurchaseOrderReceiving">PO Receiving</Link>
    },
    {
      id: 'Direct Buying',
      title: 'Direct Buying',
      type: 'item',
      url: '/DirectBuying',
      icon: icons.ProfileOutlined,
      // Replace the anchor tag with React Router's Link
      // 'to' attribute defines the destination URL
      element: <Link to="/DirectBuying">PO Direct</Link>
    },
    {
      id: 'Sell',
      title: 'Direct Selling',
      type: 'item',
      url: '/DirectSelling',
      icon: icons.ProfileOutlined,
      // Replace the anchor tag with React Router's Link
      // 'to' attribute defines the destination URL
      element: <Link to="/DirectSelling">PO Direct</Link>
    }
  ]
};

export default purchase;
