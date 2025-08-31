import { Application } from "express";
import userRoute from "../../features/user/routes/userRoute";
import listRoute from "../../features/list/routes/listRoute";
import listItemRoute from "../../features/listItem/routes/listItemRoute";
import activityRoute from "../../features/activity/routes/activityRoute";

function appRoutes(app: Application) {
    app.use('/api/v1/users', userRoute)
    app.use('/api/v1/lists', listRoute)
    app.use('/api/v1/listItem', listItemRoute)
    app.use('/api/v1/activity', activityRoute)
}

export default appRoutes