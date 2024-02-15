import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
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



const DirectBuyingAdd = () => {
  const mainCardTitle = "Purchase Order Add";
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
  const [purchasedate, setPurchaseDate] = useState(new Date());
  const [qty, setQty] = useState('');
  const [selectedOptionProductName, setSelectedOptionProductName] = useState(null);
  const [productNameOption, setProductNameOption] = useState(null);
  const [productList, setProductList] = useState([]);
  const [tax, setTax] = useState('');
  const [discountpercentage, setDiscountPercentage] = useState('');
  const [discountnominal, setDiscountNominal] = useState('0');
  const [grandtotal, setGrandTotal] = useState('');
  const [note, setNote] = useState('');
  const [shippingCost, setShippingCost] = useState('0');
  const [productprice, setProductPrice] = useState('');
  const [confirmBarcodeOpen, setConfirmBarcodeOpen] = useState(false);
  const [barcodename, setBarcodeName] = useState('');
  const [barcodeData, setBarcodeData] = useState({});
  const [currentProductName, setCurrentProductName] = useState('');
  const [currentProductCode, setCurrentProductCode] = useState('');
  const [currentProductId, setCurrentProductId] = useState('');
  const [buyingCode, setbuyingCode] = useState('');
  const [currentProductIdStock, setCurrentProductIdStock] = useState('');





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
          productIdStock: item.product_stock_id,
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




 

  // Update discount percentage when discount nominal changes
  useEffect(() => {
    if (discountnominal !== '') {
      const total = productList.reduce(
        (accumulator, product) => accumulator + product.product.price * product.quantity,
        0
      );

      const nominal = parseFloat(discountnominal);
      const percentage = (nominal / total) * 100;
      setDiscountPercentage(percentage.toFixed(2)); // Assuming you want two decimal places
    } else {
      setDiscountPercentage('');
    }
  }, [discountnominal]);


  // Update the useEffect hook for handling changes in discount nominal
useEffect(() => {
  if (discountnominal !== '') {
    const subtotal = productList.reduce(
      (accumulator, product) => accumulator + product.productPrice * product.quantity,
      0
    );
    const shippingcost = parseFloat(shippingCost);
    const nominal = parseFloat(discountnominal);
    const disc = subtotal - nominal;
    const percentage_disc = ((nominal / subtotal) * 100);
    const discountPercentageValue = isNaN(percentage_disc) ? 0 : percentage_disc.toFixed(2);
    setDiscountPercentage(discountPercentageValue);
    const tax = disc * 0.11; // Assuming tax is 11%

    const grandTotal = disc + tax + shippingcost;
    const grandTotalValue = isNaN(grandTotal) ? 0 : grandTotal.toFixed(2);
    setGrandTotal(grandTotalValue); 
  } else {
    setDiscountPercentage('');
    setGrandTotal('');
  }
}, [discountnominal, productList, shippingCost, grandtotal]);




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





  const handleAddProduct = () => {
    if (selectedOptionProductName && qty) {
      const { code, name, price, value, productIdStock } = selectedOptionProductName;
  
      // Check if the product already exists in the list
      const existingProductIndex = productList.findIndex(
        (product) => product.product.id === value
      );
  
      if (existingProductIndex !== -1) {
        // Product already exists, update the quantity
        const updatedProductList = [...productList];
        updatedProductList[existingProductIndex].quantity += parseInt(qty, 10);
        setProductList(updatedProductList);
      } else {
        // Product doesn't exist, add a new product to the list
        const newProduct = {
          product: {
            code,
            name,
            price,
            productIdStock,
            id: value,
           
          },
          quantity: parseInt(qty, 10),
          productPrice:productprice,
        };
        setProductList([...productList, newProduct]);
        console.log(newProduct);
      }

      setSelectedOptionProductName(null);
      setQty('');
      setProductPrice('');
    } else {
      // Handle empty fields or validation
      // You may display an error message or take appropriate action here
    }
  };

  useEffect(() => {
    if (selectedOptionProductName && selectedOptionProductName.price) {
      setProductPrice(selectedOptionProductName.price );
    }
  }, [selectedOptionProductName]);
  
  

  const totalPrice = productList.reduce((accumulator, product) => {
    return accumulator + (product.productPrice * product.quantity);
  }, 0);

  const handleDeleteProduct = (indexToDelete) => {
    const updatedProductList = [...productList];
    updatedProductList.splice(indexToDelete, 1); // Remove the item at the specified index

    setProductList(updatedProductList); // Update the state with the updated productList
  };


  const formatAsCurrency = (value, locale = 'en-US') => {
    return new Intl.NumberFormat(locale).format(value);
  };
  


  const handleSubmitAdd = async (e) => {
    e.preventDefault(); 

    if (!selectedOptionVendor || !selectedOptionVendor.value ) {
      setSuccessMessageAdd('Please select a vendor');
      return;
    } else if(!purchaseorderno) {
      setSuccessMessageAdd('Please fill purchase number');
      return;

    } else if(!purchasedate) {
      setSuccessMessageAdd('Please fill purchase date');
      return;
    } else if(!selectedOptionPayment || !selectedOptionPayment.value) {
      setSuccessMessageAdd('Please fill terms of payment');
      return;

    }



    try {
      const formData = {
        buying_code: buyingCode,
        purchase_date: purchasedate,
        purchase_number: purchaseorderno,
        vendor_id: selectedOptionVendor.value,
        terms_pay_id: selectedOptionPayment.value,
        shipping_cost:shippingCost,
        total: totalPrice,
        tax: tax,
        discount_percentage: discountpercentage,
        discount_nominal:discountnominal,
        note:note,
        grand_total:grandtotal,
        user_created:uid,
  
      };



  
     
  const res =  await axios.post(`${apiUrl}/api/registerDirectBuying`, formData);
    const NewId = res.data.productstockId; // from purchase Id Master
  

    productList.forEach(product => {

      product.productstockId = NewId;
      product.userID = uid;
      product.purchaseDate = purchasedate;
    });

     const jsonDataProduct = JSON.stringify(productList);

     const responseArray = await axios.post(
      `${apiUrl}/api/registerDirectBuyingProduct`,
      { data: jsonDataProduct },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const savedData = responseArray.data.savedData;



    const ProductNewIds = savedData.map((item) => item.newProductStocktId);



    console.log(responseArray);
    console.log(jsonDataProduct);
 


    
// save data barcode array to api db
const allBarcodeData = [];

Object.keys(barcodeData).forEach((productId, index) => {
  barcodeData[productId].forEach((barcode) => {
    allBarcodeData.push({
      serial_number: barcode.name,
      product_stock_id: barcode.productId,
      purchase_order_master_receiving_id: NewId,
      status: 'BY',
      in_code: buyingCode,
      purchase_order_product_id: ProductNewIds[index], // Use individual ID for each barcode
      user_created: uid,
    });
  });
});




const dataToBarcode = {
  barcodeData: allBarcodeData,
};

const responseBarcode = await axios.post(`${apiUrl}/api/RegisterPurchaseOrderBarcodeMaster`, dataToBarcode);
console.log('Response:', responseBarcode.data);



      // Fetch updated vendor data after successful submission
      const response = await axios.get(`${apiUrl}/api/getDirectBuying`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

   console.log(response.data)
   Navigate('/DirectBuying')

     
  
  

    } catch (error) {
      console.error('Error submitting data:', error);
    
    }
  };


  
  

  
  const handleBarcodeOPen = (productName, productCode, productId, productIdStock) => {

    setConfirmBarcodeOpen(true);
    setCurrentProductName(productName);
    setCurrentProductCode(productCode);
    setCurrentProductId(productId);
    setCurrentProductIdStock(productIdStock);
 


    console.log('Product Name:', productName);
  };



  const handleAddBarcode = () => {
    if (barcodename) {
  
      const newBarcode = {
        name: barcodename,
        productId: currentProductId,


      };
  
      // Update the barcodeData state
      setBarcodeData((prevData) => {
   
        const existingProductBarcodes = prevData[currentProductId] || [];
  
  
        const newProductBarcodes = [...existingProductBarcodes, newBarcode];
  
    
        const updatedBarcodeData = {
          ...prevData,
          [currentProductId]: newProductBarcodes,
        };
  
  
        console.log('Updated Barcode Data:', updatedBarcodeData);
  
        return updatedBarcodeData;
      });
  
      // Clear the barcode name input
      setBarcodeName('');
    } else {
      // Handle the case when the barcode name is empty
      // (You might want to display an error message or take appropriate action)
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



 


  const generateBuyingCode = async () => {
    try {
    
      const response = await axios.get(`${apiUrl}/api/getDirectBuyingLastId`);
      const firstPurchase = response.data[0];
      const lastBuyingCode = firstPurchase ? firstPurchase.buying_code : '';
     

 
      const currentDate = new Date();
      const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
      const currentYear = String(currentDate.getFullYear()).slice(2);

  
      const lastBuyingCodeMonth = lastBuyingCode.substring(1, 3);
      const lastBuyingCodeYear = lastBuyingCode.substring(3, 5);


      if (lastBuyingCodeMonth === currentMonth && lastBuyingCodeYear === currentYear) {

        const numericPart = parseInt(lastBuyingCode.substring(5)) + 1;
        const newNumericPart = String(numericPart).padStart(6, '0');
        const newBuyingCode = `B${currentMonth}${currentYear}${newNumericPart}`;
        setbuyingCode(newBuyingCode);
      } else {
        // Start the numeric part from 000001
        setbuyingCode(`B${currentMonth}${currentYear}000001`);
      }
    } catch (error) {
      console.error('Error generating buying code:', error);
    }
  };

  // Use useEffect to generate the buying code when the component mounts
  useEffect(() => {
    generateBuyingCode();
  }, []); 
  



  return (
    
    <MainCard title={mainCardTitle} className='boxy'>
      <Typography variant="body2">
        {name}{expire} - {uid}  <br/>

         <br/><br/>
         {successMessageAdd && (
              <div className="success-blinking-text">{successMessageAdd}</div>
            )}
         <form onSubmit={handleSubmitAdd}>
         <div className="container-form">

        
                <div className="column-form">
                <InputLabel >Buying Code</InputLabel>
                  <OutlinedInput
                   
                    type="text"
                    value={buyingCode}
                    name="buyingcode"
            
                    onChange={(e) => setbuyingCode(e.target.value)}
                    placeholder="Enter the buying code."
                    fullWidth
                   readOnly
                 
                  />
                  <InputLabel >Vendor Name</InputLabel>
                  <VirtualizedSelect 
                      options={vendorOption}
                      onChange={(option) => setSelectedOptionVendor(option)}
                      value={selectedOptionVendor}
                      required
                    />
                  </div>
                  <div className="column-form">
                  <InputLabel >Note Number</InputLabel>
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
                       <button className='add-button' onClick={handleAddProduct}>Add</button>
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
                  <InputLabel >Price</InputLabel>
                 
                  <OutlinedInput
                  type="text"
      
                  value={productprice}
                  name="productprice"
                  onChange={(e) => setProductPrice(e.target.value.replace(/[^0-9]/g, ''))}
                  // onChange={(e) => setProductPrice(e.target.value)}
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
    {productList.map((product, index) => (
      <div className="table-row" key={index}>
          <div className="table-cell">{index + 1}</div>
        <div className="table-cell">{product.product.code}</div>
        <div className="table-cell">{product.product.name}</div>
        <div className="table-cell">{formatAsCurrency(product.productPrice)}</div>
        <div className="table-cell">{product.quantity}</div>
        <div className="table-cell">{formatAsCurrency(product.quantity * product.productPrice)}</div>
        <div className="table-cell"><button onClick={() => handleDeleteProduct(index)}>Delete</button></div>
        <div className="table-cell">
            <button onClick={() => handleBarcodeOPen(product.product.name, product.product.code, product.product.id, product.product.productIdStock)}>Barcode</button>


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
                placeholder="Tax"
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
                <button  className='submit-button' type="submit" >
                Submit
                  </button>
                  </div>
            
  </div>  
  </div>      </form>
  <br></br>
               
                        </div>

               
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
      <p>Product Code: {currentProductCode}  {currentProductId} / {currentProductIdStock}</p>
      <p>Product Name: {currentProductName}</p>

    </Typography>
          </Typography>
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

               
      </Typography>
    </MainCard>
  );
};

export default DirectBuyingAdd;
