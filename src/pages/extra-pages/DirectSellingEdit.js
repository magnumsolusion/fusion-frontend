import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useParams} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Typography, InputLabel,OutlinedInput,TextareaAutosize, Modal, Box
} from '@mui/material';
import { apiUrl } from '../../config/UrlParam';
import MainCard from 'components/MainCard';
import '../../assets/additional-css/styles.css';
import VirtualizedSelect from 'react-virtualized-select';
import '../../assets/additional-css/react-select.css';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css';



const DirectSellingEdit = () => {
  const mainCardTitle = "Direct SellingEdit";
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
  const [qty, setQty] = useState('');
  const [selectedOptionProductName, setSelectedOptionProductName] = useState(null);
  const [productNameOption, setProductNameOption] = useState(null);

  const [tax, setTax] = useState('');
  const [discountpercentage, setDiscountPercentage] = useState('');
  const [discountnominal, setDiscountNominal] = useState('0');
  const [grandtotal, setGrandTotal] = useState('');
  const [note, setNote] = useState('');
  const { id } = useParams();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [purchaseId, setPurchaseId] = useState('');
  const [idCustomerContact, setIdCustomerContact] = useState('');
  const [updating, setUpdating] = useState(false);
  const [totalPrice, setTotalPrice] = useState();
  const [shippingCost, setShippingCost] = useState('')
  const [productprice, setProductPrice] = useState('');
  const [confirmBarcodeOpen, setConfirmBarcodeOpen] = useState(false);
  const [barcodename, setBarcodeName] = useState('');
  const [barcodeData, setBarcodeData] = useState([]);
  const [currentProductName, setCurrentProductName] = useState('');
  const [currentProductCode, setCurrentProductCode] = useState('');
  const [currentProductId, setCurrentProductId] = useState('');
  // const [CurrentOrderProductId, setCurrentOrderProductId] = useState('');
  // const [CurrentProductStockId, setCurrentProductStockId] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [productstockid, setProductStockId] = useState(null);
  const [productSellingId, setProductSellingId] = useState(null);
  const [barcodeAvailability, setBarcodeAvailability] = useState(null);
  const [successMessageBarcodeAdd, setSuccessMessageBarcodeAdd] = useState(null);
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
        const response = await axios.get(`${apiUrl}/api/getDirectSellingById/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const firstPurchaseOrder = response.data[0];
        setPurchaseOrderNo(firstPurchaseOrder.selling_code);
        setPurchaseDate(new Date(firstPurchaseOrder.selling_date));
        setSelectedOptionVendor({ label: firstPurchaseOrder.customer_name, value: firstPurchaseOrder.vid });
        setSelectedOptionPayment({ label: firstPurchaseOrder.termpay_name, value: firstPurchaseOrder.tid });
        setNote(firstPurchaseOrder.note)
        setDiscountNominal(firstPurchaseOrder.discount_nominal)
        setDiscountPercentage(firstPurchaseOrder.discount_percentage)
        setTax(firstPurchaseOrder.tax)
        setShippingCost(firstPurchaseOrder.shipping_cost)
 
        setPurchaseId(firstPurchaseOrder.poid)

    
       

   

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
        const response = await axios.get(`${apiUrl}/api/getDirectSellingProductByIdSum/${id}`, {
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
        const response = await axios.get(`${apiUrl}/api/getDirectSellingProductEdit/${id}`, {
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
    axios.get(`${apiUrl}/api/getCustomer`)
      .then((response) => {
        const transformedOptions = response.data.map((item) => ({
          label: `${item.customer_name}`,
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

      // for combobox
  useEffect(() => {
    // Fetch category data
    axios.get(`${apiUrl}/api/getProductStockAll`)
      .then((response) => {
        const transformedOptions = response.data.map((item) => ({
          label: `(${item.product_code}) - ${item.product_name} - ${formatAsCurrency(item.last_buy_price)}`,
          value: item.id,
          code: item.product_code,
          name: item.product_name,
          price: item.last_buy_price,
        }));
        setProductNameOption(transformedOptions);
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
      const response = await axios.get(`${apiUrl}/api/getCustomer`, {
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
      setSuccessMessageBarcodeAdd('');
    };

    // Show success messages and set timeout to clear them after 10 seconds
    if (successMessageDelete || successMessageEdit || successMessageAdd || successMessageBarcodeAdd) {
      const timeout = setTimeout(clearSuccessMessages, 7000); // 10 seconds (10,000 milliseconds)
      
      return () => {
        clearTimeout(timeout); // Clear timeout on component unmount
      };
    }
  }, [successMessageDelete, successMessageEdit , successMessageAdd, successMessageBarcodeAdd]);





  const handleAddProduct = async (e) => {
    e.preventDefault(); 
    try {

      const formData = {
        direct_selling_id:purchaseId,
        product_stock_id: selectedOptionProductName.value,
        quantity:qty,
        total_price:productprice,
        user_created:uid
      
      };

      await axios.post(`${apiUrl}/api/RegisterDirectSellingProductEdit`, formData);

      const updatedResponse = await axios.get(`${apiUrl}/api/getDirectBuyingProductEdit/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update the state with the new data
      setPurchaseOrders(updatedResponse.data);




      console.log('Data submitted successfully');
      setSelectedOptionProductName('');
      setQty('')


    } catch (error) {

      console.error('Error submitting  data:', error);
      
    }
  };
  
  const handleEditProduct= async (id) => {

    try {

      const response = await axios.get(`${apiUrl}/api/getDirectSellingProductById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const purchaseOrderProductData = response.data[0];
      console.log(purchaseOrderProductData)

      setSelectedOptionProductName({
        label: `(${purchaseOrderProductData.product_code}) - ${purchaseOrderProductData.product_name} - ${formatAsCurrency(purchaseOrderProductData.last_buy_price)}`,
        value: purchaseOrderProductData.popid
      });
        setQty(purchaseOrderProductData.quantity);
        setProductPrice(purchaseOrderProductData.total_price);
        setIdCustomerContact(purchaseOrderProductData.popid)
        setProductStockId(purchaseOrderProductData.product_stock_id)
        setUpdating(true);
        console.log(response.data);




    } catch (error) {

      console.error('Error submitting  data:', error);
      
    }
  };
  
  


  const handleDeleteProduct= async (deletingId) => {
    try {
      await axios.delete(`${apiUrl}/api/deleteDirectSellingProduct/${deletingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted vendor from the local state (rows)
      setPurchaseOrders((prevRows) => prevRows.filter((row) => row.id !== deletingId));

  
    } catch (error) {
      console.error('Error deleting data:', error);

    }
  };
  



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
         shipping_cost: shippingCost,
         user_updated:uid,
      };
  
  
      await axios.patch(`${apiUrl}/api/updateDirectSelling/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  

      console.log('Data updated successfully');

       Navigate('/DirectSelling');

    } catch (error) {
      console.error('Error updating  data:', error);
   
    }


  };



  const formatAsCurrency = (value, locale = 'en-US') => {
    return new Intl.NumberFormat(locale).format(value);
  };
  


  const handleUpdateCustomerContactCancel = async () => {
   setSelectedOptionProductName('')
   setQty('')
    setUpdating(false);
  
  };
  const handleUpdateCustomerContact = async (idCustomerContact) => {
    try {
    
      const formData = {
        purchase_order_id:purchaseId,
        product_stock_id:productstockid,
        total_price:productprice,
        quantity:qty,
        user_updated:uid,
      };
  
      // Make PATCH request to update vendor data
       await axios.patch(`${apiUrl}/api/updateDirectSellingProduct/${idCustomerContact}`,formData)

       const updatedResponse = await axios.get(`${apiUrl}/api/getDirectBuyingProductEdit/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update the state with the new data
      setPurchaseOrders(updatedResponse.data);



     
     setSelectedOptionProductName('')
     setQty('')
     setUpdating(false);
   
    } catch (error) {
      console.error('Error fetching data details:', error);
      // Handle errors or show a message to the user
    }
  };


// for calculate automatically total and grand total
  const calculateTotalPriceSum = () => {
    const sum = purchaseOrders.reduce((acc, purchaseOrder) => {
      return acc + purchaseOrder.quantity * purchaseOrder.total_price;
    }, 0);
    setTotalPrice(sum);

    const shippingcost = parseFloat(shippingCost);
    const nominal = parseFloat(discountnominal);
    const disc = sum - nominal;
    const precentage_disc = ((nominal / sum) * 100);
    const discountPercentageValue = isNaN(precentage_disc) ? 0 : precentage_disc.toFixed(2);
    setDiscountPercentage(discountPercentageValue)
    const tax = disc * 0.11; // Assuming tax is 11%
    const grandTotal = disc + tax + shippingcost;

    const grandTotalValue = isNaN(grandTotal)? 0 : grandTotal.toFixed(2);
    setGrandTotal(grandTotalValue); 
   

  };

  useEffect(() => {
    calculateTotalPriceSum();
  }, [purchaseOrders, shippingCost]);

  const handleBarcodeOPen = (productId, productCode, productName, productStockId, productSellingId) => {

    setConfirmBarcodeOpen(true);
    setCurrentProductName(productName);
    setCurrentProductCode(productCode);
    setCurrentProductId(productId);
    // setCurrentOrderProductId(productId);
    // setCurrentProductStockId(productStockId);
    setProductSellingId(productSellingId);

    console.log('Product Name:', productId);
  };




  const [barcodeID, setBarcodeID] = useState(null);

  // Function to check barcode availability
  const checkBarcodeAvailability = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/getPurchaseOrderBarcodeAll2`);
      let foundBarcodeId = null;
  
      response.data.forEach((barcode) => {
        if (barcode.serial_number === barcodename) {
          foundBarcodeId = barcode.id;
        }
      });
  
      setBarcodeID(foundBarcodeId); // Set the barcode ID
  
      const barcodeAvailable = foundBarcodeId !== null;
      setBarcodeAvailability(barcodeAvailable);
    } catch (error) {
      console.error('Error checking barcode availability:', error);
    }
  };
  
  useEffect(() => {
    if (barcodename) {
      checkBarcodeAvailability();
      handleAddBarcode();
    }
  }, [barcodename, barcodeAvailability]);


  const handleAddBarcode = async (e) => {
    if (e) {
      e.preventDefault();
    }
  
    if (barcodeAvailability) {
      try {
        const formData = {
          reference_id: id,
          reference_id_product:currentProductId,
          reference_status: 'SL',
          out_code: purchaseorderno,
          user_updated: uid,
        };
  
        // Make POST request to add new vendor data
        await axios.patch(`${apiUrl}/api/updatePurchaseOrderBarcode/${barcodeID}`, formData);
  
        // Reset the barcodename after successful addition
        setBarcodeName('');
  
      } catch (error) {
        console.error('Error submitting data:', error);
        setSuccessMessageAdd('Data already submitted');
      }
    } else {
      setSuccessMessageBarcodeAdd('Barcode is not available. Please choose a different barcode.');
    }
  };
  

  // const handleAddBarcode = async (e) => {
  //   e.preventDefault(); 
  //   if (barcodeAvailability) {
  //   try {
  //     const formData = {
  //       reference_id:id,
  //       reference_status:'SL',
  //       out_code:purchaseorderno,
  //       user_updated:uid,
    
  //     };
  
  //     // Make POST request to add new vendor data
  //     await axios.patch(`${apiUrl}/api/updatePurchaseOrderBarcode/${barcodeID}`, formData);

  //   } catch (error) {
  //     console.error('Error submitting data:', error);
  //     setSuccessMessageAdd('Data already submitted');
  //   }
  // } else {
  //   setSuccessMessageBarcodeAdd('Barcode is not available. Please choose a different barcode.');
  //  }
  // };
  

  useEffect(() => {
    axios.get(`${apiUrl}/api/getPurchaseOrderBarcodeAll2Edit/${currentProductId}`)
      .then((response) => {
        setBarcodeData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  
  }, [barcodeData, currentProductId]);




  const handleDeleteConfirmation = async () => {
    try {
      const formData = {
        reference_id:'0',
        reference_id_product:'0',
        reference_status:'',
        out_code:'',
        user_updated:uid,
    
      };

      await axios.patch(`${apiUrl}/api/updatePurchaseOrderBarcode/${deletingId}`, formData);
     
      setConfirmDeleteOpen(false); 
    } catch (error) {
      console.error('Error submitting data:', error);
    
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
                <InputLabel >Selling Code</InputLabel>
                  <OutlinedInput
                   
                    type="text"
                    value={purchaseorderno}
                    name="address"
            
                    onChange={(e) => setPurchaseOrderNo(e.target.value)}
                    placeholder="Enter the purchase No."
                    fullWidth
                    required
                 
                  />
                  <InputLabel >Customer Name</InputLabel>
                  <VirtualizedSelect 
                      options={vendorOption}
                      onChange={(option) => setSelectedOptionVendor(option)}
                      value={selectedOptionVendor}
                      required
                    />
                  </div>
                  <div className="column-form">
                  
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

     {updating ? (
        <>
          <button type='button' onClick={() => handleUpdateCustomerContact(idCustomerContact)} className='add-button'>
            Update
          </button>&nbsp;
          <button type='button' onClick={handleUpdateCustomerContactCancel} className='cancel-button'>
            Cancel Update
          </button>
        </>
      ) : (
        <button className='add-button' onClick={handleAddProduct}>Add Data</button>
      )}





                       
                       <br/>  <br/>
                       <form onSubmit={handleAddProduct}>
                       <InputLabel >Product</InputLabel>
                     <VirtualizedSelect 
                      options={productNameOption}
                      onChange={(option) => setSelectedOptionProductName(option)}
                      value={selectedOptionProductName}
                      required
                    />
                        <InputLabel >Qty</InputLabel>
                        <OutlinedInput
                   
                    type="text"
                    value={qty}
                    name="qty"
                    onChange={(e) => setQty(e.target.value.replace(/[^0-9]/g, ''))}
                    // onChange={(e) => setQty(e.target.value)}
                    placeholder="Enter the qty"
                    fullWidth
                    required
                 
                  />

<InputLabel >Selling Price</InputLabel>
                 
                 <OutlinedInput
                 type="text"
     
                 value={productprice}
                 name="productprice"
                 onChange={(e) => setProductPrice(e.target.value.replace(/[^0-9]/g, ''))}
                //  onChange={(e) => setProductPrice(e.target.value)}
                 placeholder="Product Price"
                 fullWidth
                 required
  
               />
<br/><br/>
</form>


    <div className="table">
  <div className="table-row header">
  <div className="table-cell">No.</div>
    <div className="table-cell">Code</div>
    <div className="table-cell">Product</div>
    <div className="table-cell">Price</div>
    <div className="table-cell">Qty.</div>
    <div className="table-cell">Price</div>
    <div className="table-cell">Action</div>
    <div className="table-cell">Barcode</div>
    </div>
  <div className="table-body">
  {purchaseOrders.map((purchaseOrder, index) => (
      <div className="table-row" key={index}>
          <div className="table-cell">{index + 1}</div>
        <div className="table-cell">{purchaseOrder.product_code}</div>
        <div className="table-cell">{purchaseOrder.product_name}{purchaseOrder.purchase_order_product_id}</div>
        <div className="table-cell">{formatAsCurrency(purchaseOrder.total_price)}</div>
        <div className="table-cell">{purchaseOrder.quantity}</div>
        <div className="table-cell">{formatAsCurrency(purchaseOrder.quantity * purchaseOrder.total_price)}</div>

        <div className="table-cell"><button onClick={() =>  handleEditProduct(purchaseOrder.id)}>Edit</button><button onClick={() =>  handleDeleteProduct(purchaseOrder.id)}>Delete</button></div>
     
       <div className="table-cell">
            <button onClick={() => handleBarcodeOPen(purchaseOrder.id, purchaseOrder.product_code, purchaseOrder.product_name, purchaseOrder.product_stock_id, purchaseOrder.direct_selling_id  )}>Barcode</button>


            </div>
     
      </div>
    ))}
  </div>
</div>
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

            <InputLabel >Shipping Cost</InputLabel>
             
             <OutlinedInput
                   
                type="text"
                value={shippingCost}
                name="shippingCost"
                onChange={(e) => setShippingCost(e.target.value)}
                placeholder="Shipping Cost"
                fullWidth
      
             
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
{/* { DELETE CONFIRM MODAL} */}

<Modal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='modals-delete' >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <h3>Delete {mainCardTitle}</h3>
          </Typography>
          <Typography id="modal-modal-description">
            <p>Are you sure you want to delete this data?</p>
            <button onClick={handleDeleteConfirmation} className='submit-button'>
              Yes
            </button>
            &nbsp;
            <button
              onClick={() => setConfirmDeleteOpen(false)}
              className='close-button'
            >
              No
            </button>
          </Typography>
        </Box>
      </Modal>

               
                {/* { BARCODE CONFIRM MODAL} */}

<Modal
        open={confirmBarcodeOpen}
        onClose={() => setConfirmBarcodeOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
  
        <Box className='modals' >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <h3>Barcode</h3>
            <Typography id="modal-modal-description">
      <p>Product Code: {currentProductCode}  {currentProductId}/ {productSellingId}</p>
      <p>Product Name: {currentProductName}</p>

    </Typography>
          </Typography>
          {successMessageBarcodeAdd && (
              <div className="success-blinking-text">{successMessageBarcodeAdd}</div>
            )}
             <form >
             <button  onClick={handleAddBarcode} className='add-button'>Add</button><br/>
                   <input className='select-element'
                                        type="text"
                                        value={barcodename}
                                        name="barcodename"
                                        onChange={(e) => setBarcodeName(e.target.value)}
                                        placeholder="barcode"
                                  
                                        required
                                      />    
                                      </form>
     
          <Typography id="modal-modal-description">
            <br/>
    <div className="table">
  <div className="table-row header">
  <div className="table-cell">No.</div>
    <div className="table-cell">Barcode</div>
    <div className="table-cell">Action</div>

  </div>
  <div className="table-body">
  {barcodeData.map((barcode, index) => (
            <div className="table-row" key={index}>
              <div className="table-cell">{index + 1}</div>
              <div className="table-cell">{barcode.serial_number}</div>
              <div className="table-cell">
                      <button  onClick={() => {setDeletingId(barcode.id);
                          setConfirmDeleteOpen(true);
                      }}>
                        Delete
                      </button>
                      
                    </div>
            </div>
            
          ))}
         </div>
         

</div>   





            <div className='wrapper-submit-btn'>
            
            &nbsp;
            <button
              onClick={() => setConfirmBarcodeOpen(false)}
              className='submit-button'
            >
              Ok
            </button>
            </div>
          </Typography>
        </Box>
      </Modal>

               
      </Typography>
    </MainCard>
  );
};

export default DirectSellingEdit;
