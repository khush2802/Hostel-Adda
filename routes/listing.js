const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
// CONTROLLER
const listingController=require("../controllers/listings.js");
// MULTER
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

// Router.route combine all http verbs of same path into one 

router.route("/")
// INDEX ROUTE
.get(wrapAsync(listingController.index))
//CREATE ROUTE 
.post(isLoggedIn,
    upload.single("listing[image]"), 
    validateListing,
    wrapAsync(listingController.createListing)
); 


// -------//

// NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);

// ------------ //


router.route("/:id")
// SHOW ROUTE
.get(wrapAsync(listingController.showListing)
)
// UPDATE ROUTE
.put(isLoggedIn,
    isOwner,
    upload.single("listing[image]"), validateListing,
    wrapAsync(listingController.updateListing)
)
// DELETE ROUTE
.delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyListing)
);

// ------------ //




// EDIT ROUTE

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm)
);

module.exports=router;