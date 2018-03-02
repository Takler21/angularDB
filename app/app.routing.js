"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var user_component_1 = require("./components/user.component");
var department_component_1 = require("./components/department.component");
var appRoutes = [
    { path: '', redirectTo: 'user', pathMatch: 'full' },
    { path: 'user', component: user_component_1.UserComponent },
    { path: 'depart', component: department_component_1.DepartmentComponent }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map