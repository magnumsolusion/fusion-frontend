import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useParams} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Typography, InputLabel,OutlinedInput,TextareaAutosize
} from '@mui/material';
import { apiUrl } from '../../config/UrlParam';
import MainCard from 'components/MainCard';
import '../../assets/additional-css/styles.css';
import VirtualizedSelect from 'react-virtualized-select';
import '../../assets/additional-css/react-select.css';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css';


const PurchaseOrderAdd = () => {
  const mainCardTitle = "Purchase Order Receiving";
  //for add
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [successMessageAdd, setSuccessMessageAdd] = useState('');
  const [successMessageEdit, setSuccessMessageEdit] = useState('');
  const [successMessageDelete, setSuccessMessageDelete] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const Navigate = useNavigate();
  const [selectedOptionPayment, setSelectedOptionPayment] = useState(null);
  const [paymentOption, setPaymentOption] = useState(null);
  const [selectedOptionVendor, setSelectedOptionVendor] = useState(null);
  const [vendorOption, setVendorOption] = useState(null);
  const [purchaseorderno, setPurchaseOrderNo] = useState(null);
  const [purchasedate, setPurchaseDate] = useState(null);



  const [tax, setTax] = useState('');
  const [discountpercentage, setDiscountPercentage] = useState('');
  const [discountnominal, setDiscountNominal] = useState('0');
  const [grandtotal, setGrandTotal] = useState('');
  const [note, setNote] = useState('');
  const { id } = useParams();
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  const [receivingValues, setReceivingValues] = useState(purchaseOrders.map(() => ''));
  const [totalPrice, setTotalPrice] = useState('');




//AUTH TOKEN
  
  useEffect(() => {
    refreshToken();
  
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${apiUrl}/token`);
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setUid(decoded.userID);
      setExpire(decoded.exp);
    } catch (error) {
      Navigate('/');
    }
  };

// get purchase order data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to fetch purchase order details
        const response = await axios.get(`${apiUrl}/api/getPurchaseOrderById/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const firstPurchaseOrder = response.data[0];
        setPurchaseOrderNo(firstPurchaseOrder.purchase_number);
        setPurchaseDate(new Date(firstPurchaseOrder.purchase_date));
        setSelectedOptionVendor({ label: firstPurchaseOrder.vendor_name, value: firstPurchaseOrder.vid });
        setSelectedOptionPayment({ label: firstPurchaseOrder.termpay_name, value: firstPurchaseOrder.tid });
        setNote(firstPurchaseOrder.note)
        setDiscountNominal(firstPurchaseOrder.discount_nominal)
        setDiscountPercentage(firstPurchaseOrder.discount_percentage)
        setTax(firstPurchaseOrder.tax)
   

    
       

   

      } catch (error) {
        // Handle errors during data fetching
        console.error('Error fetching data details:', error);
      }
    };

    // Call fetchData when the component mounts or when id/token changes
    fetchData();
  }, [id, token]);


  // get purchase order product data SUM
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to fetch purchase order details
        const response = await axios.get(`${apiUrl}/api/getPurchaseOrderProductByIdSum/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const firstPurchaseOrderProduct = response.data[0];
        setTotalPrice(firstPurchaseOrderProduct.totalStartPriceTimesQuantity)

      } catch (error) {
        // Handle errors during data fetching
        console.error('Error fetching data details:', error);
      }
    };

    // Call fetchData when the component mounts or when id/token changes
    fetchData();
  }, [id, token]);







  // get purchase order data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to fetch purchase order details
        const response = await axios.get(`${apiUrl}/api/getPurchaseOrderProductEdit/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
   

        if (response.data && response.data.length > 0) {
          setPurchaseOrders(response.data);
          console.log(response.data);
        } else {
          console.warn('No purchase order data found.');
        }
  
      } catch (error) {
        // Handle errors during data fetching
        console.error('Error fetching data details:', error);
      }
    };
  
    // Call fetchData when the component mounts or when id/token changes
    fetchData();
  }, [id, token, purchaseOrders]);
  



  // for combobox
  useEffect(() => {
    // Fetch category data
    axios.get(`${apiUrl}/api/getVendor`)
      .then((response) => {
        const transformedOptions = response.data.map((item) => ({
          label: `${item.vendor_name}`,
          value: item.id,
        }));
        setVendorOption(transformedOptions);
      })
      .catch((error) => {
        console.error('Error fetching category data:', error);
      });
    }, []);
    
  // for combobox
  useEffect(() => {
    // Fetch category data
    axios.get(`${apiUrl}/api/getTermPay`)
      .then((response) => {
        const transformedOptions = response.data.map((item) => ({
          label: `${item.termpay_name} - ${item.days} Days`,
          value: item.id,
        }));
        setPaymentOption(transformedOptions);
      })
      .catch((error) => {
        console.error('Error fetching category data:', error);
      });
    }, []);




          // for setting
          useEffect(() => {
            const fetchData = async () => {
              try {
                const response = await axios.get(`${apiUrl}/api/getDetail`, {
                  headers: {
                    Authorization: `Bearer ${token}`, // Add your token if needed
                  },
                });
               setTax(response.data.tax); 
          
                  
          
                // setRows(rowsWithRowNumbers);
              } catch (error) {
                console.error('Error fetching project data:', error);
              }
            };
          
            fetchData(); // Call the function to fetch data when the component mounts
          }, [token]); // Add token as a dependency if it's required


//SHOWING RECORD LIST
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/getVendor`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add your token if needed
        },
      });
    console.log(response.data); 

        

      // setRows(rowsWithRowNumbers);
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  fetchData(); // Call the function to fetch data when the component mounts
}, [token]); // Add token as a dependency if it's required










  //CLEAR MESSAGE AFTER SHOWING
  useEffect(() => {
    // Function to clear success messages after 10 seconds
    const clearSuccessMessages = () => {
      setSuccessMessageDelete('');
      setSuccessMessageEdit('');
      setSuccessMessageAdd('');
    };

    // Show success messages and set timeout to clear them after 10 seconds
    if (successMessageDelete || successMessageEdit || successMessageAdd) {
      const timeout = setTimeout(clearSuccessMessages, 7000); // 10 seconds (10,000 milliseconds)
      
      return () => {
        clearTimeout(timeout); // Clear timeout on component unmount
      };
    }
  }, [successMessageDelete, successMessageEdit , successMessageAdd]);





  // const handleAddProduct = async (e) => {
  //   e.preventDefault(); 
  //   try {

  //     const formData = {
  //       purchase_order_id: purchaseId,
  //       product_stock_id: selectedOptionProductName.value,
  //       quantity:qty,
  //       user_created:uid
      
  //     };

  //     await axios.post(`${apiUrl}/api/RegisterPurchaseOrderProductEdit`, formData);
  //     console.log('Data submitted successfully');
  //     setSelectedOptionProductName('');
  //     setQty('')


  //   } catch (error) {

  //     console.error('Error submitting  data:', error);
      
  //   }
  // };
  




    const handleSubmitEdit = async (e) => {
      e.preventDefault();

    try {
      const formData = {
         purchase_number: purchaseorderno,
         purchase_date: purchasedate,
         vendor_id: selectedOptionVendor.value,
         terms_pay_id: selectedOptionPayment.value,
         total: totalPrice,
         tax: tax,
         discount_percentage: discountpercentage,
         discount_nominal:discountnominal,
        note:note,
         grand_total:grandtotal,
         user_updated:uid,
      };
  
  
      await axios.patch(`${apiUrl}/api/updatePurchaseOrder/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  

      console.log('Data updated successfully');

       Navigate('/PurchaseOrder');

    } catch (error) {
      console.error('Error updating  data:', error);
   
    }


  };



  const formatAsCurrency = (value, locale = 'en-US') => {
    return new Intl.NumberFormat(locale).format(value);
  };
  




// for calculate automatically total and grand total
  const calculateTotalPriceSum = () => {
    const sum = purchaseOrders.reduce((acc, purchaseOrder) => {
      return acc + purchaseOrder.quantity * purchaseOrder.start_price;
    }, 0);
    setTotalPrice(sum);
  
    const nominal = parseFloat(discountnominal);
    const disc = sum - nominal;
    const precentage_disc = ((nominal / sum) * 100);
    setDiscountPercentage(precentage_disc.toFixed(1))
    const tax = disc * 0.11; // Assuming tax is 11%
    const grandTotal = disc + tax;
    setGrandTotal(grandTotal.toFixed(2)); 
   

  };

  useEffect(() => {
    calculateTotalPriceSum();
  }, [purchaseOrders]);






  const handleReceivingChange = (id, value) => {
    setReceivingValues(prevValues => ({
      ...prevValues,
      [id]: value
    }));
  };


  const handleUpdateCustomerContact = async (id) => {
    try {
      const formData = {

  
    
        receiving: receivingValues[id], 
        user_updated: uid,
      };

      // Make PATCH request to update vendor data
      const response = await axios.patch(
        `${apiUrl}/api/updatePurchaseOrderProduct/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setSelectedOptionProductName('');
      setQty('');
      setUpdating(false);
    } catch (error) {
      console.error('Error fetching data details:', error);

    }
  };

  return (
    
    <MainCard title={mainCardTitle} className='boxy'>
      <Typography variant="body2">
        {name}{expire} - {uid}  <br/>
        {id}

     

         <br/><br/>
         {successMessageAdd && (
              <div className="success-blinking-text">{successMessageAdd}</div>
            )}
         <form onSubmit={handleSubmitEdit}>
         <div className="container-form">

        
                <div className="column-form">
              
                  <InputLabel >Vendor Name</InputLabel>
                  <VirtualizedSelect 
                      options={vendorOption}
                      onChange={(option) => setSelectedOptionVendor(option)}
                      value={selectedOptionVendor}
                      required
                    />
                  </div>
                  <div className="column-form">
                  <InputLabel >No. Purchase Order</InputLabel>
                  <OutlinedInput
                   
                    type="text"
                    value={purchaseorderno}
                    name="address"
            
                    onChange={(e) => setPurchaseOrderNo(e.target.value)}
                    placeholder="Enter the purchase No."
                    fullWidth
                    required
                 
                  />
                   <InputLabel >Purchase Date</InputLabel>
                    <DatePicker 
                  
                      showIcon
                      selected={purchasedate}
                      onChange={(date) => setPurchaseDate(date)}
                      dateFormat="yyyy-MM-dd"
                    />

                     <InputLabel >Payment</InputLabel>
                     <VirtualizedSelect 
                      options={paymentOption}
                      onChange={(option) => setSelectedOptionPayment(option)}
                      value={selectedOptionPayment}
                      required
                    />
                
                       </div>      </div></form>


                   
                       <div className="column-form">

 
 





                       
                       <br/>  <br/>
                       <form onSubmit={handleUpdateCustomerContact}>
                       <button className='add-button' onClick={handleUpdateCustomerContact}>Update Data</button><br/><br/>
             


    <div className="table">
  <div className="table-row header">
  <div className="table-cell">No.</div>
    <div className="table-cell">Code</div>
    <div className="table-cell">Product</div>
    <div className="table-cell">Price</div>
    <div className="table-cell">Qty.</div>
    <div className="table-cell">Total Price</div>
    <div className="table-cell">Receiving</div>
    <div className="table-cell">Results</div>
  </div>
  <div className="table-body">
  {purchaseOrders.map((purchaseOrder, index) => (
      <div className="table-row" key={index}>
          <div className="table-cell">{index + 1}</div>
        <div className="table-cell">{purchaseOrder.product_code}</div>
        <div className="table-cell">{purchaseOrder.product_name}</div>
        <div className="table-cell">{formatAsCurrency(purchaseOrder.start_price)}</div>
        <div className="table-cell">{purchaseOrder.quantity}</div>
        <div className="table-cell">{formatAsCurrency(purchaseOrder.quantity * purchaseOrder.start_price)}</div>

        <div className="table-cell"> 

        <OutlinedInput
                
                type="text"
                value={receivingValues[purchaseOrder.id] || ''}
                name={`receiving_${index}`}
                onChange={(e) => handleReceivingChange(purchaseOrder.id, e.target.value)}
                placeholder=""
                fullWidth
              />
        </div>
       <div className="table-cell">sds</div>
       
     
      </div>   

    ))}
         
  </div>

         
</div>   </form>
<br></br>
<form onSubmit={handleSubmitEdit}>
<div className="container-form">

<div className="column-form">
<InputLabel >Note : </InputLabel>
<TextareaAutosize
  aria-label="empty textarea"
  placeholder="Empty"
  value={note}
  onChange={(e) => setNote(e.target.value)}
  style={{
    width: '100%',
    borderRadius: '8px', 
    height: '200px'     
  }}
  rowsMin={3}
/>

  </div>


  <div className="column-form">

  <InputLabel >Subtotal</InputLabel>
             
                <OutlinedInput
                    className='read-only'
                   type="text"
                   value={formatAsCurrency(totalPrice)}
                   name="totalPrice"
                   onChange={(e) => setTotalPrice(e.target.value)}
                   placeholder="Subtotal"
                   fullWidth
                   readOnly
                
                 />


<InputLabel >Discount (Nominal)</InputLabel>
             
             <OutlinedInput
                
                type="text"
                value={discountnominal}
                onChange={(e) => setDiscountNominal(e.target.value)}
                name="discountnominal"
                placeholder="Enter the nominal"
                fullWidth
                required
             
              />
   <InputLabel >Discount (%)</InputLabel>
             
             <OutlinedInput
                className='read-only'
                type="text"
                value={discountpercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                name="discountpercentage"
                placeholder="%"
                fullWidth
                readOnly
             
              />
                          

              <InputLabel >Tax (%)</InputLabel>
             
             <OutlinedInput
                    className='read-only'
                type="text"
                value={tax}
                name="tax"
                onChange={(e) => setTax(e.target.value)}
                placeholder="Tax"
                fullWidth
                readOnly
             
              />
                <InputLabel >Grand Total</InputLabel>
             
             <OutlinedInput
                    className='read-only-grandtotal'
                type="text"
                value={formatAsCurrency(grandtotal)} 
                onChange={(e) => setGrandTotal(e.target.value)}
                name="address"
                placeholder="Grand Total"
                fullWidth
                readOnly
             
              />
               <div className="wrapper-submit-btn">
                <button onClick={handleSubmitEdit}  className='submit-button' type="submit" >
                Submit
                  </button>
                  </div>
            
  </div>  
  </div>      </form>
  <br></br>
               
                        </div>

               
             

               
      </Typography>
    </MainCard>
  );
};

export default PurchaseOrderAdd;
