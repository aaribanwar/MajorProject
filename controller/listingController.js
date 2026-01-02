const Listing = require("../models/listing");

module.exports.getAll = async (req, res) => {
    let listings = await Listing.find({});
    //res.send("get is working");
    
    res.render("listings/index.ejs",{listings: listings});
}

module.exports.post = async (req,res,next) => {
    
    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;

    const imageName = req.file.originalname;
    const imagePath = req.file.path;

    console.log(imageName, imagePath);

    listing.image.filename = imageName;
    listing.image.url = imagePath;
    

    
    await listing.save();
    if( listing) {
    req.flash("success", "New listing created successfully! :)");
    }
    else {
        req.flash("error","New listing was not saved :(");
    }
    res.redirect("/listings");
}


module.exports.createForm =  (req,res) => {
    
   
    console.log("Auth check for new succeeded");
    res.render("./listings/new.ejs");
}


module.exports.random = async (req, res) => {
    const listing = await Listing.aggregate([
        { $sample: { size: 1 } }
    ]);

    if (!listing.length) {
        // No listings exist
        return res.redirect("/");
    }

    
    res.redirect(`/listings/${listing[0]._id}`);
}


module.exports.getOne =  async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate(
        {
        path: "reviews",
        populate: { path: "owner"},
        }
        ).populate("owner");
   
    if( listing ){
        req.flash("success", "listing exists! yayyy");
    }
    else{
        req.flash("error","listing not exist :(");
        res.redirect("/listings");
    }
    // res.cookie("specificid","cookiehasbeensaved");
    res.render("listings/show.ejs",{listing: listing});
}


module.exports.editForm =  async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

      if( listing ){
        req.flash("success","ID matched and we did the edit");
    }
    else {
        req.flash("error","Error :( ID did not match");
        res.redirect("/listings");
    }
     req.flash("success","ID matched and we did the edit");
    res.render("./listings/edit.ejs",{listing: listing});
}

module.exports.put = async (req, res) => {
        const { id } = req.params;

        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        console.log("in the put, listing does exist");

        await Listing.findByIdAndUpdate(
            id,
            req.body.listing,
            { runValidators: true }
        );

        if( req.file){
             const imageName = req.file.originalname;
                const imagePath = req.file.path;

                console.log(imageName, imagePath);

                listing.image.filename = imageName;
                listing.image.url = imagePath;
                await listing.save();
    
        }

       

        req.flash("success", "Listing updated successfully");
        res.redirect(`/listings/${id}`);
    }


module.exports.delete =  async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

      if( ! listing.owner.equals(req.user._id)) {
        req.flash("error","Error :( ID did not match, you dont have permission");
        res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndDelete(id);

    req.flash("success","the listing was deleted odfvnuvuv");

    res.redirect("/listings");
}