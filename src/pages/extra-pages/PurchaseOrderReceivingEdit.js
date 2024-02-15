import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useParams} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Typography, InputLabel, OutlinedInput, Modal, Box
} from '@mui/material';
import { apiUrl } from '../../config/UrlParam';
import MainCard from 'components/MainCard';
import '../../assets/additional-css/styles.css';
// import VirtualizedSelect from 'react-virtualized-select';
import '../../assets/additional-css/react-select.css';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css';



const PurchaseOrderReceivingAdd = () => {
  const mainCardTitle = "Purchase Order Receiving Edit";
  //for add
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [successMessageAdd, setSuccessMessageAdd] = useState('');
  const [successMessageEdit, setSuccessMessageEdit] = useState('');
  const [successMessageDelete, setSuccessMessageDelete] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const Navigate = useNavigate();


  const [purchasedate, setPurchaseDate] = useState(new Date());


  const [productList, setProductList] = useState([]);
  const [tax, setTax] = useState('');
  const [discountpercentage, setDiscountPercentage] = useState('');
  const [discountnominal, setDiscountNominal] = useState('');
  const [receivingValues, setReceivingValues] = useState(productList.map(() => ''));
  const [grandtotal, setGrandTotal] = useState('');
  const [totalPrice, setTotalPrice] = useState();
  const [selectedPurchaseDetails, setSelectedPurchaseDetails] = useState(null);
  // const [selectedOptionPurchaseNumber, setSelectedOptionPurchaseNumber] = useState(null);
  // const [purchaseNumberOption, setPurchaseNumberOption] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmBarcodeOpen, setConfirmBarcodeOpen] = useState(false);
  const [barcodename, setBarcodeName] = useState('');

  const [currentProductName, setCurrentProductName] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const [currentProductId, setCurrentProductId] = useState('');
  const [barcodeData, setBarcodeData] = useState([]);
  const { id } = useParams();
  const [purchaseNumberName, setPurchaseNumberName] = useState('');

  const [statusReceiving, setStatusReceiving] = useState('');
  const [currentPurchaseOrderId, setCurrentPurchaseOrderId] = useState('');
  const [currentPurchaseOrderProductId, setCurrentPurchaseOrderProductId] = useState('');
  const [currentProductStockId, setCurrentProductStockId] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [shippingCost, setShippingCost] = useState('0');

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


  const handleBarcodeOPen = (productName, productCode, productID, purchaseOrderId, purchaseOrderProductId, productStockId) => {

    setConfirmBarcodeOpen(true);
    setCurrentProductName(productName);
    setCurrentCode(productCode);
    setCurrentProductId(productID);
    setCurrentPurchaseOrderId(purchaseOrderId);
    setCurrentPurchaseOrderProductId(purchaseOrderProductId);
    setCurrentProductStockId(productStockId);

  };
  


useEffect(() => {



    axios.get(`${apiUrl}/api/getPurchaseOrderMasterReceivingStatusById/${id}`)
      .then((response) => {
        // Update the state with the fetched details
        const datashow = response.data[0];
        setSelectedPurchaseDetails(datashow);
        setDiscountNominal(datashow.discount_nominal)
        console.log(datashow.purchase_number);
        setPurchaseNumberName(datashow.purchase_number);
        setShippingCost(datashow.shipping_cost)
     
        setPurchaseDate(new Date(datashow.date_receiving));
        setStatusReceiving(datashow.status_receiving);
        console.log(datashow.date_receiving)
     
      })
      .catch((error) => {
        console.error('Error fetching purchase order details:', error);
      });

}, []);
useEffect(() => {
  axios.get(`${apiUrl}/api/getPurchaseOrderReceivingEdit2/${id}`)
    .then((response) => {
      setProductList(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}, [id, setProductList]); // Include id and setProductList as dependencies

// useEffect(() => {
//     axios.get(`${apiUrl}/api/getPurchaseOrderReceivingEdit2/${id}`)
//       .then((response) => {
//         setProductList(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//       });
 
// }, [productList]);

// useEffect(() => {
//   axios.get(`${apiUrl}/api/getPurchaseOrderReceivingEdit2/${id}`)
//     .then((response) => {
//       setProductList(response.data);
//     })
//     .catch((error) => {
//       console.error('Error fetching data:', error);
//     });

// }, [productList]);

useEffect(() => {
  axios.get(`${apiUrl}/api/getPurchaseOrderBarcodeById/${currentPurchaseOrderProductId}`)
    .then((response) => {
      setBarcodeData(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });

}, [barcodeData, currentPurchaseOrderProductId]);






  // for combobox



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


 
  






  const formatAsCurrency = (value, locale = 'en-US') => {
    return new Intl.NumberFormat(locale).format(value);
  };
  




// for calculate automatically total and grand total
const calculateTotalPriceSum = () => {
  const sum = productList.reduce((acc, productList) => {
    return acc + productList.quantity * productList.total_price;
  }, 0);
  setTotalPrice(sum);

  const shippingcost = parseFloat(shippingCost)
  const nominal = parseFloat(discountnominal);
  const disc = sum - nominal;
  const percentage_disc = ((nominal / sum) * 100);
  const discountPercentageValue = isNaN(percentage_disc)? 0 : percentage_disc.toFixed(2)
  setDiscountPercentage(discountPercentageValue)
  const tax = disc * 0.11; // Assuming tax is 11%
  const grandTotal = disc + tax + shippingcost;

  const grandTotalValue = isNaN(grandTotal)?0:grandTotal.toFixed(2)

  setGrandTotal(grandTotalValue); 
 

};
useEffect(() => {
  calculateTotalPriceSum();
}, [productList]);



// const handleReceivingChange = (productId, value) => {

//   if (value === '') {
//     setReceivingValues((prevValues) => ({
//       ...prevValues,
//       [productId]: value,
//     }));
//     return;
//   }
  
//   const parsedValue = parseFloat(value);
//   if (!isNaN(parsedValue)) {
//     setReceivingValues((prevValues) => ({
//       ...prevValues,
//       [productId]: parsedValue,
//     }));
//   }
// };

const handleReceivingChange = (productId, value) => {
  if (value === '' || value === '0' || value > '0') {
    setReceivingValues((prevValues) => ({
      ...prevValues,
      [productId]: value,
    }));
    return;
  }

  const parsedValue = parseFloat(value);
  if (!isNaN(parsedValue)) {
    // Check if the entered value is greater than the quantity
    if (parsedValue > productList.find(product => product.id === productId).quantity) {
      setConfirmDeleteOpen(true);
      return;
    }

    setReceivingValues((prevValues) => ({
      ...prevValues,
      [productId]: parsedValue,
    }));
  }
};





const handleAddBarcode = async (e) => {
  e.preventDefault(); 
  try {
    const formData = {
      serial_number: barcodename,
      purchase_order_master_receiving_id:id,
      purchase_order_id:currentPurchaseOrderId,
      purchase_order_product_id:currentPurchaseOrderProductId,
      product_stock_id:currentProductStockId,
      status:'PO',
      in_code:purchaseNumberName,
      user_created:uid,
  
    };

    // Make POST request to add new vendor data
    await axios.post(`${apiUrl}/api/RegisterPurchaseOrderBarcodeEdit`, formData);

    setRows(response.data);
    setRows(rowsWithRowNumbers);
   
    Navigate('/Vendor'); 
  } catch (error) {
    console.error('Error submitting data:', error);
    setSuccessMessageAdd('Data already submitted');
  }
};








  const handleDeleteConfirmation = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/api/deletePurchaseOrderBarcode/${deletingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    
      setConfirmDeleteOpen(false); 
      console.log(response.data);
    } catch (error) {
      console.error('Error deleting data:', error);
      setSuccessMessageDelete('Error deleting data');
    }
  };




const handleSubmitAdd = async () => {
  try {
 
    const updatePromises = [];

  
    for (const product of productList) {
      const productId = product.id;
      const residualQty = product.quantity - receivingValues[productId] || 0;
  
      if (receivingValues[productId] !== undefined) {
        const formData = {
          stuff_receiving: receivingValues[productId],
          stuff_residual:residualQty,
          user_updated: uid,
        };

   
        const updatePromise = axios.patch(
          `${apiUrl}/api/updatePurchaseOrderProduct/${productId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Push the promise into the array
        updatePromises.push(updatePromise);

        // Update the product in the productList (optional)
        const updatedProductList = productList.map((p) =>
          p.id === productId
            ? {
                ...p,
                stuff_receiving: receivingValues[productId],
              }
            : p
        );
        setProductList(updatedProductList);
      }
    }


    await Promise.all(updatePromises);





    console.log('All products updated successfully!');
    setSuccessMessageAdd('Products updated successfully.');
  } catch (error) {
    console.error('Error updating data details:', error);

  }
};



// const handleSubmit = async () => {

//   try {
    
//     const formData = {
//       purchase_order_id: selectedPurchaseDetails.purchase_order_id,
//       date_receiving: purchasedate,
//       vendor_id:selectedPurchaseDetails.vendor_id,
//       terms_pay_id:selectedPurchaseDetails.terms_pay_id,
//       purchase_date:selectedPurchaseDetails.purchase_date,
//       note:selectedPurchaseDetails.note,
//       total:selectedPurchaseDetails.total,
//       grand_total:selectedPurchaseDetails.grand_total,
//       discount_nominal:selectedPurchaseDetails.discount_nominal,
//       discount_percentage:selectedPurchaseDetails.discount_percentage,
//       tax:selectedPurchaseDetails.tax,
//       user_updated:uid,
//     };

//     // Make PATCH request to update vendor data
//     const response = await axios.patch(`${apiUrl}/api/updatePurchaseOrderMasterReceiving/${id}`,formData ,{
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//    console.log(response.data);
 

//    Navigate('/PurchaseOrderReceiving')
//   } catch (error) {
//     console.error('Error fetching data details:', error);
//     // Handle errors or show a message to the user
//   }

// };

// const handleFormSubmit = (event) => {
//   event.preventDefault();
//   handleSubmit();
// };


const handleSubmit = async () => {
  try {
    const updatePromises = [];

    for (const product of productList) {
      const productId = product.id;
      const residualQty = product.quantity - receivingValues[productId] || 0;

      if (receivingValues[productId] !== undefined) {
        const productFormData = {
          stuff_receiving: receivingValues[productId],
          stuff_residual: residualQty,
          user_updated: uid,
        };

        const productUpdatePromise = axios.patch(
          `${apiUrl}/api/updatePurchaseOrderReceiving/${productId}`,
          productFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        updatePromises.push(productUpdatePromise);

        const updatedProductList = productList.map((p) =>
          p.id === productId
            ? {
                ...p,
                stuff_receiving: receivingValues[productId],
              }
            : p
        );
        setProductList(updatedProductList);
      }
    }

    // Wait for all product update promises to resolve
    await Promise.all(updatePromises);

    // Update the master receiving details
    const masterFormData = {
      purchase_order_id: selectedPurchaseDetails.purchase_order_id,
      date_receiving: purchasedate,
      vendor_id: selectedPurchaseDetails.vendor_id,
      terms_pay_id: selectedPurchaseDetails.terms_pay_id,
      purchase_date: selectedPurchaseDetails.purchase_date,
      note: selectedPurchaseDetails.note,
      total: selectedPurchaseDetails.total,
      grand_total: selectedPurchaseDetails.grand_total,
      discount_nominal: selectedPurchaseDetails.discount_nominal,
      discount_percentage: selectedPurchaseDetails.discount_percentage,
      tax: selectedPurchaseDetails.tax,
      user_updated: uid,
    };

    // Make PATCH request to update master receiving details
    const masterResponse = await axios.patch(
      `${apiUrl}/api/updatePurchaseOrderMasterReceiving/${id}`,
      masterFormData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(masterResponse.data);

    // Redirect to the desired page after updating
    Navigate('/PurchaseOrderReceiving');
  } catch (error) {
    console.error('Error updating data details:', error);
    // Handle errors or show a message to the user
  }
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  handleSubmit();
};






  return (
    
    <MainCard title={mainCardTitle} className='boxy'>
      <Typography variant="body2">
        {name}{expire} - {uid}  <br/>

         <br/><br/>
         {successMessageAdd && (
              <div className="success-blinking-text">{successMessageAdd}</div>
            )}

{/* { QTY CONFIRM MODAL} */}

<Modal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='modals-delete' >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <h3>Attention!</h3>
          </Typography>
          <Typography id="modal-modal-description">
            <p>Receiving quantity cannot be greater than the ordered quantity!</p>
            <div className='wrapper-submit-btn'>
            
            &nbsp;
            <button
              onClick={() => setConfirmDeleteOpen(false)}
              className='submit-button'
            >
              Ok
            </button>
            </div>
          </Typography>
        </Box>
      </Modal>

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
      <p>Product Code: {currentCode}</p>
      <p>Product Name: {currentProductName}{currentProductId}</p>
      <p>{currentPurchaseOrderProductId}</p>

    </Typography>
          </Typography>
             <form >
             <button onClick={handleAddBarcode} className='add-button'>Add</button><br/>
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


         <form onSubmit={handleSubmitAdd}>
         <div className="container-form">

        
                <div className="column-form">
              
                  <InputLabel >Purchase NUmber</InputLabel>
                   {purchaseNumberName}<br/><br/>
                     <InputLabel >Receiving Date</InputLabel>
                    <DatePicker 
                  
                      showIcon
                      selected={purchasedate}
                      onChange={(date) => setPurchaseDate(date)}
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                  <div className="column-form">
            
                  {selectedPurchaseDetails && (
                      <div>
                       
                        <p>Vendor Name: {selectedPurchaseDetails.vendor_name}</p>
                        <p>Purchase Date: {selectedPurchaseDetails.purchase_date}</p>
                        <p>Status: {statusReceiving}</p>

                      </div>
                    )}
           

                
                
                       </div>      </div></form>


                   
                       <div className="column-form">
  <div className="table">
    <div className="table-row header">
      <div className="table-cell">No.</div>
      <div className="table-cell">Code</div>
      <div className="table-cell">Product</div>
      <div className="table-cell">Price</div>
      <div className="table-cell">Qty.</div>
      <div className="table-cell">Last<br></br> Qty.</div>
      <div className="table-cell">Total</div>
      <div className="table-cell">Receive(Qty)</div>
      <div className="table-cell">Residual(Qty)</div>
      <div className="table-cell">Barcode</div>
    </div>
    <div className="table-body">
   
       {productList.map((product, index) => (
          <div className="table-row" key={index}>
            <div className="table-cell">{index + 1}</div>
            <div className="table-cell">{product.product_code}</div>
            <div className="table-cell">{product.product_name}</div>
            <div className="table-cell">{formatAsCurrency(product.total_price)}</div>
            <div className="table-cell">{product.quantity}</div>
            <div className="table-cell">{product.quantity - product.stuff_receiving}</div>
            <div className="table-cell">{formatAsCurrency(( product.quantity) * product.total_price)}</div>
            <div className="table-cell">
            <OutlinedInput
              className="read-only"
              type="text"
              value={receivingValues[product.id] || product.stuff_receiving}
              name={`receiving_${index}`}
              onChange={(e) => handleReceivingChange(product.id, e.target.value)}
              placeholder=""
              fullWidth
              readOnly
              
            />
            </div>
            <div className="table-cell">{(( product.quantity) - receivingValues[product.id] || 0)}</div>
            <div className="table-cell">
            <button onClick={() => handleBarcodeOPen(product.product_name, product.product_code, product.id, product.purchase_order_id, product.purchase_order_product_id, product.product_stock_id)}>Barcode</button>


            </div>
          </div>
        ))}
     
    </div>
  </div>
<br></br>


<form onSubmit={handleSubmitAdd}>
<div className="container-form">

<div className="column-form">
<InputLabel >Note : </InputLabel>

{selectedPurchaseDetails && (
                      <div>
                       
                        <p>{selectedPurchaseDetails.note}</p>
                

                      </div>
                    )}
           

  </div>


  <div className="column-form">

    

  <InputLabel >Subtotal</InputLabel>
             
  <b>{formatAsCurrency(totalPrice)}</b>


<br/> <br/>
<InputLabel >Discount (Nominal)</InputLabel>
             
{selectedPurchaseDetails && (

       <b>{selectedPurchaseDetails.discount_nominal}</b>
 
  )}
  <br/> <br/>
   <InputLabel >Discount (%)</InputLabel>

  <b>{formatAsCurrency(discountpercentage)}</b>

  <br/>   <br/>   
  <InputLabel >Tax (%)</InputLabel>
             
  <b>{formatAsCurrency(tax)}</b>
  
  <br/> <br/>
  <InputLabel >Shipping Cost</InputLabel>
             
             <b>{formatAsCurrency(shippingCost)}</b>
             
             <br/> <br/>
  <InputLabel >Grand Total</InputLabel>
             
  <b>{formatAsCurrency(grandtotal)} </b>    


            
  </div>  
  </div>      </form>
  <br></br>
  <form >
  <div className="wrapper-submit-btn">
  <button onClick={handleFormSubmit} className='submit-button' type="submit" >
          Submit 
       </button>
       </div>
       </form>
                        </div>

               
             

               
      </Typography>
    </MainCard>
  );
};

export default PurchaseOrderReceivingAdd;
