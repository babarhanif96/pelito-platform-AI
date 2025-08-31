var custom_routes = (app)=>{
    var userRoutes = require('./userRoutes.js')
    app.use('/user',userRoutes)

    var interestRoutes = require('./interestRoutes.js')
    app.use('/interest',interestRoutes)

    var uploadRoutes = require('./uploadRoutes.js')
    app.use('/upload',uploadRoutes)

    var productRoutes = require('./productRoutes.js')
    app.use('/product',productRoutes)

    var professionalWorkingRoutes = require('./professionalWorkingRoutes.js')
    app.use('/working-hours',professionalWorkingRoutes)

    var serviceRoutes = require('./serviceRoutes.js')
    app.use('/service',serviceRoutes)

    var postRoutes = require('./postRoutes.js')
    app.use('/post',postRoutes)

    var slotRoutes = require('./slotRoutes.js')
    app.use('/slot',slotRoutes)

    var wishlistRoutes = require('./wishlistRoutes.js')
    app.use('/wishlist',wishlistRoutes)

    var memberRoutes = require('./memberRoutes.js')
    app.use('/member',memberRoutes)

    var ratingRoutes = require('./ratingRoutes.js')
    app.use('/rating',ratingRoutes)
    
    var giftRoutes = require('./giftRoutes.js')
    app.use('/gift', giftRoutes)

    // Analytics routes
    var analyticsRoutes = require('./analyticsRoutes.js')
    app.use('/analytics', analyticsRoutes)

}

module.exports = custom_routes