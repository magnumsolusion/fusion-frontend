import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Typography, InputLabel, OutlinedInput, Modal, Box
} from '@mui/material';
import { apiUrl } from '../../config/UrlParam';
import MainCard from 'components/MainCard';
import '../../assets/additional-css/styles.css';
import VirtualizedSelect from 'react-virtualized-select';
import '../../assets/additional-css/react-select.css';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css';



const PurchaseOrderReceivingAdd = () => {
  const mainCardTitle = "Purchase Order Receiving Add";
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
  const [selectedOptionPurchaseNumber, setSelectedOptionPurchaseNumber] = useState(null);
  const [purchaseNumberOption, setPurchaseNumberOption] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmBarcodeOpen, setConfirmBarcodeOpen] = useState(false);
  const [barcodename, setBarcodeName] = useState('');

  const [currentProductName, setCurrentProductName] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const [currentProductId, setCurrentProductId] = useState('');
  const [barcodeData, setBarcodeData] = useState({});

 


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


  const handleBarcodeOPen = (productName, productCode, productID) => {

    setConfirmBarcodeOpen(true);
    setCurrentProductName(productName);
    setCurrentCode(productCode);
    setCurrentProductId(productID);


    console.log('Product Name:', productName);
  };
  


useEffect(() => {

  if (selectedOptionPurchaseNumber && selectedOptionPurchaseNumber.value) {

    axios.get(`${apiUrl}/api/getPurchaseOrderStatusById/${selectedOptionPurchaseNumber.value}`)
      .then((response) => {
        // Update the state with the fetched details
        const datashow = response.data[0];
        setSelectedPurchaseDetails(datashow);
        setDiscountNominal(datashow.discount_nominal)
     
      })
      .catch((error) => {
        console.error('Error fetching purchase order details:', error);
      });
  } else {
    // If no purchase number is selected, reset the details
    setSelectedPurchaseDetails(null);
  }
}, [selectedOptionPurchaseNumber]);

useEffect(() => {

  if (selectedOptionPurchaseNumber && selectedOptionPurchaseNumber.value) {

    axios.get(`${apiUrl}/api/getPurchaseOrderReceivingEdit/${selectedOptionPurchaseNumber.value}`)
      .then((response) => {
       

        const idArray = response.data.map(item => item.id);
        setProductList(response.data);

        console.log(idArray);
     
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  } else {
    // If no purchase number is selected, reset the details
    setSelectedPurchaseDetails(null);
  }
}, [selectedOptionPurchaseNumber]);






  useEffect(() => {
    // Fetch category data
    axios.get(`${apiUrl}/api/getPurchaseOrder`)
      .then((response) => {
        const transformedOptions = response.data.map((item) => ({
          label: `${item.purchase_number}`,
          value: item.id,
        }));
        setPurchaseNumberOption(transformedOptions);
      })
      .catch((error) => {
        console.error('Error fetching category data:', error);
      });
    }, []);

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
    return acc + productList.quantity * productList.start_price;
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
  if (value === '' || value === '0') {
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





const handleAddBarcode = () => {
  if (barcodename) {
    const newBarcode = {
      name: barcodename,
      productId: currentProductId,
    };


    setBarcodeData((prevData) => {
      const newProductBarcodes = [...(prevData[currentProductId] || []), newBarcode];

      return {
        ...prevData,
        [currentProductId]: newProductBarcodes,
      };
    });

    setBarcodeName('');
    console.log(newBarcode);
  } else {
    // Handle the case when the barcode name is empty
  }
};

const handleDeleteBarcode = (barcodeIndex) => {
 
  setBarcodeData((prevData) => {
    const updatedProductBarcodes = [...prevData[currentProductId]];
    updatedProductBarcodes.splice(barcodeIndex, 1);

    return {
      ...prevData,
      [currentProductId]: updatedProductBarcodes,
    };
  });
};



// const handleSubmitAdd = async () => {
//   try {
 
//     const updatePromises = [];

  
//     for (const product of productList) {
//       const productId = product.id;
//       const residualQty = product.quantity - receivingValues[productId] || 0;
  
//       if (receivingValues[productId] !== undefined) {
//         const formData = {
//           stuff_receiving: receivingValues[productId],
//           stuff_residual:residualQty,
//           user_updated: uid,
//         };

   
//         const updatePromise = axios.patch(
//           `${apiUrl}/api/updatePurchaseOrderProduct/${productId}`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         // Push the promise into the array
//         updatePromises.push(updatePromise);

//         // Update the product in the productList (optional)
//         const updatedProductList = productList.map((p) =>
//           p.id === productId
//             ? {
//                 ...p,
//                 stuff_receiving: receivingValues[productId],
//               }
//             : p
//         );
//         setProductList(updatedProductList);
//       }
//     }


//     await Promise.all(updatePromises);


//     setSelectedOptionProductName('');
//     setQty('');
//     setUpdating(false);


//     console.log('All products updated successfully!');
//     setSuccessMessageAdd('Products updated successfully.');
//   } catch (error) {
//     console.error('Error updating data details:', error);

//   }
// };


const handleSubmitAdd = async () => {
  try {
    const insertPromises = [];

    // Loop through each product in productList
    for (const product of productList) {
      const productId = product.id;
      const residualQty = product.quantity - receivingValues[productId] || 0;

      if (receivingValues[productId] !== undefined) {
        const formData = {
         
          product_stock_id: productId,
          stuff_receiving:residualQty,
        };

        // Send a POST request to insert data into RegisterPurchaseOrderReceivingMaster
        const insertPromise = axios.post(
          `${apiUrl}/api/RegisterPurchaseOrderReceivingMaster`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Push the promise into the array
        insertPromises.push(insertPromise);
      }
    }

    // Wait for all insert promises to complete
    await Promise.all(insertPromises);

 
    setSuccessMessageAdd('Products inserted and saved successfully.');
  } catch (error) {
    console.error('Error inserting data:', error);
    // Handle error, show error message, etc.
  }
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
  {barcodeData[currentProductId]?.map((barcode, index) => (
            <div className="table-row" key={index}>
              <div className="table-cell">{index + 1}</div>
              <div className="table-cell">{barcode.name}</div>
              <div className="table-cell">
                      <button onClick={() => handleDeleteBarcode(index)}>
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
                  <VirtualizedSelect 
                      options={purchaseNumberOption}
                      onChange={(option) => setSelectedOptionPurchaseNumber(option)}
                      value={selectedOptionPurchaseNumber}
                      required
                    /><br/>
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
                        <p>Status: {selectedPurchaseDetails.status_receiving}</p>

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
            <div className="table-cell">{formatAsCurrency(product.start_price)}</div>
            <div className="table-cell">{product.quantity}</div>
            <div className="table-cell">{formatAsCurrency(product.quantity * product.start_price)}</div>
            <div className="table-cell">
            <OutlinedInput
              className="read-only"
              type="text"
              value={receivingValues[product.id] || 0}
              name={`receiving_${index}`}
              onChange={(e) => handleReceivingChange(product.id, e.target.value)}
              placeholder=""
              fullWidth
            />
            </div>
            <div className="table-cell">{(product.quantity - receivingValues[product.id] || 0)}</div>
            <div className="table-cell">
            <button onClick={() => handleBarcodeOPen(product.product_name, product.product_code, product.id)}>Barcode</button>


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
  <InputLabel >Grand Total</InputLabel>
             
  <b>{formatAsCurrency(grandtotal)} </b>    

  <div className="wrapper-submit-btn">
      <button onClick={handleSubmitAdd} className='submit-button' type="submit" >
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

export default PurchaseOrderReceivingAdd;
