const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async (req,res,next)=>{
    try
    {
        let {id}=req.params;
        let listing=await Listing.findById(id);
        if(!listing)
        {
            req.flash("error","Listing you requested for does not exist!");
            return res.redirect("/listings");
        }
        // Compare against the signed-in user from the session, never against request data.
        if(!req.user || !listing.owner || !listing.owner.equals(req.user._id))
        {
            req.flash("error","you are not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
    }
    catch(err)
    {
        // Express 4 doesn't catch rejected promises; without this a bad id crashes the server.
        next(err);
    }
};

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else
    {
        next();
    }
};


module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else
    {
        next();
    }
};

module.exports.isReviewAuthor=async (req,res,next)=>{
    try
    {
        let {id,reviewId}=req.params;
        let review=await Review.findById(reviewId);
        if(!review)
        {
            req.flash("error","Review you requested for does not exist!");
            return res.redirect(`/listings/${id}`);
        }
        if(!req.user || !review.author || !review.author.equals(req.user._id))
        {
            req.flash("error","you are not the author of this review");
            return res.redirect(`/listings/${id}`);
        }
        next();
    }
    catch(err)
    {
        next(err);
    }
};