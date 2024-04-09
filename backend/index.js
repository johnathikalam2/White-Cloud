const port = 4001;
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const Item = require('./models/item');
const Invoice = require('./models/invoice');
const Banner = require('./models/banner');  
const Admin = require('./models/admin');
const User = require('./models/user');

const app = express();

app.use(cors());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(express.json());

//mongoose.connect("mongodb+srv://ebinjomonkottakal:fwscJgpQGiEp8amb@cluster0.iekhyww.mongodb.net/ecommerce").then(()=>{
console.log("Connected to MongoDB");
mongoose.connect("mongodb+srv://johnathikalam:bKKjhjvcxEZ5H60q@cluster0.my87tnj.mongodb.net/store_billing").then(()=>{
}).catch((error)=>{
  console.log("Mongoose Error : "+error);
})

app.get("/",(req,res)=>{
  app.use(express.static(path.resolve(__dirname,"frontend","build")));
  res.sendFile(path.resolve(__dirname,"frontend","build","index.html"));
    //res.send("Express app is running")
})

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find({});

    res.json({
      success: true,
      data: items
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the items'
    });
  }
});


app.post('/itemDelete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the item'
    });
  }
});
app.get('/itemEdit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the item'
    });
  }
});

app.post('/itemUpdate/:id', upload.fields([{ name: 'item_image', maxCount: 1 }, { name: 'item_hsb', maxCount: 1 }]), async (req, res) => {
  try {
    const id = req.params.id;
    const newdata = req.body;
    const categoryArray = newdata.item_catogory.split('-').map(category => category.trim());
    const newData = {
      ...newdata,
      item_catogory: categoryArray, 
      updated_at: Date.now()
    };

    // Check if item_image exists in the request
    if (req.files && req.files['item_image']) {
      newData.item_image = req.files['item_image'] ? req.files['item_image'][0].buffer.toString('base64') : null;
    } else {
      delete newData.item_image; // Remove item_image field if not present
    }

    // Check if item_hsb exists in the request
    if (req.files && req.files['item_hsb']) {
      newData.item_hsb = req.files['item_hsb'] ? req.files['item_hsb'][0].buffer.toString('base64') : null;
    } else {
      delete newData.item_hsb; // Remove item_hsb field if not present
    }

    console.log(`ID : ${id}`);
    console.log(req.body);
    const item = await Item.findByIdAndUpdate(id, newData, { new: true });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the item'
    });
  }
});



app.post('/itemStore', upload.fields([{ name: 'item_image', maxCount: 1 }, { name: 'item_hsb', maxCount: 1 }]), async (req, res) => {
  const itemData = req.body;

  const itemImage = req.files['item_image'] ? req.files['item_image'][0].buffer.toString('base64') : null;
  const itemHsb = req.files['item_hsb'] ? req.files['item_hsb'][0].buffer.toString('base64') : null;

  // Split the item_tags string into an array of tags
  const categoryArray = itemData.item_catogory.split('-').map(category => category.trim());

  if (!itemImage || !itemHsb) {
    return res.status(400).send({ success: false, error: "Please fill in all required fields." });
}
  try {
    const item = new Item({
      ...itemData,
      item_image: itemImage,
      item_hsb: itemHsb,
      item_catogory: categoryArray,       // Representing item tags as a list of strings
    });
    console.log(`Item: ${item}`);

    await item.save();

    res.json({
      success: true,
      message: 'Item created successfully',
      item: item,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the item',
    });
  }
});
app.get('/getBanner', async (req, res) => {
  try {
    const banner = await Banner.find({});
    res.json({
      success: true,
      banner: banner
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the items'
    });
  }
});

app.post('/deletehsbimg/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`ID : ${id}`);
    const item = await Banner.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the item'
    });
  }
});

app.post('/add_banner', upload.fields([ { name: 'banner_img', maxCount: 1 }]), async (req, res) => {
  const bannerData = req.body;
  const bannerHsb = req.files['banner_img'] ? req.files['banner_img'][0].buffer.toString('base64') : null;
  try {
    const banner = new Banner({
      ...bannerData,
      banner_img: bannerHsb
    });

    await banner.save();

    res.json({
      success: true,
      message: 'Item created successfully',
      item: bannerData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the item'
    });
  }
});


app.post('/orderStore', upload.none(), async (req, res) => {
  try {
      const { cx_phone_number, cx_name, price, payment_mode, item_details } = req.body;

      // Check if required fields are empty
      if (!cx_phone_number || !cx_name || !price || !payment_mode || !item_details) {
          return res.status(400).send({ success: false, error: "Please fill in all required fields." });
      }

      const oba = price;
      const order_status = "Accepted";
      const order_id = Date.now().toString();
      const parsedItemDetails = JSON.parse(item_details);

      const invoice = new Invoice({
          cx_phone_number,
          cx_name,
          oba,
          payment_mode,
          order_status,
          order_id,
          order_date: Date.now(),
          item_details: parsedItemDetails,
      });

      await invoice.save();
      res.status(201).send({ success: true, data: invoice });
  } catch (error) {
      res.status(400).send({ success: false, error: error.message });
  }
});



  app.get('/orders', async (req, res) => {
    try {
      const invoices = await Invoice.find({});
  
      res.json({
        success: true,
        data: invoices
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'An error occurred while retrieving the items'
      });
    }
  });

  /*app.post('/orderStatus', upload.none(), async (req, res) => {
    const { orderId, order_status } = req.body;
    console.log(req.body)
    try {
        const invoice = await Invoice.findOne({order_id: orderId });
        console.log(orderId)
        if (!invoice) {
            return res.status(404).json({ message: 'Order not found' });
        }

        invoice.order_status = order_status;
        await invoice.save();

        res.status(201).send({ success: true, data: invoice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});*/

app.post('/orderStatus', upload.none(), async (req, res) => {
  const { orderId, order_status } = req.body;
  try {
      const invoice = await Invoice.findOne({order_id: orderId });
      if (!invoice) {
          return res.status(404).json({ message: 'Order not found' });
      }

      invoice.order_status = order_status;
      await invoice.save();

      const user = await User.findById(invoice.cx_id);

      if (user) {
        const userOrder = user.user_order.find(order => order.id === orderId);
        if (!userOrder) {
            return res.status(404).json({ message: 'User order not found' });
        }

        userOrder.status = order_status;
        await user.save();

        res.status(201).send({ success: true, data: { invoice, user } });
      }

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});


app.post('/login', async (req, res) => {
  try {
      const { phone_number, password } = req.body;
      const admin = await Admin.findOne({ phone_number: phone_number });
            console.log(admin);
      if (password == admin.password){
        res.status(200).json({ success: true, message: 'Login successful' });

      }else{
        res.status(400).json({ success: false, error: error.message });
      }
      
  } catch (error) {
      res.status(400).json({ success: false, error: error.message });
  }
});





  

app.listen(port,(error)=>{
    if(!error){
        console.log("Server running on port"+port);
    }
    else{
        console.log("Error : "+error);
    }
})