"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var user_service_1 = require("../Service/user.service");
var forms_1 = require("@angular/forms");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var enum_1 = require("../Shared/enum");
var global_1 = require("../Shared/global");
var DepartmentComponent = (function () {
    function DepartmentComponent(fb, _userService) {
        this.fb = fb;
        this._userService = _userService;
        this.empl = [];
        this.indLoading = false;
    }
    DepartmentComponent.prototype.ngOnInit = function () {
        this.departmentFrm = this.fb.group({
            Id: [''],
            NameDepart: ['', forms_1.Validators.required],
            Sales: [''],
        });
        this.LoadDeparts();
        this.LoadUsers();
    };
    DepartmentComponent.prototype.LoadDeparts = function () {
        var _this = this;
        this.indLoading = true;
        this._userService.get(global_1.Global.BASE_DEPART_ENDPOINT)
            .subscribe(function (departments) { _this.departments = departments; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    DepartmentComponent.prototype.LoadUsers = function () {
        var _this = this;
        this._userService.get(global_1.Global.BASE_USER_ENDPOINT)
            .subscribe(function (users) {
            users.forEach(function (key) {
                _this.empl[key['Id_Depart']] = key['Id_Depart'];
            });
        }, function (error) { return _this.msg = error; });
    };
    DepartmentComponent.prototype.addDepart = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Nuevo Departamento";
        this.modalBtnTitle = "Agregar";
        this.departmentFrm.reset();
        this.modal.open();
    };
    DepartmentComponent.prototype.editDepart = function (id) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Editar Departamento";
        this.modalBtnTitle = "Actualizar";
        this.department = this.departments.filter(function (x) { return x.Id == id; })[0];
        this.departmentFrm.setValue(this.department);
        this.modal.open();
    };
    DepartmentComponent.prototype.deleteDepart = function (id) {
        if (!this.empl[id]) {
            this.dbops = enum_1.DBOperation.delete;
            this.SetControlsState(false);
            this.modalTitle = "Borrar?";
            this.modalBtnTitle = "Borrar";
            this.department = this.departments.filter(function (x) { return x.Id == id; })[0];
            this.departmentFrm.setValue(this.department);
            this.modal.open();
        }
        else
            this.msg = "El departamento no puede borrarse mientras haya usuarios asignados a este.";
    };
    DepartmentComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.departmentFrm.enable() : this.departmentFrm.disable();
    };
    DepartmentComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        this.msg2 = "";
        var vr = true;
        this.departments.forEach(function (key) {
            if (formData._value.NameDepart.toUpperCase().trim() == key['NameDepart'].toUpperCase().trim())
                if (key['Id'] != formData._value.Id)
                    vr = false;
        });
        if (vr) {
            if (formData._value.Sales == null)
                formData._value.Sales = 0;
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._userService.post(global_1.Global.BASE_DEPART_ENDPOINT, formData._value).subscribe(function (data) {
                        if (data == 1) {
                            _this.msg = "Departamento añadido correctamente.";
                            _this.LoadDeparts();
                        }
                        else {
                            _this.msg = "Hay problemas para guardar los datos!";
                        }
                        _this.modal.dismiss();
                    }, function (error) {
                        _this.msg = error;
                    });
                    break;
                case enum_1.DBOperation.update:
                    this._userService.put(global_1.Global.BASE_DEPART_ENDPOINT, formData._value.Id, formData._value).subscribe(function (data) {
                        if (data == 1) {
                            _this.msg = "El departamento se ha actualizado exitosamente.";
                            _this.LoadDeparts();
                        }
                        else {
                            _this.msg = "Hay problemas para guardar los datos!";
                        }
                        _this.modal.dismiss();
                    }, function (error) {
                        _this.msg = error;
                    });
                    break;
                case enum_1.DBOperation.delete:
                    this._userService.delete(global_1.Global.BASE_DEPART_ENDPOINT, formData._value.Id).subscribe(function (data) {
                        if (data == 1) {
                            _this.msg = "El departamento se ha borrado exitosamente.";
                            _this.LoadDeparts();
                        }
                        else {
                            _this.msg = "Hay problemas al guardar las modificaciones hechas!";
                        }
                        _this.modal.dismiss();
                    }, function (error) {
                        _this.msg = error;
                    });
                    break;
            }
        }
        else
            this.msg2 = "Ese departamento ya existe, por favor, escoja otro nombre";
    };
    __decorate([
        core_1.ViewChild('modal'),
        __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
    ], DepartmentComponent.prototype, "modal", void 0);
    DepartmentComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/Components/department.component.html'
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder, user_service_1.UserService])
    ], DepartmentComponent);
    return DepartmentComponent;
}());
exports.DepartmentComponent = DepartmentComponent;
//# sourceMappingURL=department.component.js.map