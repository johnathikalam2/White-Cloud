import React, { useEffect, useState } from 'react'
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { RenderButton } from "../../component/Button";
import { create_item } from "../../redux/actions/items.action";
import { retrieve_item } from '../../redux/actions/items.action';
import Select from 'react-select';

const ItemAdd = () => {
    
    const [items, setItems] = useState([]);
    const existingItemCodes = items.map(item => item.item_code);
    const [stockIndicater,setStockIndicater]=useState('')
    //const [mesuring_Qntty,setMesuring_Qntty]=useState('')
    const [mesuring_Qntty,setMesuring_Qntty]=useState('Number')
    const [category,setCategory]=useState('')
    const [tag,settag]=useState('')
    //const [type,settype]=useState('')
    const [validated, setValidated] = useState(false);
    const [file,setFile] = useState('')
    const [preview,setPreview] = useState('')
    const [hsbFile,sethsbFile] = useState('')
    const [hsbPreview,setHasbPreview] = useState('')
    const [formFields, setFormFields] = useState({
        "item_code": '',
        "item_name": '',
        "mesuring_qntty": '',
        "item_mrp": '',
        "offer_price": '',
        "discount": '',
        "item_catogory": '',
        "item_tags": '',
        //"item_type": '',
        "item_hsb": '',
        "instock_outstock_indication": '',
        "stock_quantity": '',
        "item_discription": ''
    })

    const TypeData = [
        {label:'School Corner',value:'School Corner'},
        {label:'Prayer Corner',value:'Prayer Corner'},
        {label:'Miscellaneous',value:'Miscellaneous'},
        
    ]

    const CategoryData = [
        {label:'Rice & Grains',value:'Rice & Grains'},
        {label:'Wheat, Rice Flour',value:'Wheat, Rice Flour'},
        {label:'Coriander, Chili, Masala',value:'Coriander, Chili, Masala'},
        {label:'Oil & Other Ingredients',value:'Oil & Other Ingredients'},
        {label:'Drinks',value:'Drinks'},
        {label:'Vegetables & Fruits',value:'Vegetables & Fruits'},
        {label:'Chips & Snacks',value:'Chips & Snacks'},
        {label:'Cosmetics',value:'Cosmetics'},
        {label:'Detergents',value:'Detergents'},
        {label:'School Corner',value:'School Corner'},
        {label:'Prayer Corner',value:'Prayer Corner'},
        {label:'Miscellaneous',value:'Miscellaneous'},
    ]
    const tagsData = [
        {label:'Soaps & Shampoo',value:'Soaps & Shampoo'},
        {label:'Biscuits & Rusk',value:'Biscuits & Rusk'},
        {label:'Rice flour & Semolina',value:'Rice flour & Semolina'},
        {label:'Papadam',value:'Papadam'},
        {label:'Powder',value:'Powder'},
        {label:'Soap powder',value:'Soap powder'},
        {label:'Tea & Coffee Powder',value:'Tea & Coffee Powder'},
        {label:'Oil',value:'Oil'},
        {label:'Tamarind',value:'Tamarind'},
        {label:'Toothpaste',value:'Toothpaste'},
        {label:'Hair Die',value:'Hair Die'},
        {label:'Battery',value:'Battery'},
        {label:'Spice Powders',value:'Spice Powders'},
        {label:'Pampers',value:'Pampers'},
        {label:'Sanitary Napkin',value:'Sanitary Napkin'},
        {label:'Dish wash',value:'Dish wash'},
        {label:'Vinegar',value:'Vinegar'},
        {label:'Dal',value:'Dal'},
        {label:'Soybean',value:'Soybean'},
        {label:'Beans',value:'Beans'},
        {label:'Harpic',value:'Harpic'},
        {label:'Vermicelli',value:'Vermicelli'},
        {label:'Egg',value:'Egg'},
        {label:'Yeast',value:'Yeast'},
    ]

    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(()=>{
        __fetchItems()
    },[])
  
    const __fetchItems = () => {
      try {
          dispatch(retrieve_item())
              .then((response) => {
                  setItems(response.data);
              })
              .catch((error) => {
                  console.log("error : ", error);
              });
      } catch (error) {
          console.log("__fetchItems Catch block error : ", error);
      }
  };

const allCodes = Array.from({ length: 10000 }, (v, i) => String(i).padStart(4, '0'));
const itemCode = allCodes.find(code => !existingItemCodes.includes(code));

    const __changeInputFields = (e) => {
        setFormFields({...formFields,[e.target.name]:e.target.value})
    }

    const __changeImage = (e) => {
       setFile(e.target.files[0])
       setPreview(URL.createObjectURL(e.target.files[0]))
    }

    const __changeHsbImage = (e) => {
        sethsbFile(e.target.files[0])
        setHasbPreview(URL.createObjectURL(e.target.files[0]))
     }

     

    const  __handleSubmit = (e) =>{
        e.preventDefault();
        
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
          }

          setValidated(true);

        let formData = new FormData()
        formData.append("item_code", itemCode);
        formData.append("item_name", formFields?.item_name);
        formData.append("mesuring_qntty", mesuring_Qntty);
        formData.append("item_mrp", formFields.item_mrp);
        formData.append("offer_price", formFields.offer_price);
        formData.append("discount", formFields.discount);
        //formData.append("item_catogory", category);
        console.log(category)
        //const categoryArray = category.map(c => c.value)
        //const categoryList = categoryArray.map(category => category.trim());
        const categoryArray = category.map(c => c.value);
        const categoryList = categoryArray.map(category => category.trim());
        const categoryString = categoryList.join('-');
        console.log(categoryString);
        formData.append("item_catogory", categoryString);
        formData.append("item_tags", tag);
        //formData.append("item_type", type);
        formData.append("instock_outstock_indication", stockIndicater);
        formData.append("stock_quantity", formFields.stock_quantity);
        formData.append("item_discription", formFields.item_discription);
        formData.append("item_image", file);
        formData.append("item_hsb", hsbFile);

        dispatch(create_item(formData)).then(res =>{
            if (res.success === true) {
                swal({
                    title: "Stock item created sucessfully...",
                    text: res.message,
                    icon: "success",
                    showConfirmButton: false,
                    button: (navigate('/')),
                  });
            } else {
                swal({
                    title: "Oops,Something went wrong!",
                    text: res.message,
                    icon: "error",
                  });
            }
        }).catch(err =>{
            console.log(err);
        })
    }

  return (
    <React.Fragment>
      <div className="d-flex align-items-center p-5">
        <Container>
          <Row>
            <Col md={12} className="d-flex align-items-center justify-content-center">
              <div className="card w-100 dashboard-card">
                <div className="card-body">
                  <Row>
                    <Col md={12}>
                      <h1 className="fw-bolder text-white mt-2 mb-3">
                        Add Item
                      </h1>
                    </Col>
                  </Row>
                  <Form noValidate validated={validated}>
                    <Row>
                        {/* <Col md={6}>
                            <Form.Group className="mb-3" controlId="validationCustom01">
                                <Form.Label className='text-white fw-semibold'>Item code</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control type="number" placeholder="Enter item code" name="item_code" onChange={(e) => __changeInputFields(e)}  className='fw-semibold' required />
                                    <Form.Control.Feedback type="invalid" style={{fontSize:"20px"}}>
                                        Item code is required.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Col> */}
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="validationCustom01">
                                <Form.Label className='text-white fw-semibold'>Item name</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control type="text" placeholder="Enter item name" name="item_name" onChange={(e) => __changeInputFields(e)}  className='fw-semibold' required/>
                                    <Form.Control.Feedback type="invalid" style={{fontSize:"20px"}}>
                                            Item name is required.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        {/*<Col md={6}>
                            <Form.Group className="mb-3" controlId="validationCustom01">
                                <Form.Label className='text-white fw-semibold'>Mesuring qntty</Form.Label>
                                <select value={mesuring_Qntty} className="form-select form-control" onChange={(e) => setMesuring_Qntty(e.target.value)} >
                                    <option value='' disabled="disabled">Mesuring qntty</option>
                                    <option value="Kg" >Kg</option>
                                    <option value="Number" >Number</option>
                                    <option value="liter" >Liter</option>
                                    <option value="gram" >Gram</option>
                                </select>
                                { <InputGroup hasValidation>
                                    <Form.Control type="number" placeholder="Enter mesuring qntty" name="mesuring_qntty" onChange={(e) => __changeInputFields(e)}  className='fw-semibold' required/>
                                    <Form.Control.Feedback type="invalid" style={{fontSize:"20px"}}>
                                            Mesuring qntty is required.
                                    </Form.Control.Feedback>
                                </InputGroup> }
                            </Form.Group>
                        </Col>*/}
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="validationCustom01">
                                <Form.Label className='text-white fw-semibold'>Item price</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control type="number" placeholder="Enter item price" name="item_mrp" onChange={(e) => __changeInputFields(e)}  className='fw-semibold' required/>
                                    <Form.Control.Feedback type="invalid" style={{fontSize:"20px"}}>
                                            Item price is required.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className='text-white fw-semibold'>Offer price</Form.Label>
                                <Form.Control type="number" placeholder="Enter offer price" name="offer_price" onChange={(e) => __changeInputFields(e)}  className='fw-semibold' />
                            </Form.Group>
                        </Col>
                        { <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className='text-white fw-semibold'>Offer Percentage</Form.Label>
                                <Form.Control type="number" step="0.01" placeholder="Enter offer percentage" name="discount" onChange={(e) => __changeInputFields(e)}  className='fw-semibold' />
                            </Form.Group>
                        </Col> }
                        
                        <Col md={6}>
                        <Form.Group className="mb-3" controlId="validationCustom01">
                            <Form.Label className='text-white fw-semibold'>Item category</Form.Label>
                        <Select 
                                isMulti
                                options={CategoryData}
                                value={category}
                                onChange={(selected) => setCategory(selected)}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="validationCustom01">
                                <Form.Label className='text-white fw-semibold'>Item tag</Form.Label>
                                {/* <InputGroup hasValidation>
                                    <Form.Control type="text" placeholder="Enter item category" name="item_catogory" onChange={(e) => __changeInputFields(e)}  className='fw-semibold' required/>
                                    <Form.Control.Feedback type="invalid" style={{fontSize:"20px"}}>
                                            Item category is required.
                                    </Form.Control.Feedback>
                                </InputGroup> */}
                                <select value={tag} className="form-select form-control" onChange={(e) => settag(e.target.value)} >
                                    <option value='' disabled="disabled">Item tag</option>
                                    {
                                         tagsData.map((data)=>{
                                            return <option value={data.value} >{data.label}</option>
                                         })
                                    }
                                </select>
                                 {/* <Select 
                                    isMulti
                                    options={CategoryData} 
                                /> */}
                            </Form.Group>
                        </Col>

                        {/*<Col md={6}>
                            <Form.Group className="mb-3" controlId="validationCustom01">
                                <Form.Label className='text-white fw-semibold'>Item type</Form.Label>
                                 <InputGroup hasValidation>
                                    <Form.Control type="text" placeholder="Enter item category" name="item_catogory" onChange={(e) => __changeInputFields(e)}  className='fw-semibold' required/>
                                    <Form.Control.Feedback type="invalid" style={{fontSize:"20px"}}>
                                            Item category is required.
                                    </Form.Control.Feedback>
                                </InputGroup> 
                                <select value={type} className="form-select form-control" onChange={(e) => settype(e.target.value)} >
                                    <option value='' disabled="disabled">Item type</option>
                                    {
                                         TypeData.map((data)=>{
                                            return <option value={data.value} >{data.label}</option>
                                         })
                                    }
                                </select>
                        
                            </Form.Group>
                        </Col>*/}
                        {/*<Col md={6}>
                            <Form.Group className="mb-3" controlId="validationCustom01">
                                <Form.Label className='text-white fw-semibold'>Item tags</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control type="text" placeholder="Enter item tags" name="item_tags" onChange={(e) => __changeInputFields(e)}  className='fw-semibold' required/>
                                    <Form.Control.Feedback type="invalid" style={{fontSize:"20px"}}>
                                            Item tags is required.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Col>*/}
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="validationCustom01">
                                <Form.Label className='text-white fw-semibold'>Instock/outstock indication</Form.Label>
                                {/* <Form.Control type="number" placeholder="Enter instock/outstock indication" name="instock_outstock_indication" onChange={(e) => __changeInputFields(e)}  className='fw-semibold' /> */}
                            
                                {/* <DropdownButton onSelect={(e) =>setStockIndicater(e.target.value)} value={stockIndicater}  title="Instock/outstock indication" className="Form-Control drop-down" id="input-group-dropdown-1">
                                    <Dropdown.Item eventKey="0">Yes</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item eventKey="1">No</Dropdown.Item>
                                </DropdownButton> */}
                                <select value={stockIndicater} className="form-select form-control" onChange={(e) => setStockIndicater(e.target.value)} >
                                    <option value='' disabled="disabled">Instock/outstock indication</option>
                                    <option value="0" >Yes</option>
                                    <option value="1" >No</option>
                                </select>
    
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3"controlId="validationCustom01">
                                <Form.Label className='text-white fw-semibold'>Stock quantity</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control type="number" placeholder="Enter stock quantity" name="stock_quantity" onChange={(e) => __changeInputFields(e)}  className='fw-semibold' required/>
                                    <Form.Control.Feedback type="invalid" style={{fontSize:"20px"}}>
                                        Stock quantity is required.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className='text-white fw-semibold'>Item discription</Form.Label>
                                <Form.Control as="textarea" rows={2} placeholder="Enter Item discription" name="item_discription" onChange={(e) => __changeInputFields(e)}  className='fw-semibold' />
                            </Form.Group>
                        </Col>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="validationCustom01">
                                    <Form.Label className='text-white fw-semibold'>Item HSB</Form.Label>
                                    <InputGroup hasValidation>
                                        {/* <Form.Control type="text" placeholder="Enter item HSB" name="item_hsb" onChange={(e) => __changeInputFields(e)}  className='fw-semibold' required/> */}
                                        <Form.Control type="file" accept="image/png, image/gif, image/jpeg" placeholder="Enter item image" onChange={(e)=>__changeHsbImage(e)} className='fw-semibold' required/>
                                        <Form.Control.Feedback type="invalid" style={{fontSize:"20px"}}>
                                                Item tags is required.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    {   (hsbPreview) &&
                                        <img src={hsbPreview} className='mt-3 border border-dark' height='150' width='150' alt='stock_img' />
                                    }
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="validationCustom01">
                                    <Form.Label className='text-white fw-semibold'>Item image</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control type="file" accept="image/png, image/gif, image/jpeg" placeholder="Enter item image" onChange={(e)=>__changeImage(e)} className='fw-semibold' required/>
                                        <Form.Control.Feedback type="invalid" style={{fontSize:"20px"}}>
                                                Item image is required.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    {   (preview) &&
                                        <img src={preview} className='mt-3 border border-dark' height='150' width='150' alt='stock_img' />
                                    }
                                </Form.Group>
                            </Col>
                        </Row>
                        <Col className="d-flex align-items-center text-end justify-content-end">
                            <RenderButton 
                                variant={'primary'}
                                type={'submit'}
                                title={'Add'}
                                onClick={__handleSubmit}
                            />
                        </Col>
                    </Row>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ItemAdd;
